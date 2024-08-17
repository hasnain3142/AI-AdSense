// src/App.js
import React, { useState, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import SmileyScreen from './screens/SmileyScreen';
import socket from './socket';

const App = () => {
  const [message, setMessage] = useState(null);
  const [isSpeaking, setSpeaking] = useState(false);

  useEffect(() => {
    socket.on('newMessage', (newMessage) => {
      setMessage(newMessage);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const handleSpeechEnd = () => {
    setMessage(null);
  };

  return (
    <div className="App">
      {message ? (
        <SmileyScreen
          isSpeaking={isSpeaking}
          setSpeaking={setSpeaking}
          message={message}
          onSpeechEnd={handleSpeechEnd}
        />
      ) : (
        <HomeScreen />
      )}
    </div>
  );
};

export default App;
