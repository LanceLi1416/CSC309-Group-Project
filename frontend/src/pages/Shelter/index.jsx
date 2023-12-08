import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShelterProfile = () => {
    const { shelter_id } = useParams();
    const [shelter, setShelter] = React.useState(null);
    const url = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            try {
                const accessToken = localStorage.getItem('access_token');
                axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
                const response2 = await axios.get(`${url}accounts/` + shelter_id);
                setShelter(response2.data);
            } catch (error) {
                if (error.response.status === 404) {
                    navigate("/404");
                } else if (error.response.status === 401) {
                    navigate("/401");
                }
            }
        }
        loadData();
    }, [shelter_id, url, navigate]);

    console.log(shelter);

    const redirectToComments = () => {
    // TODO: Implement logic to display comments
        navigate("/shelter/" + shelter_id + "/comments")
    };

    return (
    <div className="shelter-container">
    {/* Heading */}
    <div className="image-wrapper">
        <img
        alt=""
        className="wrapped-img"
        src={shelter ? shelter.avatar : `${url}media/avatars/default.jpg`}
        />
    </div>
    <div className="text-center my-3">
        <h1>{shelter ? shelter.first_name + " " + shelter.last_name : "Shelter"}</h1>
    </div>
    {/* Detail */}
    <div className="d-flex flex-column align-items-center align-content-center text-start w-100">
    {/* Bio */}
    <div className="overflow-auto bio-text fs-6 text-center mb-2">
        <p>
        {shelter ? shelter.bio : "This is a shelter."}
        </p>
    </div>
    {/* Icons */}
    <div className="row mt-3 d-flex justify-content-center">
        {/* Address */}
        <div className="col d-flex flex-column align-items-center align-content-center shelter-contact-box mx-5">
        <div className="p-1 text-center fs-3 fw-bold mb-2">ADDRESS</div>
        <div className="text-center align-text-bottom fs-6 address-text">
            {shelter ? shelter.address ? shelter.address : "1234 Main Street, City, State, 98765" : "1234 Main Street, City, State, 98765"}
        </div>
        </div>
        {/* Phone */}
        <div className="col d-flex flex-column align-items-center align-content-center shelter-contact-box mx-5">
        <div className="p-1 text-center fs-3 fw-bold mb-2">PHONE</div>
        <div className="text-center align-text-bottom fs-6"> {shelter ? shelter.phone ? shelter.phone : "(333) 444-5555" : "(333) 444-5555"} </div>
        </div>
        {/* Email */}
        <div className="col d-flex flex-column align-items-center align-content-center shelter-contact-box mx-5">
        <div className="p-1 text-center fs-3 fw-bold mb-2">EMAIL</div>
        <div className="text-center align-text-bottom fs-6">
            <a href={"mailto:" + (shelter !== null ? shelter.username : "example@gmail.com")}>{(shelter !== null ? shelter.username : "example@gmail.com")}</a>
        </div>
        </div>
    </div>
    </div>
    {/* Buttons */}
    <div className="d-flex justify-content-center mt-3">
        <button className="btn mx-2 my-2 comments-button btn-secondary" onClick={redirectToComments}>
            View Comments
        </button>
    </div>
    </div>
    );
    };

    export default ShelterProfile;
