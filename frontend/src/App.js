import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "./components/Logo";

function App() {
    return (<div className="d-flex flex-column justify-content-center align-items-center">
        <div className="row mt-4 d-flex flex-column align-items-center">
            <div className="col text-center image-wrapper"><Logo/></div>
        </div>

        <h1 className="mt-4">We are PetPal!</h1>
        <p className="mt-2 w-50 text-center">
            We empower pet seekers to search for pets and apply for adoption and pet shelters to create listings for
            pets that are up for adoption.
            Read more about our adoption process and logistics <a href="/adopt">here</a>.
        </p>
        <p className="fw-bold w-50 text-center text-primary">Welcome to your one stop for helping more animals!</p>
    </div>);
}

export default App;
