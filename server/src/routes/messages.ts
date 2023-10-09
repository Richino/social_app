import { Router, Response } from "express";
import auth from "../auth/index.js";
import connectDB from "../config/mongodb.js";
import { ObjectId, Document } from "mongodb";
const router = Router();

export interface IMessage extends Document {
	sender: string;
	recipient: string;
	message: string;
	readBy: ObjectId[];
}
//
router.get("/", auth, async (req: any, res: Response) => {
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();

	try {
		const user = await client
			.collection("users")
			.findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0, __v: 0 } })
			.catch(() => res.status(500).send("User not found"));

		const messages = user["messages"];

		const users = await client
			.collection("users")
			.aggregate([
				{
					$match: {
						_id: {
							$in: messages,
						},
					},
				},
				{
					$lookup: {
						from: "messages",
						let: { user_id: "$_id" },
						pipeline: [
							{
								$match: {
									$expr: {
										$or: [
											{
												$and: [
													{
														$eq: ["$sender", "$$user_id"],
													},
													{
														$eq: ["$recipient", new ObjectId(req.user.id)],
													},
												],
											},
											{
												$and: [
													{
														$eq: ["$recipient", "$$user_id"],
													},
													{
														$eq: ["$sender", new ObjectId(req.user.id)],
													},
												],
											},
										],
									},
								},
							},
							{
								$project: {
									_id: 1,
									recipient: 1,
									sender: 1,
									message: 1,
									readBy: 1,
								},
							},
							{ $sort: { _id: -1 } },
						],
						as: "message",
					},
				},
				{
					$project: {
						fullname: 1,
						avatar: 1,
						username: 1,
						message: "$message",
					},
				},
			])
			.toArray();

		return res.status(200).json(users);
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

router.post("/user/:id", auth, async (req: any, res: Response) => {
	const { id } = req.params;
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();

	try {
		const userIds = [new ObjectId(id), new ObjectId(req.user.id)];

		const messages = await client
			.collection("messages")
			.aggregate([
				{
					$match: {
						$and: [
							{
								sender: { $in: userIds },
							},
							{
								recipient: { $in: userIds },
							},
						],
					},
				},
				{
					$project: {
						sender: 1,
						recipient: 1,
						message: 1,
						readBy: 1,
					},
				},
				{ $sort: { _id: -1 } },
			])
			.toArray();

		return res.status(200).json(messages);
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

router.post("/read", auth, async (req: any, res: Response) => {
	const { user } = req["body"];
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	const users = [new ObjectId(user), new ObjectId(req.user.id)];

	try {
		const messages = await client
			.collection("messages")
			.find({
				sender: { $in: users },
				recipient: { $in: users },
			})
			.toArray();

		for (const message of messages) {
			if (!message["readBy"].includes(req.user.id)) {
				message["readBy"].push(req.user.id);
				await client.collection("messages").updateOne({ _id: message._id }, { $set: { readBy: message["readBy"] } });
			}
		}

		return res.status(200).json(true);
	} catch (error) {
		(await session).abortTransaction();
		console.log(error);
	} finally {
		(await session).endSession();
	}
});

export default router;
