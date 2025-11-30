import React, { useState } from 'react';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);

  const conversations = [
    { id: 1, name: 'Sarah Johnson', lastMessage: 'Thank you for the great stay!', time: '2h ago', avatar: 'SJ', unread: 2 },
    { id: 2, name: 'Michael Chen', lastMessage: 'Is the property available next week?', time: '5h ago', avatar: 'MC', unread: 0 },
    { id: 3, name: 'Emma Wilson', lastMessage: 'The check-in process was smooth', time: '1d ago', avatar: 'EW', unread: 0 },
  ];

  const messages = [
    { id: 1, sender: 'Sarah Johnson', text: 'Hi, I wanted to ask about the check-in time', time: '10:30 AM', isOwner: false },
    { id: 2, sender: 'You', text: 'Hello! Check-in is available from 3 PM onwards', time: '10:35 AM', isOwner: true },
    { id: 3, sender: 'Sarah Johnson', text: 'Perfect, thank you!', time: '10:36 AM', isOwner: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your guests</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-800">
              {conversations.find(c => c.id === selectedChat)?.name}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwner ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.isOwner ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isOwner ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

