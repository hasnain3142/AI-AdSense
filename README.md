# AI AdSense

## Overview

**AI AdSense** is a cutting-edge application designed to detect human presence, analyze their features, and generate personalized advertisements using advanced AI technologies. The system consists of three primary components:

1. **Cronjob**: Detects humans, extracts their features, and generates tailored messages.
2. **Backend**: Handles incoming messages, processes them, and communicates with the frontend.
3. **Frontend**: Displays the personalized advertisements to users in an engaging manner.


## Project Structure

The project is organized into three main directories:

- **`cronjob/`**: Contains the Python script responsible for human detection and message generation.
- **`backend/`**: Houses the server-side code using Express.js to manage message processing and state changes.
- **`frontend/`**: Includes the React.js application that presents the generated advertisements to users.

## Getting Started

Follow these instructions to set up and run the AI AdSense application locally.

### Prerequisites

Ensure you have the following installed on your machine:

- Python (for the cronjob)
- pip (Python package installer)
- Node.js (for backend and frontend)
- npm (Node.js package manager)

### Setting Up the Cronjob

1. Navigate to the `cronjob` directory:
    ```bash
    cd cronjob
    ```
2. Install the necessary Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Run the cronjob script:
    ```bash
    python main.py
    ```

### Setting Up the Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. Install the required Node.js packages:
    ```bash
    npm install
    ```
3. Start the server:
    ```bash
    node server.js
    ```
   The backend should now be running and listening for POST requests at `http://localhost:5000`.

### Setting Up the Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install the required Node.js packages:
    ```bash
    npm install
    ```
3. Start the React application:
    ```bash
    npm start
    ```
   The frontend should now be running on `http://localhost:3000`.

### Using the Application

- Ensure the cronjob script is running to detect human presence and generate messages.
- The cronjob will send generated messages to the backend via POST requests.
- The backend processes these messages and updates the frontend as necessary.
- The frontend displays the advertisements to users, optimized based on the detected features.

## Contributing

We welcome contributions to AI AdSense! If you have suggestions, bug reports, or would like to contribute code, please open an issue or submit a pull request.

## License

AI AdSense is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Tools and Technologies

- **React** - For building the dynamic frontend interface.
- **Express.js** - For creating the robust backend server.
- **Node.js** - For server-side JavaScript execution.
- **Llama3** - For the advanced language model capabilities.

---

Feel free to modify or expand upon this as needed to better fit your project's specific details or updates!