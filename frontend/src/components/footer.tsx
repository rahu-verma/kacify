import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <div className="border-t-[0.5px] border-primary-light p-2 items-center flex justify-between">
      <div className="flex gap-2 items-center">
        <FaFacebookF size={20} className="fill-primary-medium cursor-pointer hover:opacity-50" />
        <FaInstagram size={25} className="fill-primary-medium cursor-pointer hover:opacity-50" />
        <IoMdMail size={25} className="fill-primary-medium cursor-pointer hover:opacity-50" />
      </div>
      <div>
        <span className="text-center text-sm">
          © {new Date().getFullYear()} KACIFY
        </span>
      </div>
      <div>
        <a href='#' className="underline">Privay Policy</a>
      </div>
    </div>
  );
};

export default Footer;
