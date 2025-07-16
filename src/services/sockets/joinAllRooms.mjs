export default (socket) => {
  socket.on("join-rooms", (rooms) => {
    rooms.forEach((room) => {
      socket.join(room);
      console.log("dolaczono");
    });
  });
};
