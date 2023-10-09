import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import connectDB from "../config/mongodb.js";
import { Message } from "../models/model.js";
import { ObjectId } from "mongodb";

async function updateUserMessages(messages: any, id_1: any, id_2: any, client: any) {
	console.log(id_1, id_2);
	if (messages !== undefined) {
		const containsObjectId = messages.map((objId: any) => objId.toString()).includes(id_2.toString());

		if (!containsObjectId) {
			await client
				.collection("users")
				.updateOne({ _id: id_1 }, { $push: { messages: { $each: [id_2], $position: 0 } } })
				.catch((err) => console.log(err.message));
		} else {
			let array = [...messages];
			const ID = id_2;

			let index = array.findIndex((item) => item.toString() === ID.toString());
			if (index !== -1) {
				let id = array.splice(index, 1)[0];
				array.unshift(id);

				await client
					.collection("users")
					.updateOne(
						{ _id: id_2 },
						{
							$set: {
								messages: array,
							},
						}
					)
					.then(() => {
						console.log("Message updated successfully - sender");
					})
					.catch((err) => {
						console.log(err.message);
					});
			} else {
				console.log("Message not found in the array.");
			}
		}
	} else {
		await client
			.collection("users")
			.updateOne({ _id: id_1 }, { $push: { messages: { $each: [id_2], $position: 0 } } })
			.catch((err) => console.log(err.message));
	}
}

function Messages(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
	const users = new Map();

	io.of("/messages").use((socket, next) => {
		if (socket.handshake.auth["id"]) {
			socket["user"] = socket.handshake.auth["id"];
			next();
		}
	});

	io.of("/messages").on("error", (error) => {
		console.error("Socket.IO error:", error);
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

					await updateUserMessages(sender["messages"], res["sender"], res["recipient"], client);
					await updateUserMessages(recepient["messages"], res["recipient"], res["sender"], client);


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
