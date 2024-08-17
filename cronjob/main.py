import cv2
import time
import base64
import requests
from io import BytesIO
from PIL import Image
from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import JsonOutputParser
import numpy as np

POST_URL = "http://localhost:5000/api/postMessage"
STATUS_URL = "http://localhost:5000/api/status"

def prompt_func(data):
    text = data["text"]
    image = data["image"]

    image_part = {
        "type": "image_url",
        "image_url": f"data:image/jpeg;base64,{image}",
    }

    content_parts = []

    text_part = {"type": "text", "text": text}

    content_parts.append(image_part)
    content_parts.append(text_part)

    return [HumanMessage(content=content_parts)]

def convert_to_base64(pil_image):
    buffered = BytesIO()
    pil_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def run_custom_function(frame):
    global is_running_custom_function
    is_running_custom_function = True
    print("Running custom function...")
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    filename = f"./static/detected_human_{timestamp}.jpg"
    cv2.imwrite(filename, frame)
    pil_image = Image.open(filename)
    print(pil_image)
    image_b64 = convert_to_base64(pil_image)
    chain = prompt_func | llm | JsonOutputParser()
    query_chain = chain.invoke(
        {"text": 'Extract the gender, clothing_top_color and cloth_top_type from the image. You are an AI dialogue creator. You are fixed in a prototype which shows ads regarding shampoo. You need to create a dialog for grabbing attention of the person whose features are given by user. Focus solely on dialog and return string without any headlines or other info. Return the response in JSON format, for example {"message":"Hey sir how are you? You are looking great in your green shirt. Take a look at our new shampoo."} The response should always be unique and must be 500 characters.', "image": image_b64}
    )
    print(query_chain)
    response = requests.post(POST_URL, json=query_chain)
    while requests.get(STATUS_URL).json()['messageProcessed'] == False:
        time.sleep(1)
    print("Success response received")
    is_running_custom_function = False

def detect_humans(frame, net):
    (h, w) = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()

    human_boxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > confidence_value:
            idx = int(detections[0, 0, i, 1])
            if idx == coco_dataset_person_class:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                human_boxes.append((startX, startY, endX, endY))
    return human_boxes

confidence_value = 0.4
coco_dataset_person_class = 15
prototxt_path = 'deploy.prototxt'
model_path = 'mobilenet_iter_73000.caffemodel'
net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)

llm = ChatOllama(model="llava-phi3", temperature=0.5)

video_capture = cv2.VideoCapture(0)
is_running_custom_function = False
previous_frame_had_human = False
human_detected = False
frame_collections = 0

while True:
    result, video_frame = video_capture.read()
    if not result:
        break
    if not is_running_custom_function:
        humans = detect_humans(video_frame, net)

        if len(humans) > 0:
            if not previous_frame_had_human:
                human_detected = True
                if frame_collections != 25:
                    frame_collections = frame_collections + 1
                    continue
                else:
                    frame_collections = 0
                    pass
            current_frame_had_human = True            
            if not previous_frame_had_human:
                print('Human detected!')
                run_custom_function(video_frame.copy())
        else:
            current_frame_had_human = False

        # Update previous_frame_had_human status
        previous_frame_had_human = current_frame_had_human

        for (startX, startY, endX, endY) in humans:
            cv2.rectangle(video_frame, (startX, startY), (endX, endY), (0, 255, 0), 2)

    cv2.imshow("Human Detection Project", video_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

video_capture.release()
cv2.destroyAllWindows()
