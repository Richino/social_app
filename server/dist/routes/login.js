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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
const router = Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    if (!password.length && !email.length)
        return res.status(400).send("Email and Password fields cannot be empty");
    if (!email.length)
        return res.status(400).send("Email field cannot be empty");
    if (!password.length)
        return res.status(400).send("Password field cannot be empty");
    const client = yield connectDB();
    const session = client.startSession();
    (yield session).startTransaction();
    try {
        const user = yield client.collection("users").findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(400).send("Email or password is incorrect");
        const match = yield bcrypt.compare(password, user["password"]);
        if (!match)
            return res.status(400).send("Email or password is incorrect");
        // Assuming you have retrieved the user from the login process
        // Set the cookie
        const token = jwt.sign({ id: user._id }, process.env["SECRET"], {
            expiresIn: "5h",
        });
        res.cookie("auth", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 5 * 60 * 60 * 1000,
        });
        res.status(200).json(token);
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
//# sourceMappingURL=login.js.map