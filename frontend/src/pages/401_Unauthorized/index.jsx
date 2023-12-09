import React from "react";
import {useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Unauthorized = () => {
    const navigate = useNavigate();

    return (<div>
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
    </div>)
}

export default Unauthorized;