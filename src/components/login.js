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
          setUser(username);
        }
      } catch (err) {
        console.error(err);
        alert("Incorrect username or password");
      };
    };
  };

  return (
    <div className="Modal" style={{zIndex:'1002'}}>
      <div className="ModalContent" onKeyDown={e => e.key==="Enter"?handleSubmit(e):""}>
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
        <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
          <button type="submit" onClick={handleSubmit}>{isRegister ? "Register" : "Login"}</button>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Login" : "No account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
