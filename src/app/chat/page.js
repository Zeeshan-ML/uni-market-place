// app/chat/page.js
'use client';

import { useState } from 'react';
import ChatList from '../components/ChatList';
import ChatConversation from '../components/ChatConversation';

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="container mx-auto p-4 flex gap-4">
      <div className="w-1/3">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>
        <ChatList onSelectChat={setSelectedChatId} />
      </div>
      <div className="w-2/3">
        {selectedChatId ? (
          <ChatConversation chatId={selectedChatId} />
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
