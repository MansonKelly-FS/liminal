import React, { useState, useEffect }  from "react";
import authService from "../services/auth.service";
import axios from "axios";


function Profile() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [password, setPassword] = useState("");


  useEffect(() => {
    const email = authService.isLoggedIn(); 
    if (email) {
      setUser({ email });
    }
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.put(
        "http://localhost:6060/auth/profile",
        { email: user.email, newPassword: password }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      alert('Password updated successfully');
      setUser(response.data.user);
      setPassword(""); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
    
  return (
    <main>
      <span>
        <line></line> Account
      </span>
      <h1>Your Account</h1>
      <p>Update your account's password as needed</p>
      <section className="form">
        <form onSubmit={handleUpdateProfile}>
          <label for="email">
            Email <input id="email" type="text" value={user.email} readOnly />
          </label>
          <label for="password">
            Password
            <input
              id="password"
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </label>
          <button type="submit">Save Changes</button>
        </form>
      </section>
    </main>
  );
}

export default Profile;
