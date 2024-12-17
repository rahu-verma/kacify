import { useEffect, useState } from "react";
import { UserType } from "../../../api/src/utils/types";
import { getUsers } from "../utils/api";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  useEffect(() => {
    getUsers().then((response) => {
      if (response.success) {
        setUsers(response.data);
      }
    });
  }, []);
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <div>
              <span>{user.email}</span>
              <span>X</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
