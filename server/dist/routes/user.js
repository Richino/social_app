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
import "dotenv/config";
const router = Router();
router.post("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params["username"];
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const user = yield client
            .collection("users")
            .findOne({ username: username.toLowerCase() }, { projection: { password: 0, __v: 0, email: 0 } });
        if (!user)
            return res.status(404).send("Page not found");
        const post = yield client.collection("posts").find({ author: user._id }).sort({ createdAt: -1 }).toArray();
        return res.status(200).json({ user, post });
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
export default router;
//# sourceMappingURL=user.js.map