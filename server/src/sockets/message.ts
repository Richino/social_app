import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import connectDB from "../config/mongodb.js";
import { Message } from "../models/model.js";
import { ObjectId } from "mongodb";

function Messages(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	const users = new Map();
	io.of("/messages").use((socket, next) => {
		if (socket.handshake.auth["id"]) {
			socket["user"] = socket.handshake.auth["id"];
			next();
		}
	});

	io.of("/messages").on("connection", (socket) => {
		const userId = socket["user"];
		const sessionId = socket.id;
		users.set(sessionId, userId);

		socket.on("disconnect", () => {
			users.forEach((key, value) => {
				if (value === socket.id) {
					users.delete(socket.id);
				}
			});
		});

		socket.on("message", async (data) => {
			if (data.message.length === 0) return;
			let recipientArray = [];
			let senderArray = [];
			users.forEach((key, value) => {
				if (key === data.id) recipientArray.push(value);
			});

			users.forEach((key, value) => {
				if (key === socket["user"]) senderArray.push(value);
			});

			const client = await connectDB();
			const session = client.startSession();
			(await session).startTransaction();
			try {
				const message = new Message({
					sender: socket["user"],
					recipient: data.id,
					message: data.message,
					readBy: [socket["user"].toString()],
				});
				message.save(async (err, res) => {
					const [senderUser, recepientUser] = await Promise.all([
						client
							.collection("users")
							.aggregate([
								{ $match: { _id: res["sender"] } },
								{ $addFields: { message: data.message } },
								{
									$project: {
										avatar: 1,
										fullname: 1,
										username: 1,
										message: 1,
										messages: 1,
									},
								},
							])
							.toArray(),
						client
							.collection("users")
							.aggregate([
								{ $match: { _id: new ObjectId(data.id) } },
								{
									$project: {
										avatar: 1,
										fullname: 1,
										username: 1,
										messages: 1,
									},
								},
							])
							.toArray(),
					]);
					let sender = senderUser[0];
					let recepient = recepientUser[0];
					let s = res["sender"];
					let r = res["recipient"];
					if (sender["messages"] !== undefined) {
						const containsObjectId = sender["messages"].map((objId: any) => objId.toString()).includes(r.toString());
						if (!containsObjectId) {
							await client
								.collection("users")
								.updateOne({ _id: res["sender"] }, { $push: { messages: { $each: [new ObjectId(data.id)], $position: 0 } } })
								.catch((err) => console.log(err.message, 1));
						} else {
							await Promise.all([
								client
									.collection("users")
									.updateOne({ _id: res["sender"] }, { $pull: { messages: new ObjectId(data.id) } })
									.then((res) => {
										console.log(res, "pulled");
									})
									.catch((err) => console.log(err.message, 2)),
								client
									.collection("users")
									.updateOne({ _id: res["sender"] }, { $push: { messages: { $each: [new ObjectId(data.id)], $position: 0 } } })
									.then((res) => {
										console.log(res, "pushed");
									})
									.catch((err) => console.log(err.message, 3)),
							]);
						}
					} else {
						await client
							.collection("users")
							.updateOne({ _id: res["sender"] }, { $push: { messages: { $each: [new ObjectId(data.id)], $position: 0 } } })
							.catch((err) => console.log(err.message, 3));
					}

					if (recepient["messages"] !== undefined) {
						const containsObjectId = recepient["messages"].map((objId: any) => objId.toString()).includes(s.toString());
						if (!containsObjectId) {
							await client
								.collection("users")
								.updateOne({ _id: new ObjectId(data.id) }, { $push: { messages: { $each: [res["sender"]], $position: 0 } } })
								.catch((err) => console.log(err.message, 4));
						} else {
							await Promise.all([
								client
									.collection("users")
									.updateOne({ _id: new ObjectId(data.id) }, { $pull: { messages: res["sender"] } })
									.then((res) => {
										console.log(res, "pushed");
									})
									.catch((err) => console.log(err.message, 5)),
								client
									.collection("users")
									.updateOne({ _id: new ObjectId(data.id) }, { $push: { messages: { $each: [res["sender"]], $position: 0 } } })
									.then((res) => {
										console.log(res, "pulled");
									})
									.catch((err) => console.log(err.message, 6)),
							]);
						}
					} else {
						await client
							.collection("users")
							.updateOne({ _id: new ObjectId(data.id) }, { $push: { messages: { $each: [res["sender"]], $position: 0 } } })
							.catch((err) => console.log(err.message, 6));
					}

					delete res["__v"];
					delete res["createdAt"];
					const msg = { index: data.index, message: res, id: data.sender, recipient: data.id };
					if (recipientArray.length != 0) {
						recipientArray.forEach((id) => socket.to(id).emit("received-message", msg));
					}
					if (senderArray.length != 0) {
						senderArray.forEach((id) => socket.to(id).emit("send-message", msg));
					}

					socket.emit("send-message", msg);
				});
			} catch (error) {
				(await session).abortTransaction();
			} finally {
				(await session).endSession();
			}
		});
	});
}

export default Messages;
