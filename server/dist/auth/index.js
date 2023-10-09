import "dotenv/config";
import jwt from "jsonwebtoken";
const secret = process.env["SECRET"];
//possible to has the cookie
export default function auth(req, res, next) {
    const auth = req.cookies.auth;
    if (!auth)
        return res.status(401).send("Unauthorized");
    try {
        const token = jwt.verify(auth, secret);
        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = token.exp - currentTime;
        console.log(token);
        const oneHour = 3600;
        if (expirationTime < oneHour) {
            const newToken = jwt.sign({ id: token.id }, secret, {
                expiresIn: "2d",
            });
            res.cookie("auth", newToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 2 * 24 * 60 * 60 * 1000,
            });
            req.user = jwt.verify(newToken, secret);
        }
        else {
            req.user = token;
        }
        next();
    }
    catch (err) {
        return res.status(401).send("Unauthorized");
    }
}
//# sourceMappingURL=index.js.map