import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import "dotenv/config";

const firebaseConfig = {
	apiKey: process.env["API_KEY"],
	authDomain: process.env["AUTH_DOMAIN"],
	databaseURL: process.env["DATABASE_URL"],
	projectId: process.env["PROJECT_ID"],
	storageBucket: process.env["STORAGE_BUCKET"],
	messagingSenderId: process.env["SENDER_ID"],
	appId: process.env["APP_ID"],
	measurementId: process.env["MEASUREMEMT_ID"],
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
