import { toast, ToastContent, ToastOptions } from "react-toastify";

const DEFAULT_TOAST_PROPS: ToastOptions = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: "light",
};

export const displayToast = (
	content: ToastContent,
	options: Partial<ToastOptions>
) => {
	return toast(content, {
		...DEFAULT_TOAST_PROPS,
		...options,
	});
};
