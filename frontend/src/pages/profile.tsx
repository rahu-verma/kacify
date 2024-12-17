import { useEffect, useState } from "react";
import { UserType } from "../../../api/src/utils/types";
import { getUserProfile } from "../utils/api";

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    getUserProfile().then((response) => {
      if (response.success) {
        setUser(response.data);
      }
    });
  }, []);
  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
