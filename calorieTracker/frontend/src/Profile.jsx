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
    const [userError, setUserError] = useState("");


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

    async function handleChangeProfile() {
        const newName = nameRef.current.value;
        const newUsername = usernameRef.current.value;
        const newPassword = passRef.current.value;
        const newPasswordCheck = passCheckRef.current.value;
        const token = sessionStorage.getItem("token")

        const rawData = {
            username: newUsername,
            full_name: newName,
            password: newPassword,
            password_check: newPasswordCheck
        };

        const updatedData = Object.fromEntries(Object.entries(rawData).filter(([key, value]) => value.length > 0));
        const keys = Object.keys(updatedData)

        const res = await fetch("http://127.0.0.1:8000/profile",
            {
                method: "PATCH", headers: {"Content-Type" : "application/json", "Authorization": `Bearer ${token}`},
                body: JSON.stringify(updatedData)
            }
        )
        const data = await res.json();
        if (!res.ok) {
            setUserError("")
            // setPassError("")
            setNameError("")
            // if (res.status === 400) {
            //     setPassCheck
            // }
            if (res.status === 500) {
                const message = data.detail[i].msg;
                const newMessage = message.replace("String", "Input");
                setNameError(newMessage);
            }
            if (keys[0] === undefined) {
                const message = data.detail[i].msg;
                setNameError(message);
                setUserError(message);
                //password error
                //pass check error
            }
            if (keys[0] === "full_name") {
                const message = data.detail[i].msg;
                setNameError(message);
            }
        }
        const meRes = await fetch("http://127.0.0.1:8000/users/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await meRes.json();
        setUser(userData);

        handleCloseName()
    }



    return (
        <>  
            <div className="profile">
                <div className="name">
                    <div className="textButton">
                        <p className="originalName">{user.full_name}</p>
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
                        <Button variant="primary" onClick={handleChangeProfile}>Save Changes</Button>
                        <p className="dbError">{dbError}</p>
                    </Modal.Footer>
                </Modal>

                <div className="name">
                    <div className="textButton">
                        <p className="originalName">{user.username}</p>
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
                        <p className="userError">{userError}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleChangeProfile}>Save Changes</Button>
                        <p className="dbError">{dbError}</p>
                    </Modal.Footer>
                </Modal>

                <InputGroup>
                    <InputGroup.Text id="passwordInput">Password</InputGroup.Text>
                    <Form.Control ref={passRef}></Form.Control>
                </InputGroup>
                <InputGroup>
                    <InputGroup.Text id="passwordCheckInput">Re-enter Password</InputGroup.Text>
                    <Form.Control ref={passCheckRef}></Form.Control>
                </InputGroup>
            </div>
        </>
    )
}

export default Profile