export default (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);
    socket.request.session.currentNameOfChat = room;
    socket.request.session.save();
  });
};
