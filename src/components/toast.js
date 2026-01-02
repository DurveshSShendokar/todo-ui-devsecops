import { toast } from "react-toastify";

export const ToastTypes = Object.freeze({
  success: "success",
  error: "error",
  info: "info",
  default: "default",
});

export const showToast = (text, type = ToastTypes.default) => {
  toast(text, {
    type: type,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
