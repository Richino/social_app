import mongoose from "mongoose";
import { Document } from "mongoose";

//user
const user = new mongoose.Schema({
	fullname: { type: String, required: true, max: 25, min: 5 },
	username: { type: String, required: true, unique: true, max: 25, min: 5 },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	bio: { type: String },
	followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
	messages: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
		default: [],
	},
	avatar: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
});

//post
const post = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	caption: { type: String },
	imageUrl: { type: String, required: true },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
	createdAt: { type: Date, default: Date.now },
	edited: { type: Boolean },
});

//comment
const comment = new mongoose.Schema({
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "posts",
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	text: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

//reply
const reply = new mongoose.Schema({
	comment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "comments",
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
});

//notification
const notification = new mongoose.Schema({
	author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	action: { type: String },
	post: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	read: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

//message
const message = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	readBy: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
		required: true,
		default: [],
	},
});

export const Message = mongoose.model<mongoose.Document>("messages", message);
export const Post = mongoose.model<mongoose.Document>("posts", post);
export const User = mongoose.model<mongoose.Document>("users", user);
export const Notification = mongoose.model<mongoose.Document>("notifications", notification);
export const Comment = mongoose.model<mongoose.Document>("comments", comment);
export const Reply = mongoose.model<mongoose.Document>("replies", reply);
