import { Router, Request, Response } from "express";
import connectDB from "../config/mongodb.js";
import "dotenv/config";
const router = Router();

router.post("/:username", async (req: Request, res: Response) => {
	const username = req.params["username"];
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		const user = await client
			.collection("users")
			.findOne({ username: username.toLowerCase() }, { projection: { password: 0, __v: 0, email: 0 } });

		if (!user) return res.status(404).send("Page not found");
		const post = await client.collection("posts").find({ author: user._id }).sort({ createdAt: -1 }).toArray();
		return res.status(200).json({ user, post });
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
