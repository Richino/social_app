import { Router, Response } from "express";
import auth from "../auth/index.js";
import connectDB from "../config/mongodb.js";
import { ObjectId } from "mongodb";
const router = Router();
//
router.post("/", auth, async (req: any, res: Response) => {
	const { skip } = req.body;

	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();

	try {
		const user = await client
			.collection("users")
			.findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0, __v: 0 } })
			.catch(() => res.status(500).send("User not found"));

		let following: Array<string> = [...user["following"]];
		following.push(req.user.id);
		const feeds = await client
			.collection("posts")
			.aggregate([
				{ $match: { author: { $in: following.map((id: any) => new ObjectId(id)) } } },
				{
					$lookup: {
						from: "users",
						localField: "author",
						foreignField: "_id",
						as: "author_info",
					},
				},
				{
					$lookup: {
						from: "comments",
						localField: "_id",
						foreignField: "post",
						as: "comments_info",
					},
				},
				{
					$sort: { createdAt: -1 },
				},
				{ $skip: skip },
				{ $limit: 15 },
				{
					$project: {
						imageUrl: 1,
						avatar: "$author_info.avatar",
						author_username: "$author_info.username",
						author_fullname: "$author_info.fullname",
						_id: 1,
						caption: 1,
						likes: 1,
						author: 1,
						author_followers: "$author_info.followers",
						comments: { $size: "$comments_info" },
						createdAt: 1,
						edited: 1,
					}, //
				},
			])
			.toArray();
		return res.status(200).json(feeds);
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});
//
export default router; //
