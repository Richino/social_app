import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";
import { Router, Response } from "express";
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

router.post("/post/upload", auth, upload.any(), async (req: any, res: Response) => {
	const caption = req.body.caption;
	const author = req.user.id;
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();

	try {
		const metadata = {
			contentType: "image/jpeg",
		};
		const storageRef = ref(storage, `${author}/${uuidv4()}`);
		const bytes = new Uint8Array(req.files[0].buffer);
		uploadBytes(storageRef, bytes, metadata)
			.then(async (data) => {
				const imageUrl = await getDownloadURL(ref(storage, data.metadata.fullPath));
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
			})
			.catch((err) => {
				if (err) return res.status(500).send("Image failed to upload");
			});
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

router.post("/profile/upload", auth, upload.single("image"), async (req: any, res: Response) => {
	const user = req.user.id;

	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();

	try {
		const metadata = {
			contentType: "image/jpeg",
		};
		const storageRef = ref(storage, `${user}/avatar/image`);
		const bytes = new Uint8Array(req.file.buffer);
		uploadBytes(storageRef, bytes, metadata).then(async (data) => {
			const imageUrl = await getDownloadURL(ref(storage, data.metadata.fullPath));
			await client
				.collection("users")
				.updateOne({ _id: new ObjectId(user) }, { $set: { avatar: imageUrl } })
				.then(() => res.status(200).json(imageUrl))
				.catch((err) => {
					if (err) return res.status(500).send("Image failed to modify");
				});
		});
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

router.post("/profile/delete", auth, async (req: any, res: Response) => {
	const user = req.user.id;
	const client = await connectDB();
	const session = client.startSession();
	(await session).startTransaction();
	try {
		const imageUrl = await getDownloadURL(ref(storage, "default/default.png")).catch((err) => {
			if (err) return res.status(500).send("Image failed to modify");
		});
		await client
			.collection("users")
			.updateOne({ _id: new ObjectId(user) }, { $set: { avatar: imageUrl } })
			.then(() => res.status(200).json(imageUrl));
	} catch (error) {
		(await session).abortTransaction();
	} finally {
		(await session).endSession();
	}
});

export default router;
