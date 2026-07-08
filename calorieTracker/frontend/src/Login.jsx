import { useRef } from 'react'
import './App.css'

const usernameRef = useRef();
const passwordRef = useRef();

function Login() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    

    async function handleLogin() {
        const res = await fetch (`http://127.0.0.1:8000/check_login?username=${username}&password=${password}`,
            {
                method: "GET", headers: {"Content-Type" : "application/json"}
            }
        )


    }

    return (
        <>
            <InputGroup className="mb-3">
                <InputGroup.Text id="userInput">Username:</InputGroup.Text>
                <FormControl ref={usernameRef}></FormControl>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="passInput">Password:</InputGroup.Text>
                <FormControl ref={passwordRef}></FormControl>
            </InputGroup>

            <p id="userPassError"></p>

            <Button onClick={handleLogin}>Submit</Button>
        </>
    )
}