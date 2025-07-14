import changeAvatar from "./changeAvatar.mjs";
import joinRoom from "./joinRoom.mjs";
import newMessage from "./newMessage.mjs";
export default (io) => {
  io.on("connection", (socket) => {
    if (!socket.request.session.passport) return;
    newMessage(socket, io);
    joinRoom(socket);
    changeAvatar(socket, io);
    console.log("połączono", socket.id);
  });
};
