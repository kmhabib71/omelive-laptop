const socketIo = require("socket.io");
const {
  addUser,
  handleNext,
  handleDisconnect,
  getTargetSocketId,
  updateUserFiltersInService,
  handleCallAccepted,
  handleCallEnd,
  handleStop,
} = require("./services/matchingService");
const SupportMessage = require("./model/SupportMessage");
const { isConnectedBefore } = require("./config/db");
const socketSetup = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = {}; // Store userId to socket.id mapping
  io.on("connection", (socket) => {
    socket.on("add-user", (userInfo) => {
      if (!isConnectedBefore) {
        console.error("MongoDB is not connected");
        socket.emit("error", "Database connection error");
        return;
      }
      socket.user = userInfo; // Store user info in socket for reference
      addUser(io, socket);
    });

    socket.on("next", () => {
      handleNext(io, socket);
    });

    socket.on("ice-candidate", (candidate) => {
      const targetSocketId = getTargetSocketId(socket.id);
      if (targetSocketId) {
        io.to(targetSocketId).emit("ice-candidate", candidate);
      }
    });

    socket.on("offer", (offer) => {
      const targetSocketId = getTargetSocketId(socket.id);
      if (targetSocketId) {
        io.to(targetSocketId).emit("offer", offer);
      }
    });
    socket.on("send-gift", async (data) => {
      io.to(data.receiverSocket).emit("gift-received", data);
    });
    socket.on("answer", (answer) => {
      const targetSocketId = getTargetSocketId(socket.id);
      if (targetSocketId) {
        io.to(targetSocketId).emit("answer", answer);
      }
    });

    socket.on("prepare-for-call", ({ callerSocketId, callerUserId }) => {
      //console.log("from prepare-for-call");
      socket.prepareForCall = true;
      socket.callerSocketId = callerSocketId;
      socket.callerUserId = callerUserId;
    });

    socket.on("call-ended", () => {
      handleCallEnd(io, socket);
    });
    socket.on("disconnect", (reason) => {
      handleDisconnect(io, socket);
      //console.log("Client disconnected", socket.id, "reason:", reason);
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });
    socket.on("stop", () => {
      handleStop(io, socket);
    });

    // Listen for filter updates
    socket.on("update-filters", ({ userId, filters }) => {
      updateUserFiltersInService(userId, filters);
    });
    socket.on("call-accepted", (data) => {
      handleCallAccepted(socket, data);
      console.log("From Call-Accepted");
    });

    socket.on("call-rejected", () => {
      if (socket.user.callerSocketId) {
        const callerSocket = users.find(
          (user) => user.id === socket.user.callerSocketId
        );
        if (callerSocket) {
          callerSocket.emit("call-rejected");
        }
      }
    });

    // Join the support room or user-specific room
   // Join the support room or user-specific room

   socket.on("join-support-room", ({ userId, isAdmin }) => {
    if (!isConnectedBefore) {
      console.error("MongoDB is not connected");
      socket.emit("error", "Database connection error");
      return;
    }
  
    if (isAdmin) {
      socket.join("support-room"); // Admin joins the support room
      console.log("Admin joined the support room.");
    } else {
      socket.join(userId); // User joins their specific room
      userSocketMap[userId] = socket.id; // Map userId to socket.id
      console.log(`User joined room: ${userId}, Socket ID: ${socket.id}`);
    }
  });
  socket.on("support-message", async (message) => {
    console.log("Support message received:", message);
  
    try {
      const supportMessage = new SupportMessage({
        userId: message.userId,
        sender: message.sender, // Can be "admin" or user ID
        name: message.name ? message.name : message.userId,
        message: message.message || null,
        fileName: message.fileName || null,
        filePath: message.filePath || null,
        timestamp: message.timestamp || new Date(),
        isUnread: message.sender !== "admin", // Mark as unread if sent by the user
      });
  
      await supportMessage.save();
  
      if (message.sender === "admin") {
        // Admin sent the message; notify the specific user
        const userSocketId = userSocketMap[message.userId];
        if (userSocketId) {
          io.to(userSocketId).emit("new-support-message", message);
          console.log("Message sent to user:", message.userId);
        } else {
          console.error(`User socket ID not found for userId: ${message.userId}`);
        }
      } else {
        // User sent the message; notify the admin
        io.to("support-room").emit("new-support-message", message);
        console.log("Message sent to admin support-room:", message);
  
        // Emit consistent new-conversation data to support-room
        io.to("support-room").emit("new-conversation", {
          _id: message.userId, // Ensure consistency with `_id` key
          name: message.name ? message.name : message.userId,
          lastMessage: {
            message: message.message,
            isUnread: true,
          },
          timestamp: message.timestamp || new Date(),
        });
        console.log("Emitted new-conversation to support-room:", {
          _id: message.userId, // Ensure consistency with `_id` key
          lastMessage: {
            message: message.message,
            isUnread: true,
          },
          timestamp: message.timestamp || new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving support message:", error);
    }
  });
  
  

// Handle sending support messages
// socket.on("support-message", async (message) => {
//   console.log("Support message received:", message);

//   try {
//     const supportMessage = new SupportMessage({
//       userId: message.userId,
//       sender: message.sender, // Can be "admin" or user ID
//       message: message.message || null,
//       fileName: message.fileName || null,
//       filePath: message.filePath || null,
//       timestamp: message.timestamp || new Date(),
//       isUnread: message.sender !== "admin", // Mark as unread if sent by the user
//     });

//     await supportMessage.save();

//     if (message.sender === "admin") {
//       // Admin sent the message; notify the specific user
//       const userSocketId = userSocketMap[message.userId];
      
//       if (userSocketId) {
//         io.to(userSocketId).emit("new-support-message", message);
//         console.log("Message sent to user:", message.userId);
//       } else {
//         console.error(`User socket ID not found for userId: ${message.userId}`);
//       }
//     } else {
//       // User sent the message; notify the admin
//       io.to("support-room").emit("new-support-message", message);
//       console.log("Message sent to admin support-room:", message);
//     }
//   } catch (error) {
//     console.error("Error saving support message:", error);
//   }
// });


    
    
  });
};

module.exports = socketSetup;
