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
import registerSockets from "./services/sockets/index.mjs";
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const sessionMiddleware = session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 5,
  },
});
io.engine.use(sessionMiddleware);
registerSockets(io);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/public")));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

connectDb();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routers);
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
