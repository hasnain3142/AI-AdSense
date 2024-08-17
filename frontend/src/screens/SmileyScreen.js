// src/screens/SmileyScreen.js
import React, { useEffect, useState, useRef } from 'react';

const emojiMap = {
  "😀": ["a", "i"],  // Smiling Face
  "😊": ["b", "j"],  // Smiling Face with Smiling Eyes
  "😐": ["c", "k"],  // Neutral Face
  "😲": ["d", "t"],  // Astonished Face
  "😮": ["e", "o"],  // Face with Open Mouth
  "😂": ["f", "x"],  // Face with Tears of Joy
  "😉": ["g", "q"],  // Winking Face
  "😯": ["h", "u"],  // Hushed Face
  "🙂": ["l", "r"],  // Slightly Smiling Face
  "😎": ["m", "y"],  // Smiling Face with Sunglasses
  "😜": ["p", "z"],  // Winking Face with Tongue
  "🤔": ["n", "s"],  // Thinking Face
  "😚": ["v", "w"],  // Kissing Face with Closed Eyes
  "😠": ["r", "x"],  // Angry Face
  "🤗": ["g", "h"],  // Hugging Face
  "😇": ["k", "m"],  // Smiling Face with Halo
  "😴": ["w", "r"],  // Sleeping Face
  "😵": ["o", "l"],  // Dizzy Face
  "🤐": ["q", "y"],  // Zipper-Mouth Face
  "🤩": ["a", "s"]   // Star-Struck
};


const baseURL = "http://localhost:5000";

const getEmojiForWord = (word) => {
  const firstChar = word[0].toLowerCase();
  for (const [emoji, chars] of Object.entries(emojiMap)) {
    if (chars.includes(firstChar)) {
      return emoji;
    }
  }
  return "😊";
};

const SmileyScreen = ({ isSpeaking, setSpeaking, message, onSpeechEnd }) => {
  const [currentEmoji, setCurrentEmoji] = useState("😊");
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (message) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.voice = window.speechSynthesis.getVoices()[1]
      console.log(utterance.voice)
      utteranceRef.current = utterance;
      const words = message.split("");
      let wordIndex = 0;
      
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const currentWord = words[wordIndex];
          const emoji = getEmojiForWord(currentWord);
          setCurrentEmoji(emoji);
          wordIndex++;
        }
      };
      
      utterance.onstart = () => {
        setCurrentEmoji(getEmojiForWord(words[0]));
        setSpeaking(true);
      };

      utterance.onend = () => {
        setCurrentEmoji("😊");
        fetch(baseURL + '/api/status', { method: 'POST' });
        setSpeaking(false);
        onSpeechEnd();
      };

      window.speechSynthesis.speak(utterance);
    }
  }, [message]);

  return (
    <div className="h-screen flex justify-center items-center bg-white-100">
      <div style={{ fontSize: '20rem' }}>
        {currentEmoji}
      </div>
    </div>
  );
};

export default SmileyScreen;
