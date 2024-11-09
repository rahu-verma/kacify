import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div>
      <span>KACIFY</span>
      <div>
        <div>
          <BiSolidShoppingBagAlt size={40} />
        </div>
        <div>
          <FaUserCircle size={35} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
