import { useState } from "react";
import { addUser } from "../utils/api";

const AddUser = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "vendor">("user");
  return (
    <div>
      <h1>Add User</h1>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as "user" | "vendor")}
        className="border"
      >
        <option value="user">User</option>
        <option value="vendor">Vendor</option>
      </select>
      <button
        onClick={async () => {
          addUser(email, role, password).then((response) => {
            if (response.success) {
              onSuccess();
            } else {
              alert(response.message);
            }
          });
        }}
        className="border"
      >
        submit
      </button>
    </div>
  );
};

export default AddUser;
