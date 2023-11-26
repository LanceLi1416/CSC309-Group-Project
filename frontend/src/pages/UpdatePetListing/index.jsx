

function updatePetListing() {
    const [ updateListingError, setUpdateListingError ] = useState(null);
    const navigate = useNavigate();
    const { listingID } = useParams();

    const submitHandler = (values) => {
        axios({
            method: "PUT",
            url: `http://localhost:8000/pet_listings/${listingID}`,
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
                "status": values.status
            }
        }).then((response) => {
            // TODO
        }).catch((error) => {
            setUpdateListingError(error.response.data.detail); // TODO
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
        owner_birthday: yup.string().required("Please enter the owner's birthday"),
        status: yup.string().required("Please indicate the pet listing's status")
    });

    return <>

    </>
}