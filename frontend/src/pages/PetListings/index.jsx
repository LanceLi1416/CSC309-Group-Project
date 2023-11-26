import PetForm from "./PetForm";
import OwnerForm from "../../components/OwnerForm";

import * as formik from 'formik';
import * as yup from 'yup';
import axios from 'axios';

function petListingFormToSerializer(form) {
    return {
        pet_name: ,
        gender: ,
        pet_birthday: ,
        pet_weight: ,
        animal: ,
        breed: ,
        colour: ,
        vaccinated: ,
        pictures: ,
        owner_name: ,
        email: ,
        phone_number: ,
        location: ,
        owner_birthday: ,
        status: 
    }
}

function CreatePetListing() {
    const [ newPetListingError, setNewPetListingError ] = useState(null);
    const [ postData, setPostData ] = useState(false);

    const submitHandler = (values) => {
        axios({
            method: "POST",
            url: "http://localhost:8000/", // TODO:
            data: {
                "pet_name": values.pet_name,
                "gender": values.gender,
                "pet_birthday": values.pet_birthday,
                "pet_weight": values.pet_weight,
                "animal": values.pet_animal,
                "breed": values.pet_breed,
                "colour": values.colour,
                "vaccinated": values.vaccinated,
                "other_info": values.other_info,
                "pictures": values.pictures,
                "owner_name": values.owner_name,
                "email": values.email,
                "phone_number": values.phone_number,
                "location": values.location,
                "owner_birthday": values.owner_birthday,
            }
        }).then((response) => {
            // TODO:
        }).catch((error) => {
            setNewPetListingError(""); // TODO
        })
    }

    const { Formik } = formik;
    const schema = yup.object().shape({
        pet_name: yup.string().required("Please enter the pet's name"),
        gender: yup.string().required("Please indicate the pet's gender"),
        pet_birthday: yup.string().required("Please enter the pet's birthday"),
        pet_weight: yup.string().required("Please enter the pet's weight"),
        animal: yup.string().required("Please enter the type of animal"),
        breed: yup.string().required("Please enter the pet's breed"),
        colour: yup.string().required("Please enter the pet's colour"),
        vaccinated: yup.string().required("The pet must be vaccinated"),
        pictures: yup.string().required("Please upload at least 1 pet picture"),
        owner_name: yup.string().required("Please enter the owner's name"),
        email: yup.string().email("Invalid email").required("Please enter the owner's email"),
        phone_number: yup.string().required("Please enter the owner's phone number")
                                  .matches(/^\d{3}-\d{3}-\d{4}$/, "Invalid phone number"),
        location: yup.string().required("Please enter the owner's location"),
        owner_birthday: yup.string().required("Please enter the owner's birthday")
    })

    // useEffect(() => {
    //     const fetchData = async () => {

    //     }
    // }, [ setPostData ]);

    return <>
        <div class="page-container">
            <h1>Upload a pet for adoption</h1>
            <p>Please fill in the form below with the pet and owner's details.</p>

            <Formik
                validationSchema={schema}
                onSubmit={(values) => submitHandler(values)}
            >
                { ({handleSubmit, handleChange, values, touched, errors}) => (
                    <Form noValidate onSubmit={handleSubmit} className="needs-validation">
                         {/* TODO */}
                    </Form>
                )}
            </Formik>

            <form class="needs-validation" novalidate>
                <h2 class="page-title">Pet Information</h2>
                <PetForm />

                <h2 class="page-title">Owner Information</h2>
                <OwnerForm />

                <button class="btn btn-outline-success" type="submit"
                        onClick={() => {setPostData(true)}}>Upload</button>
            </form>
        </div>
    </>
}