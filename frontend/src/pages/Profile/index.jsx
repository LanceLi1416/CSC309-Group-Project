import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormField from '../../components/FormField';
import { useNavigate } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import ImageUploadButton from '../../components/ImageUploadButton';

function Profile() {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [isSeeker, setIsSeeker] = useState(false);
    const [existingProfile, setExistingProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
        bio: "",
        avatar: "",
        notifPreference: true
    });

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        }
        else {
            const user = JSON.parse(localStorage.getItem('user'));
            setIsSeeker(user.is_seeker);
            axios({
                method: "GET",
                url: API_URL + "accounts/" + user.id + "/",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((response) => {
                setExistingProfile({
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
                    // console.log("Account not found");
                    navigate("/404");
                }
            });
        }
    }, [token, navigate, API_URL]);

    const submitHandler = (values) => {
        const formData = new FormData();
        formData.append('first_name', values.firstName);
        formData.append('last_name', values.lastName);
        formData.append('username', values.email);
        formData.append('address', values.address);
        formData.append('phone', values.phone);
        formData.append('bio', values.bio);
        if (values.avatar !== existingProfile.avatar) {
            formData.append('avatar', values.avatar, values.avatar.name);
        }
        if (isSeeker) {
            formData.append('notif_preference', values.notifPreference);
        }

        axios({
            method: "PUT",
            url: API_URL + "accounts/",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "multipart/form-data"
            },
            data: formData
        }).then(() => {
            navigate(0);   // refresh page
        }).catch((error) => {
            console.log(error);
        });
    };

    const { Formik } = formik;
    const phoneRegExp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
    const schema = yup.object().shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        address: yup.string().notRequired(),
        phone: yup.string().matches(phoneRegExp, 'Phone number must be in the format 000-000-0000').notRequired(),
        bio: yup.string().notRequired(),
        avatar: yup.mixed().notRequired(),
        notifPreference: yup.boolean().notRequired(),
    });

    return (<div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="mt-5 mb-3">Update Profile</h1>
        <img src={existingProfile.avatar} alt="profile" className="img-fluid rounded-circle mb-4" width="200" height="200"/>
        <Formik
            validationSchema={schema}
            onSubmit={submitHandler}
            initialValues={existingProfile}
            enableReinitialize={true}
        >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit} className="centered-form mt-5">
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="firstName" width="6" label="First Name" type="text" placeholder="First Name" name="firstName" value={values.firstName} handleChange={handleChange} error={touched.firstName && errors.firstName} />
                    <FormField id="lastName" width="6" label="Last Name" type="text" placeholder="Last Name" name="lastName" value={values.lastName} handleChange={handleChange} error={touched.lastName && errors.lastName} />
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="email" width="12" label="Email" type="email" placeholder="Email" name="email" value={values.email} handleChange={handleChange} error={touched.email && errors.email} />
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="address" width="12" label="Address" type="text" placeholder="Address" name="address" value={values.address} handleChange={handleChange} error={touched.address && errors.address} />
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <FormField id="phone" width="12" label="Phone Number" type="text" placeholder="000-000-0000" name="phone" value={values.phone} handleChange={handleChange} error={touched.phone && errors.phone} />
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <Form.Group as={Col} md="12" controlId="bio">
                        <Form.Label className="fw-bold">Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            placeholder="Bio"
                            name="bio"
                            value={values.bio}
                            onChange={handleChange}
                            isInvalid={!!errors.bio}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.bio}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <ImageUploadButton name="avatar" accept="image/*" placeholder="Change profile picture" />
                </Row>
                {isSeeker && (<Row className="mb-3">
                    <Form.Group as={Col} md={12} controlId="notifPreference">
                        <Form.Check
                            type="checkbox"
                            label="I would like to receive notifications."
                            name="notifPreference"
                            value="notifPreference"
                            checked={values.notifPreference}
                            onChange={handleChange}
                            isInvalid={!!(touched.notifPreference && errors.notifPreference)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {touched.notifPreference && errors.notifPreference}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>)}
                <Button className="mb-4" type="submit" variant="outline-primary">Update</Button>
            </Form>
        )}
        </Formik>
    </div>);
}

export default Profile;