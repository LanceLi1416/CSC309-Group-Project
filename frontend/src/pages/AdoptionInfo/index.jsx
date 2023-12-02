import { Col } from 'react-bootstrap';
import logo from '../../assets/images/petpal.svg';

function AdoptionInfo() {
    return (
        <Col className="mt-3 justify-content-center align-items-center">
			<h1 className="text-center">Pet Adoption Information</h1>
            <div className="info-cont">
			<p className="pet-info">In order to adopt a pet that you think you might be compatible with, first navigate to the desired listing 
                through the search bar. From there, you can see a variety of information about the pet, including a form 
                to begin the adoption process. Note that the adoption fees are decided by the pet owner, and may be negotiated
                through the chat system. Pet seekers can typically expect to pay anywhere from $50-$200 for adoption fees.
            </p>
            <p className="pet-info">After submitting an application, pet seekers can expect to wait anywhere from 1-2 weeks for a response
                from the pet owner. If the pet owner approves the application, the pet seeker will be notified and can then set up a time
                to meet the pet in person. If the pet owner rejects the application, the pet seeker will be notified and can continue their
                search for a pet.
            </p>
            <p className="pet-info">Note that all pet seekers must be logged in to submit an application, and that all applications are subject to
                approval by the pet owner. In addition, pet seekers must be at least 18 years old to adopt a pet. Happy searching!
            </p>
            <img src={logo} alt="pet adoption" className="img-fluid dog-img mb-4"/>
            </div>
		</Col>
    );
}

export default AdoptionInfo;