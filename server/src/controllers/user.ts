import { Router,  Response } from "express";
import connectDB from "../config/mongodb.js";
import "dotenv/config";
import { ObjectId } from "mongodb";
import { Notification, Comment } from "../models/model.js";
import auth from "../auth/index.js";
import bcrypt from "bcrypt";
const router = Router();

function validateUsername(username: string): boolean {
	const pattern = /^[a-zA-Z0-9]+$/;
	return pattern.test(username);
}

function validateEmail(email: string): boolean {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
}

router.post("/follow/:id", auth, async (req: any, res: Response) => {
	const { id } = req.params;
	const follower = req.body["user"];
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		const user = await client.collection("users").findOne({ _id: new ObjectId(req.user.id) });
		if (!user["following"].includes(id)) {
			if (id != follower) {
				client
					.collection("notifications")
					.find({ author: new ObjectId(id), user: new ObjectId(follower) })
					.toArray()
					.then((res) => {
						if (res.length >= 1) return;
						const notification = new Notification({
							author: new ObjectId(id),
							user: new ObjectId(follower),
							action: "follow",
						});
						notification.save();
					});
			}
			const updateUserFollowing = client.collection("users").updateOne({ _id: new ObjectId(req.user.id) }, { $push: { following: id } });
			const updateUserFollowers = client.collection("users").updateOne({ _id: new ObjectId(id) }, { $push: { followers: req.user.id } });
			await Promise.all([updateUserFollowing, updateUserFollowers]);
			return res.status(200).json(true);
		} else {
			const updateUserFollowing = client.collection("users").updateOne({ _id: new ObjectId(req.user.id) }, { $pull: { following: id } });
			const updateUserFollowers = client.collection("users").updateOne({ _id: new ObjectId(id) }, { $pull: { followers: req.user.id } });
			await Promise.all([updateUserFollowing, updateUserFollowers]);
			return res.status(200).json(true);
		}
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

router.post("/like/:id", auth, async (req: any, res: Response) => {
	const { id } = req.params;
	const { user, author } = req.body;
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		const post = await client.collection("posts").findOne({ _id: new ObjectId(id) });

		if (!post["likes"].includes(req.user.id)) {
			await client.collection("posts").updateOne({ _id: new ObjectId(id) }, { $push: { likes: req.user.id } });
			if (user != author) {
				client
					.collection("notifications")
					.find({ post: new ObjectId(id), user })
					.toArray()
					.then((res) => {
						if (res.length >= 1) return;
						const notification = new Notification({
							author: new ObjectId(author),
							post: new ObjectId(id),
							user: new ObjectId(user),
							action: "like",
						});
						notification.save();
					});
			}
			return res.status(200).json(true);
		} else {
			await client.collection("posts").updateOne({ _id: new ObjectId(id) }, { $pull: { likes: req.user.id } });
			return res.status(200).json(true);
		}
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

router.post("/like-comment", auth, async (req: any, res: Response) => {
	const { commentId, author, user, postId } = req.body;
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		const comments = await client.collection("comments").findOne({ _id: new ObjectId(commentId) });
		if (!comments["likes"].includes(req.user.id)) {
			await client.collection("comments").updateOne({ _id: new ObjectId(commentId) }, { $push: { likes: req.user.id } });
			if (user != author) {
				client
					.collection("notifications")
					.find({ post: new ObjectId(postId), user })
					.toArray()
					.then((res) => {
						if (res.length >= 1) return;
						const notification = new Notification({
							author: new ObjectId(author),
							post: new ObjectId(postId),
							user: new ObjectId(user),
							action: "comment",
						});
						notification.save();
					});
			}
			return res.status(200).json(true);
		} else {
			await client.collection("comments").updateOne({ _id: new ObjectId(commentId) }, { $pull: { likes: req.user.id } });
			return res.status(200).json(true);
		}
	} catch (error) {
		(await session).abortTransaction();
		console.log(error); //
	} finally {
		(await session).endSession();
	}
});

router.post("/caption/update", auth, async (req: any, res: Response) => {
	const { postId, text } = req.body;
	console.log({ postId, text });
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		await client.collection("posts").updateOne({ _id: new ObjectId(postId) }, { $set: { caption: text, edited: true } });
		return res.status(200).json(true);
	} catch (error) {
		(await session).abortTransaction();
		console.log(error); //
	} finally {
		(await session).endSession();
	}
});

router.post("/update/user/:type", auth, async (req: any, res: Response) => {
	const { type } = req.params;
	const data = req.body;
	let username = data.username.trim();
	if (username.length < 5) return res.status(400).send("Username too short (5 character or more)");
	if (username.length > 256) return res.status(400).send("Username too long (255 character or less)");
	if (username.includes(" ")) return res.status(400).send("Username can't contain spaces");
	if (!validateUsername(username)) return res.status(400).send("Username can only contain char from a-z and 1-9");
	if (data.fullname.length < 5) return res.status(400).send("Fullname too short");
	if (data.fullname.length > 256) return res.status(400).send("Fullname too long");
	if (!validateEmail(data.email)) return res.status(400).send("Email is invalid");

	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		if (type == "bio") {
			await client
				.collection("users")
				.findOneAndUpdate({ _id: new ObjectId(req.user.id) }, { $set: { fullname: data.fullname, username: data.username, email: data.email, bio: data.bio } })
				.catch((e) => {
					if (e.message.includes(data.username)) return res.status(400).send("username already exist");
					return res.status(400).send("password already exist");
				});
		} else {
			if (data.password.length < 7 || data.newPassword.length < 7) return res.status(400).send("Password is too weak");
			if (data.newPassword !== data.confirmPassword) return res.status(400).send("New password do not match");

			const user = await client.collection("users").findOne({ _id: new ObjectId(req.user.id) });
			const match = await bcrypt.compare(data.password, user["password"]);
			if (!match) return res.status(400).send("Password does not match");
			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);
			const hash = bcrypt.hashSync(data.newPassword, salt);
			await client
				.collection("users")
				.findOneAndUpdate({ _id: new ObjectId(req.user.id) }, { $set: { password: hash } })
				.catch((e) => {
					return res.status(500).send("Failed to update password");
				});
		}

		const user = await client
			.collection("users")
			.findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0, __v: 0 } })
			.catch(() => res.status(500).send("User not found"));

		return res.status(200).json(user);
	} catch (error) {
		(await session).abortTransaction();
		console.log(error); //
	} finally {
		(await session).endSession();
	}
});

