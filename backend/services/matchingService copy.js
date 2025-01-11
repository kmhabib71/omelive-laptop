const users = [];
const userInfo = [];
const engagedUsers = {}; // Track engaged users
const engagedPairs = []; // Track engaged pairs

const addUser = (socket, userInfoData) => {
  users.push(socket);
  const existingUserIndex = userInfo.findIndex(
    (user) => user.id === userInfoData.id
  );
  if (existingUserIndex !== -1) {
    userInfo[existingUserIndex] = userInfoData; // Update existing user
    // console.log(`Updated user info for ${userInfoData.id}`);
  } else {
    userInfo.push(userInfoData); // Add new user
    // console.log(`Added new user info for ${userInfoData.id}`);
  }
  console.log("Current users array:", users);
  console.log("Current userInfo array:", userInfo);
  findMatch(socket);
};

const updateUserFiltersInService = (userId, filters) => {
  const user = userInfo.find((user) => user.id === userId);
  if (user) {
    user.filters = filters;
    console.log(`Updated filters for user ${userId}`);
  } else {
    console.log(`User ${userId} not found for updating filters`);
  }
};

const findMatch = (socket) => {
  console.log("Engaged Users before match: ", engagedUsers);

  const user = userInfo.find((u) => u.id === socket.id);
  if (!user) {
    console.log("User not found");
    return;
  }

  let availableUsers;

  if (user.isPremium) {
    const userFilters = user.filters;
    availableUsers = userInfo.filter(
      (u) =>
        u.id !== socket.id &&
        !engagedUsers[u.id] &&
        matchFilters(u, userFilters)
    );
  } else {
    availableUsers = users.filter(
      (u) => u.id !== socket.id && !engagedUsers[u.id]
    );
  }

  if (availableUsers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    const match = availableUsers[randomIndex];
    engagedUsers[socket.id] = true;
    engagedUsers[match.id] = true;
    engagedPairs.push({ user1: socket.id, user2: match.id });
    socket.emit("match-found", match.id);
    socket.to(match.id).emit("match-found-for-remote", socket.id);
    console.log(`Match found between ${socket.id} and ${match.id}`);
  } else {
    console.log("No available users found for matching");
  }

  console.log("Engaged Users after match: ", engagedUsers);
};

const matchFilters = (user, userCriteria) => {
  if (userCriteria.gender && user.userGender !== userCriteria.gender) {
    return false;
  }
  if (
    userCriteria.ageRange &&
    (user.userAge < userCriteria.ageRange.min ||
      user.userAge > userCriteria.ageRange.max)
  ) {
    return false;
  }
  if (userCriteria.location && user.userCountry !== userCriteria.location) {
    return false;
  }
  if (userCriteria.interests.length > 0) {
    const commonInterests = user.userInterests.filter((interest) =>
      userCriteria.interests.includes(interest)
    );
    if (commonInterests.length === 0) {
      return false;
    }
  }
  return true;
};

const handleNext = (io, socket) => {
  const pair = engagedPairs.find(
    (pair) => pair.user1 === socket.id || pair.user2 === socket.id
  );

  if (pair) {
    const remoteUserId = pair.user1 === socket.id ? pair.user2 : pair.user1;
    engagedUsers[socket.id] = false;
    engagedUsers[remoteUserId] = false;

    engagedPairs.splice(engagedPairs.indexOf(pair), 1);
    io.to(remoteUserId).emit("user-disconnected-by-next", socket.id);
    console.log(`User ${socket.id} disconnected by next`);
  }

  findMatch(socket);
};
const handleCallEnd = (io, socket) => {
  // Clear the caller information and add the user back to the random matching pool
  socket.prepareForCall = false;
  socket.callerSocketId = null;
  socket.callerUserId = null;

  findMatch(socket);
};

const handleDisconnect = (io, socket) => {
  console.log("Engaged Users before Disconnect: ", engagedUsers);

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
        console.log("Engaged Users after Disconnect: ", engagedUsers);
      }
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

module.exports = {
  findMatch,
  handleNext,
  handleDisconnect,
  addUser,
  getEngagedPairsService,
  getTargetSocketId,
  updateUserFiltersInService,
  handleCallEnd,
};
