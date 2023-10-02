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
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
export default router;
//# sourceMappingURL=activities.js.map