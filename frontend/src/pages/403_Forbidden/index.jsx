import React from "react";
import {useNavigate} from "react-router-dom";

export const Forbidden = () => {
    const navigate = useNavigate();

    return (<div>
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <h1>Forbidden</h1>
        <p>You don't have permission to view this page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
    </div>)
}