export default (socket) => {
  socket.on("join-room", (roomToJoin) => {
    const roomsToLeave = Array.from(socket.rooms).filter(
      (room) => room !== socket.id
    );
    roomsToLeave.forEach((roomToLeave) => {
      socket.leave(roomToLeave);
      console.log("opuszczono");
    });
    socket.join(roomToJoin);
    socket.request.session.currentNameOfChat = roomToJoin;
    socket.request.session.save();
  });
};
