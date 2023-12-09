import React from "react";
import {useNavigate} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import axios from "axios";

const CATEGORY_TO_DISPLAY = {
    "spam": "Spam",
    "sexually_explicit": "Sexually Explicit",
    "child_abuse": "Child Abuse",
    "violence": "Violence",
    "hate_speech": "Hate Speech",
    "harassment": "Harassment",
    "misinformation": "Misinformation",
    "other": "Other",
}

const STATUS_TO_DISPLAY = {
    "pending": "Pending", "processed": "Processed",
}

const STATUS_TO_COLOR = {
    "pending": "warning", "processed": "success",
}

const ACTION_TO_DISPLAY = {
    "null": "Not yet processed",
    "no_action_taken": "No action taken",
    "warning_issued": "A warning was issued",
    "banned": "The user was banned",
}

const ACTION_TO_COLOR = {
    "null": "primary", "no_action_taken": "secondary", "warning_issued": "warning", "banned": "danger",
}

export const ApplicationReportEntry = ({report, endpoint}) => {
    const navigate = useNavigate();

    if (report === null) return;

    // Event handlers --------------------------------------------------------------------------------------------------
    const handleProcessReport = (action) => {
        axios.put(process.env.REACT_APP_API_URL + endpoint + "reports/application_comments/" + report.id + "/", {
            action_taken: action,
        }, {
            headers: {
                'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(response => {
            // navigate("/admin/");
        }).catch(e => {
            console.log(e);
            if (e.response.status === 401) {
                navigate('/login');
            } else if (e.response.status === 403) {
                navigate('/403');
            }
        })
    };

    /* { "id": 1,   "reporter": 1,  "comment": 6,   "category": "violence", "other_info": "",   "status": "pending",
         "action_taken": "null",    "creation_date": "2023-12-01" } */
    console.log(report)
    return (<li key={`report${report.id}`} className="list-group-item">
        <h5 className="mb-3">Application Comment Report #{report.id}</h5>

        <div className="d-flex flex-row justify-content-between align-items-start">
            <div className="d-flex flex-column me-5 w-100">
                <div className="d-flex flex-row justify-content-between align-items-center flex-wrap">
                    <p>Reported by user <strong>#{report.reporter}</strong> on {report.creation_date}</p>
                    <p>Category: <strong>{CATEGORY_TO_DISPLAY[report.category]}</strong></p>
                    <p>Status: <strong
                        className={`text-${STATUS_TO_COLOR[report.status]}`}>{STATUS_TO_DISPLAY[report.status]}</strong>
                    </p>
                </div>
                <p>Other Information: {report.other_info}</p>
                <p>Action Taken: <strong className={`text-${ACTION_TO_COLOR[report.action_taken]}`}>
                    {ACTION_TO_DISPLAY[report.action_taken]}</strong></p>
            </div>

            {/* TODO: Revise the links */}
            <div className="d-flex flex-column align-items-center w-25">
            {/*    <button className="btn btn-primary w-100"*/}
            {/*            onClick={() => navigate(`/applications/${report.id}`)}>*/}
            {/*        View Application*/}
            {/*    </button>*/}

                <button className="btn btn-primary mt-2 w-100"
                        onClick={() => navigate(`/users?id=${report.reporter}`)}>
                    View Reporter
                </button>

                {/*  Drop down to take action  */}
                <Dropdown className="dropdown mt-2 w-100">
                    {endpoint === "moderation/" &&
                    <button className="btn btn-primary dropdown-toggle w-100" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false" disabled={report.status === "processed"}>
                        Process Report
                    </button>}
                    <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["no_action_taken"]}`}
                                    onClick={() => handleProcessReport("no_action_taken")}>
                                <strong>Take no action</strong>
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["warning_issued"]}`}
                                    onClick={() => handleProcessReport("warning_issued")}>
                                <strong>Issue a warning</strong>
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["banned"]}`}
                                    onClick={() => handleProcessReport("banned")}>
                                <strong>Ban the user</strong>
                            </button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>
    </li>);
}

export const ShelterCommentReportEntry = ({report, endpoint}) => {
    const navigate = useNavigate();

    if (report === null) return;

    // Event handlers --------------------------------------------------------------------------------------------------
    const handleProcessReport = (action) => {
        axios.put(process.env.REACT_APP_API_URL + endpoint + "reports/shelter_comments/" + report.id + "/", {
            action_taken: action,
        }, {
            headers: {
                'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(response => {
            // navigate("/admin/");
        }).catch(e => {
            console.log(e);
            if (e.response.status === 401) {
                navigate('/login');
            } else if (e.response.status === 403) {
                navigate('/403');
            }
        })
    };

    /* { "id": 1,   "reporter": 1,  "comment": 6,   "category": "violence", "other_info": "",   "status": "pending",
    "action_taken": "null",         "creation_date": "2023-12-01" } */
    return (<li key={report.id} className="list-group-item">
        <h5>Shelter Comment Report #{report.id}</h5>

        <div className="d-flex flex-row justify-content-between align-items-start">
            <div className="d-flex flex-column me-5 w-100">
                <div className="d-flex flex-row justify-content-between align-items-center flex-wrap">
                    <p>Reported by user <strong>#{report.reporter}</strong> on {report.creation_date}</p>
                    <p>Category: <strong>{CATEGORY_TO_DISPLAY[report.category]}</strong></p>
                    <p>Status: <strong
                        className={`text-${STATUS_TO_COLOR[report.status]}`}>{STATUS_TO_DISPLAY[report.status]}</strong>
                    </p>
                </div>
                <p>Other Information: {report.other_info}</p>
                <p>Action Taken: <strong className={`text-${ACTION_TO_COLOR[report.action_taken]}`}>
                    {ACTION_TO_DISPLAY[report.action_taken]}</strong></p>
            </div>

            {/* TODO: Revise the links */}
            <div className="d-flex flex-column align-items-center w-25">
                <button className="btn btn-primary w-100"
                        onClick={() => navigate(`/users/${report.id}`)}>
                    View Shelter
                </button>

                <button className="btn btn-primary mt-2 w-100"
                        onClick={() => navigate(`/profile/${report.reporter}`)}>
                    View Reported User
                </button>

                {/*  Drop down to take action  */}
                <Dropdown className="dropdown mt-2 w-100">
                    {endpoint === "moderation/" &&
                    <button className="btn btn-primary dropdown-toggle w-100" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false" disabled={report.status === "processed"}>
                        Process Report
                    </button>}
                    <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["no_action_taken"]}`}
                                    onClick={() => handleProcessReport("no_action_taken")}>
                                <strong>Take no action</strong>
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["warning_issued"]}`}
                                    onClick={() => handleProcessReport("warning_issued")}>
                                <strong>Issue a warning</strong>
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["banned"]}`}
                                    onClick={() => handleProcessReport("banned")}>
                                <strong>Ban the user</strong>
                            </button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>
    </li>);
}

