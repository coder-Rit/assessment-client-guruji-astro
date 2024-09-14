import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import Jobs from './components/Jobs';


import io from 'socket.io-client';

export const socket = io('http://localhost:4001/'); // Connect to Server 1

socket.on('connect', () => {
  console.log('Client 1 connected');

  socket.emit('message', 'Hello from Client 1!');
});

socket.on('message', (data) => {
  console.log('Client 1 received message:', data);
});

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
