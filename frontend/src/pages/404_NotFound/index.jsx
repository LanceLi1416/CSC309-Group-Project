import React from "react";
import {useNavigate} from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    return (<div>
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <h1>404 Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Home</button>
    </div>)
}

export default NotFound;