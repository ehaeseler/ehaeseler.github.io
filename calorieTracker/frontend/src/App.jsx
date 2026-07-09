import { useState } from 'react'
import './App.css'
import Login from "./Login.jsx"

function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return <div>Dashboard coming soon</div>;
  }
  return <Login onLogin={setUser} />;
}

export default App
