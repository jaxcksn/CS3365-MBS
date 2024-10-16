import { useState } from "react";
import { useAuth } from "../providers/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        auth?.login(username, password).then(() => {
          navigate("/");
        });
      }}
    >
      <input
        type="text"
        value={username}
        onChange={(v) => {
          setUsername(v.target.value);
        }}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(v) => {
          setPassword(v.target.value);
        }}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
