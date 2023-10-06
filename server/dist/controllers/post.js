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
import connectDB from "../config/mongodb.js";
//import { IRequest } from "../interfaces";
import auth from "../auth/index.js";
import "dotenv/config";
import { ObjectId } from "mongodb";
const router = Router();
router.post("/comments/:id", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = req.params["id"];
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const comments = yield client
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
                    "comments_info.likes": 1,
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
        return res.status(200).json(comments);
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
export default router;
//# sourceMappingURL=post.js.map