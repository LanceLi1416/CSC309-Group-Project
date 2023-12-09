import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import * as yup from 'yup';
import * as formik from 'formik';
import FormField from '../../components/FormField';
import { Row, Dropdown, Button, Col, Form } from 'react-bootstrap';
import MultipleImagesUploadButton from '../../components/MultipleImagesUploadButton';

const STATUS_TO_COLOR = {
    "available": "success",
    "adopted": "danger",
    "pending": "warning",
    "withdrawn": "secondary"
};

function PetListingForm() {
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const { petListingID } = useParams();
    const [ originalPics, setOriginalPics ] = useState([]);
    let deletedPics = [];

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
        ownerBirthday: "",
        status: "",
    });
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
                    ownerName: response.data.owner_name,
                    email: response.data.email,
                    ownerPhone: response.data.owner_phone,
                    location: response.data.location,
                    ownerBirthday: response.data.owner_birthday,
                    status: response.data.status,
                });
                setOriginalPics(response.data.pictures);
                setCreate(false);
            })).catch((error) => {
                if (error.response.status === 404) {
                    // TODO: redirect to 404
                    navigate("/404");
                } else if (error.response.status === 401) {
                    navigate("/login"); // TODO: don't know if necessary
                } else if (error.response.status === 403) {
                    navigate("/403");
                }
            })
        }
    }, [ petListingID, token, API_URL, navigate ])
    
    const createHandler = (formData) => {
        axios({
            method: "POST",
            url: `${API_URL}pet_listings/`,
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "multipart/form-data"
            },
            data: formData
        }).then((response) => {
            navigate(0);
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 403) {
                navigate("/403"); // TODO: redirect to 403
            }
        });
    };

    function deleteListingPic(picID) {
        axios({
            method: "DELETE",
            url: `${API_URL}pet_listings/pictures/${petListingID}/${picID}/`,
            headers: {
                "Authorization": "Bearer " + token,
            },
        }).then((response) => {
            let tmp = curApplication.pictures.filter(key => key.id !== picID);
            setCurApplication({
                ...curApplication, 
                pictures: tmp
            });
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 403) {
                navigate("/403");
            } else if(error.response.status === 404) {
                navigate("/404");
            }
        });
    }

    const updateHandler = (formData) => {
        console.log("In update handler");
        for (var pic of deletedPics) {
            deleteListingPic(pic.id);
        }
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        axios({
            method: "PUT",
            url: `${API_URL}pet_listings/${petListingID}/`,
            headers: {
                "Authorization": "Bearer " + token,
                // "Content-Type": "multipart/form-data"
            },
            data: formData
        }).then((response) => {
            console.log(response);
            console.log("updated");
            // navigate(0);
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 403) {
                console.log(error.response.status); // TODO: redirect to 403
                navigate("/403");
            }
        });
    };

    const submitHandler = (values) => {
        console.log(values);
        const formData = new FormData();
        formData.append("pet_name", values.petName);
        formData.append("gender", values.gender);
        formData.append("pet_birthday", values.petBirthday);
        formData.append("pet_weight", values.petWeight);
        formData.append("animal", values.animal);
        formData.append("breed", values.breed);
        formData.append("colour", values.colour);
        formData.append("vaccinated", values.vaccinated);
        formData.append("other_info", values.otherInfo ?? "");
        formData.append("owner_name", values.ownerName);
        formData.append("email", values.email);
        formData.append("owner_phone", values.ownerPhone);
        formData.append("location", values.location);
        formData.append("owner_birthday", values.ownerBirthday);

        if (create || values.pictures !== undefined) {
            for (let i = 0; i < values.pictures.length; i++) {
                formData.append("pictures", values.pictures[i]);
            }
        }

        // if (!create) {
        //     console.log(originalPics);
        //     for (var i in originalPics) {
        //         console.log(originalPics[i]);
        //         formData.append("pictures", originalPics[i]);
        //     }
        // }
        
        if (create) {
            createHandler(formData);
        } else {
            formData.append("status", values.status);
            updateHandler(formData);
        }
    }

    const { Formik } = formik;
    const phoneRegEx = /^\d{3}-\d{3}-\d{4}$/;
    const locationRegEx = /^[a-zA-Z\s]+, [a-zA-z\s]+$/;
    let maxOwnerBirthday = new Date();
    maxOwnerBirthday.setFullYear(maxOwnerBirthday.getFullYear() - 18);

    let schema;
    if (create || originalPics.length === 0) {
        schema = yup.object().shape({
            petName: yup.string().required("Please enter the pet's name")
                        .max(50, "Pet name can only be a max of 50 characters"),
            gender: yup.string().required("Please indicate the pet's gender")
                       .oneOf(["male", "female"], "The gender is invalid"),
            petBirthday: yup.date().required("Please enter the pet's birthday")
                            .max(new Date(), "Please enter a valid birthday"),
            petWeight: yup.number().required("Please enter the pet's weight")
                          .min(0, "The given pet weight is invalid"),
            animal: yup.string().required("Please enter the type of animal")
                       .max(50, "Animal can only be a max of 50 characters"),
            breed: yup.string().required("Please enter the pet's breed")
                      .max(50, "Breed can only be a max of 50 characters"),
            colour: yup.string().required("Please enter the pet's colour")
                       .max(50, "Colour can only be a max of 50 characters"),
            vaccinated: yup.bool().oneOf([true], "The pet must be vaccinated"),
            pictures: yup.mixed()
                         .test('fileList', "Please upload at least 1 pet picture",
                             (value) => {
                                if (create) {
                                    return value && value.length > 0;
                                }
                                return true;
                             }
                         ).test('fileList', 'Only a max of 5 pictures can be uploaded',
                              (value) => {
                                    return value && 0 < value.length && value.length <= 5;
                              }
                         ).test('fileType', 'Invalid file type. Please upload .jpg and .png images only',
                            (value) => {
                                let i = 0;
                                for (var key in value) {
                                    if (i === value.length) {
                                        break;
                                    } else if (key === "length") {
                                        continue;
                                    }
                                    if (!['image/jpeg', 'image/png'].includes(value[key].type)) {
                                        return false;
                                    }
                                    i += 1;
                                }
                                return true;
                            }),
            otherInfo: yup.string().max(50, "Extra information can only be a max of 50 characters"),
            ownerName: yup.string().required("Please enter the owner's name")
                                   .max(50, "Owner name can only be a max of 50 characters"),
            email: yup.string().email("Invalid email").required("Please enter the owner's email")
                               .max(50, "Email can only be a max of 50 characters"),
            ownerPhone: yup.string().required("Please enter the owner's phone number")
                                    .matches(phoneRegEx, "Invalid phone number. Please use the format: 000-000-0000"),
            location: yup.string().required("Please enter the owner's location")
                         .max(50, "Location can only be a max of 50 characters")
                         .matches(locationRegEx, "Invalid location. Please use the format: City, Country"),
            ownerBirthday: yup.date().required("Please enter the owner's birthday")
                              .max(maxOwnerBirthday, "The owner must be at least 18 years old"),
            status: yup.string().oneOf(["available", "adopted", "pending", "withdrawn"], "Invalid status")
        });
    } else {
        schema = yup.object().shape({
            petName: yup.string().required("Please enter the pet's name")
                        .max(50, "Pet name can only be a max of 50 characters"),
            gender: yup.string().required("Please indicate the pet's gender")
                        .oneOf(["male", "female"], "The gender is invalid"),
            petBirthday: yup.date().required("Please enter the pet's birthday")
                            .max(new Date(), "Please enter a valid birthday"),
            petWeight: yup.number().required("Please enter the pet's weight")
                            .min(0, "The given pet weight is invalid"),
            animal: yup.string().required("Please enter the type of animal")
                        .max(50, "Animal can only be a max of 50 characters"),
            breed: yup.string().required("Please enter the pet's breed")
                        .max(50, "Breed can only be a max of 50 characters"),
            colour: yup.string().required("Please enter the pet's colour")
                        .max(50, "Colour can only be a max of 50 characters"),
            vaccinated: yup.bool().oneOf([true], "The pet must be vaccinated"),
            otherInfo: yup.string().max(50, "Extra information can only be a max of 50 characters"),
            ownerName: yup.string().required("Please enter the owner's name")
                                    .max(50, "Owner name can only be a max of 50 characters"),
            email: yup.string().email("Invalid email").required("Please enter the owner's email")
                                .max(50, "Email can only be a max of 50 characters"),
            ownerPhone: yup.string().required("Please enter the owner's phone number")
                                    .matches(phoneRegEx, "Invalid phone number. Please use the format: 000-000-0000"),
            location: yup.string().required("Please enter the owner's location")
                            .max(50, "Location can only be a max of 50 characters")
                            .matches(locationRegEx, "Invalid location. Please use the format: City, Country"),
            ownerBirthday: yup.date().required("Please enter the owner's birthday")
                                .max(maxOwnerBirthday, "The owner must be at least 18 years old"),
            status: yup.string().oneOf(["available", "adopted", "pending", "withdrawn"], "Invalid status")
        });
    }

    const handleFieldChange = (fieldName, value) => {
        setCurApplication(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    return (<div className="page-container">
        <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-column">
                <h1>Upload a pet for adoption</h1>
                <p>Please fill in the form below with the pet and owner's details.</p>
            </div>
            <div>
            {!create && 
            <Dropdown>
                <Dropdown.Toggle variant={STATUS_TO_COLOR[curApplication.status]} id="statusDropdown">
                    Status: {curApplication.status.charAt(0).toUpperCase() + curApplication.status.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleFieldChange('status', 'available')}>Available</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFieldChange('status', 'adopted')}>Adopted</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFieldChange('status', 'accepted')}>Pending</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFieldChange('status', 'accepted')}>Withdrawn</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>}
            </div>
        </div>

        <h2>Pet Information</h2>
        <Formik validationSchema={schema}
                onSubmit={submitHandler}
                initialValues={curApplication}
                enableReinitialize={true} 
        >
            {({ handleSubmit, handleChange, handleBlur, values, touched, errors }) => (
                <Form onSubmit={handleSubmit} noValidate encType="application/json">
                    <div className="row mt-2 pb-3 border rounded">
                        <Row className="d-flex flex-row mt-3">
                            <FormField id="petName" type="text"
                                        name="petName" placeholder="Pet Name"
                                        value={values.petName}
                                        handleChange={handleChange} 
                                        error={touched.petName && errors.petName} 
                                        label="Name" boldLabel={false}/>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Col className="form-group">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" id="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.gender && !!errors.gender}>
                                    <option value="">Choose...</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {touched.gender && errors.gender}
                                </Form.Control.Feedback>
                            </Col>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="petBirthday" type="date"
                                        name="petBirthday" 
                                        value={values.petBirthday}
                                        handleChange={handleChange} 
                                        error={touched.petBirthday && errors.petBirthday} 
                                        label="Birthday" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="petWeight"
                                        min="0"
                                        placeholder="0"
                                        type="number"
                                        name="petWeight" 
                                        handleChange={handleChange} 
                                        value={values.petWeight}
                                        error={touched.petWeight && errors.petWeight} 
                                        label="Weight" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="animal"
                                        type="text"
                                        name="animal" 
                                        handleChange={handleChange} 
                                        error={touched.animal && errors.animal} 
                                        value={values.animal}
                                        label="Animal" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="breed"
                                        className="form-control"
                                        type="text"
                                        name="breed" 
                                        handleChange={handleChange} 
                                        value={values.breed}
                                        error={touched.breed && errors.breed} 
                                        label="Breed" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="colour"
                                        type="text"
                                        name="colour"
                                        handleChange={handleChange} 
                                        value={values.colour}
                                        error={touched.colour && errors.colour} 
                                        label="Colour" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <Form.Group as={Col} md={12} controlId="vaccinated">
                                <Form.Check
                                    type="checkbox"
                                    label="Vaccinated"
                                    name="vaccinated"
                                    value="vaccinated"
                                    checked={values.vaccinated}
                                    onChange={handleChange}
                                    isInvalid={!!(touched.vaccinated && errors.vaccinated)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {touched.vaccinated && errors.vaccinated}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="otherInfo"
                                        type="text"
                                        name="otherInfo" 
                                        value={values.otherInfo}
                                        placeholder="No additional information available"
                                        handleChange={handleChange} 
                                        error={touched.otherInfo && errors.otherInfo} 
                                        label="Other Information" boldLabel={false} />
                        </Row>

                        {!create &&
                        <Row className="d-flex flex-row mt-3">
                            <label className="mb-3">Current Pictures</label>
                            {originalPics.length > 0 ? originalPics.map((delPic) => (
                                <div key={delPic.path}>
                                    <Button className="pic-delete" variant="outline-primary"
                                            onClick={() => {
                                                deletedPics.push(delPic)
                                                setOriginalPics(originalPics.filter(pic => pic.id !== delPic.id))}}>Delete</Button>
                                    <img className="d block mb-3 w-25" alt={delPic.path} src={`${API_URL}${delPic.path.replace('/media/', 'media/pet_listing_pics/')}`}/>
                                    <br />
                                </div>
                            )) : <i>No existing images</i>}
                        </Row>}

                        <Row className="d-flex flex-row mt-3">
                            <MultipleImagesUploadButton name="pictures" accept="image/*" placeholder="Upload Pictures" />
                            {/* <Col className="form-group">
                                <Form.Label htmlFor="pictures">Upload Pictures</Form.Label>
                                <Form.Control id="pictures"
                                              className="form-control"
                                              type="file"
                                              accept="image/*"
                                              multiple
                                              name="pictures" 
                                              onChange={handleChange} 
                                              error={touched.pictures && errors.pictures} />
                            </Col> */}
                        </Row>
                    </div>

                    <h2 className="page-title">Owner Information</h2>
                    <div className="row mt-2 pb-3 border rounded">
                        <Row className="d-flex flex-row mt-3">
                            <FormField id="ownerName" placeholder="Owner Name"
                                        type="text"
                                        name="ownerName" 
                                        value={values.ownerName}
                                        handleChange={handleChange} 
                                        error={touched.ownerName && errors.ownerName} 
                                        label="Name" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="email"
                                        type="text"
                                        name="email" 
                                        value={values.email}
                                        placeholder="example@domain.com"
                                        handleChange={handleChange} 
                                        error={touched.email && errors.email}
                                        label="Email" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="ownerPhone"
                                        type="text"
                                        name="ownerPhone"
                                        value={values.ownerPhone}
                                        placeholder="000-000-0000"
                                        handleChange={handleChange} 
                                        error={touched.ownerPhone && errors.ownerPhone} 
                                        label="Phone Number" boldLabel={false} />
                        </Row>
                        
                        <Row className="d-flex flex-row mt-3">
                            <FormField id="location"
                                        type="text"
                                        name="location"
                                        value={values.location}
                                        placeholder="City, Country"
                                        handleChange={handleChange} 
                                        error={touched.location && errors.location} 
                                        label="Location" boldLabel={false} />
                        </Row>

                        <Row className="d-flex flex-row mt-3">
                            <FormField id="ownerBirthday"
                                        type="date"
                                        name="ownerBirthday" 
                                        value={values.ownerBirthday}
                                        handleChange={handleChange} 
                                        error={touched.ownerBirthday && errors.ownerBirthday} 
                                        label="Birthday" boldLabel={false} />
                        </Row>
                    </div>
                    <Row className="mt-4"><Button variant="outline-primary" type="submit">{create ? "Upload" : "Update"}</Button></Row>
                </Form>
            )}
        </Formik>
    </div>);
}

export default PetListingForm;