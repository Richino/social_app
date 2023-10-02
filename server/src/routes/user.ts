import { Router, Request, Response } from "express";
import connectDB from "../config/mongodb.js";
import "dotenv/config";
import { ObjectId } from "mongodb";
const router = Router();

router.post("/:username", async (req: Request, res: Response) => {
	const username = req.params["username"];
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		let user = await client
			.collection("users")
			.findOne({ username: username.toLowerCase() }, { projection: { password: 0, __v: 0, email: 0 } });

		if (!user) return res.status(404).send("Page not found");
		let post = await client.collection("posts").find({ author: user._id }).sort({ createdAt: -1 }).toArray();
		const posts = await client
			.collection("posts")
			.aggregate([
				{ $match: { author: new ObjectId(user._id) } },
				{
					$lookup: {
						from: "comments",
						localField: "_id",
						foreignField: "post",
						as: "comments_info",
					},
				},
				{
					$project: {
						_id: 1,
						author: 1,
						caption: 1,
						createdAt: 1,
						comments: { $size: "$comments_info" },
						imageUrl: 1,
						likes: 1,
					},
				},
			])
			.toArray();
		return res.status(200).json({ user, post });
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
