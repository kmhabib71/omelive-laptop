import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { AiOutlineUpload } from "react-icons/ai";
import { IoMdSend } from "react-icons/io";

function SupportChat({ userId, isAdmin = false, name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null); // Selected file
  const [filePreview, setFilePreview] = useState(""); // File preview URL
  const socketRef = useRef(null); // Socket reference
  const messagesEndRef = useRef(null); // Reference to scroll to bottom
  const [selectedUserId, setSelectedUserId] = useState(null); // For admin to select user

  useEffect(() => {
    // Establish socket connection
    socketRef.current = io("http://localhost:5000"); // Replace with your backend URL

    // Admin joins support room, user joins specific room
    if (isAdmin) {
      socketRef.current.emit("join-support-room", { isAdmin: true });
    } else {
      socketRef.current.emit("join-support-room", { userId });
    }

    // Fetch chat history on initial load or when user changes
    const fetchChatHistory = async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/history/${id}`);
        if (response.ok) {
          const chatHistory = await response.json();
          setMessages(chatHistory);
          scrollToBottom();
        } else {
          console.error("Failed to fetch chat history");
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };

    if (isAdmin && selectedUserId) {
      fetchChatHistory(selectedUserId); // Fetch history for selected user
    } else if (!isAdmin) {
      fetchChatHistory(userId); // Fetch history for the user
    }

    // Listen for new messages
    socketRef.current.on("new-support-message", (message) => {
      if (isAdmin && message.userId === selectedUserId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      } else if (!isAdmin && message.userId === userId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    });

    // Cleanup socket on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, selectedUserId, isAdmin]);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a message
  const sendMessage = async () => {
    if (input.trim() || file) {
      let uploadedFilePath = null;
      let uploadedFileName = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            uploadedFilePath = data.filePath;
            uploadedFileName = data.fileName;
          } else {
            console.error("File upload failed:", response.statusText);
          }
        } catch (err) {
          console.error("Error uploading file:", err);
          return; // Prevent sending a message if file upload fails
        }
      }

      const message = {
        userId: isAdmin ? selectedUserId : userId, // For admin, send to selected user
        sender: isAdmin ? "admin" : userId, // Indicate who sent the message
        name: name ? name : userId,
        message: input.trim() || null,
        fileName: uploadedFileName,
        filePath: uploadedFilePath,
        timestamp: new Date().toISOString(),
      };

      // Send message to backend via socket
      socketRef.current.emit("support-message", message);

      // Update local messages state for instant feedback
      setMessages((prev) => [...prev, message]);

      // Reset input and file states
      setInput("");
      setFile(null);
      setFilePreview("");
      scrollToBottom();
    }
  };

  


const handleFileUpload = (e) => {
  const uploadedFile = e.target.files[0];
  if (uploadedFile) {
    setFile(uploadedFile); // Save the selected file
    setFilePreview(URL.createObjectURL(uploadedFile)); // Generate a preview URL
  }
};

  return (
    <div
      className="bg-[#c7f7e6] border rounded-lg shadow-xl w-full z-30"
      style={{ minHeight: "90%", overflowY: "auto" }}
    >
      {/* Header */}
      <div className="p-3 border-b bg-gradient-to-r from-[#68bf9d] to-[#4da984] text-white font-bold shadow-md flex justify-between items-center">
        Support Chat
        <button
          className="text-white text-lg"
          onClick={() => {
            scrollToBottom(); // Scroll to bottom when the chat box is opened
          }}
        >
          {/* &#x2715; */}
        </button>
      </div>
      {/* <div className="bg-[#d8f4ea] p-3 h-[22rem] overflow-y-auto ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === "You" ? "text-right" : "text-left"
            }`}
          >
            <strong
              className={`text-sm ${
                msg.sender === "You" ? "text-blue-500" : "text-gray-800"
              }`}
            >
              {msg.sender}:
            </strong>
            {msg.fileContent && (
              <div className="mt-2">
                <img
                  src={msg.fileContent}
                  alt={msg.fileName}
                  className="max-w-xs max-h-40 object-cover rounded-lg border mb-2"
                />
              </div>
            )}
            {msg.message && (
              <div className="text-gray-700 text-sm">{msg.message}</div>
            )}
          </div>
        ))}
        <div className="h-10"></div>
        <div ref={messagesEndRef} className=" "/>
      </div> */}
      {/* Messages */}
      <div className="bg-[#d8f4ea] p-3 h-[22rem] overflow-y-auto">
  {messages.map((msg, index) => (
    <div
      key={index}
      className={`mb-4 ${msg.sender === userId ? "text-right" : "text-left"}`}
    >
      <strong
        className={`text-sm ${
          msg.sender === userId ? "text-blue-500" : "text-gray-800"
        }`}
      >
        {msg.sender === userId ? "You" : "Support"}:
      </strong>
      {msg.filePath && (
        <div className="mt-2">
          <img
            src={`http://localhost:5000${msg.filePath}`}
            alt={msg.fileName}
            className="max-w-xs max-h-40 object-cover rounded-lg border mb-2"
          />
        </div>
      )}
      {msg.message && (
        <div className="text-gray-700 text-sm">{msg.message}</div>
      )}
    </div>
  ))}
   <div className="h-10"></div>
  <div ref={messagesEndRef} />
</div>



      {/* Input & Upload */}
      <div className="flex flex-col border-t p-3 space-y-2 bg-[#c7f7e6] shadow-inner">
      
       {/* File Preview */}
        {file && (
          <div className="flex items-center space-x-3 p-2 bg-gray-100 rounded-lg mb-2">
            {filePreview && (
              <img
                src={filePreview}
                alt={file.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-700">{file.name}</p>
              <button
                onClick={() => {
                  setFile(null);
                  setFilePreview("");
                }}
                className="text-red-500 text-xs underline hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}


        {/* Input Section */}
        <div className="flex items-center space-x-3">
          {/* Message Input Field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#68bf9d]"
            placeholder="Type a message..."
          />

          {/* File Upload */}
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-200 p-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#68bf9d]"
          >
            <AiOutlineUpload size={20} className="text-gray-600" />
          </label>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-[#68bf9d] to-[#4da984] p-3 rounded-lg shadow-md text-white hover:from-[#58ad8d] hover:to-[#3d916f] focus:outline-none focus:ring-2 focus:ring-[#68bf9d]"
          >
            <IoMdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupportChat;
