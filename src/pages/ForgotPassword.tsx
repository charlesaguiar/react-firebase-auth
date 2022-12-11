import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { MdArrowBack } from "react-icons/md";

import { useAuthContext } from "../contexts/AuthContext";
import { displayToast } from "../utils/toast";
import { AuthError, parseFirebaseErrorMessage } from "../lib/firebase";

const ForgotPassword: React.FC = () => {
	const { resetPassword } = useAuthContext();

	const [loading, setLoading] = useState(false);

	const emailRef = useRef<HTMLInputElement>(null);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		setLoading(true);
		try {
			if (emailRef.current?.value) {
				await resetPassword(emailRef.current?.value);
				displayToast("All set! Check you e-mail for further instructions.", {
					type: "success",
				});
			}
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
			<h1 className="text-4xl font-bold self-center mb-10">
				Recover your password
			</h1>

			<form className="flex flex-col gap-4" onSubmit={onSubmit}>
				<div className="flex flex-col">
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						ref={emailRef}
						className="p-4 border border-gray-300 border-solid rounded"
					/>
				</div>

				<button
					className="flex justify-center p-3 bg-blue-500 text-white font-bold text-2xl rounded-xl cursor-pointer hover:bg-blue-800 disabled:bg-gray-200"
					type="submit"
					disabled={loading}
				>
					{loading ? <ClipLoader size={25} color="#FFF" /> : "Reset password"}
				</button>
			</form>

			<div className="w-100 h-[1px] bg-gray-300 my-4" />

			<div className="flex gap-3 items-center text-sm">
				<MdArrowBack />
				<Link to="/login" className="underline text-blue-500">
					Back to login page
				</Link>{" "}
			</div>
		</div>
	);
};

export default ForgotPassword;
