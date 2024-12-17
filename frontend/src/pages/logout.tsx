import { useEffect } from "react";
import { clearAuthToken } from "../utils/localStorage";

const Logout = () => {
  useEffect(() => {
    clearAuthToken();
  }, []);
  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
