import { ToastContainer } from "react-toastify";
import { Routes, Route, Navigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { useAuthContext } from "./contexts/AuthContext";

import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
	const { isAuthenticated, loading } = useAuthContext();

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<ClipLoader size={50} />
			</div>
		);
	}

	return (
		<>
			<div className="flex items-center justify-center container max-w-[1280px] mx-auto h-screen">
				<Routes>
					{isAuthenticated ? (
						<>
							<Route path="/" element={<Dashboard />} />
							<Route path="/update-profile" element={<UpdateProfile />} />
							<Route path="*" element={<Navigate to="/" />} />
						</>
					) : (
						<>
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="*" element={<Navigate to="/login" />} />
						</>
					)}
				</Routes>
			</div>
			<ToastContainer />
		</>
	);
}

export default App;
