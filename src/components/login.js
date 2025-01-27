import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please insert username and password")
    } else {
      try {
        if (isRegister) {
          registerUser(username, password, setIsRegister)
        } else {
          const response = await loginUser(username, password);
          const { access_token } = response.data;
          localStorage.setItem("token", access_token);
          setUser(username);
        }
      } catch (err) {
        console.error(err);
        alert("Error: " + (err.response?.data?.error || "Something went wrong"));
      };
    };
  };

  return (
    <div className="Modal">
      <div className="ModalContent">
        <h2 style={{justifySelf:'center', marginTop:'0'}}>{isRegister ? "Register" : "Login"}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{display:'flex', justifyContent:'center'}}>
          <button type="submit" onClick={handleSubmit}>{isRegister ? "Register" : "Login"}</button>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Login" : "No account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
