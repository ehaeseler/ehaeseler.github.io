import { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'

import './App.css'
function Register({onRegister}) {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const passCheckRef = useRef();
    const nameRef = useRef();
    const [userError, setUserError] = useState("");
    const [passError, setPassError] = useState("");
    const [nameError, setNameError] = useState("");
    const [passCheckError, setPassCheckError] = useState("");
    const navigate = useNavigate()

    async function handleRegister() {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const name = nameRef.current.value;
        const passCheck = passCheckRef.current.value;
        if (password !== passCheck) {
            setPassError("Password and Password Check must be the same");
            setPassCheckError("Password and Password Check must be the same");
            return;
        }
        const res = await fetch("http://127.0.0.1:8000/register",
            {
                method: "POST", headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"username": username, "password": password, "full_name": name})
            });
            const data = await res.json();
            setUserError("");
            setPassError("");
            setNameError("");
            setPassCheckError("");
            if (!res.ok) {
                if (res.status === 400) {
                    setUserError("Username is already taken");
                    return;
                }
                for (let i = 0; i < data.detail.length; i++) {
                    const type = data.detail[i].loc[1]
                    if (type === "username") {
                        const message = data.detail[i].msg
                        const newMessage = message.replace("String", "Username")
                        setUserError(newMessage)
                    }
                    if (type === "password") {
                        const message = data.detail[i].msg
                        const newMessage = message.replace("String", "Password")
                        setPassError(newMessage)
                    }
                    if (type === "full_name") {
                        const message = data.detail[i].msg
                        const newMessage = message.replace("String", "Full Name")
                        setNameError(newMessage)
                    }
                }
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
                <InputGroup.Text id="nameInput">Full Name:</InputGroup.Text>
                <Form.Control ref={nameRef}></Form.Control>
            </InputGroup>

            <p id="nameError">{nameError}</p>

            <InputGroup className="mb-3">
                <InputGroup.Text id="userInput">Username:</InputGroup.Text>
                <Form.Control ref={usernameRef}></Form.Control>
            </InputGroup>
            
            <p id="userError">{userError}</p>

            <InputGroup className="mb-3">
                <InputGroup.Text id="passInput">Password:</InputGroup.Text>
                <Form.Control ref={passwordRef}></Form.Control>
            </InputGroup>

            <p id="passError">{passError}</p>

            <InputGroup className="mb-3">
                <InputGroup.Text id="passCheckInput">Re-enter Password:</InputGroup.Text>
                <Form.Control ref={passCheckRef}></Form.Control>
            </InputGroup>

            <p id="passCheckError">{passCheckError}</p>


            <Button onClick={handleRegister}>Submit</Button>
        </>
    )
}

export default Register