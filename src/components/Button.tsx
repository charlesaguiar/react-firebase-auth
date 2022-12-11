import React from "react";

const VARIANT_CLASSES = {
	primary: "bg-blue-500 text-white hover:bg-blue-800 disabled:bg-gray-200",
	secondary: "bg-white text-blue-500 hover:bg-blue-50 border-2 border-blue-700",
} as const;

interface IButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	children: React.ReactNode;
	variant?: keyof typeof VARIANT_CLASSES;
	className?: string;
}

export default function Button({
	children,
	variant = "primary",
	className = "",
	...rest
}: IButtonProps) {
	return (
		<button
			{...rest}
			className={`flex items-center justify-center p-3 font-bold text-xl rounded-xl cursor-pointer ${VARIANT_CLASSES[variant]} ${className}`}
		>
			{children}
		</button>
	);
}
