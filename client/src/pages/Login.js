import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await authService.login(email, password);
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <span>
        <line></line> Login
      </span>
      <h1>Login to your Account</h1>
      <section className="form">
        <form onSubmit={handleLogin}>
          <label for="email">
            Email <input id="email" type="text" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)}/>
          </label>
          <label for="password">
            Password
            <input id="password" type="password" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)}/>
          </label>
          <button type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}

export default Login;
