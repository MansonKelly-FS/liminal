import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Files from './pages/Files';
import Editor from './pages/Editor';
import Profile from './pages/Profile';

import NewFolder from './pages/NewFolder';
import NewFile from './pages/NewFile';
import EditFolder from './pages/EditFolder';

import Nav from "./components/Nav";

import authService from "./services/auth.service";

const ProtectedRoute = () => { 
  const location = useLocation();
  return  authService.isLoggedIn() ? <Outlet /> : <Navigate to="/login" state={{ from: location }} />; 
}

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/files/:folderId" element={<Files />} />
          <Route path="/editor/:fileId" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/new" element={<NewFolder />} />
          <Route path="/folder/:folderId/new" element={<NewFolder />} />
          <Route path="/folder/:folderId/edit" element={<EditFolder />} />
          <Route path="/files/:folderId/new" element={<NewFile />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
