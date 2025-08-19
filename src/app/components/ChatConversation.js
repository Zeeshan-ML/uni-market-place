// app/components/ChatConversation.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import ReconnectBanner from './ReconnectBanner';
import { FEATURE_FLAGS } from '../config';

const ChatConversation = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages via REST API
  useEffect(() => {
    const fetchMessages = async () => {
      if (!FEATURE_FLAGS.enableWebSocket) {
        setMessages([
          { id: 1, sender: 'Alice', content: 'Hi, is this available?', timestamp: '2025-08-19T10:00:00Z' },
          { id: 2, sender: 'You', content: 'Yes, it is!', timestamp: '2025-08-19T10:01:00Z' },
        ]);
        return;
      }

      try {
        const response = await fetch(
          `https://campus-exchange-fastapi-production.up.railway.app/api/v1/chat/rooms/${chatId}/messages?page=1&page_size=50`
        );
        const data = await response.json();
        console.log('Messages API response:', data);

        const parsedMessages = Array.isArray(data) ? data : data.messages || [];
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [chatId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!FEATURE_FLAGS.enableWebSocket) return;

    const wsUrl = `wss://campus-exchange-fastapi-production.up.railway.app/ws/${chatId}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, { id: prev.length + 1, ...data }]);
      } else if (data.type === 'typing') {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message = {
      type: 'message',
      content: newMessage,
      sender: 'You',
      timestamp: new Date().toISOString(),
    };

    if (FEATURE_FLAGS.enableWebSocket && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }

    setMessages((prev) => [...prev, { id: prev.length + 1, ...message }]);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (FEATURE_FLAGS.enableWebSocket && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', user: 'You' }));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {!isConnected && <ReconnectBanner />}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-sm text-gray-500">Someone is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
