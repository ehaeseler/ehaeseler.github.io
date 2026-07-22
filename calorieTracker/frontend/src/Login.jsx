import { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'


import './App.css'



function Login({onLogin}) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");
    const navigate = useNavigate()
    
    async function handleLogin() {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const body = new URLSearchParams();
        body.append("username", username);
        body.append("password", password);

        const res = await fetch(`http://127.0.0.1:8000/token`,
        {
            method: "POST", headers: {"Content-Type" : "application/x-www-form-urlencoded"},
            body: body
        });
        const data = await res.json();
        if (!res.ok) {
            setError("Username or password is incorrect")
            return;
        }
        sessionStorage.setItem("token", data.access_token);

        const resp = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: {"Authorization": `Bearer ${data.access_token}`}
        });
        const userData = await resp.json();
        onLogin(userData);
        navigate("/")
    }

    return (
        <>
            <InputGroup className="mb-3">
                <InputGroup.Text id="userInput">Username:</InputGroup.Text>
                <Form.Control ref={usernameRef}></Form.Control>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="passInput">Password:</InputGroup.Text>
                <Form.Control ref={passwordRef}></Form.Control>
            </InputGroup>

            <p id="userPassError">{error}</p>

            <Button onClick={handleLogin}>Submit</Button>
        </>
    )
}

export default Login