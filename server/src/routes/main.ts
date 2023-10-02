import { Router, Response } from "express";
import auth from "../auth/index.js";
import { IRequest } from "../interfaces/index.js";
import connectDB from "../config/mongodb.js";
import { ObjectId } from "mongodb";
const router = Router();
//
router.get("/", auth, async (req: IRequest, res: Response) => {
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
		const notifications = await client
			.collection("notifications")
			.aggregate([
				{
					$match: { author: new ObjectId(req.user.id) },
				},
				{
					$lookup: {
						from: "users",
						localField: "user",
						foreignField: "_id",
						as: "user_info",
					},
				},
				{
					$lookup: {
						from: "posts",
						localField: "post",
						foreignField: "_id",
						as: "post_info",
					},
				},
				{
					$sort: { createdAt: -1 },
				},
				{ $limit: 5 },
				{
					$project: {
						avatar: "$user_info.avatar",
						author_username: "$user_info.username",
						author_fullname: "$user_info.fullname",
						image: "$post_info.imageUrl",
						action: 1,
						createdAt: 1,
					},
				},
			])
			.toArray();
		return res.status(200).json({ user, feeds, notifications }); //
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
