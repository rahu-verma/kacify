import { useEffect, useState } from "react";
import { UserType } from "../../../api/src/utils/types";
import { deleteUser, getUsers } from "../utils/api";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const loadUsers = async () => {
    const response = await getUsers();
    if (response.success) {
      setUsers(response.data);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <div>
              <span>{user.email}</span>
              <span
                onClick={() => {
                  deleteUser(user._id).then(loadUsers);
                }}
              >
                X
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
