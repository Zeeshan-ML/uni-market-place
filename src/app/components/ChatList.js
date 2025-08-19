// app/components/ChatList.js
'use client';

import { useState, useEffect } from 'react';
import { Card } from './Card';
import { FEATURE_FLAGS } from '../config';

const ChatList = ({ onSelectChat }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!FEATURE_FLAGS.enableWebSocket) {
        // Mock rooms for development
        setRooms([
          { id: 1, user: 'Alice', lastMessage: 'Hey, is this still available?', timestamp: '2025-08-19T10:00:00Z' },
          { id: 2, user: 'Bob', lastMessage: 'Can you lower the price?', timestamp: '2025-08-19T09:45:00Z' },
        ]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://campus-exchange-fastapi-production.up.railway.app/api/v1/chat/rooms'
        );
        const data = await response.json();
        console.log('Rooms API response:', data);

        // Flexible parsing
        const parsedRooms = Array.isArray(data) ? data : data.rooms || [];
        setRooms(parsedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (isLoading) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="space-y-4">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <Card
            key={room.id}
            className="p-4 cursor-pointer"
            onClick={() => onSelectChat(room.id)}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{room.user || `Room ${room.id}`}</h3>
                <p className="text-sm text-gray-600">{room.lastMessage || 'No messages yet'}</p>
              </div>
              {room.timestamp && (
                <span className="text-sm text-gray-500">
                  {new Date(room.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center">No chats available</p>
      )}
    </div>
  );
};

export default ChatList;

// Skeleton for loading
const ChatListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 bg-gray-200 animate-pulse rounded-lg">
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);
