import React, { useState } from "react";
import ConversationsList from "./Components/Support/ConversationsList";
import ChatArea from "./Components/Support/ChatArea";

function AdminSupport() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelectConversation = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="admin-support flex h-screen mt-40">
      {/* Conversations List */}
      <div className="conversations-list w-1/3 border-r border-gray-300">
        <ConversationsList onSelectConversation={handleSelectConversation} />
      </div>

      {/* Chat Area */}
      <div className="chat-area flex-grow">
        {selectedUserId ? (
          <ChatArea selectedUserId={selectedUserId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSupport;
