export default (socket, io) => {
  socket.on("changeAvatar", ({ avatar, username }) => {
    Array.from(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        io.to(room).emit("changeAvatar", {
          avatar: avatar,
          username: username,
        });
      }
    });
  });
};
