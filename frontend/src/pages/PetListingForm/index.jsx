import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';


function PetListingForm() {
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const { petListingID } = useParams();

    const [ curApplication, setCurApplication ] = useState({
        petName: "",
        gender: "",
        petBirthday: "",
        petWeight: "",
        animal: "",
        breed: "",
        colour: "",
        vaccinated: false,
        otherInfo: "",
        pictures: "",
        ownerName: "",
        email: "",
        ownerPhone: "",
        location: "",
        ownerBirthday: ""
    })

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        }
        if (petListingID !== "new") {
            axios({
                method: "GET",
                url: `${API_URL}pet_listings/${petListingID}/`,
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then(((response) => {
                setCurApplication({
                    petName: response.data.pet_name,
                    gender: response.data.gender,
                    petBirthday: response.data.pet_birthday,
                    petWeight: response.data.pet_weight,
                    animal: response.data.animal,
                    breed: response.data.breed,
                    colour: response.data.colour,
                    vaccinated: response.data.vaccinated,
                    otherInfo: response.data.other_info,
                    pictures: response.data.pictures,
                    ownerName: response.data.owner_name,
                    email: response.data.email,
                    ownerPhone: response.data.owner_phone,
                    location: response.data.location,
                    ownerBirthday: response.data.owner_birthday
                })
            })).catch((error) => {
                if (error.response.status === 404) {
                    // TODO: redirect to 404
                    console.log(error.response.status);
                } else if (error.response.status === 401) {
                    navigate("/login"); // TODO: don't know if necessary
                } else if (error.response.status === 403) {
                    console.log(error.response.status);
                }
            })
        }
    }, [ petListingID, token, API_URL, navigate ])

    return <>

    </>
}

export default PetListingForm;