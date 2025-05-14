import React, { useEffect, useState } from 'react';

function App() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    fetch('https://ziioz-backend.onrender.com/api/hello')
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch((err) => {
        console.error('Failed to connect to backend:', err);
        setBackendMessage('❌ Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', padding: '2rem' }}>
      <h1>🚀 Welcome to ZiiOZ</h1>
      <p>The platform that changes everything.</p>
      <hr />
      <h2>🧠 Backend says:</h2>
      <p>{backendMessage}</p>
    </div>
  );
}

export default App;
