import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
import { Link, useNavigate, useParams } from "react-router-dom";
import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios'

function ApplicationForm() {
    const { id } = useParams();
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [existingApplication, setExistingApplication] = useState({
        email: '',
        firstName: '',
        lastName: '',
        birthday: '',
        address: '',
        phone: '',
        income: '',
        experience: '',
        current_pets: '',
        availability: '',
        checkbox: false,
    });
    const [readOnly, setReadOnly] = useState(false);

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        }
        if (id !== "new") {
            axios({
                method: "GET",
                url: API_URL + "applications/" + id + "/",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((response) => {
                setExistingApplication({
                    email: response.data.email,
                    firstName: response.data.first_name,
                    lastName: response.data.last_name,
                    birthday: response.data.birthday,
                    address: response.data.address,
                    phone: response.data.phone,
                    income: response.data.income,
                    experience: response.data.experience,
                    current_pets: response.data.current_pets,
                    availability: response.data.availability,
                    checkbox: true,
                });
                setReadOnly(true);
            }).catch((error) => {
                // TODO: 404 page
                if (error.response.status === 404) {
                    console.log("Application not found");
                }
            });
        }
    }, [id]);

    // TODO: need to get the corresponding pet listing id from navigate
    const submitHandler = (values) => {
        const formData = {
            "email": values.email,
            "first_name": values.firstName,
            "last_name": values.lastName,
            "birthday": values.birthday,
            "address": values.address,
            "phone": values.phone,
            "income": values.income,
            "experience": values.experience,
            "current_pets": values.current_pets,
            "availability": values.availability,
        }
        axios({
            method: "POST",
            url: API_URL + "applications/",
            data: formData,
            headers: {
                "Authorization": "Bearer " + token,
            }
        }).then((response) => {
            console.log(response.data);
            navigate("/");
        }).catch((error) => {
            console.log(error);
        });
    };

    const { Formik } = formik;
    const phoneRegExp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/
    const schema = yup.object().shape({
        email: yup.string().email('Invalid email').required('Email is required'),
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        birthday: yup.date().required('Birthday is required'),
        address: yup.string().required('Address is required'),
        phone: yup.string().matches(phoneRegExp, 'Phone number must be in the format 000-000-0000').required('Phone number is required'),
        income: yup.number().required('Income is required'),
        experience: yup.string().required('Experience is required'),
        current_pets: yup.string().required('Current pets is required'),
        availability: yup.date().required('Pick up date is required'),
        checkbox: yup.bool().oneOf([true], 'This must be checked'),
    });

    // TODO: back button
    return (<>
        <Header header={id} subheader="" />
        <Formik
            validationSchema={schema}
            onSubmit={console.log}
            initialValues={existingApplication}
            enableReinitialize={true}
        >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit} className="centered-form mt-5">
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Name</Form.Label>
                    <FormField id="firstName" width="5" type="text" placeholder="First Name" name="firstName" value={values.firstName} handleChange={handleChange} error={touched.firstName && errors.firstName} disabled={readOnly} />
                    <FormField id="lastName" width="5" type="text" placeholder="Last Name" name="lastName" value={values.lastName} handleChange={handleChange} error={touched.lastName && errors.lastName} disabled={readOnly} />
                </Row>
                <Row className="mb-3 d-flex flex-row justify-content-center">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Email</Form.Label>
                    <FormField id="email" width="10" type="email" placeholder="Email" name="email" value={values.email} handleChange={handleChange} error={touched.email && errors.email} disabled={readOnly} />
                </Row>
                <Row className="mb-3 d-flex flex-row">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Birthday</Form.Label>
                    <FormField id="birthday" width="10" type="date" placeholder="Birthday" name="birthday" value={values.birthday} handleChange={handleChange} error={touched.birthday && errors.birthday} disabled={readOnly} />
                </Row>
                <Row className="mb-3 d-flex flex-row">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Address</Form.Label>
                    <FormField id="address" width="10" type="text" placeholder="Address" name="address" value={values.address} handleChange={handleChange} error={touched.address && errors.address} disabled={readOnly} />
                </Row>
                <Row className="mb-3 d-flex flex-row">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Phone Number</Form.Label>
                    <FormField id="phone" width="10" type="text" placeholder="000-000-0000" name="phone" value={values.phone} handleChange={handleChange} error={touched.phone && errors.phone} disabled={readOnly} />
                </Row>
                <Row className="mb-3 d-flex flex-row">
                <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Household Income</Form.Label>
                    <Form.Group as={Col} md={8} controlId="income">
                        <Form.Check
                            type="radio"
                            label="$0-$30,000"
                            name="income"
                            value="$0-$30,000"
                            checked={values.income === "$0-$30,000"}
                            onChange={handleChange}
                            isInvalid={!!(touched.income && errors.income)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="$30,000-$60,000"
                            name="income"
                            value="$30,000-$60,000"
                            checked={values.income === "$30,001-$60,000"}
                            onChange={handleChange}
                            isInvalid={!!(touched.income && errors.income)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="$60,000-$90,000"
                            name="income"
                            value="$60,000-$90,000"
                            checked={values.income === "$60,000-$90,000"}
                            onChange={handleChange}
                            isInvalid={!!(touched.income && errors.income)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="$90,000-$120,000"
                            name="income"
                            value="$90,000-$120,000"
                            checked={values.income === "$90,000-$120,000"}
                            onChange={handleChange}
                            isInvalid={!!(touched.income && errors.income)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="$120,000+"
                            name="income"
                            value="$120,000+"
                            checked={values.income === "$120,000+"}
                            onChange={handleChange}
                            isInvalid={!!(touched.income && errors.income)}
                            disabled={readOnly}
                        />
                        <Form.Control.Feedback type="invalid">
                            {touched.income && errors.income}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3 d-flex flex-row">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Experience with Pets</Form.Label>
                    <Form.Group as={Col} md={8} controlId="experience">
                        <Form.Check
                            type="radio"
                            label="Never"
                            name="experience"
                            value="Never"
                            checked={values.experience === "Never"}
                            onChange={handleChange}
                            isInvalid={!!(touched.experience && errors.experience)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="Less then 2 years"
                            name="experience"
                            value="Less then 2 years"
                            checked={values.experience === "Less then 2 years"}
                            onChange={handleChange}
                            isInvalid={!!(touched.experience && errors.experience)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="2-5 years"
                            name="experience"
                            value="2-5 years"
                            checked={values.experience === "2-5 years"}
                            onChange={handleChange}
                            isInvalid={!!(touched.experience && errors.experience)}
                            disabled={readOnly}
                        />
                        <Form.Check
                            type="radio"
                            label="More than 5 years"
                            name="experience"
                            value="More than 5 years"
                            checked={values.experience === "More than 5 years"}
                            onChange={handleChange}
                            isInvalid={!!(touched.experience && errors.experience)}
                            disabled={readOnly}
                        />
                        <Form.Control.Feedback type="invalid">
                            {touched.experience && errors.experience}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3 d-flex flex-row">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Any Current Pets</Form.Label>
                    <FormField id="current_pets" width="10" type="text" placeholder="Dog (2 years), Cat (1 year)" name="current_pets" value={values.current_pets} handleChange={handleChange} error={touched.current_pets && errors.current_pets} disabled={readOnly} />
                </Row>
                <Row className="mb-3 d-flex flex-row">
                    <Form.Label className="fw-bold d-flex flex-row justify-content-start justify-content-md-end align-items-center" as={Col} md="2">Pickup Date</Form.Label>
                    <FormField id="availability" width="10" type="date" placeholder="Availability" name="availability" value={values.availability} handleChange={handleChange} error={touched.availability && errors.availability} disabled={readOnly} />
                </Row>
                <Row className="mb-3 align-self-center">
                    <Form.Group as={Col} md={12} controlId="checkbox">
                        <Form.Check
                            type="checkbox"
                            label="I hereby declare that the information provided is true and correct."
                            name="checkbox"
                            value="checkbox"
                            checked={values.checkbox}
                            onChange={handleChange}
                            isInvalid={!!(touched.checkbox && errors.checkbox)}
                            disabled={readOnly}
                        />
                        <Form.Control.Feedback type="invalid">
                            {touched.checkbox && errors.checkbox}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                {id === "new" && (<Button type="submit" variant="outline-primary">Submit</Button>)}
            </Form>
        )}
        </Formik>
    </>);
}

export default ApplicationForm;