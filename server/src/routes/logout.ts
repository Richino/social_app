import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
const router = Router();

router.post("/", async (req: Request, res: Response) => {
	const token = jwt.sign({ id: "" }, process.env["SECRET"], {
		expiresIn: "1ms",
	});
	res.cookie("auth", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: 1,
	});
	return res.status(200).send("User logged out");
});

export default router;
