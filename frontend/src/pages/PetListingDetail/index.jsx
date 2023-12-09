import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';


function capitalize(str) {
    if (str === "") return "";
    return str[0].toUpperCase() + str.slice(1);
}


function PetListingDetail() {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem('user')) ?? {is_seeker: true};

    const { petListingID } = useParams();
    const [ petListing, setPetListing ] = useState({
        "petName": "",
        "gender": "",
        "petBirthday": "",
        "petWeight": 0,
        "animal": "",
        "breed": "",
        "colour": "",
        "vaccinated": false,
        "otherInfo": "",
        "pictures": [],
        "ownerName": "",
        "email": "",
        "ownerPhone": "",
        "location": "",
        "ownerBirthday": "",
        "status": "",
        "shelterID": 0,
        "shelterFirstName": "",
        "shelterLastName": "",
        "shelterPhone": "",
        "shelterEmail": "",
        "creationDate": ""
    });

    useEffect(() => {
        axios({
            method: "GET",
            url: `${API_URL}pet_listings/search_results/${petListingID}/`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            console.log(response);
            setPetListing({
                "petName": response.data.pet_name,
                "gender": response.data.gender,
                "petBirthday": response.data.pet_birthday,
                "petWeight": response.data.pet_weight,
                "animal": response.data.animal,
                "breed": response.data.breed,
                "colour": response.data.colour,
                "vaccinated": response.data.vaccinated,
                "otherInfo": response.data.other_info,
                "pictures": response.data.pictures,
                "ownerName": response.data.owner_name,
                "email": response.data.email,
                "ownerPhone": response.data.owner_phone,
                "location": response.data.location,
                "ownerBirthday": response.data.owner_birthday,
                "status": response.data.status,
                "shelterID": response.data.shelter_id,
                "shelterFirstName": response.data.shelter_first_name,
                "shelterLastName": response.data.shelter_last_name,
                "shelterPhone": response.data.shelter_phone,
                "shelterEmail": response.data.shelter_email,
                "creationDate": response.data.creation_date
            });
        }).catch((error) => {
            if (error.response.status === 404) {
                navigate("/404");
                console.log(error.response.status);
            } else if (error.response.status === 401) {
                navigate('/login');
            } else if (error.response.status === 403) {
                // TODO: Redirect to 403 page
                console.log(error.response);
                // navigate("/403");
            }
        });
    }, [ petListingID, token, API_URL, navigate ]); // TODO: navigate?

    let today = new Date();
    let birthday = new Date(petListing.petBirthday);

    let age = today.getFullYear() - birthday.getFullYear();

    if (today.getMonth() < birthday.getMonth() || 
        (today.getMonth() === birthday.getMonth() && today.getDay() > birthday.getDay())) {
        age--;
    }

    const newApplication = () => {        
        const applicationURL = `${window.location.origin}/application/new/${petListingID}`;
        window.location.href = applicationURL;
    }

    return <>
    <div className="page-container" id="pet-detail-container">
    <div className="main-page">
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>
        <div className="row mt-2 pb-3 border rounded">
            <h1>{petListing.petName}</h1>
            <p>{capitalize(petListing.animal)} | {capitalize(petListing.breed)} | {petListing.location}</p>
            <p><strong>Status:</strong> {capitalize(petListing.status)}</p>
            <p><strong>Posting Date:</strong> {petListing.creationDate}</p>
        </div>
        <h2 className="pet-detail-subtitles">Pictures</h2>
        <div className="row mt-2 border rounded">
        <Carousel className="carousel-button-background">
            {petListing.pictures.map((pic) => (
                <Carousel.Item>
                    <div className="carousel-item active" key={pic.path}>
                        <img className="d block w-50" alt={`${pic.path}`} src={`${API_URL}${pic.path.replace('/media/', 'media/pet_listing_pics/')}`} />
                    </div>
                </Carousel.Item>
            ))}
        </Carousel>
        </div>

        <h2 className="pet-detail-subtitles">About</h2>

        <div className="row mt-2 pb-3 border rounded">
            <p><strong>Gender:</strong> {capitalize(petListing.gender)}</p>
            <p><strong>Age:</strong> {age}</p>
            <p><strong>Weight (kg):</strong> {petListing.petWeight}</p>
            <p><strong>Vaccinated:</strong> {petListing.vaccinated ? "Yes" : "No"}</p>
            <p><strong>Colour:</strong> {capitalize(petListing.colour)}</p>
        </div>

        <h2 className="pet-detail-subtitles">Additional Information</h2>
        <div className="row mt-2 pb-3 border rounded">
            <p className="no-additional-info">
                {petListing.otherInfo ? petListing.otherInfo : <i>No additional information available</i>}
            </p>
        </div>
    </div>

    <div>
        <div className="sidebar-info">
            <div className="sidebar">
                <h2>Contact Info</h2>
                <div className="row mt-2 pb-3 border rounded">
                    <p><strong>Name:</strong> {petListing.ownerName}</p>
                    <p><strong>Email:</strong> {petListing.email}</p>
                    <p><strong>Phone:</strong> {petListing.ownerPhone}</p>
                    <button className="btn btn-outline-primary sidebar-button" onClick={newApplication} disabled={user.is_seeker ? false : true}>
                        Adopt This Pet
                    </button>
                </div>
                <h2>Shelter Info</h2>
                <div className="row mt-2 pb-3 border rounded">
                    <p><strong>Name:</strong> {petListing.shelterFirstName + " " + petListing.shelterLastName}</p>
                    <p><strong>Email:</strong> {petListing.shelterEmail}</p>
                    <p><strong>Phone:</strong> {petListing.shelterPhone}</p>
                    <button className="btn btn-outline-primary sidebar-button"
                            onClick={() => {navigate(`../shelter/${petListing.shelterID}`)}}>
                        View Detailed Shelter Info
                    </button>
                </div>
                <div className="row mt-2 mb-2 pt-2 pb-2 border rounded">
                    <button className="btn btn-outline-danger sidebar-button"
                            onClick={() => {navigate(`/pet_listings/${petListingID}/report`)}}>
                        Report Pet Listing
                    </button>
                </div>
            </div>

        </div>
    </div>

    </div>
    </>
}

export default PetListingDetail;