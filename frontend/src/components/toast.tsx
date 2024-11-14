import { useToastContext } from "../context/toast";

const Toast = () => {
  const { showToast, toastMessage, toastType } = useToastContext();
  return showToast && toastMessage ? (
    <div
      className={
        "max-w-56 rounded-md p-4 text-white " +
        (toastType === "success" ? "bg-primary-dark" : "") +
        (toastType === "error" ? "bg-error" : "")
      }
    >
      {toastMessage}
    </div>
  ) : null;
};

export default Toast;
