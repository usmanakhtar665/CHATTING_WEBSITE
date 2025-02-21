import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function AdminLinkGenerator() {
  const [generatedLink, setGeneratedLink] = useState('');
  const [chatrooms, setChatrooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'chatrooms'), orderBy('createdAt', 'asc')),
      (snapshot) => {
        setChatrooms(snapshot.docs.map((doc, index) => ({
          id: doc.id,
          name: doc.data().name || `Chatroom-${index + 1}`,
          link: `${window.location.origin}/chatroom/${doc.id}`,
          ...doc.data(),
        })));
      }
    );

    return () => unsubscribe();
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) {
      alert('Please enter a chatroom name.');
      return;
    }
    const newRoom = await addDoc(collection(db, 'chatrooms'), {
      name: roomName,
      createdAt: new Date(),
    });
    setGeneratedLink(`${window.location.origin}/chatroom/${newRoom.id}`);
    setRoomName('');  // Clear the input after creating the room
  };

  const joinAsAdmin = (roomId) => {
    navigate(`/chatroom/${roomId}`, { state: { isAdmin: true } });
  };

  return (
    <div className="w-screen flex items-center justify-center">
      <div className="h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <div className="mb-4">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter Chatroom Name"
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={createRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Generate Chatroom Link
          </button>
        </div>

        {generatedLink && (
          <div className="mb-6">
            <p className="text-slate-500">New Chatroom Link:</p>
            <a href={generatedLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {generatedLink}
            </a>
          </div>
        )}

        <h2 className="text-xl font-bold mt-6">Chatrooms</h2>
        <ul className="mt-4 space-y-2">
          {chatrooms.map((room) => (
            <li key={room.id} className="bg-white p-2 rounded-md shadow">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">{room.name}</span>
                <div className="flex items-center space-x-2">
                  <a href={room.link} target="_blank" rel="noopener noreferrer" className="outline p-2 rounded ml-3 text-blue-500 underline">
                    {room.link}
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(room.link)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => joinAsAdmin(room.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Join as Admin
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminLinkGenerator;
