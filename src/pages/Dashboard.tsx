import { useNavigate } from "react-router-dom";
import { MdLogout, MdAccountCircle } from "react-icons/md";

import { useAuthContext } from "../contexts/AuthContext";
import Button from "../components/Button";
import Divider from "../components/Divider";

export default function Dashboard() {
	const navigate = useNavigate();
	const { user, logout } = useAuthContext();

	return (
		<div>
			<div className="flex flex-col p-2">
				<div className="flex flex-col gap-1">
					<span>{`Welcome, ${user?.name || "user"}`}</span>
					<span className="text-sm text-gray-300">{user?.email}</span>
				</div>

				<Divider />

				<div className="flex gap-3">
					<button
						className="flex items-center justify-center gap-4 border border-gray-300 p-2 rounded-lg hover:border-blue-500 hover:bg-blue-50"
						onClick={() => navigate("/update-profile")}
					>
						<MdAccountCircle size={20} />
						Update my profile
					</button>
					<button
						className="flex items-center justify-center gap-4 border border-gray-300 p-2 rounded-lg hover:border-blue-500 hover:bg-blue-50"
						onClick={logout}
					>
						<MdLogout size={20} />
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}
