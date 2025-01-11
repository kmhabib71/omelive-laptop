const mongoose = require("mongoose");
const User = require("../model/User"); // Assuming your user model is located here
const { isConnectedBefore } = require("../config/db");
const users = [];
const engagedUsers = {}; // Track engaged users
const engagedPairs = []; // Track engaged pairs

// Function to get current users
const getCurrentUsers = () => {
  return users.map((user) => ({
    id: user.id,
    userId: user.user.userid,
    userInfo: user.user,
  }));
};

// Emit current users data
const emitCurrentUsers = (io) => {
  io.emit("current-users", getCurrentUsers());
};

const handleCallEnd = (io, socket) => {
  // Clear the caller information and add the user back to the random matching pool
  socket.prepareForCall = false;
  socket.callerSocketId = null;
  socket.callerUserId = null;

  findMatch(socket);
};

const updateUserConnectionAttempts = async (userId, connectionAttempts) => {
  if (!isConnectedBefore) {
    console.error("MongoDB is not connected");
    return;
  }

  try {
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "connectionAttempts.dailyAttempts": connectionAttempts,
          "connectionAttempts.lastAttemptDate": new Date(),
        },
      },
      { new: true }
    );
    //console.log(`Updated connection attempts for user ${userId}`);
  } catch (error) {
    console.error("Error updating user connection attempts:", error.message);
  }
};
const updateUserFiltersInService = (userId, filters) => {
  const user = users.find((user) => user.user.userid === userId);
  if (user) {
    user.filters = filters;
    //console.log(`Updated filters for user ${userId}`);
  } else {
    //console.log(`User ${userId} not found for updating filters`);
  }
};
const resetDailyAttemptsIfNewDay = async (user) => {
  const currentDate = new Date().toISOString().slice(0, 10);
  if (user.connectionAttempts.lastAttemptDate !== currentDate) {
    user.connectionAttempts.dailyAttempts = 0;
    user.connectionAttempts.lastAttemptDate = currentDate;
    await User.findByIdAndUpdate(user.userid, {
      "connectionAttempts.dailyAttempts": 0,
      "connectionAttempts.lastAttemptDate": currentDate,
    });
  }
};
const updateConnectionHistory = async (userId, connectedUserId) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          connectionHistory: { connectedUserId, connectedAt: new Date() },
        },
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating connection history:", error.message);
  }
};
const findMatch = async (socket) => {
  const user = users.find((user) => user.id === socket.id);
  if (!user) return;
  if (!socket.user.isPremium) {
    // console.log("Engaged Users before match: ", engagedUsers);
    await resetDailyAttemptsIfNewDay(user.user);
    // .....................End max_attempts_and_time_limit...............
    const currentDate = new Date().toISOString().slice(0, 10);
    const lastAttemptDate = user.user.connectionAttempts.lastAttemptDate;
    if (lastAttemptDate !== currentDate) {
      user.user.connectionAttempts.dailyAttempts = 0;
      user.user.connectionAttempts.lastAttemptDate = currentDate;
      await User.findByIdAndUpdate(user.user.userid, {
        "connectionAttempts.dailyAttempts": 0,
        "connectionAttempts.lastAttemptDate": currentDate,
      });
    }

    if (user.user.connectionAttempts.dailyAttempts >= 555) {
      socket.emit("connection-limit-exceeded");
      return;
    }

    user.user.connectionAttempts.dailyAttempts++;
    // //console.log(
    //   `Connection attempts: ${user.user.connectionAttempts.dailyAttempts}`
    // );
    await User.findByIdAndUpdate(user.user.userid, {
      "connectionAttempts.dailyAttempts":
        user.user.connectionAttempts.dailyAttempts,
    });
    // .....................End max_attempts_and_time_limit...............

    const availableUsers = users.filter(
      (user) => user !== socket && !engagedUsers[user.id]
    );
    if (availableUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableUsers.length);
      const match = availableUsers[randomIndex];
      engagedUsers[socket.id] = true;
      engagedUsers[match.id] = true;
      engagedPairs.push({ user1: socket.id, user2: match.id });
      //console.log("match.user.userid: ", match.user.userid);
      //console.log("socket.user.userid: ", socket.user.userid);
      await updateConnectionHistory(user.user.userid, match.user.userid);
      await updateConnectionHistory(match.user.userid, user.user.userid);

      socket.emit("match-found", {
        socketId: match.id,
        userId: match.user.userid, // Include MongoDB user ID
      });
      match.emit("match-found-for-remote", {
        socketId: socket.id,
        userId: socket.user.userid, // Include MongoDB user ID
      });
      //console.log("match.user.userid: ", match.user.userid);
      //console.log("socket.user.userid: ", socket.id);
      // socket.emit("match-found", match.id);
      // match.emit("match-found-for-remote", socket.id);
      startChatTimeout(socket, match);
    }
    console.log("Engaged Users after match: ", engagedUsers);
  } else {
    //console.log("from isPremium: ");
    const userFilters = socket.user.filters;

    // Try to find a match progressively relaxing criteria
    let availablePremiumUsers = users.filter(
      (u) => u.id !== socket.id && !engagedUsers[u.id]
    );

    for (let criteria = 4; criteria >= 0; criteria--) {
      const filteredUsers = availablePremiumUsers.filter((u) =>
        matchFilters(u.user, userFilters, criteria)
      );
      if (filteredUsers.length > 0) {
        availablePremiumUsers = filteredUsers;
        break;
      }
    }

    if (availablePremiumUsers.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * availablePremiumUsers.length
      );
      const match = availablePremiumUsers[randomIndex];
      engagedUsers[socket.id] = true;
      engagedUsers[match.id] = true;
      engagedPairs.push({ user1: socket.id, user2: match.id });
      await updateConnectionHistory(user.user.userid, match.user.userid);
      await updateConnectionHistory(match.user.userid, user.user.userid);

      socket.emit("match-found", {
        socketId: match.id,
        userId: match.user.userid, // Include MongoDB user ID
      });
      match.emit("match-found-for-remote", {
        socketId: socket.id,
        userId: socket.user.userid, // Include MongoDB user ID
      });
      //console.log("match.user.userid: ", match.user.userid);
      //console.log("socket.user.userid: ", socket.id);
    } else {
      const availableUsers = users.filter(
        (user) => user !== socket && !engagedUsers[user.id]
      );
      if (availableUsers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const match = availableUsers[randomIndex];
        engagedUsers[socket.id] = true;
        engagedUsers[match.id] = true;
        engagedPairs.push({ user1: socket.id, user2: match.id });
        await updateConnectionHistory(user.user.userid, match.user.userid);
        await updateConnectionHistory(match.user.userid, user.user.userid);

        socket.emit("match-found", {
          socketId: match.id,
          userId: match.user.userid, // Include MongoDB user ID
        });
        match.emit("match-found-for-remote", {
          socketId: socket.id,
          userId: socket.user.userid, // Include MongoDB user ID
        });
        //console.log("match.user.userid: ", match.user.userid);
        //console.log("socket.user.userid: ", socket.id);
        startChatTimeout(socket, match);
      }
    }
  }
};
const startChatTimeout = async (socket, match) => {
  if (!socket.user.isPremium) {
    setTimeout(async () => {
      socket.emit("chat-time-ended");
      match.emit("chat-time-ended");

      // await User.findByIdAndUpdate(socket.user.userid, {
      //   $push: { chatHistory: { endedAt: new Date() } },
      // });

      handleNext(socket.nsp, socket); // This will initiate the next match
      await updateUserConnectionAttempts(socket.user.userid, 0); // Reset daily attempts or update accordingly
    }, 300 * 60 * 1000); // 30 minutes for free users
  }
};
const matchFilters = (user, userCriteria, criteriaLevel) => {
  let matchCount = 0;

  if (userCriteria.gender && user.userGender === userCriteria.gender) {
    matchCount++;
  }
  if (
    userCriteria.ageRange &&
    user.userAge >= userCriteria.ageRange.min &&
    user.userAge <= userCriteria.ageRange.max
  ) {
    matchCount++;
  }
  if (userCriteria.location && user.userCountry === userCriteria.location) {
    matchCount++;
  }
  if (userCriteria.interests.length > 0) {
    const commonInterests = user.userInterests.filter((interest) =>
      userCriteria.interests.includes(interest)
    );
    if (commonInterests.length > 0) {
      matchCount++;
    }
  }

  return matchCount >= criteriaLevel;
};
// const matchFilters = (user, userCriteria, criteriaLevel) => {
//   let matchCount = 0;

