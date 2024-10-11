import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

function SignUp() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    try { 
      await authService.signup(email, password).then(
        (response) => {
          navigate("/login");
        }
      );
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <main>
      <span>
        <line></line> SignUp
      </span>
      <h1>Create An Account</h1>
      <section className="form">
        <form onSubmit={handleSignUp}>
          <label for="email">
            Email{" "}
            <input
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label for="password">
            Password
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Sign Up</button>
        </form>
      </section>
    </main>
  );
}

export default SignUp;
