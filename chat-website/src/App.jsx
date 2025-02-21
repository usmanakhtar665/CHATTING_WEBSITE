// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLinkGenerator from './components/AdminLinkGenerator';
import Chatroom from './components/Chatroom';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLinkGenerator />} />
        <Route path="/chatroom/:roomId" element={<Chatroom />} />
      </Routes>
    </div>
  );
};

export default App;