//   // Check gender match
//   if (userCriteria.gender && user.userGender === userCriteria.gender) {
//     matchCount++;
//   }

//   // Check location match
//   if (userCriteria.location && user.userCountry === userCriteria.location) {
//     matchCount++;
//   }

//   // Return true if the match count meets or exceeds the criteria level
//   return matchCount >= criteriaLevel;
// };

const handleNext = (io, socket) => {
  const pair = engagedPairs.find(
    (pair) => pair.user1 === socket.id || pair.user2 === socket.id
  );

  if (pair) {
    const remoteUserId = pair.user1 === socket.id ? pair.user2 : pair.user1;
    engagedUsers[socket.id] = false;
    engagedUsers[remoteUserId] = false;

    engagedPairs.splice(engagedPairs.indexOf(pair), 1);
    io.to(remoteUserId).emit("user-disconnected-by-next", socket.id); // Notify the other user
  }

  findMatch(socket);
};

const handleDisconnect = (io, socket) => {
  // console.log("Engaged Users before Disconnect: ", engagedUsers);

  const index = users.indexOf(socket);
  if (index !== -1) {
    users.splice(index, 1);
  }
  delete engagedUsers[socket.id];

  for (let i = engagedPairs.length - 1; i >= 0; i--) {
    if (
      engagedPairs[i].user1 === socket.id ||
      engagedPairs[i].user2 === socket.id
    ) {
      const otherUserId =
        engagedPairs[i].user1 === socket.id
          ? engagedPairs[i].user2
          : engagedPairs[i].user1;

      if (socket.prepareForCall) {
        // Handle the transition to a new call
        io.to(otherUserId).emit("user-disconnected", socket.id);
        engagedPairs.splice(i, 1);
        engagedUsers[otherUserId] = false;
        console.log("Engaged Users after Disconnect for call: ", engagedUsers);

        // Proceed with the call to the new user
        const targetSocket = users.find(
          (user) => user.id === socket.callerSocketId
        );
        if (targetSocket) {
          console.log("targetSocket is true: ", targetSocket);
          socket.emit("match-found", {
            socketId: targetSocket.id,
            userId: targetSocket.user.userid,
          });
          targetSocket.emit("match-found-for-remote", {
            socketId: socket.id,
            userId: socket.user.userid,
          });
        }
      } else {
        // Regular disconnection handling
        io.to(otherUserId).emit("user-disconnected", socket.id); // Notify the other user
        engagedPairs.splice(i, 1);
        engagedUsers[otherUserId] = false; // Reset state for remaining user
        console.log("From diconnect else part");
        console.log("Engaged Users after Disconnect: ", engagedUsers);
        findMatch(socket);
      }
    }
  }

  emitCurrentUsers(io);
};
const addUser = (io, socket) => {
  if (!socket.user.connectionAttempts) {
    socket.user.connectionAttempts = {
      dailyAttempts: 0,
      lastAttemptDate: new Date().toISOString().slice(0, 10),
    };
  }

  const existingUserIndex = users.findIndex((user) => user.id === socket.id);
  if (existingUserIndex !== -1) {
    users[existingUserIndex] = socket; // Update existing user
    // console.log(`Updated user info for ${socket.user.userid}`);
  } else {
    users.push(socket); // Add new user
    // console.log(`Added new user info for ${socket.user.userid}`);
    // console.log(`Added new socket info for ${socket.id}`);
  }
  emitCurrentUsers(io);
  if (socket.user.callerSocketId) {
    callToUser(socket);
  } else {
    findMatch(socket);
  }
};

