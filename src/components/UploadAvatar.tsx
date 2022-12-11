import { FaUser } from "react-icons/fa";
import Input from "./Input";

interface IUploadAvatarProps {
	avatarUrl?: string | null;
	setAvatar: React.Dispatch<React.SetStateAction<File | undefined>>;
	setAvatarUrl: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

export default function UploadAvatar({
	avatarUrl,
	setAvatarUrl,
	setAvatar,
}: IUploadAvatarProps) {
	const handleAvatarSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const file = e.target?.files?.[0];

		if (!file) return;

		setAvatar(file);

		const fileReader = new FileReader();
		fileReader.addEventListener("load", () => {
			setAvatarUrl(fileReader.result as string);
		});

		fileReader.readAsDataURL(file);
	};

	return (
		<div className="relative flex items-center w-[120px] h-[120px] rounded-full border border-gray-300 p-4">
			<label
				className="absolute top-[50%] left-[50%] w-full h-full cursor-pointer -translate-x-[50%] -translate-y-[50%]"
				htmlFor="avatar-input"
			>
				{avatarUrl ? (
					<img
						className="w-full h-full rounded-full object-cover object-center"
						src={avatarUrl}
					/>
				) : (
					<FaUser className="w-full h-full rounded-full" size={28} />
				)}
			</label>
			<Input
				id="avatar-input"
				className="hidden"
				type="file"
				onChange={handleAvatarSubmit}
				accept="image/png, image/jpg"
			/>
		</div>
	);
}
