import React, { useState } from "react";
import { loginUser, registerUser } from "../services/api";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setInvalid(true);
      return;
    } else {
      setInvalid(false);
      try {
        if (isRegister) {
          setIncorrect(false);
          const success = await registerUser(username, password, setIsRegister);
          if (success === true) {
            console.log("Registration successful");
            setUserExists(false);
            setRegisterSuccess(true);
            setIsRegister(false);
          } else {
            setUserExists(true);
          }
        } else {
          setUserExists(false);
          const loginSuccess = await loginUser(username, password);
          if (loginSuccess) {
            setUser(username);
            setIncorrect(false);
          } else {
            setIncorrect(true);
          }
        }
      } catch (err) {
        console.error(err);
        setRegisterSuccess(false);
        setIncorrect(true);
      }
    }
  };

  return (
    <div className="Modal" style={{zIndex:'1002'}}>
      <div className="ModalContent" onKeyDown={e => e.key==="Enter"?handleSubmit(e):""}>
        <h2 style={{justifySelf:'center', marginTop:'0'}}>{isRegister ? "Register" : "Login"}</h2>
        {invalid && <h4 className="login-error">Please insert username and password</h4>}
        {incorrect && <h4 className="login-error">Incorrect username or password</h4>}
        {userExists && <h4 className="login-error">Username already exists</h4>}
        {registerSuccess && <h4 className="login-error" style={{color:'green'}}>Registration successful! You can now login</h4>}
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
