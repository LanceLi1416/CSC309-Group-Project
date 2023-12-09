import React from 'react';
import {useNavigate} from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

const PetListings = () => {
    const navigate = useNavigate();

    return (<div>
        {/* Back Arrow */}
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <div className="d-flex flex-row justify-content-between">

            {/* Arrow and Text */}
            <div className="d-flex flex-row">
                <div className="mx-3">
                    <h1 className="my-4">Manage your pet listings</h1>
                </div>
            </div>
            {/* Sorting */}
            <div className="d-flex flex-row justify-content-center align-items-center">
                <p className="m-0">Sort</p>
                <select aria-label="sort by select dropdown" className="form-select mx-2">
                    <option value="newest">New</option>
                    <option value="oldest">Old</option>
                </select>
            </div>
        </div>
    </div>);
}

export default PetListings;