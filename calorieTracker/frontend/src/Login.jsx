import { useState } from 'react'
import './App.css'



function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogin() {
        setPassword()
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
                <FormControl></FormControl>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="passInput">Password:</InputGroup.Text>
            </InputGroup>

            <p id="userPassError"></p>

            <Button onClick={handleLogin()}>Submit</Button>
        </>
    )
}