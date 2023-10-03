import express, { NextFunction, Request, Response } from "express";
import cookieSession from "cookie-session";
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

const app = express();
app.use(helmet());
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "https://moments.up.railway.app");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

const corsOptions = {
	origin: process.env["URL"],
	credentials: true,
};

app.set("trust proxy", true);

const io = new Server(server, {
	cors: {
		origin: process.env["PRODUCTION_URL_SOCKET"],
		methods: ["GET", "POST"],
	},
});

const PORT = process.env["PRODUCTION_URL"] || 4000;

//config
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "https://moments.up.railway.app",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
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

server.listen(PORT, () => console.log("Server started"));
