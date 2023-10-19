var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import auth from "../auth/index.js";
import connectDB from "../config/mongodb.js";
import { ObjectId } from "mongodb";
const router = Router();
//
router.get("/", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const user = yield client
            .collection("users")
            .findOne({ _id: new ObjectId(req.user.id) }, { projection: { password: 0, __v: 0 } })
            .catch(() => res.status(500).send("User not found"));
        const messages = user["messages"];
        const users = yield client
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
                $addFields: {
                    orderIndex: { $indexOfArray: [messages, "$_id"] }
                }
            },
            {
                $sort: { orderIndex: 1 }
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
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
router.post("/user/:id", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const userIds = [new ObjectId(id), new ObjectId(req.user.id)];
        const messages = yield client
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
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
router.post("/read", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req["body"];
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    const users = [new ObjectId(user), new ObjectId(req.user.id)];
    try {
        const messages = yield client
            .collection("messages")
            .find({
            sender: { $in: users },
            recipient: { $in: users },
        })
            .toArray();
        for (const message of messages) {
            if (!message["readBy"].includes(req.user.id)) {
                message["readBy"].push(req.user.id);
                yield client.collection("messages").updateOne({ _id: message._id }, { $set: { readBy: message["readBy"] } });
            }
        }
        return res.status(200).json(true);
    }
    catch (error) {
        (yield session).abortTransaction();
        console.log(error);
    }
    finally {
        (yield session).endSession();
    }
}));
export default router;
//# sourceMappingURL=messages.js.map