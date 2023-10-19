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
import jwt from "jsonwebtoken";
import "dotenv/config";
const router = Router();
router.post("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
export default router;
//# sourceMappingURL=logout.js.map