import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { useAuthContext } from "../contexts/AuthContext";
import { displayToast } from "../utils/toast";
import { AuthError, parseFirebaseErrorMessage } from "../lib/firebase";

import Button from "../components/Button";
import Input from "../components/Input";
import Divider from "../components/Divider";

const Login: React.FC = () => {
	const { login } = useAuthContext();

	const [loading, setLoading] = useState(false);

	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		setLoading(true);
		try {
			if (emailRef.current?.value && passwordRef.current?.value) {
				await login(emailRef.current?.value, passwordRef.current?.value);
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
			<h1 className="text-4xl font-bold self-center mb-10">Welcome</h1>

			<form className="flex flex-col gap-4" onSubmit={onSubmit}>
				<Input id="email" ref={emailRef} label="Email" type="email" />
				<Input
					id="password"
					ref={passwordRef}
					label="Password"
					type="password"
				/>

				<Button type="submit" disabled={loading}>
					{loading ? <ClipLoader size={25} color="#FFF" /> : "Login"}
				</Button>

				<Link
					to="/forgot-password"
					className="text-sm self-end underline text-blue-500"
				>
					Forgot password?
				</Link>
			</form>

			<Divider />

			<span className="text-sm">
				Doesn't have an account? Click{" "}
				<Link to="/signup" className="underline text-blue-500">
					here
				</Link>{" "}
				to signup.
			</span>
		</div>
	);
};

export default Login;
