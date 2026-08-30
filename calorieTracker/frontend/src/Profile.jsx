import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

function Profile({user, isLoading, setUser}) {
    const navigate = useNavigate();
    const nameRef = useRef();
    const usernameRef = useRef();
    const passRef = useRef();
    const passCheckRef = useRef();
    const [showName, setShowName] = useState(false);
    const [showUsername, setShowUsername] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [dbError, setDbError] = useState("");
    const [nameError, setNameError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passCheckError, setPassCheckError] = useState("");


    const handleShowName = () => setShowName(true);
    const handleCloseName = () => setShowName(false);
    const handleShowUsername = () => setShowUsername(true);
    const handleCloseUsername = () => setShowUsername(false);
    const handleShowPassword = () => setShowPassword(true);
    const handleClosePassword = () => setShowPassword(false);

    useEffect(() =>{
        if (!user && !isLoading) {
            navigate("/login");
        }
    }, [user, isLoading]);

    if (!user || isLoading) {
        return null
    }

    async function handleChangeName() {
        const newName = nameRef.current.value;
        const token = sessionStorage.getItem("token")

        const rawData = {
            full_name: newName
        };

        const res = await fetch("http://127.0.0.1:8000/profile",
            {
                method: "PATCH", headers: {"Content-Type" : "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(rawData)
            }
        )
        const data = await res.json();
        if (!res.ok) {
            setNameError("");
            if (res.status === 500) {
                const message = data.detail[0].msg;
                const newMessage = message.replace("String", "Input");
                setNameError(newMessage);
            }
            if (rawData.full_name.length === 0) {
                const message = data.detail;
                setNameError(message);
            }
            if (res.status === 422) {
                const message = data.detail[0].msg;
                setNameError(message);
            }
            return;
        }
        const meRes = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await meRes.json();
        setUser(userData);
        setNameError("");
        handleCloseName()
    }

    async function handleChangeUsername() {
        const newUsername = usernameRef.current.value;
        const token = sessionStorage.getItem("token")

        const rawData = {
            username: newUsername
        };

        const res = await fetch("http://127.0.0.1:8000/profile",
            {
                method: "PATCH", headers: {"Content-Type" : "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(rawData)
            }
        )
        const data = await res.json();
        console.log(res);
        console.log(data);
        if (!res.ok) {
            setUsernameError("");
            if (res.status === 500) {
                const message = data.detail[0].msg;
                const newMessage = message.replace("String", "Input");
                setUsernameError(newMessage);
            }
            if (rawData.username.length === 0) {
                const message = data.detail;
                setUsernameError(message);
            }
            if (res.status === 422) {
                const message = data.detail[0].msg;
                setUsernameError(message);
            }
            return;
        }
        const newToken = data.access_token;
        sessionStorage.setItem("token", newToken);
        const meRes = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${newToken}` }
        });
        const userData = await meRes.json();
        setUser(userData);
        setUsernameError("");
        handleCloseUsername()
    }

    async function handleChangePassword() {
        const newPassword = passRef.current.value;
        const newPassCheck = passCheckRef.current.value;
        const token = sessionStorage.getItem("token")

        const rawData = {
            password: newPassword,
            passCheck: newPassCheck
        };

        const res = await fetch("http://127.0.0.1:8000/profile",
            {
                method: "PATCH", headers: {"Content-Type" : "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(rawData)
            }
        )
        const data = await res.json();
        console.log(res);
        console.log(data);
        if (!res.ok) {
            setPasswordError("");
            if (res.status === 500) {
                const message = data.detail[0].msg;
                const newMessage = message.replace("String", "Input");
                setPasswordError(newMessage);
            }
            if (rawData.username.length === 0) {
                const message = data.detail;
                setPasswordError(message);
            }
            if (res.status === 422) {
                const message = data.detail[0].msg;
                setPasswordError(message);
            }
            return;
        }
        const meRes = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${new_token}` }
        });
        const userData = await meRes.json();
        setUser(userData);
        setPasswordError("");
        handleClosePassword()
    }



    return (
        <>  
            <div className="profile">
                <div className="name">
                    <div className="textButton">
                        <p className="originalName">Name</p>
                        <Button className="changeButton" size="sm" onClick={handleShowName}>Edit</Button>
                    </div>
                </div>
                <Modal show={showName} onHide={handleCloseName}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup>
                            <InputGroup.Text id="nameInput">Name</InputGroup.Text>
                            <Form.Control ref={nameRef}></Form.Control>
                        </InputGroup>
                        <p className="nameError">{nameError}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleChangeName}>Save Changes</Button>
                        <p className="dbError">{dbError}</p>
                    </Modal.Footer>
                </Modal>

                <div className="name">
                    <div className="textButton">
                        <p className="originalName">Username</p>
                        <Button className="changeButton" size="sm" onClick={handleShowUsername}>Edit</Button>
                    </div>
                </div>
                <Modal show={showUsername} onHide={handleCloseUsername}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup>
                            <InputGroup.Text id="usernameInput">Username</InputGroup.Text>
                            <Form.Control ref={usernameRef} placeholder={user.username}></Form.Control>
                        </InputGroup>
                        <p className="userError">{usernameError}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleChangeUsername}>Save Changes</Button>
                        <p className="dbError">{dbError}</p>
                    </Modal.Footer>
                </Modal>

                <div className="name">
                    <div className="textButton">
                        <p className="originalName">Password</p>
                        <Button className="changeButton" size="sm" onClick={handleShowPassword}>Edit</Button>
                    </div>
                </div>
                <Modal show={showPassword} onHide={handleClosePassword}>
                    <Modal.Header closeButton>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text id="passwordInput">Password</InputGroup.Text>
                        <Form.Control ref={passRef}></Form.Control>
                    </InputGroup>
                    <p className="passwordError">{passwordError}</p>
                    <InputGroup>
                        <InputGroup.Text id="passwordCheckInput">Re-enter Password</InputGroup.Text>
                        <Form.Control ref={passCheckRef}></Form.Control>
                    </InputGroup>
                    <p className="passwordError">{passCheckError}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleChangeUsername}>Save Changes</Button>
                        <p className="dbError">{dbError}</p>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Profile