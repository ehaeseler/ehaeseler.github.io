import { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'

import './App.css'

function Register({onRegister}) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const nameRef = useRef();
    const [error, setError] = useState("");
    const navigate = useNavigate()

    async function handleRegister() {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const name = nameRef.current.value;
        const res = await fetch(`http://127.0.0.1:8000/register`,
            {
                method: "POST", headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"username": username, "password": password, "full_name": name})
            });
            const data = await res.json();
            if (!res.ok) {
                setError("Username is already taken")
                return;
            }
            sessionStorage.setItem("token", data.access_token);

            const resp = await fetch("http://127.0.0.1:8000/users/me", {
                method: "GET",
                headers: {"Authorization": `Bearer ${data.access_token}`}
            });
            const userData = await resp.json();
            onRegister(userData);
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

            <InputGroup className="mb-3">
                <InputGroup.Text id="nameInput">Full Name:</InputGroup.Text>
                <Form.Control ref={nameRef}></Form.Control>
            </InputGroup>

            <p id="userPassError">{error}</p>

            <Button onClick={handleRegister}>Submit</Button>
        
        </>
    )
}

export default Register