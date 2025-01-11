import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function ConversationsList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Join the support-room when the component mounts
    socket.emit("join-support-room", { userId: "admin", isAdmin: true });

    // Fetch initial conversations
    fetchConversations();

    // Listen for "new-conversation" events
    socket.on("new-conversation", (newConversation) => {
      console.log("New conversation received:", newConversation);

      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex(
          (conv) => conv._id === newConversation._id // Match by `_id`
        );

        if (existingIndex !== -1) {
          // Update the existing conversation with the latest message
          const updatedConversations = [...prevConversations];
          updatedConversations[existingIndex] = {
            ...updatedConversations[existingIndex],
            lastMessage: {
              message: newConversation.lastMessage.message,
              isUnread: newConversation.lastMessage.isUnread,
            },
            timestamp: newConversation.timestamp,
          };
          return updatedConversations;
        }

        // Add a new conversation if it doesn't exist
        return [newConversation, ...prevConversations];
      });
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off("new-conversation");
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat/conversations");
      setConversations(response.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  return (
    <div className="conversations-list h-full overflow-y-auto bg-gray-100">
      {conversations.map((conversation) => (
        console.log(conversation),
        <div
          key={conversation._id}
          className={`conversation-item flex items-center p-3 border-b cursor-pointer ${
            conversation.lastMessage.isUnread ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => onSelectConversation(conversation._id)}
        >
          <div className="flex-grow">
            <div className="font-medium text-gray-800">User: {conversation.name ?  conversation.name : conversation.lastMessage.name ? conversation.lastMessage.name: conversation._id}</div>
            <div className="text-sm text-gray-600 truncate">
              {conversation.lastMessage.message || "File sent"}
            </div>
          </div>
          {conversation.lastMessage.isUnread && (
            <span className="notification-dot w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ConversationsList;
