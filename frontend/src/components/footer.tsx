import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IconButton, TextButton } from "./buttons";

const Footer = () => {
  return (
    <div className="border-t-[0.5px] border-primary-light p-2 items-center flex justify-between">
      <div className="flex gap-2 items-center">
        <IconButton Icon={FaFacebookF} />
        <IconButton Icon={FaInstagram} />
        <IconButton
          Icon={IoMdMail}
          onClick={() => {
            window.location.href = `mailto:${process.env.REACT_APP_CONTACT_EMAIL}`;
          }}
        />
      </div>
      <span className="text-center text-sm">
        © {new Date().getFullYear()} KACIFY
      </span>
      <TextButton text="Privacy Policy" className="text-xs"/>
    </div>
  );
};

export default Footer;
