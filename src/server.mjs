import express from "express";
import routers from "./routers/index.mjs";
import connectDb from "./config/db.mjs";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import { sendMessageToChat } from "./controllers/chatControllers.mjs";
import User from "./models/userSchema.mjs";
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/public")));
const sessionMiddleware = session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 5,
  },
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
io.engine.use(sessionMiddleware);
io.on("connection", (socket) => {
  if (!socket.request.session.passport) return;
  socket.on("newMessage", async (message) => {
    try {
      const userId = socket.request.session.passport.user;
      const user = await User.findById(userId);
      if (!user) return;
      if (typeof message !== "string" || message.length === 0) return;
      const messageId = await sendMessageToChat(
        message,
        socket.request.session.currentNameOfChat,
        user.username
      );
      io.to(socket.request.session.currentNameOfChat).emit("newMessage", {
        message: message,
        messageId: messageId,
        senderUsername: user.username,
      });
    } catch (e) {
      console.log(e);
      return;
    }
  });
  socket.on("join-room", (room) => {
    socket.join(room);
    socket.request.session.currentNameOfChat = room;
    socket.request.session.save();
  });
  console.log("połączono", socket.id);
});
connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routers);
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
