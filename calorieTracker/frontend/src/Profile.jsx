import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

function Profile({user, isLoading}) {
    const navigate = useNavigate();
    const nameRef = useRef();
    const usernameRef = useRef();
    const passRef = useRef();
    const passCheckRef = useRef();
    const [showName, setShowName] = useState(false);
    const [showUsername, setShowUsername] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState("")

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
        const name = user.full_name;

        // const res = await fetch("http://127.0.0.1:8000/profilename") {

        // }
    }



    return (
        <>  
            <div className="profile">
                <div className="name">
                    <div className="textButton">
                        <p className="originalName">{user.full_name}</p>
                        <Button className="changeButton" size="sm" onClick={handleShowName}>Edit</Button>
                    </div>
                    <p className="errorMessage" id="userError">test</p>
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
                        <p classname="nameError">{nameError}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleChangeName}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                <InputGroup>
                    <InputGroup.Text id="usernameInput">Username</InputGroup.Text>
                    <Form.Control ref={usernameRef} placeholder={user.username}></Form.Control>
                </InputGroup>

                <InputGroup>
                    <InputGroup.Text id="passwordInput">Username</InputGroup.Text>
                    <Form.Control ref={passRef}></Form.Control>
                </InputGroup>
                <InputGroup>
                    <InputGroup.Text id="passwordCheckInput">Username</InputGroup.Text>
                    <Form.Control ref={passCheckRef}></Form.Control>
                </InputGroup>
            </div>
        </>
    )
}

export default Profile