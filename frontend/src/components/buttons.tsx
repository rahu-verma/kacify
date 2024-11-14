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
}: {
  Icon: IconType;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <Icon
      size={20}
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
}: {
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      className={
        "bg-primary-light text-center font-semibold tracking-wider rounded-md py-2 text-lg cursor-pointer hover:bg-primary-dark hover:text-white " +
        className
      }
      onClick={onClick}
    >
      {text}
    </div>
  );
};
