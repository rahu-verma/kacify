import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import styled from "styled-components";

const Navbar = () => {
  return (
    <Container>
      <Logo>KACIFY</Logo>
      <ActionsContainer>
        <ShoppingBagIcon />
        <UserIcon />
      </ActionsContainer>
    </Container>
  );
};

export default Navbar;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  padding: 10px 0px;
`;

const Logo = styled.span`
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  color: #A79A85;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ShoppingBagIcon = styled(BiSolidShoppingBagAlt)`
  font-size: 40px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const UserIcon = styled(FaUserCircle)`
  font-size: 35px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;
