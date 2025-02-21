import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useParams, useLocation } from 'react-router-dom';

function Chatroom() {
  const { roomId } = useParams();
  const location = useLocation();
  const isAdmin = location.state?.isAdmin || false;
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNicknamePrompt, setShowNicknamePrompt] = useState(!isAdmin);

  useEffect(() => {
    const messagesRef = collection(db, `chatrooms/${roomId}/messages`);
    const unsubscribe = onSnapshot(
      query(messagesRef, orderBy('timestamp', 'asc')),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const messagesRef = collection(db, `chatrooms/${roomId}/messages`);
    await addDoc(messagesRef, {
      sender: isAdmin ? 'Admin' : nickname,
      content: newMessage,
      timestamp: new Date(),
    });
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    const date = timestamp.toDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (showNicknamePrompt) {
    return (
      <div className="p-4 h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Enter a Nickname to Join</h1>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="p-2 border rounded-md w-full max-w-sm mb-4"
          placeholder="Enter your nickname"
        />
        <button
          onClick={() => setShowNicknamePrompt(false)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-4xl h-[85vh] flex flex-col rounded-lg shadow-lg overflow-hidden">
        <div className="flex-1 overflow-y-scroll p-4 bg-gray-50">
          <h1 className="text-2xl font-bold mb-4 text-slate-800">Chatroom</h1>
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'Admin' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="max-w-xs bg-white p-2 rounded-lg shadow text-sm text-slate-800 relative break-words whitespace-pre-wrap">
                  <p className="font-bold">{message.sender}</p>
                  <p className="mt-1 mb-3">{message.content}</p>
                  <span
                    className={`text-xs text-gray-500 absolute bottom-1 ${
                      message.sender === 'Admin' ? 'right-2' : 'right-2'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-white flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded-md text-slate-800"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;
