import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import * as yup from 'yup';
import * as formik from 'formik';
import Form from 'react-bootstrap/Form';
import FormField from '../../components/FormField';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


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
        pictures: [],
        ownerName: "",
        email: "",
        ownerPhone: "",
        location: "",
        ownerBirthday: ""
    })
    const [ create, setCreate ] = useState(true);

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
                setCreate(false);
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

    const createHandler = (values) => {
        const formData = new FormData();
        formData.append("pet_name", values.petName);
        formData.append("gender", values.gender);
        formData.append("pet_birthday", values.petBirthday);
        formData.append("pet_weight", values.petWeight);
        formData.append("animal", values.animal);
        formData.append("breed", values.breed);
        formData.append("colour", values.colour);
        formData.append("vaccinated", values.vaccinated);
        formData.append("other_info", values.otherInfo);
        formData.append("pictures", values.pictures);
        formData.append("owner_name", values.ownerName);
        formData.append("email", values.email);
        formData.append("owner_phone", values.ownerPhone);
        formData.append("location", values.location);
        formData.append("owner_birthday", values.ownerBirthday);
    
        console.log(formData);

        axios({
            method: "POST",
            url: `${API_URL}pet_listings/`,
            header: {
                "Authorization": "Bearer " + token,
                "Content-Type": "multipart/form-data"
            },
            data: formData
        }).then((response) => {
            console.log("created");
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 403) {
                console.log(error.response.status); // TODO: redirect to 403
            }
        });
    };

    const updateHandler = (values) => {
        axios({
            method: "PUT",
            url: `${API_URL}pet_listings/${petListingID}/`,
            header: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            console.log("created");
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 403) {
                console.log(error.response.status); // TODO: redirect to 403
            }
        });
    };

    const { Formik } = formik;
    const phoneRegEx = /^\d{3}-\d{3}-\d{4}$/;
    const locationRegEx = /^[a-zA-Z\s]+, [a-zA-z\s]+$/;
    let maxOwnerBirthday = new Date();
    maxOwnerBirthday.setFullYear(maxOwnerBirthday.getFullYear() - 18);

    const schema = yup.object().shape({
        petName: yup.string().required("Please enter the pet's name")
                    .max(50, "Pet name can only be a max of 50 characters"),
        gender: yup.string().required("Please indicate the pet's gender")
                   .oneOf(["male", "female"], "The gender is invalid"),
        petBirthday: yup.date().required("Please enter the pet's birthday"),
        petWeight: yup.number().required("Please enter the pet's weight")
                      .min(0, "The given pet weight is invalid"),
        animal: yup.string().required("Please enter the type of animal")
                   .max(50, "Animal can only be a max of 50 characters"),
        breed: yup.string().required("Please enter the pet's breed")
                  .max(50, "Breed can only be a max of 50 characters"),
        colour: yup.string().required("Please enter the pet's colour")
                   .max(50, "Colour can only be a max of 50 characters"),
        vaccinated: yup.bool().oneOf([true], "The pet must be vaccinated"),
        pictures: yup.string().required("Please upload at least 1 pet picture"),
        otherInfo: yup.string().max(50, "Extra information can only be a max of 50 characters"),
        ownerName: yup.string().required("Please enter the owner's name")
                               .max(50, "Owner name can only be a max of 50 characters"),
        email: yup.string().email("Invalid email").required("Please enter the owner's email")
                           .max(50, "Email can only be a max of 50 characters"),
        phoneNumber: yup.string().required("Please enter the owner's phone number")
                                 .matches(phoneRegEx, "Invalid phone number. Please use the format: 000-000-0000"),
        location: yup.string().required("Please enter the owner's location")
                     .max(50, "Location can only be a max of 50 characters")
                     .matches(locationRegEx, "Invalid location. Please use the format: City, Country"),
        ownerBirthday: yup.date().required("Please enter the owner's birthday")
                          .max(maxOwnerBirthday, 
                               "The owner must be at least 18 years old")
    })

    return <>
    <div className="page-container">
        <h1>Upload a pet for adoption</h1>
        <p>Please fill in the form below with the pet and owner's details.</p>

        <h2>Pet Information</h2>
        <Formik validationSchema={schema}
                onSubmit={createHandler}
                initialValues={curApplication}
                enableReinitialize={true} 
        >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form onSubmit={handleSubmit} noValidate>
                    <div className="row mt-2 pb-3 border rounded">
                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="petName">Name</Form.Label>
                                <FormField id="petName"
                                           className="form-control"
                                           type="text"
                                           name="petName" 
                                           value={values.petName}
                                           onChange={handleChange} 
                                           error={touched.petName && errors.petName} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="gender">Gender</Form.Label>
                                <Form.Select id="gender" 
                                             onChange={handleChange} 
                                             error={touched.gender && errors.gender}>
                                    <option value="">Choose...</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="petBirthday">Birthday</Form.Label>
                                <FormField id="petBirthday"
                                           className="form-control"
                                           type="date"
                                           name="petBirthday" 
                                           value={values.petBirthday}
                                           onChange={handleChange} 
                                           error={touched.petBirthday && errors.petBirthday} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="petWeight">Weight</Form.Label>
                                <FormField id="petWeight"
                                           className="form-control"
                                           min="0"
                                           placeholder="0"
                                           type="number"
                                           name="petWeight" 
                                           value={values.petWeight}
                                           onChange={handleChange} 
                                           error={touched.petWeight && errors.petWeight} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="animal">Animal</Form.Label>
                                <FormField id="animal"
                                           className="form-control"
                                           type="text"
                                           name="animal" 
                                           value={values.animal}
                                           onChange={handleChange} 
                                           error={touched.animal && errors.animal} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="breed">Breed</Form.Label>
                                <FormField id="breed"
                                           className="form-control"
                                           type="text"
                                           name="breed" 
                                           value={values.breed}
                                           onChange={handleChange} 
                                           error={touched.breed && errors.breed} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="colour">Colour</Form.Label>
                                <FormField id="colour"
                                           className="form-control"
                                           type="text"
                                           name="colour" 
                                           value={values.colour}
                                           onChange={handleChange} 
                                           error={touched.colour && errors.colour} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="vaccinated">Vaccinated</Form.Label>
                                <Form.Check id="vaccinated"
                                            type="checkbox"
                                            name="vaccinated" 
                                            checked={!create ? values.vaccinated : null}
                                            onChange={handleChange} 
                                            error={touched.vaccinated && errors.vaccinated} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="otherInfo">Other Information</Form.Label>
                                <FormField id="otherInfo"
                                           className="form-control"
                                           type="text"
                                           name="otherInfo" 
                                           placeholder="No additional information available"
                                           value={values.otherInfo}
                                           onChange={handleChange} 
                                           error={touched.otherInfo && errors.otherInfo} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="pictures">Upload Pictures</Form.Label>
                                <Form.Control id="pictures"
                                              className="form-control"
                                              type="file"
                                              accept="image/*"
                                              multiple
                                              name="pictures" 
                                              onChange={handleChange} 
                                              error={touched.pictures && errors.pictures} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>
                    </div>

                    <h2 className="page-title">Owner Information</h2>
                    <div className="row mt-2 pb-3 border rounded">
                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="ownerName">Name</Form.Label>
                                <FormField id="ownerName"
                                           className="form-control"
                                           type="text"
                                           name="ownerName" 
                                           value={values.ownerName}
                                           onChange={handleChange} 
                                           error={touched.ownerName && errors.ownerName} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <FormField id="email"
                                           className="form-control"
                                           type="text"
                                           name="email" 
                                           placeholder="example@domain.com"
                                           value={values.email}
                                           onChange={handleChange} 
                                           error={touched.email && errors.email} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
                                <FormField id="phoneNumber"
                                           className="form-control"
                                           type="text"
                                           name="phoneNumber"
                                           placeholder="000-000-0000"
                                           value={values.phoneNumber}
                                           onChange={handleChange} 
                                           error={touched.phoneNumber && errors.phoneNumber} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>
                        
                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="location">Location</Form.Label>
                                <FormField id="location"
                                           className="form-control"
                                           type="text"
                                           name="location"
                                           placeholder="City, Country"
                                           value={values.location}
                                           onChange={handleChange} 
                                           error={touched.location && errors.location} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label htmlFor="ownerBirthday">Birthday</Form.Label>
                                <FormField id="ownerBirthday"
                                           className="form-control"
                                           type="date"
                                           name="ownerBirthday" 
                                           value={values.ownerBirthday}
                                           onChange={handleChange} 
                                           error={touched.ownerBirthday && errors.ownerBirthday} />
                                            {/* disabled={readOnly} /> */}
                            </Col>
                        </Row>


                    </div>
                    {/* onClick={create ? createHandler : } */}
                    <Row className="mt-4">
                        <Button className="mb-4"
                                variant="outline-primary" 
                                type="submit"
                                >Upload</Button>
                    </Row>
                </Form>
            )}
        </Formik>

    </div>
    </>
}

export default PetListingForm;