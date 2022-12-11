import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { useAuthContext } from "../contexts/AuthContext";
import { displayToast } from "../utils/toast";
import { AuthError, parseFirebaseErrorMessage, storage } from "../lib/firebase";

import Button from "../components/Button";
import Input from "../components/Input";
import Divider from "../components/Divider";
import UploadAvatar from "../components/UploadAvatar";

// interface IAvatar {
// 	url: string | null | undefined;
// 	file: File | undefined;
// }

const UpdateProfile: React.FC = () => {
	const navigate = useNavigate();
	const { user, updateProfile, updatePassword, updateEmail } = useAuthContext();

	const [loading, setLoading] = useState(false);
	const [avatar, setAvatar] = useState<File | undefined>();
	const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>();

	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmationRef = useRef<HTMLInputElement>(null);

	const currentUserEmail = user?.email || "";
	const currentUserName = user?.name || "";

	useEffect(() => {
		setAvatarUrl(user?.photoUrl);
	}, [user?.photoUrl]);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		if (!emailRef.current?.value) {
			displayToast("Email must not be empty", { type: "error" });
			return;
		}

		if (passwordRef.current?.value !== passwordConfirmationRef.current?.value) {
			displayToast("Password must match", { type: "error" });
			return;
		}

		setLoading(true);
		let promises: Promise<void | string>[] = [];

		if (emailRef.current?.value !== user?.email) {
			promises = [...promises, updateEmail(emailRef.current.value)];
		}

		if (passwordRef.current?.value) {
			promises = [...promises, updatePassword(passwordRef.current.value)];
		}

		let url = undefined;
		if (avatar) {
			const storageRef = ref(storage, `files/${avatar.name}`);
			const uploadSnapshot = await uploadBytes(storageRef, avatar);
			url = await getDownloadURL(uploadSnapshot.ref);
			promises = [...promises, updateProfile(nameRef.current?.value, url)];
		}

		if (nameRef.current?.value) {
			promises = [...promises, updateProfile(nameRef.current.value, url)];
		}

		try {
			await Promise.all(promises);
			displayToast("Profile successfully updated!", {
				type: "success",
			});
		} catch (e) {
			displayToast(parseFirebaseErrorMessage(e as AuthError), {
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col min-w-[300px] p-4 md:min-w-[500px]">
			<h1 className="text-4xl font-bold self-center mb-10">Update Profile</h1>

			<form className="flex flex-col gap-4" onSubmit={onSubmit}>
				<div className="flex flex-col gap-8 items-center md:flex-row">
					<UploadAvatar
						avatarUrl={avatarUrl}
						setAvatarUrl={setAvatarUrl}
						setAvatar={setAvatar}
					/>
					<div className="flex-1 w-100">
						<Input
							id="name"
							ref={nameRef}
							label="Display Name"
							type="text"
							defaultValue={currentUserName}
						/>
					</div>
				</div>
				<Divider />
				<Input
					id="email"
					ref={emailRef}
					label="Email"
					type="email"
					defaultValue={currentUserEmail}
				/>
				<Input
					id="password"
					ref={passwordRef}
					label="Password"
					type="password"
					placeholder="Leave blank to keep current"
				/>
				<Input
					id="password-conf"
					ref={passwordConfirmationRef}
					label="Password Confirmation"
					type="password"
					placeholder="Leave blank to keep current"
				/>

				<div className="flex flex-col gap-4 lg:flex-row">
					<Button className="flex-1" type="submit" disabled={loading}>
						{loading ? <ClipLoader size={25} color="#FFF" /> : "Update"}
					</Button>

					<Button
						type="submit"
						variant="secondary"
						onClick={() => navigate("/")}
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
};

export default UpdateProfile;
