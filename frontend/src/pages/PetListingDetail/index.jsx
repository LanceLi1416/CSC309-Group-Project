import { useNavigate, useParams, navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';


function capitalize(str) {
    if (str === "") return "";
    return str[0].toUpperCase() + str.slice(1);
}


function PetListingDetail() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const { petListingID } = useParams();
    const [ petListing, setPetListing ] = useState({
        "id": 0,
        "pet_name": "",
        "gender": "",
        "pet_birthday": "",
        "pet_weight": 0,
        "animal": "",
        "breed": "",
        "colour": "",
        "vaccinated": true,
        "other_info": "",
        "pictures": [],
        "owner_name": "",
        "email": "",
        "phone_number": "",
        "location": "",
        "owner_birthday": "",
        "status": "",
        "shelter_first_name": "",
        "shelter_last_name": "",
        "shelter_phone": "",
        "shelter_email": ""
    });

    useEffect(() => {
        axios({
            method: "GET",
            url: `${API_URL}pet_listings/${petListingID}/`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            console.log(response);
            setPetListing(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    let today = new Date();
    let birthday = new Date(petListing.pet_birthday);

    let age = today.getFullYear() - birthday.getFullYear();

    if (today.getMonth() > birthday.getMonth() || 
        (today.getMonth() === birthday.getMonth() && today.getDay() > birthday.getDay())) {
        age--;
    }

    const newApplication = () => {
        const applicationURL = `${window.location.origin}/application/new`
        window.location.href = applicationURL;
    }

    return <>
    <div className="page-container" id="pet-detail-container">
    <div className="main-page">
        <div className="row mt-2 pb-3 border rounded">
            <h1>{petListing.pet_name}</h1>
            <p>{capitalize(petListing.animal)} | {capitalize(petListing.breed)} | {petListing.location}</p>
            <p><strong>Status:</strong> {capitalize(petListing.status)}</p>
        </div>

        <h2 className="pet-detail-subtitles">Pictures</h2>
        <div className="row mt-2 pb-3 border rounded">
            <div className="carousel slide" data-ride="carousel" id="pet-pictures-indicators">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img alt="First Slide" className="d block w-50" src="../petpal/static/media/images/sample_dog1.jpg" />
                    </div>
                    <div className="carousel-item">
                        <img alt="Second Slide" className="d block w-50" src="../petpal/static/media/images/sample_dog2.jpeg" />
                    </div>
                </div>
                <a className="carousel-control-prev carousel-button-background"
                   data-slide="prev"
                   href="#pet-pictures-indicators"
                   role="button">
                    <span aria-hidden="true" className="carousel-control-prev-icon"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next carousel-button-background"
                   data-slide="next"
                   href="#pet-pictures-indicators"
                   role="button">
                    <span aria-hidden="true" className="carousel-control-next-icon"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        </div>

        <h2 className="pet-detail-subtitles">About</h2>

        <div className="row mt-2 pb-3 border rounded">
            <p><strong>Gender:</strong> {capitalize(petListing.gender)}</p>
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Weight (kg):</strong> {petListing.pet_weight}</p>
            <p><strong>Vaccinated:</strong> {petListing.vaccinated ? "Yes" : "No"}</p>
            <p><strong>Colour:</strong> {capitalize(petListing.colour)}</p>
        </div>

        <h2 className="pet-detail-subtitles">Additional Information</h2>
        <div className="row mt-2 pb-3 border rounded">
            <p className="no-additional-info">
                {petListing.other_info ? petListing.other_info : <i>No additional information available</i>}
            </p>
        </div>
    </div>

    <div>
        <div className="sidebar-info">
            <div className="sidebar">
                <h2>Contact Info</h2>
                <div className="row mt-2 pb-3 border rounded">
                    <p><strong>Name:</strong> {petListing.owner_name}</p>
                    <p><strong>Email:</strong> {petListing.email}</p>
                    <p><strong>Phone:</strong> {petListing.owner_phone}</p>
                    <button className="btn btn-outline-primary sidebar-button" onClick={newApplication}>
                        Adopt This Pet
                    </button>
                </div>
                <h2>Shelter Info</h2>
                <div className="row mt-2 pb-3 border rounded">
                    <p><strong>Name:</strong> {petListing.shelter_first_name + " " + petListing.shelter_last_name}</p>
                    <p><strong>Email:</strong> {petListing.shelter_email}</p>
                    <p><strong>Phone:</strong> {petListing.shelter_phone}</p>
                    <button className="btn btn-outline-primary sidebar-button" onClick="location.href='shelter-detail.html'">
                        View Detailed Shelter Info
                    </button>
                </div>
            </div>

        </div>
    </div>

    </div>
    </>
}

export default PetListingDetail;