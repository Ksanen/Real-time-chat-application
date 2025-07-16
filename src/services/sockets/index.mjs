import changeAvatar from "./changeAvatar.mjs";
import joinAllRooms from "./joinAllRooms.mjs";
import newMessage from "./newMessage.mjs";
export default (io) => {
  io.on("connection", (socket) => {
    if (!socket.request.session.passport) return;
    newMessage(socket, io);
    changeAvatar(socket, io);
    joinAllRooms(socket);
    console.log("connected", socket.id);
  });
};