const callToUser = (socket) => {
  const targetSocket = users.find(
    (user) => user.id === socket.user.callerSocketId
  );
  // users.find((user) => console.log("user socket: ", user.id));
  // console.log(
  //   "targetSocket user from callToUser: ",
  //   socket.user.callerSocketId
  // );
  if (targetSocket) {
    targetSocket.emit("call-prompt", {
      callerSocketId: socket.id,
      callerUserId: socket.user.userid,
    });
  }
};
// Handle call-accepted event
const handleCallAccepted = (socket, data) => {
  const callerSocketId = data.callerSocketId;
  //console.log("callerSocketId: ", callerSocketId);
  if (callerSocketId) {
    const targetSocket = users.find((user) => user.id === callerSocketId);
    //console.log("targetSocket from handleCallAccepted: ", targetSocket);
    if (targetSocket) {
      engagedUsers[socket.id] = true;
      engagedUsers[targetSocket.id] = true;
      engagedPairs.push({ user1: socket.id, user2: targetSocket.id });
      socket.emit("match-found", {
        socketId: targetSocket.id,
        userId: targetSocket.user.userid,
      });
      targetSocket.emit("match-found-for-remote", {
        socketId: socket.id,
        userId: socket.user.userid,
      });

      socket.prepareForCall = false;
      socket.callerSocketId = null;
      socket.callerUserId = null;
    }
  }
};

const getEngagedPairsService = () => {
  return engagedPairs;
};

const getTargetSocketId = (socketId) => {
  const pair = engagedPairs.find(
    (pair) => pair.user1 === socketId || pair.user2 === socketId
  );
  return pair ? (pair.user1 === socketId ? pair.user2 : pair.user1) : null;
};
const handleStop = (io, socket) => {
  const pair = engagedPairs.find(
    (pair) => pair.user1 === socket.id || pair.user2 === socket.id
  );

  if (pair) {
    const remoteUserId = pair.user1 === socket.id ? pair.user2 : pair.user1;
    engagedUsers[socket.id] = false;
    engagedUsers[remoteUserId] = false;

    engagedPairs.splice(engagedPairs.indexOf(pair), 1);
    io.to(remoteUserId).emit("remote-user-stopped", socket.id); // Notify the other user
  }

  // Clear the caller information and reset the state
  socket.prepareForCall = false;
  socket.callerSocketId = null;
  socket.callerUserId = null;

  // Optionally, emit an event back to the frontend to confirm the stop
  socket.emit("chat-stopped");
};

module.exports = {
  findMatch,
  handleNext,
  handleDisconnect,
  addUser,
  getEngagedPairsService,
  getTargetSocketId,
  updateUserFiltersInService,
  callToUser,
  handleCallAccepted,
  handleCallEnd,
  handleStop,
};
