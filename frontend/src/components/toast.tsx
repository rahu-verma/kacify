import { useToastContext } from "../context/toast";
import { IoIosClose } from "react-icons/io";
import { IconButton } from "./buttons";

const Toast = () => {
  const { showToast, toastMessage, toastType, setShowToast } =
    useToastContext();
  return showToast && toastMessage ? (
    <div
      className={
        "rounded-md p-4 overflow-hidden flex " +
        (toastType === "success" ? "bg-primary-dark" : "") +
        (toastType === "error" ? "bg-error" : "")
      }
    >
      <div className="text-white">{toastMessage}</div>
      <IconButton
        className="cursor-pointer fill-white"
        onClick={() => setShowToast(false)}
        Icon={IoIosClose}
        size={40}
      />
    </div>
  ) : null;
};

export default Toast;
