import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import strftime from 'strftime'

import './Dashboard.css'

function Dashboard({user, isLoading}) {
    const [showCalorie, setShowCalorie] = useState(false);
    const navigate = useNavigate();
    const calorieRef = useRef();
    const [error, setError] = useState("");
    const calorieData = [];

    const handleShowCalorie = () => setShowCalorie(true);
    const handleCloseCalorie = () => setShowCalorie(false);

    
    useEffect(() =>{
        if (!user && !isLoading) {
            navigate("/login");
        }
    }, [user, isLoading]);

    if (!user || isLoading) {
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
        if (!res.ok) {
            if(res.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return;
            }
            const message = data.detail[0].msg;
            setError(message)
            return;
        }
        handleChart()
        handleClose()
    }

    async function handleChart() {
        const token = sessionStorage.getItem("token")
        const res = await fetch ("http://127.0.0.1:8000/graph",
            {
                method: "GET", headers: {"Content-Type": "application/json", "Authorization" : `Bearer ${token}`}
            }
        )
        const data2 = await res.json();
        if (!res.ok) {
            if(res.status === 401) {
                sessionStorage.removeItem("token")
                navigate("/login")
                return;
            }
        }
        if (data2 === null) {
            return 
        }
        for (let i = 0; i < data2.length; i++) {
            calorieData.push({"name" : strftime(("%A, %m/%d"), new Date(data2[i].date)), "uv" : data2.calories})
        }
    }

    handleChart()


    return (
        <>
            <div className="header">
                <h1>Welcome {user.full_name}</h1>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="profile-dropdown" size="lg">
                        Profile
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate("/profile")}>Profile</Dropdown.Item>
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
                        <Button variant="primary" onClick={handleCalories}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={calorieData}>
                <CartesianGrid />
                <Line dataKey="uv" />
                <XAxis dataKey="name" />
                <YAxis />
                <Legend />
                </LineChart>
            </div>
        </>
    )
}

export default Dashboard