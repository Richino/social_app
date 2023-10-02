import { Router, Request, Response } from "express";
import connectDB from "../config/mongodb.js";
import auth from "../auth/index.js";
import "dotenv/config";
const router = Router();

router.post("/user", auth, async (req: Request, res: Response) => {
	const username = req.body.username;
	if (username.length === 0) return res.status(200).json([]);
	const regex = new RegExp(`^${username}`, "i");
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		client.collection("users").createIndex({ user: 1 });
		await client
			.collection("users")
			.find(
				{ username: { $regex: regex } },
				{
					projection: {
						password: 0,
						__v: 0,
						email: 0,
						followers: 0,
						following: 0,
						bio: 0,
						createdAt: 0,
					},
				}
			)
			.toArray()
			.then((user) => {
				return res.status(200).json(user);
			});
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
