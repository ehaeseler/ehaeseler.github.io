import { useState, useEffect } from 'react'
import './App.css'
import Login from "./Login.jsx"

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function restoreSession() {
      const userToken = localStorage.getItem("token");
  
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
  if(user) {
    return <div>Dashboard coming soon</div>;
  }
  return <Login onLogin={setUser}></Login>
}

export default App
