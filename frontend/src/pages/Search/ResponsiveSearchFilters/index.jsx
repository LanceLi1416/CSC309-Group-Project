import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Row} from "react-bootstrap";


function ResponsiveSearchFilters({filters, setFilters}) {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [filterDropdown, setFilterDropdown] = useState(false);

    // Filter Options --------------------------------------------------------------------------------------------------
    const PET_TYPES = [{
        id: "dog", value: "Dog", checked: !!(filters.status !== undefined && filters.status.includes("dog"))
    }, {
        id: "cat", value: "Cat", checked: !!(filters.status !== undefined && filters.status.includes("cat"))
    }, {
        id: "bird", value: "Bird", checked: !!(filters.status !== undefined && filters.status.includes("bird"))
    }, {
        id: "other", value: "Other", checked: !!(filters.status !== undefined && filters.status.includes("other"))
    }];

    const STATUSES = [{
        id: "available",
        value: "Available",
        checked: !!(filters.status !== undefined && filters.status.includes("available"))
    }, {
        id: "adopted",
        value: "Adopted",
        checked: !!(filters.status !== undefined && filters.status.includes("adopted"))
    }, {
        id: "pending",
        value: "Pending",
        checked: !!(filters.status !== undefined && filters.status.includes("pending"))
    }, {
        id: "withdrawn",
        value: "Withdrawn",
        checked: !!(filters.status !== undefined && filters.status.includes("withdrawn"))
    }];

    const GENDERS = [{
        id: "male", value: "Male", checked: !!(filters.gender !== undefined && filters.gender.includes("male"))
    }, {
        id: "female", value: "Female", checked: !!(filters.gender !== undefined && filters.gender.includes("female"))
    }];

    const [shelters, setShelters] = useState([]);

    // Hooks -----------------------------------------------------------------------------------------------------------

    useEffect(() => {
        axios({
            method: "GET",
            url: `${API_URL}accounts/`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setShelters(response.data);
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/login");
            }
        });
    }, [API_URL, navigate, token]);

    // Event Handlers --------------------------------------------------------------------------------------------------
    const handleMultiSelectChange = (event, filterType) => {
        const value = event.target.value;
        let newValues;

        newValues = newValues = filters[filterType].includes(value) ?
            filters[filterType].filter(c => c !== value) :
            [...filters[filterType], value];

        setFilters({...filters, [filterType]: newValues});
    }

    return (<>
    {/* Filter Options Dropdown Button, For Smaller Screens */}
    <Row id="filter-toggle">
        <button className="btn btn-outline-primary"
                id="filter-toggle-button"
                onClick={() => (setFilterDropdown(!filterDropdown))}>Show Filters</button>
        {filterDropdown && <div className="p-2 border full-height" id="filter-small">
            {/* Filter By Date */}
            <div className="mb-4 d-flex flex-column">
                <h5>Date Added</h5>
                <div>
                    <label className="subtitle" htmlFor="start-date">From</label>
                    <input className="form-control"
                           id="start-date"
                           type="date"
                           onChange={(e) => setFilters({...filters, "start_date": e.target.value})}/>
                </div>
                <div>
                    <label className="subtitle" htmlFor="end-date">To</label>
                    <input className="form-control"
                           id="end-date"
                           type="date"
                           onChange={(e) => setFilters({...filters, "end_date": e.target.value})} />
                </div>
            </div>
            {/* Filter By Pet Type */}
            <div className="mb-4">
                <h5>Pet Type</h5>

                <div className="form-check">
                    {PET_TYPES.map((type) => (<div key={`Types: ${type.id}`}>
                        <input className="form-check-input"
                               name="pet-type"
                               id={type.id}
                               type="checkbox"
                               value={type.id}
                               onChange={(e) => handleMultiSelectChange(e, "pet_type")}/>
                        <label htmlFor={type.id}>{type.value}</label><br/>
                    </div>))}
                </div>
            </div>
            {/* Filter By Gender */}
            <div className="mb-4">
                <h5>Gender</h5>
                <div className="form-check">

                    {GENDERS.map((gender) => (<div key={`Gender: ${gender.id}`}>
                        <input className="form-check-input"
                               name="gender"
                               id={gender.id}
                               type="checkbox"
                               value={gender.id}
                               onChange={(e) => handleMultiSelectChange(e, "gender")}/>
                        <label htmlFor={gender.id}>{gender.value}</label>
                    </div>))}

                </div>
            </div>
            {/* Filter By Shelter */}
            <div className="mb-4">
                <h5>Shelter</h5>
                <div className="form-check">
                    {shelters.map((shelter) => (
                    <div key={`Shelter: ${shelter.id}`}>
                        <input className="form-check-input"
                               id={shelter.id}
                               name="shelter"
                               type="checkbox"
                               value={shelter.id}
                               onChange={(e) => handleMultiSelectChange(e, "shelter")}/>
                        <label htmlFor={shelter.id}>{shelter.first_name + " " + shelter.last_name}</label><br />
                    </div>
                    ))}
                </div>
            </div>
            {/* Filter By Status */}
            <div className="mb-4">
                <h5>Status</h5>
                <div className="form-check">
                    {STATUSES.map((status) => (<div key={`Status: ${status.id}`}>
                        <input className="form-check-input"
                               name="status"
                               id={status.id}
                               type="checkbox"
                               value={status.id}
                               onChange={(e) => handleMultiSelectChange(e, "status")}/>
                        <label htmlFor={status.id}>{status.value}</label>
                    </div>))}
                </div>
            </div>
        </div>}
    </Row>
    </>)
}

export default ResponsiveSearchFilters;