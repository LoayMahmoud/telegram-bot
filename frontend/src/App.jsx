import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState({ name: '', points: 0, chatId: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      // Replace this with actual logic to retrieve chat ID from Telegram
      const response = await axios.get(`/api/user?chatId=${user.chatId}`);
      setUser(response.data);
    };

    // Assuming you have a way to get the chatId from the bot interaction
    const getChatIdFromBotInteraction = async () => {
      // You might need to send a request to your backend here
      // For example, if you have a way to get updates or store it in session/local storage
    };

    getChatIdFromBotInteraction();
    fetchUserData();
  }, [user.chatId]);

  const handleClick = async () => {
    await axios.post('/api/increase-points', { chatId: user.chatId });
    setUser((prev) => ({ ...prev, points: prev.points + 1 }));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{user.name}</h1>
      <h2>Points: {user.points}</h2>
      <button onClick={handleClick} style={{ borderRadius: '50%', width: '100px', height: '100px' }}>
        Click Me!
      </button>
    </div>
  );
}

export default App;