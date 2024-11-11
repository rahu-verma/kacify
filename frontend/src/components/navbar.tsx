import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center sticky py-2 border-b-[0.5px] border-primary-light">
      <div className="flex items-end">
        <span className="text-4xl font-bold cursor-pointer text-primary-light hover:opacity-80">
          KACIFY
        </span>
        <span className="text-xs font-bold cursor-pointer text-primary-light relative bottom-[7px] hover:opacity-80">
          iPhone Cases
        </span>
      </div>
      <div className="flex items-center gap-2">
        <BiSolidShoppingBagAlt className="text-4xl cursor-pointer hover:opacity-80" />
        <FaUserCircle className="text-[35px] cursor-pointer hover:opacity-80" />
      </div>
    </div>
  );
};

export default Navbar;