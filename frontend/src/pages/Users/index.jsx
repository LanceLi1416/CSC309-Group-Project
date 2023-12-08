import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FormField from "../../components/FormField";
import Col from "react-bootstrap/Col";
import 'bootstrap-icons/font/bootstrap-icons.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Search = () => {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    let query = useQuery();
    let id = query.get("id");

    const [isSeeker, setIsSeeker] = useState(false);
    const [profile, setProfile] = useState({
        firstName: "", lastName: "", email: "", address: "", phone: "", bio: "", avatar: "", notifPreference: true
    });

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        } else {
            axios({
                method: "GET", url: API_URL + "accounts/" + id + "/", headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((response) => {
                setIsSeeker(response.data.is_seeker);
                console.log(response.data);
                setProfile({
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    email: response.data.username,
                    address: response.data.address,
                    phone: response.data.phone,
                    bio: response.data.bio,
                    avatar: response.data.avatar,
                    notifPreference: response.data.notif_preference
                });
            }).catch((error) => {
                if (error.response.status === 404) {
                    console.log("Account not found");
                }
            });
        }
    }, [token, navigate, API_URL]);

    return (<div>
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <div className="d-flex flex-column justify-content-center align-items-center">

            <h1 className="mt-5 mb-3">{profile.firstName + " " + profile.lastName}</h1>
            <img src={profile.avatar} alt="profile" className="img-fluid rounded-circle mb-4" width="200" height="200"/>

            <Form noValidate className="centered-form mt-5">
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="firstName" width="6" label="First Name" type="text" placeholder="First Name"
                               name="firstName" value={profile.firstName} disabled={true}/>
                    <FormField id="lastName" width="6" label="Last Name" type="text" placeholder="Last Name"
                               name="lastName" value={profile.lastName} disabled={true}/>
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="email" width="12" label="Email" type="email" placeholder="Email" name="email"
                               value={profile.email} disabled={true}/>
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="address" width="12" label="Address" type="text" placeholder="Address"
                               name="address" value={profile.address} disabled={true}/>
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="phone" width="12" label="Phone Number" type="text" placeholder="000-000-0000"
                               name="phone" value={profile.phone} disabled={true}/>
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <Form.Group as={Col} md="12" controlId="bio">
                        <Form.Label className="fw-bold">Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            placeholder="Bio"
                            name="bio"
                            value={profile.bio}
                            disabled={true}
                        />
                    </Form.Group>
                </Row>
                {isSeeker && (<Row className="mb-3">
                    <Form.Group as={Col} md={12} controlId="notifPreference">
                        <Form.Check
                            type="checkbox"
                            label="I would like to receive notifications."
                            name="notifPreference"
                            value="notifPreference"
                            checked={profile.notifPreference}
                            disabled={true}
                        />
                    </Form.Group>
                </Row>)}
            </Form>
        </div>
    </div>)

};

export default Search;