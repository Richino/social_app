import { Router, Request, Response } from "express";
import connectDB from "../config/mongodb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
	let { email, password, staySignin } = req.body;
	if (!password.length && !email.length) return res.status(400).send("Email and Password fields cannot be empty");
	if (!email.length) return res.status(400).send("Email field cannot be empty");
	if (!password.length) return res.status(400).send("Password field cannot be empty");
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();

	try {
		const user = await client.collection("users").findOne({ email: email.toLowerCase() });
		if (!user) return res.status(400).send("Email or password is incorrect");
		const match = await bcrypt.compare(password, user["password"]);
		if (!match) return res.status(400).send("Email or password is incorrect");
		// Assuming you have retrieved the user from the login process

		// Set the cookie
		const token = jwt.sign({ id: user._id }, process.env["SECRET"], {
			expiresIn: "2d",
		});

		res.cookie("auth", token, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: staySignin ? 2 * 24 * 60 * 60 * 1000 : undefined,
			domain: ".momentswelive.app",
		});

		//fixed

		res.status(200).json(token);
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
