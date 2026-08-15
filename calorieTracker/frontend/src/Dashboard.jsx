import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({user}) {
    const [showCalorie, setShowCalorie] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate()
    const calorieRef = useRef()
    const [error, setError] = useState("");

    const handleShowCalorie = () => setShowCalorie(true);
    const handleCloseCalorie = () => setShowCalorie(false);
    const handleShowProfile = () => setShowProfile(true);
    const handleCloseProfile = () => setShowProfile(false);

    
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
        const token = sessionStorage.getItem("token")

        const res = await fetch("http://127.0.0.1:8000/calories",
            {
                method: "POST", headers: {"Content-Type": "application/json", "Authorization" : `Bearer ${token}`},
                body: JSON.stringify({"calories": parseInt(calories)})
            }
        )
        const data = await res.json();
        console.log(res);
        console.log(data);
        if (!res.ok) {
            if(res.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return;
            }
            const message = data.detail[0].msg;
            setError(message)
            console.log(message)
            return;
        }
        handleClose()
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
                <Button className="calorieButton" onClick={handleShowCalorie}>Add Calories</Button> 
                <Modal show={showCalorie} onHide={handleCloseCalorie}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Calories</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InputGroup>
                            <InputGroup.Text id="calorieInput">Calories:</InputGroup.Text>
                            <Form.Control ref={calorieRef}></Form.Control>
                        </InputGroup>
                        <p className="calorieError">{error}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCalories}> Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default Dashboard