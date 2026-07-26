import { useState, useEffect } from 'react'
import './App.css'
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import Register from "./Register.jsx"
import { Routes, Route, Navigate } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      const userToken = sessionStorage.getItem("token");
  
      if(userToken) {
        const res = await fetch("http://127.0.0.1:8000/users/me",
          {
              method: "GET", headers: {"Authorization": `Bearer ${userToken}`}
          });
          const userData = await res.json();
          setUser(userData);
      }
    }
    restoreSession();
  }, [])

  return(
    <Routes>
      <Route path="/" element={<Dashboard user={user} />}></Route>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser}/>}></Route>
      <Route path="/register" element={user ? <Navigate to="/" /> :<Register onRegister={setUser}/>}></Route>
    </Routes>
  )
}

export default App