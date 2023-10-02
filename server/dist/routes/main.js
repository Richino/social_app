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
        let following = [...user["following"]];
        following.push(req.user.id);
        const feeds = yield client
            .collection("posts")
            .aggregate([
            { $match: { author: { $in: following.map((id) => new ObjectId(id)) } } },
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
        const notifications = yield client
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
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
export default router;
//# sourceMappingURL=main.js.map