import React from "react";
import {Link} from "react-router-dom";
import logo from '../../assets/images/petpal.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';


const Footer = () => {
    // Get the login token
    const token = localStorage.getItem('access_token');
    const isLoggedIn = !!token;

    let bgClass = "bg-primary";
    if (isLoggedIn) {
        // Check if the user is a pet shelter
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            if (user.is_seeker === false) bgClass = "bg-success";
        } catch (e) {
            // Do nothing
        }
    }

    return (<footer
        className={"d-flex flex-wrap justify-content-between align-items-center p-3 mt-4 fixed-bottom " + bgClass}>

        <div className="d-flex align-items-center">
            <Link to={"/"} className="me-2 text-light text-decoration-none">
                <img alt="Petpal Logo" className="logo invert" src={logo}/>
            </Link>
            <span className="text-light">© 2023 <Link to={"/"} className="text-light">PetPal</Link>
        </span>
        </div>

        {/* TODO: Social media integration */}
        <ul className="nav justify-content-end list-unstyled d-flex">
            <li className="ms-3"><a className="text-light" href="/"><i className="bi bi-twitter"></i></a></li>
            <li className="ms-3"><a className="text-light" href="/"><i className="bi bi-instagram"></i></a></li>
            <li className="ms-3"><a className="text-light" href="/"><i className="bi bi-facebook"></i></a></li>
            <li className="ms-3"><a className="text-light" href="/"><i className="bi bi-linkedin"></i></a></li>
            <li className="ms-3"><a className="text-light" href="/"><i className="bi bi-github"></i></a></li>
        </ul>
    </footer>);
}

export default Footer;