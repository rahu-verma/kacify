import { TextButton } from "../components/buttons";
import { useNavigationContext } from "../context/navigation";
import { useUserContext } from "../context/user";
import { removeAuthToken } from "../utils/authToken";

const User = () => {
  const { setPage } = useNavigationContext();
  const { user } = useUserContext();
  return (
    <div>
      <span>{JSON.stringify(user)}</span>
      <TextButton
        text="Logout"
        onClick={() => {
          removeAuthToken();
          setPage("login");
        }}
      />
    </div>
  );
};

export default User;
