const users = [];

// Add user to a chatroom

const joinRoom = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

const userLeavesChat = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  joinRoom,
  getCurrentUser,
  userLeavesChat,
  getUsersInRoom,
};
