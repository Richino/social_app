import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
	mongoose.set("strictQuery", true);
	await mongoose.connect(process.env["MONGODB_URI"]);
	const db = mongoose.connection;
	return db;
};

export default connectDB;
