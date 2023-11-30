import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Logo from '../../components/Logo';
import Heading from '../../components/Heading';
import FormField from '../../components/FormField';
import { Link, useNavigate } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import ImageUploadButton from '../../components/ImageUploadButton';

function Register() {
    const [registerError, setRegisterError] = useState([]);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    let fieldToErrorField = {
        "username": "Email",
        "password": "Password",
        "reenter_password": "Confirm Password",
        "first_name": "First Name",
        "last_name": "Last Name",
        "is_seeker": "User Type",
        "avatar": "Profile Picture"
    }

    const submitHandler = (values) => {
        const formData = new FormData();
        formData.append('username', values.email);
        formData.append('password', values.password);
        formData.append('reenter_password', values.confirmPassword);
        formData.append('first_name', values.firstName);
        formData.append('last_name', values.lastName);
        formData.append('is_seeker', values.radio === 'petSeeker');
        formData.append("notif_preference", true);

        if (values.avatar !== '') {
            formData.append('avatar', values.avatar, values.avatar.name);
        }
        axios({
            method: "POST",
            url: API_URL + "accounts/",
            headers: { "Content-Type": "multipart/form-data" },
            data: formData
        }).then(() => {
            navigate("/login");
        }).catch((error) => {
            let errorMessages = [];
            for (var key in error.response.data) {
                errorMessages.push(fieldToErrorField[key] + ': ' + error.response.data[key]);
            }
            setRegisterError(errorMessages);
        });
    };

    const { Formik } = formik;
    const schema = yup.object().shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
        radio: yup.string().required('Please select a user type'),
        avatar: yup.mixed().notRequired(),
    });

    return (<>
        <Logo />
        <Heading header="Welcome to PetPal!" subheader="Sign up below with your details." />
        <Formik
            validationSchema={schema}
            onSubmit={(values) => submitHandler(values)}
            initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', radio: '', avatar: '' }}
        >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit} className="centered-form mt-5">
                <Row className="mb-3">
                    <FormField id="firstName" width="6" type="text" placeholder="First Name" name="firstName" value={values.firstName} handleChange={handleChange} error={touched.firstName && errors.firstName} />
                    <FormField id="lastName" width="6" type="text" placeholder="Last Name" name="lastName" value={values.lastName} handleChange={handleChange} error={touched.lastName && errors.lastName} />
                </Row>
                <Row className="mb-3">
                    <FormField id="email" width="12" type="email" placeholder="Email" name="email" value={values.email} handleChange={handleChange} error={touched.email && errors.email} />
                </Row>
                <Row className="mb-3">
                    <FormField id="password" width="6" type="password" placeholder="Password" name="password" value={values.password} handleChange={handleChange} error={touched.password && errors.password} />
                    <FormField id="confirmPassword" width="6" type="password" placeholder="Confirm Password" name="confirmPassword" value={values.confirmPassword} handleChange={handleChange} error={touched.confirmPassword && errors.confirmPassword} />
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md={6} controlId="radio">
                        <Form.Label className="fw-bold">Are you a pet seeker or a pet shelter?</Form.Label>
                        <Form.Check
                            type="radio"
                            label="Pet Seeker"
                            name="radio"
                            value="petSeeker"
                            onChange={handleChange}
                            isInvalid={!!(touched.radio && errors.radio)}
                        />
                        <Form.Check
                            type="radio"
                            label="Pet Shelter"
                            name="radio"
                            value="petShelter"
                            onChange={handleChange}
                            isInvalid={!!(touched.radio && errors.radio)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {touched.radio && errors.radio}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <ImageUploadButton name="avatar" accept="image/*" placeholder="Upload an optional profile picture" />
                </Row>
                <Button type="submit">Sign Up</Button>
            </Form>
            )}
        </Formik>
        <div className="text-center mt-2 mb-4">
            Already have a PetPal account? <Link to="/login">Log in</Link>.
            {registerError.map((errorMessage) => (<>
                <div className='error-text'>{errorMessage}</div>
            </>))}
        </div>
    </>);
}

export default Register;