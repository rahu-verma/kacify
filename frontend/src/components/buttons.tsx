import { MouseEventHandler, useCallback } from "react";
import { IconType } from "react-icons";

export const TextButton = ({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <span
      className={
        "text-lg uppercase font-[600] tracking-wider cursor-pointer text-primary-light hover:text-primary-dark " +
        className
      }
      onClick={onClick}
    >
      {text}
    </span>
  );
};

export const IconButton = ({
  Icon,
  onClick,
  className,
  size,
}: {
  Icon: IconType;
  onClick?: () => void;
  className?: string;
  size?: number;
}) => {
  return (
    <Icon
      size={size ?? 20}
      className={
        "fill-primary-medium cursor-pointer hover:opacity-50 " + className
      }
      onClick={onClick}
    />
  );
};

export const TextButtonFilled = ({
  text,
  onClick,
  className,
  disabled,
}: {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <div
      className={
        "bg-primary-light text-center font-semibold tracking-wider rounded-md py-2 text-lg " +
        (disabled
          ? "opacity-50 cursor-not-allowed "
          : " cursor-pointer hover:bg-primary-dark hover:text-white ") +
        className
      }
      onClick={disabled ? undefined : onClick}
    >
      {text}
    </div>
  );
};

export const ImageButton = ({
  src,
  onClick,
  className,
}: {
  src: string;
  onClick?: () => void;
  className?: string;
}) => {
  const handleClick: MouseEventHandler<HTMLImageElement> = useCallback(
    (event) => {
      const element = event.target as HTMLImageElement;
      element.style.scale = "0.9";
      setTimeout(() => {
        element.style.scale = "1";
        onClick?.();
      }, 200);
    },
    []
  );
  return (
    <img
      src={src}
      alt="avatar"
      className={
        "rounded-full w-20 h-20 border-2 border-gray-600 object-cover cursor-pointer hover:opacity-50 transition-all duration-300 " +
        className
      }
      onClick={handleClick}
    />
  );
};
