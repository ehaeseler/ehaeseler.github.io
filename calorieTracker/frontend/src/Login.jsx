import { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import './App.css'



function Login({onLogin}) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");
    
    async function handleLogin() {
    
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const res = await fetch (`http://127.0.0.1:8000/login?username=${username}&password=${password}`,
            {
                method: "GET", headers: {"Content-Type" : "application/json"}
            }
        )
        const data = await res.json();
        if (!data.success) {
            setError("Username or password is incorrect")
        }
        else {
            //display stats and stuff
            console.log("username and password is correct")
            onLogin(data)
        }
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