export const PetListingReportEntry = ({report, endpoint}) => {
    const navigate = useNavigate();

    if (report === null) return;

    // Event handlers --------------------------------------------------------------------------------------------------
    const handleProcessReport = (action) => {
        axios.put(process.env.REACT_APP_API_URL + endpoint + "reports/pet_listings/" + report.id + "/", {
            action_taken: action,
        }, {
            headers: {
                'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(response => {
            // navigate("/admin/");
        }).catch(e => {
            console.log(e);
            if (e.response.status === 401) {
                navigate('/login');
            } else if (e.response.status === 403) {
                navigate('/403');
            }
        })
    };

    /* { "id": 1,   "reporter": 1,  "pet_listing": 1,   "category": "violence", "other_info": "violent image",
         "status": "pending",       "action_taken": "null",                     "creation_date": "2023-12-02" } */
    console.log(report)
    return (<li key={report.id} className="list-group-item">
        <h5>Pet Listing Report #{report.id}</h5>

        <div className="d-flex flex-row justify-content-between align-items-start">
            <div className="d-flex flex-column me-5 w-100">
                <div className="d-flex flex-row justify-content-between align-items-center flex-wrap">
                    <p>Reported by user <strong>#{report.reporter}</strong> on {report.creation_date}</p>
                    <p>Category: <strong>{CATEGORY_TO_DISPLAY[report.category]}</strong></p>
                    <p>Status: <strong
                        className={`text-${STATUS_TO_COLOR[report.status]}`}>{STATUS_TO_DISPLAY[report.status]}</strong>
                    </p>
                </div>
                <p>Other Information: {report.other_info}</p>
                <p>Action Taken: <strong className={`text-${ACTION_TO_COLOR[report.action_taken]}`}>
                    {ACTION_TO_DISPLAY[report.action_taken]}</strong></p>
            </div>

            {/* TODO: Revise the links */}
            <div className="d-flex flex-column align-items-center w-25">
                <button className="btn btn-primary w-100"
                        onClick={() => navigate(`/profile/${report.id}`)}>
                    View Pet Listing
                </button>

                <button className="btn btn-primary mt-2 w-100"
                        onClick={() => navigate(`/profile/${report.reporter}`)}>
                    View Reported Shelter
                </button>

                {/*  Drop down to take action  */}
                <Dropdown className="dropdown mt-2 w-100">
                    {endpoint === "moderation/" &&
                    <button className="btn btn-primary dropdown-toggle w-100" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown" aria-expanded="false" disabled={report.status === "processed"}>
                        Process Report
                    </button>}
                    <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["no_action_taken"]}`}
                                    onClick={() => handleProcessReport("no_action_taken")}>
                                <strong>Take no action</strong>
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["warning_issued"]}`}
                                    onClick={() => handleProcessReport("warning_issued")}>
                                <strong>Issue a warning</strong>
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item text-${ACTION_TO_COLOR["banned"]}`}
                                    onClick={() => handleProcessReport("banned")}>
                                <strong>Ban the user</strong>
                            </button>
                        </li>
                    </ul>
                </Dropdown>
            </div>
        </div>
    </li>);
}