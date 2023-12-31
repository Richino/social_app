import express, {  Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import main from "./routes/main.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import user from "./routes/user.js";
import helmet from "helmet";
import messages from "./routes/messages.js";
import logout from "./routes/logout.js";
import activities from "./routes/activities.js";
import messagesSocket from "./sockets/message.js";
import user_controller from "./controllers/user.js";
import image from "./controllers/image.js";
import search from "./controllers/search.js";
import feeds from "./controllers/feeds.js";
import post from "./controllers/post.js";
import "dotenv/config";
const PORT = process.env["PORT"] || 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env["PRODUCTION_URL"], 
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	},
});

//config
app.use((_, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", process.env["PRODUCTION_URL"]);
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env["PRODUCTION_URL"],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
	})
);

//routes
app.use("/app", main);
app.use("/register", register);
app.use("/login", login);
app.use("/user", user);
app.use("/logout", logout);
app.use("/activities", activities);

//controllers//
app.use("/image", image);
app.use("/search", search);
app.use("/main_user", user_controller);
app.use("/feeds", feeds);
app.use("/post", post);
app.use("/messages", messages);

//socketss
messagesSocket(io);

server.listen(PORT, () => console.log("Server started: ", PORT));

