import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';


function PetListingForm() {
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const { petListingID } = useParams();

    const [ curApplication, setCurApplication ] = useState({
        pet_name: "",
        gender: "",
        pet_birthday: "",
        pet_weight: "",
        animal: "",
        breed: "",
        colour: "",
        vaccinated: false,
        other_info: "",
        pictures: "",
        owner_name: "",
        email: "",
        owner_phone: "",
        location: "",
        owner_birthday: ""
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
                    pet_name: response.data.pet_name,
                    gender: response.data.gender,
                    pet_birthday: response.data.pet_birthday,
                    pet_weight: "",
                    animal: "",
                    breed: "",
                    colour: "",
                    vaccinated: false,
                    other_info: "",
                    pictures: "",
                    owner_name: "",
                    email: "",
                    owner_phone: "",
                    location: "",
                    owner_birthday: ""
                })
            }))
        }
    })

    return <>

    </>
}

export default PetListingForm;