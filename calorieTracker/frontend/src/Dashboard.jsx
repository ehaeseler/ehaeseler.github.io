import { useRef, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'

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
    return (<div>Dashboard coming soon</div>)
}

export default Dashboard