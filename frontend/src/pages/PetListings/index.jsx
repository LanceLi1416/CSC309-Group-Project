import PetForm from "./PetForm";
import OwnerForm from "./OwnerForm";

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
    const [ newPetListing, setNewPetListing ] = useState({});
    const [ postData, setPostData ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

        }
    }, [ setPostData ]);

    return <>
        <div class="page-container">
            <h1>Upload a pet for adoption</h1>
            <p>Please fill in the form below with the pet and owner's details.</p>


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