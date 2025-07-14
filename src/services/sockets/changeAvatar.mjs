export default (socket, io) => {
  socket.on("changeAvatar", ({ avatar, username }) => {
    io.to(socket.request.session.currentNameOfChat).emit("changeAvatar", {
      avatar: avatar,
      username: username,
    });
  });
};
