import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PetListingDetail() {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const { petListingID } = useParams();
    const [ petListing, setPetListing ] = useState({});

    useEffect(() => {
        axios({
            method: "GET",
            url: `${API_URL}pet_listings/${petListingID}/`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setPetListing(response.data);
        })
    })

    return <>
    <div className="page-container" id="pet-detail-container">
    <div className="main-page">
        <div className="row mt-2 pb-3 border rounded">
            <h1>{petListing.pet_name}</h1>
            <p>{petListing.animal} | {petListing.breed} | {petListing.location}</p>
            <p><strong>Status:</strong> {petListing.status}</p>
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
            <p><strong>Gender:</strong> {petListing.gender}</p>
            <p><strong>Age:</strong> 2</p>
            <p><strong>Weight (kg):</strong> {petListing.pet_weight}</p>
            <p><strong>Vaccinated:</strong> {petListing.vaccinated ? "Yes" : "No"}</p>
            <p><strong>Colour:</strong> {petListing.colour}</p>
        </div>

        <h2 className="pet-detail-subtitles">Additional Information</h2>
        <div className="row mt-2 pb-3 border rounded">
            <p className="no-additional-info"><i>No additional information available</i></p>
        </div>
    </div>

    <div>
        <div className="sidebar-info">
            <div className="sidebar">
                <h2>Contact Info</h2>
                <div className="row mt-2 pb-3 border rounded">
                    <p><strong>Name:</strong> {petListing.owner_name}</p>
                    <p><strong>Email:</strong> {petListing.email}</p>
                    <p><strong>Phone:</strong> {petListing.phone_number}</p>
                    <button className="btn btn-outline-primary sidebar-button" onClick="location.href='pet-adoption.html'">
                        Adopt This Pet
                    </button>
                </div>
                <h2>Shelter Info</h2>
                <div className="row mt-2 pb-3 border rounded">
                    <p><strong>Name:</strong> PetPal</p>
                    <p><strong>Email:</strong> example@domain.com</p>
                    <p><strong>Phone:</strong> (000) 000 - 0000</p>
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