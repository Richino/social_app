import "dotenv/config";
import jwt from "jsonwebtoken";
const secret = process.env["SECRET"];
//possible to has the cookie
export default function auth(req, res, next) {
    const auth = req.cookies.auth;
    console.log(auth);
    if (!auth)
        return res.status(401).send("Unauthorized");
    const token = jwt.verify(auth, secret);
    req.user = token;
    const now = Date.now();
    const tokenExpTime = token["exp"] * 1000;
    const oneHour = 60 * 60 * 1000;
    /* if (tokenExpTime - now <= oneHour) {
    //console.log(:) // token is about to expire in 1 hou r or less
  }*/
    next();
}
//# sourceMappingURL=index.js.map