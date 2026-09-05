import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'
import { useNavigate } from 'react-router-dom'
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';


import './Dashboard.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

function Dashboard({user, isLoading}) {
    const [showCalorie, setShowCalorie] = useState(false);
    const navigate = useNavigate();
    const calorieRef = useRef();
    const [error, setError] = useState("");
    const [calorieData, setCalorieData] = useState([]);
    const [labels, setLabels] = useState([]);

    const handleShowCalorie = () => setShowCalorie(true);
    const handleCloseCalorie = () => setShowCalorie(false);

    
    useEffect(() =>{
        if (!user && !isLoading) {
            navigate("/login");
        }
    }, [user, isLoading]);

    useEffect(() =>{
        handleChart();
    }, []);

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
        await handleChart()
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
            return ;
        }
        const dates = [];

        for (let i = 0; i < 14; i += 2) {
            dates.push(data2[i]);
        }
        setLabels(dates);

        const calories = [];

        for (let i = 1; i < 14; i += 2) {
            calories.push(data2[i]);
        }
        setCalorieData(calories)
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Wekly Calories' },
        },
        scales: {
            y: { 
              min: 0,
              max: 5000
            }
          }
    };


    const data = {
        labels,
        datasets: [
          {
            data: calorieData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };



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
                <div style={{ width: '90%', height: '50vh' }}>
                    <Line options={options} data={data}></Line>
                </div>
            </div>
        </>
    )
}

export default Dashboard