var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";
import { Router } from "express";
import connectDB from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";
//import { IRequest } from "../interfaces";
import auth from "../auth/index.js";
import "dotenv/config";
import multer from "multer";
import { Post } from "../models/model.js";
import { ObjectId } from "mongodb";
const router = Router();
const upload = multer();
router.post("/post/upload", auth, upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const caption = req.body.caption;
    const author = req.user.id;
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const metadata = {
            contentType: "image/jpeg",
        };
        const storageRef = ref(storage, `${author}/${uuidv4()}`);
        const bytes = new Uint8Array(req.files[0].buffer);
        uploadBytes(storageRef, bytes, metadata)
            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
            const imageUrl = yield getDownloadURL(ref(storage, data.metadata.fullPath));
            const post = new Post({
                author,
                caption,
                imageUrl,
            });
            post.save((err, post) => {
                if (err) {
                }
                client.close();
                return res.status(200).json(post);
            });
        }))
            .catch((err) => {
            if (err)
                return res.status(500).send("Image failed to upload");
        });
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
router.post("/profile/upload", auth, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.id;
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const metadata = {
            contentType: "image/jpeg",
        };
        const storageRef = ref(storage, `${user}/avatar/image`);
        const bytes = new Uint8Array(req.file.buffer);
        uploadBytes(storageRef, bytes, metadata).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            const imageUrl = yield getDownloadURL(ref(storage, data.metadata.fullPath));
            yield client
                .collection("users")
                .updateOne({ _id: new ObjectId(user) }, { $set: { avatar: imageUrl } })
                .then(() => res.status(200).json(imageUrl))
                .catch((err) => {
                if (err)
                    return res.status(500).send("Image failed to modify");
            });
        }));
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
router.post("/profile/delete", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user.id;
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const imageUrl = yield getDownloadURL(ref(storage, "default/default.png")).catch((err) => {
            if (err)
                return res.status(500).send("Image failed to modify");
        });
        yield client
            .collection("users")
            .updateOne({ _id: new ObjectId(user) }, { $set: { avatar: imageUrl } })
            .then(() => res.status(200).json(imageUrl));
    }
    catch (error) {
        (yield session).abortTransaction();
    }
    finally {
        (yield session).endSession();
    }
}));
export default router;
//# sourceMappingURL=image.js.map