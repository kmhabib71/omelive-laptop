import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

function ChatArea({ selectedUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    setupSocket();
    console.log("Selected user ID:", selectedUserId);
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [selectedUserId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/messages/${selectedUserId}`
      );
      setMessages(response.data);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const setupSocket = () => {
    console.log("Setting up socket for user ID:", selectedUserId);
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join-support-room", { userId: selectedUserId, isAdmin: true });
  
    socketRef.current.on("new-support-message", (message) => {
      if (message.userId === selectedUserId || message.sender === "admin") {
        setMessages((prev) => {
          const exists = prev.find((msg) => msg.timestamp === message.timestamp);
          return exists ? prev : [...prev, message];
        });
        scrollToBottom();
      }
    });
  };
  


  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        userId: selectedUserId,
        sender: "admin", // Mark as sent by admin
        message: input.trim(),
        timestamp: new Date().toISOString(),
      };

      socketRef.current.emit("support-message", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-area flex flex-col h-full">
      {/* Messages */}
      <div className="messages flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded-lg max-w-xs ${
              msg.sender === "admin"
                ? "bg-blue-100 text-right self-end"
                : "bg-gray-100 text-left self-start"
            }`}
          >
            {msg.message && <div className="text-sm">{msg.message}</div>}
            {msg.filePath && (
              <img
                src={`http://localhost:5000${msg.filePath}`}
                alt="File"
                className="mt-2 max-w-full rounded-lg"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="message-input flex items-center p-3 bg-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={sendMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