router.post("/get-list", auth, async (req: any, res: Response) => {
	const { id, type } = req.body;
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		let list = null;
		let text = "";
		if (type.toLowerCase() === "likes") {
			const findOptions = {
				projection: { likes: 1 },
			};
			list = await client.collection("comments").findOne({ _id: new ObjectId(id) }, findOptions);
			text = "likes";
		} else {
			const findOptions = {
				projection: { followers: 1, following: 1 },
			};
			list = await client.collection("users").findOne({ _id: new ObjectId(id) }, findOptions);
			if (type.toLowerCase() === "new message") {
				text = "following";
			} else {
				text = type.toLowerCase();
			}
		}
		const users = await client
			.collection("users")
			.aggregate([
				{ $match: { _id: { $in: list[text].map((id: any) => new ObjectId(id)) } } },
				{ $limit: 15 },
				{
					$project: {
						avatar: 1,
						fullname: 1,
						username: 1,
						followers: 1,
						following: 1,
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

router.delete("/post/delete", auth, async (req: any, res: Response) => {
	const id: any = req.query["id"];
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		await client.collection("posts").deleteOne({ _id: new ObjectId(id) });
		return res.status(200).json(true);
	} catch (error) {
		(await session).abortTransaction();
		console.log(error); //
	} finally {
		(await session).endSession();
	}
});

router.post("/comment/:id", auth, async (req: any, res: Response) => {
	const author = req.params["id"];
	const { post, text } = req.body;
	if (text.length === 0) return res.status(400);
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		const comment = new Comment({
			post: post,
			author: author,
			text: text,
		});

		comment.save().then(async () => {
			const singleComment = await client
				.collection("posts")
				.aggregate([
					{ $match: { _id: new ObjectId(post) } },
					{
						$lookup: {
							from: "comments",
							localField: "_id",
							foreignField: "post",
							as: "comments_info",
						},
					},
					{
						$unwind: "$comments_info",
					},
					{
						$lookup: {
							from: "users",
							localField: "comments_info.author",
							foreignField: "_id",
							as: "comments_info.authorDetails",
						},
					},
					{
						$addFields: {
							"comments_info.authorDetails": {
								$arrayElemAt: ["$comments_info.authorDetails", 0],
							},
						},
					},

					{
						$project: {
							"comments_info.authorDetails.fullname": 1,
							"comments_info.authorDetails.avatar": 1,
							"comments_info.authorDetails._id": 1,
							"comments_info.text": 1,
							"comments_info.createdAt": 1,
							"comments_info._id": 1,
							"comments_info.likes": 1, //
							createdAt: 1,
						},
					},
					{
						$sort: {
							"comments_info.createdAt": -1,
						},
					},
				])
				.toArray();
			return res.status(200).json(singleComment);
		});
	} catch (error) {
		(await session).abortTransaction();
		console.log(error);
	} finally {
		(await session).endSession();
	}
});

export default router;
