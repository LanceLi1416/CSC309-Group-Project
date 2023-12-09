import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {ApplicationReportEntry, PetListingReportEntry, ShelterCommentReportEntry} from "./ReportEntry";

const TYPE_TO_URI = {
    "application": "reports/application_comments/",
    "shelter_comment": "reports/shelter_comments/",
    "pet_listing": "reports/pet_listings/",
};

export const Admin = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));

    const categories = ["spam", "sexually_explicit", "child_abuse", "violence", "hate_speech", "harassment", "misinformation", "other"];
    const statuses = ["processed", "pending"];

    // States ----------------------------------------------------------------------------------------------------------
    // const [type, setType] = useState('application');
    const [reports, setReports] = useState({count: 0, next: null, previous: null, results: [],});
    const [page, setPage] = useState(1);
    const [pathEndpoint, setPathEndpoint] = useState("moderation/")
    const [type, setType] = useState(() => {
        const savedType = localStorage.getItem('admin-filter-type');
        return savedType ? savedType : "application";
    });
    const [filters, setFilters] = useState(() => {
        const savedFilters = localStorage.getItem('filters');
        return savedFilters ? JSON.parse(savedFilters) : {category: [], status: [], most_recent: true};
    });

    // Hooks -----------------------------------------------------------------------------------------------------------
    useEffect(() => {
        localStorage.setItem('admin-filter-type', type);
    }, [type]);

    useEffect(() => {
        localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]);

    useEffect(() => {
        if (token === null) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const path = user.is_superuser ? API_URL + "moderation/" + TYPE_TO_URI[type] + `?page=${page}` : API_URL + "accounts/" + TYPE_TO_URI[type] + `?page=${page}`;
        user.is_superuser ? setPathEndpoint("moderation/") : setPathEndpoint("accounts/");
        axios.post(path, JSON.stringify(filters),
            {
                // filters + `?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json', Authorization: `Bearer ${token}`,
                }
            }).then(response => {
            setReports({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
                results: response.data.results,
            });
        }).catch(e => {
            if (e.response.status === 401) {
                navigate('/login');
            } else if (e.response.status === 403) {
                navigate('/403');
            } else {
                navigate('/')
            }
        });
    }, [type, filters, page, token, API_URL, navigate]);

    // Event handlers --------------------------------------------------------------------------------------------------
    const handleMultiSelectChange = (event, filterType) => {
        const value = event.target.value;
        let newValues;

        if (value === "selectAll") {
            newValues = filterType === 'category' ? [...categories] : [...statuses];
        } else if (value === "deselectAll") {
            newValues = [];
        } else {
            newValues = filters[filterType].includes(value) ? filters[filterType].filter(c => c !== value) : [...filters[filterType], value];
        }

        setFilters({...filters, [filterType]: newValues});
    };

    return (<div>
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <h1>{user.is_superuser ? 'Administrative' : 'Reports'}</h1>
        {/* Drop down to select category */}
        <div className="d-flex flex-column my-3">
            <h4>Type</h4>
            <select name="type" id="type" value={type} className="me-3 form-select w-100"
                    onChange={(e) => setType(e.target.value)}>
                <option value="application">Application Comment</option>
                <option value="shelter_comment">Shelter Comment</option>
                <option value="pet_listing">Pet Listing</option>
            </select>
        </div>

        <div className="d-flex flex-row justify-content-between align-items-center w-100">
            <div className="d-flex flex-column w-100">
                {/* Filters Section */}
                <div className="d-flex flex-column">
                    <h4>Filters</h4>
                    {/* Category Multi-Select Filter */}
                    <h5>Category</h5>
                    <div className="d-flex flex-row align-items-center justify-content-start flex-wrap w-100">
                        <button onClick={() => handleMultiSelectChange({target: {value: "selectAll"}}, 'category')}
                                className="btn btn-primary me-1 w-auto">
                            Select All
                        </button>
                        <button onClick={() => handleMultiSelectChange({target: {value: "deselectAll"}}, 'category')}
                                className="btn btn-primary me-3">
                            Deselect All
                        </button>
                        {categories.map((cat) => (<label key={cat} className="me-2">
                            <input type="checkbox" name="category" value={cat}
                                   checked={filters.category.includes(cat)}
                                   className="me-1"
                                   onChange={(e) => handleMultiSelectChange(e, 'category')}/>
                            {cat}
                        </label>))}
                    </div>

                    {/* Status Multi-Select Filter */}
                    <h5>Status</h5>
                    <div className="d-flex flex-row align-items-center justify-content-start w-100">
                        <button onClick={() => handleMultiSelectChange({target: {value: "selectAll"}}, 'status')}
                                className="btn btn-primary me-1">
                            Select All
                        </button>
                        <button onClick={() => handleMultiSelectChange({target: {value: "deselectAll"}}, 'status')}
                                className="btn btn-primary me-3">
                            Deselect All
                        </button>
                        {statuses.map((status) => (<label key={status} className="me-2">
                            <input type="checkbox" name="status" value={status}
                                   checked={filters.status.includes(status)}
                                   className="me-1"
                                   onChange={(e) => handleMultiSelectChange(e, 'status')}/>
                            {status}
                        </label>))}
                    </div>

                    {/* Most Recent Filter */}
                    <label className="mt-3">
                        Most Recent
                        <input type="checkbox" name="most_recent" checked={filters.most_recent} className="ms-1"
                               onChange={(e) => setFilters({...filters, most_recent: e.target.checked})}/>
                    </label>
                </div>

                {/* Reports List */}
                <div className="d-flex flex-column mt-3">
                    <h4>Reports</h4>
                    {reports.count === 0 ? <div className="alert alert-info">There are no reports to display.</div> :
                        <ul className="list-group">
                            {reports.results.map((report) => type === 'application' ?
                                <ApplicationReportEntry key={report.id} report={report}
                                                        endpoint={pathEndpoint}/> : type === 'shelter_comment' ?
                                    <ShelterCommentReportEntry key={report.id} report={report}
                                                               endpoint={pathEndpoint}/> :
                                    <PetListingReportEntry key={report.id} report={report} endpoint={pathEndpoint}/>)}
                        </ul>}

                    {/* Pagination Controls */}
                    {reports.count === 0 ? null :
                        <div className="pagination-controls my-3 d-flex justify-content-center">
                            {/* Previous Page */}
                            <button disabled={reports.previous === null} className="btn btn-secondary m-1"
                                    onClick={() => setPage(page - 1)}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            {/* Page Number */}
                            <div className="m-1">
                                Page {page} of {Math.ceil(reports.count / 10)}
                            </div>
                            {/* Next Page */}
                            <button disabled={reports.next === null} className="btn btn-secondary m-1"
                                    onClick={() => setPage(page + 1)}>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>}
                </div>
            </div>
        </div>
    </div>)
}

export default Admin;