import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { auth, FirebaseUser, UserCredential } from "../lib/firebase";

interface IUser {
	uid: string;
	name?: string | null;
	email: string | null;
	photoUrl?: string | null;
}

type FirebaseAuthAction = (
	email: string,
	password: string
) => Promise<UserCredential>;

interface IAuthContextProps {
	user: IUser | null;
	loading: boolean;
	isAuthenticated: boolean;
	signup: FirebaseAuthAction;
	login: FirebaseAuthAction;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	updateProfile: (
		displayName: string | null | undefined,
		photoURL: string | null | undefined
	) => Promise<void>;
	updateEmail: (newEmail: string) => Promise<void>;
	updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext({} as IAuthContextProps);

export const useAuthContext = () => {
	return useContext(AuthContext);
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [loading, setLoading] = useState(true);

	const signup = (email: string, password: string) => {
		return auth.createUserWithEmailAndPassword(email, password);
	};

	const login = (email: string, password: string) => {
		return auth.signInWithEmailAndPassword(email, password);
	};

	const logout = async () => {
		await auth.signOut();
	};

	const resetPassword = (email: string) => {
		return auth.sendPasswordResetEmail(email);
	};

	const updateProfile = async (
		displayName: string | null | undefined,
		photoURL: string | null | undefined
	) => {
		if (!auth.currentUser || !user) return Promise.resolve();
		await auth.currentUser.updateProfile({ displayName, photoURL });
		setUser({ ...user, name: displayName, photoUrl: photoURL });
	};

	const updateEmail = async (newEmail: string) => {
		if (!auth.currentUser || !user) return Promise.resolve();
		await auth.currentUser.updateEmail(newEmail);
		setUser({ ...user, email: newEmail });
	};

	const updatePassword = async (newPassword: string) => {
		if (!auth.currentUser) return Promise.resolve();
		return auth.currentUser.updatePassword(newPassword);
	};

	const updateUser = useCallback((user: FirebaseUser | null) => {
		setUser(
			user
				? {
						uid: user.uid,
						name: user.displayName,
						email: user.email,
						photoUrl: user.photoURL,
				  }
				: null
		);
	}, []);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			updateUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, [updateUser]);

	const isAuthenticated = useMemo(
		() => Boolean(user && !loading),
		[user, loading]
	);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				isAuthenticated,
				login,
				logout,
				signup,
				resetPassword,
				updateProfile,
				updateEmail,
				updatePassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
