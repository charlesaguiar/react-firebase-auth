import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getStorage } from "firebase/storage";

const app = firebase.initializeApp({
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
});
export const storage = getStorage(app);

export const auth = app.auth();

/* ERROR MESSAGE PARSER */
const FIREBASE_ERROR_MAP = {
	"auth/wrong-password": "Invalid credentials",
	"auth/user-not-found": "User does not exist",
	"auth/email-already-in-use": "Email already in use",
	"auth/weak-password": "Passsword must have at least 6 characters",
	"auth/too-many-requests":
		"Too many failed login attemps. Account temporarilt blocked",
};

export const parseFirebaseErrorMessage = (error: AuthError) => {
	const message = error.message;
	let parsedMessage = "An error happened. Please try again";

	console.log({ message });
	for (var k of Object.keys(FIREBASE_ERROR_MAP)) {
		if (message.includes(k)) {
			parsedMessage = FIREBASE_ERROR_MAP[k as keyof typeof FIREBASE_ERROR_MAP];
			break;
		}
	}

	return parsedMessage;
};

/* FIREBASE TYPES */
export type AuthError = firebase.auth.Error;
export type UserCredential = firebase.auth.UserCredential;
export type FirebaseUser = firebase.User;

export default app;
