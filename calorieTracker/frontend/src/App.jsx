import { useState, useEffect } from 'react'
import './App.css'
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import Register from "./Register.jsx"
import Profile from './Profile.jsx'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function restoreSession() {
      const userToken = sessionStorage.getItem("token");
  
      if(userToken) {
        const res = await fetch("http://127.0.0.1:8000/users/me",
          {
              method: "GET", headers: {"Authorization": `Bearer ${userToken}`}
          });
          const userData = await res.json();
          if (!res.ok) {
            sessionStorage.removeItem("token");
            navigate("/login");
            return;
          }
          setUser(userData);
      }
      setIsLoading(false);
    }
    restoreSession();
  }, [])

  return(
    <Routes>
      <Route path="/" element={<Dashboard user={user}/>}></Route>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser} isLoading={isLoading}/>}></Route>
      <Route path="/register" element={user ? <Navigate to="/" /> :<Register onRegister={setUser} isLoading={isLoading}/>}></Route>
      <Route path="/profile" element={<Profile user={user} isLoading={isLoading} setUser={setUser}/>}></Route>
    </Routes>
  )
}

export default App