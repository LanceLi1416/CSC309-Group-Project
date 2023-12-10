import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import logo from '../../assets/images/petpal.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Form from "react-bootstrap/Form";
import axios from "axios";
import generateNavigationLink from "../../utils/generateNavigationLink";
import {useNotificationContext} from "../../context/NotificationContext";
import './style.css';

export const Header = () => {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const access_token = localStorage.getItem('access_token');
    const isLoggedIn = !!access_token;
    const navigate = useNavigate();

    // States ----------------------------------------------------------------------------------------------------------
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);

    // Context ---------------------------------------------------------------------------------------------------------
    const {notificationState, updateNotificationState} = useNotificationContext();

    // Event handlers --------------------------------------------------------------------------------------------------
    function handleLogout() {
        // Remove user from local storage
        localStorage.removeItem('user');
        // Remove tokens from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Remove user from local storage
        localStorage.removeItem('user');
        // Redirect to login page, forcing a refresh
        window.location.href = "/login";
    }

    function handleNotificationClick(notification) {
        axios.put(`${BASE_URL}notifications/${notification.id}/`, {}, {
            headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }
        }).then(() => {
            // Update notification state
            updateNotificationState(!notificationState);
            // Redirect to related link
            const navigationLink = generateNavigationLink(notification);
            navigate(navigationLink);
        }).catch((error) => {
            console.log(error);
        });
    }

    function handleSearch() {
        const searchInput = document.getElementById("navbar-search-input").value;
        console.log(searchInput);
        navigate(`/search?`); // TODO: search page
    }


    // Initial fetch and setup -----------------------------------------------------------------------------------------
    useEffect(() => {
        // Check if the user is logged in
        if (!isLoggedIn) return;

        // Fetch notifications
        axios.get(`${BASE_URL}notifications/?is_read=False`, {
            headers: {
                'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then((response) => {
            setNotifications(response.data.results);
            setCount(response.data.count);
        }).catch((error) => {
            console.log(error);
        });
    }, [notificationState, BASE_URL, isLoggedIn]);

    let bgColour = "primary"
    if (isLoggedIn) {
        // Check if the user is a pet shelter
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user.is_seeker === false) bgColour = "success";
        } catch (e) {
            // Do nothing
        }
    }

    // Render ----------------------------------------------------------------------------------------------------------
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
                    {isLoggedIn ? (<>
                        {/* Notifications */}
                        <div className="dropdown">
                            <button aria-expanded="false" className={`btn btn-${bgColour} dropdown-toggle`}
                                    data-bs-toggle="dropdown" id="header-notif-dropdown" type="button">
                                <i className="bi bi-bell"></i>&nbsp;
                                {count === 0 ? "" : <span className="badge bg-danger rounded-pill">{count}</span>}
                            </button>

                            <ul aria-labelledby="header-notif-dropdown"
                                className={`dropdown-menu dropdown-menu-dark bg-${bgColour}`}>
                                {notifications.map((notification) => (<li key={notification.id}>
                                    <button className="dropdown-item"
                                            onClick={() => handleNotificationClick(notification)}>

                                        {notification.message}
                                    </button>
                                </li>))}

                                {count === 0 ? (<li>
                                    <button className="dropdown-item" disabled={true}>No unread notifications</button>
                                </li>) : ""}

                                <li>
                                    <hr className="dropdown-divider"/>
                                </li>

                                <li>
                                    <Link to="/notifications" className="dropdown-item">View All Notifications</Link>
                                </li>

                                <li>
                                    <button className="dropdown-item" disabled={count === 0} onClick={() => {
                                        axios.put(`${BASE_URL}notifications/`, {}, {
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                            }
                                        }).then(() => {
                                            // Update notification state
                                            updateNotificationState(!notificationState);
                                        }).catch(() => {
                                            navigate('/');
                                            handleLogout();
                                        });
                                    }}>Mark All as Read
                                    </button>
                                </li>
                            </ul>
                        </div>


                        <div className="dropdown">
                            <button className={`btn btn-${bgColour} dropdown-toggle`}
                                    data-bs-toggle="dropdown"
                                    type="button">
                                {(() => {
                                    try {
                                        return JSON.parse(localStorage.getItem('user')).first_name + " " + JSON.parse(localStorage.getItem('user')).last_name
                                    } catch (e) {
                                        return "Account" // This means something went wrong
                                    }
                                })()}
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-dark bg-${bgColour}`}>
                                <li><Link to="/profile" className="dropdown-item">View Profile</Link></li>
                                <li><Link to="/shelters" className="dropdown-item">Shelters</Link></li>
                                {(JSON.parse(localStorage.getItem('user')).is_superuser === true) ?
                                    <li><Link to="/admin" className="dropdown-item">Administrative</Link></li> :
                                    <>
                                        <li><Link to="/applications" className="dropdown-item">Applications</Link></li>
                                        {(JSON.parse(localStorage.getItem('user')).is_seeker === false) ?
                                            <li><Link to="/pet_listings" className="dropdown-item">Pet Listings</Link>
                                            </li> : <></>}
                                        <li><Link to="/admin" className="dropdown-item">Reports</Link></li>
                                    </>}
                                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    </>) : (<>
                        <Link to={"/login"} className="nav-link m-1 p-1">Log In</Link>
                        <Link to={"/register"} className="nav-link m-1 p-1">Register</Link>
                    </>)}

                    {/* Search Box */}
                    <Form className="d-flex ps-2" role="search">
                        <input className="form-control mx-2"
                               id="navbar-search-input"
                               placeholder="Search"
                               type="search"/>
                        <button onClick={handleSearch}
                                className="btn btn-outline-light mx-2 d-flex align-items-center"
                                type="button">
                            <i className="bi bi-search"></i>
                        </button>
                    </Form>
                </div>
            </div>
        </nav>
    </header>)

}

export default Header;