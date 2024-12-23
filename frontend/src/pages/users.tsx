import { useEffect, useState } from "react";
import { UserType } from "../../../api/src/utils/types";
import { deleteUser, getUsers } from "../utils/api";
import AddUser from "./addUser";

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
    <div className="p-2">
      <div className="my-4">
        <AddUser onSuccess={loadUsers} />
      </div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id} className="border w-max">
            <div className="m-2 flex gap-2">
              <span>{user.email}</span>
              <span>{user.role}</span>
              <span
                className="cursor-pointer"
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
