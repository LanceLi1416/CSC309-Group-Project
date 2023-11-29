import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import logo from '../../assets/images/petpal.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Form from "react-bootstrap/Form";
import axios from "axios";

export const Header = () => {
    const access_token = localStorage.getItem('access_token');
    const isLoggedIn = !!access_token;
    const BASE_URL = process.env.REACT_APP_API_URL;

    const [notifications, setNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // TODO: pagination

    useEffect(() => {
        axios.get(BASE_URL + `notifications?page=${currentPage}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then((response) => {
            setNotifications(response.data.results);
        }).catch((error) => {
            console.log(error);
        });
    }, [currentPage]);


    function handleLogout() {
        // Remove user from local storage
        localStorage.removeItem('user');
        // Remove tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Redirect to login page, forcing a refresh
        window.location.href = "/login";
    }

    let bgColour = "primary"
    if (isLoggedIn) {
        // Check if the user is a pet shelter
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.is_seeker === false) bgColour = "success";
    }

    return (<header>
            <nav className={`navbar navbar-expand-lg bg-${bgColour} fixed-top`}>
                <div className="container-fluid">
                    {/* Logo and Name */}
                    <Link to={"/"} className="navbar-brand text-light">
                        <img alt="PetPal Logo"
                             className="d-inline-block align-text-top me-2"
                             src={logo}
                             width="30px"/>
                        PetPal
                    </Link>
                    {/* Expand Button For Smaller Screen -- DO NOT MODIFY UNLESS YOU KNOW WHAT YOU ARE DOING */}
                    <button aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            className="navbar-toggler"
                            data-bs-target="#navbarSupportedContent"
                            data-bs-toggle="collapse"
                            type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Major Contents */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {/* Left */}
                        <div className="me-auto mb-2 mb-lg-0">
                            {/* Add components later as needed */}
                        </div>

                        {/* Right */}
                        <div className="dropdown"> {/* Notifications */}
                            <button aria-expanded="false"
                                    className={`btn btn-${bgColour} dropdown-toggle`}
                                    data-bs-toggle="dropdown"
                                    id="header-notif-dropdown"
                                    type="button">
                                Notifications
                            </button>
                            <ul aria-labelledby="header-notif-dropdown"
                                className={`dropdown-menu dropdown-menu-dark bg-${bgColour}`}>
                                {notifications.map((notification) => (
                                    <li key={notification.id}>
                                        <Link to={`${notification.related_link}`}
                                              className="dropdown-item">
                                            {notification.message}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {!isLoggedIn && (
                            <>
                                <Link to={"/login"} className="nav-link m-1 p-1">Log In</Link>
                                <Link to={"/register"} className="nav-link m-1 p-1">Register</Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <div className="dropdown">
                                <button className={`btn btn-${bgColour} dropdown-toggle`}
                                        data-bs-toggle="dropdown"
                                        type="button">
                                    User
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-dark bg-${bgColour}`}>
                                    <li><Link to="/profile" className="dropdown-item">View Profile</Link></li>
                                    <li><Link to="/manage-properties" className="dropdown-item">Manage
                                        Properties</Link>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Search Box */}
                        <Form className="d-flex ps-2" role="search">
                            <input aria-label="Search"
                                   className="form-control mx-2"
                                   id="search-input"
                                   placeholder="Search"
                                   type="search"/>
                            <Link to={"/search"} className="btn btn-outline-light mx-2" id="search-link"
                                  role="button"
                                  type="submit">Search</Link>
                        </Form>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;