import { useState, useEffect } from 'react'
import './App.css'
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


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
    // <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />}></Route>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={setUser}/>}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    // </BrowserRouter>
  )
  
  // if(user) {
  //   return <div>Dashboard coming soon</div>;
  // }
  // return <Login onLogin={setUser}></Login>
}

export default App