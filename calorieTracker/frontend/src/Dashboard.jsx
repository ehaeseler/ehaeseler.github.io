import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({user}) {
    const [show, setShow] = useState(false);
    const navigate = useNavigate()
    const calorieRef = useRef()

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    
    useEffect(() =>{
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    if (!user) {
        return null
    }

    function handleLogout() {
        sessionStorage.removeItem("token");
        window.location.reload();
    }

    async function handleCalories() {
        const calories = calorieRef.current.value;

        const res = await fetch("http://127.0.0.1:8000/calories",
            {
                method: "POST", headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({"calories": calories})
            }
        )
    }

    return (
        <>
            <div className="header">
                <h1>Welcome {user.full_name}</h1>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="profile-dropdown" size="lg">
                        Profile
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="calorieTracker">
                <Button className="calorieButton" onClick={handleShow}>Add Calories</Button> 
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Calories</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup>
                            <InputGroup.Text id="calorieInput">Calories:</InputGroup.Text>
                            <Form.Control ref={calorieRef}></Form.Control>
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}> Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Dashboard