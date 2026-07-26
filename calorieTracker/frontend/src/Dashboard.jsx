import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({user}) {
    const navigate = useNavigate()
    
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

    return (
        <>
            <div className="header">
                <h1>Welcome {user.full_name}</h1>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="profile-dropdown" size="lg">
                        Profile
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {/* remove #, add a function to log out */}
                        <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}

export default Dashboard