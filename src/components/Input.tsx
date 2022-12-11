import React, { forwardRef } from "react";

interface IInputProps extends React.ComponentPropsWithoutRef<"input"> {
	label?: string;
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
	({ id, label, className, ...rest }, ref) => {
		return (
			<div className="flex flex-col">
				{label ? <label htmlFor={id}>{label}</label> : null}
				<input
					{...rest}
					id={id}
					ref={ref}
					className={`p-4 border border-gray-400 border-solid rounded ${className}`}
				/>
			</div>
		);
	}
);

export default Input;
