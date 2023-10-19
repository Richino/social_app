import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import connectDB from "../config/mongodb.js";
import { Message } from "../models/model.js";
import { ObjectId } from "mongodb";

async function updateMessagesInUserCollection(client: any, userId: any, messageArray: any, recipientId: any) {
	const containsObjectId = messageArray.map((objId) => objId.toString()).includes(recipientId.toString());

	let updatedArray = [...messageArray];

	if (!containsObjectId) {
		updatedArray.unshift(recipientId);
	} else {
		const index = updatedArray.findIndex((item) => item.toString() === recipientId.toString());
		if (index !== -1) {
			updatedArray.splice(index, 1);
			updatedArray.unshift(recipientId);
		} else {
			console.log("Message not found in the array.");
		}
	}

	return client.collection("users").updateOne({ _id: userId }, { $set: { messages: updatedArray } });
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
				message.save(async (_, res) => {
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
					let recipient = recepientUser[0];

					if (sender["messages"] !== undefined && recipient["messages"] !== undefined) {
						const senderPromise = updateMessagesInUserCollection(client, res["sender"], sender["messages"], res["recipient"]);
						const recipientPromise = updateMessagesInUserCollection(client, res["recipient"], recipient["messages"], res["sender"]);

						await Promise.all([senderPromise, recipientPromise]);
					} else if (sender["messages"] !== undefined) {
						await updateMessagesInUserCollection(client, res["sender"], sender["messages"], res["recipient"]);
					} else if (recipient["messages"] !== undefined) {
						await updateMessagesInUserCollection(client, res["recipient"], recipient["messages"], res["sender"]);
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
