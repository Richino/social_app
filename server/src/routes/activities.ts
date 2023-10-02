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
		return res.status(200).json(notifications);
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
