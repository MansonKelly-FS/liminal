import axios from 'axios'; 

  const API_BASE = process.env.REACT_APP_BASE_URL;
const API_URL = '/auth'; 

const signup = (email, password) => {
    return axios.post(`${API_BASE}${API_URL}/signup`, { email, password })
        .then(response => {
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data
        });
}

const login = (email, password) => {
  return axios
    .post(`${API_BASE}${API_URL}/signin`, { email, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", response.data.token); 
        localStorage.setItem("user", JSON.stringify({ email })); 
        console.log(
          "Token and user email stored in localStorage:",
          response.data.token,
          email
        );
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      throw error;
    });
};

const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
}

const getUser = () => {
    return JSON.parse(localStorage.getItem('user'));
}
 
const isLoggedIn = () => {
  const user = getUser();
  const token = localStorage.getItem('token');
  return user && token ? user.email : false;
};

const authService = { 
    signup, login, logout, getUser, isLoggedIn
}

export default authService;
