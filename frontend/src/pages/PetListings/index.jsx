import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";

import PetListingFilters from "./PetListingFilters";
import axios from "axios";

const PetListings = () => {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // States ----------------------------------------------------------------------------------------------------------
    const [filters, setFilters] = useState({
        "shelter": [user.id],
        "status": [],
        "gender": [],
        "start_date": "1969-12-31",
        "end_date": "2099-12-31",
        "pet_type": [],
        "sort": "name"
    });
    const [response, setResponse] = useState([]);
    const [page, setPage] = useState(1);

    // Hooks -----------------------------------------------------------------------------------------------------------
    useEffect(() => {
        axios({
            method: "POST", url: `${API_URL}pet_listings/search_results/?page=${page}`,
            data: JSON.stringify(filters),
            headers: {
                "Authorization": "Bearer " + token, "Content-Type": "application/json"
            }
        }).then(response => {
            console.log(filters);
            console.log(response.data);
            setResponse(response.data);
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 404) {
                navigate("/404");
            }
        })
    }, [filters, page, navigate, token, API_URL]);

    // Rendering Functions ---------------------------------------------------------------------------------------------
    const renderItem = (listing) => {
        return (<div className="col-md-3 d-flex align-items-center flex-column position-relative"
                     key={`Listing: ${listing.id}`}>
            <img className="search-pics img-fluid full-img px-2" alt={`${listing.id}`}
                 src={`${API_URL}${listing.pet_pictures[0].path.replace('/media/', 'media/pet_listing_pics/')}`}/>
            <button className="stretched-link text-decoration-none btn text-primary"
                    onClick={() => navigate(`/pet_listing/${listing.id}`)}>
                <h5>{listing.pet_name}</h5>
            </button>
        </div>);
    }

    function renderRows() {
        const rows = [];

        for (let i = 0; i < response.count; i += 4) {
            const itemsRow = response.results.slice(i, i + 4);
            const row = (<div className="row mx-2" key={`Listing Render: ${i}`}>
                {itemsRow.map(renderItem)}
            </div>);
            rows.push(row);
        }
        return rows;
    }

    return (<div>
        {/* Back Arrow */}
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <div className="d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex flex-row">
                <div className="mx-3">
                    <h1 className="my-4">Manage your pet listings</h1>
                </div>
            </div>

            {/* Create New Listing Button */}
            <div className="d-flex flex-row h-50">
                {/* TODO: revise this link */}
                <button className="btn btn-success" onClick={() => navigate("/pet_listing/new")}>
                    Create New Listing
                </button>
            </div>
        </div>

        <div className="d-flex flex-row mt-3">
            <PetListingFilters filters={filters} setFilters={setFilters}/>

            {/* Results Grid */}
            <div className="col-md-10 mx-4">
                {renderRows()}

                {/* PAGINATION BEGIN --------------------------------------------------------------------------------*/}
                {response.count === 0 ?
                    <div className="pagination-controls my-3 d-flex justify-content-center">
                        <div className="m-1">
                            No results found.
                        </div>
                    </div>
                    :
                    <div className="pagination-controls my-3 d-flex justify-content-center">
                    {/* Previous Page */}
                    <button disabled={response.previous === null} className="btn btn-secondary m-1"
                            onClick={() => setPage(page - 1)}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    {/* Page Number */}
                    <div className="m-1">
                        Page {page} of {Math.ceil(response.count / 8)}
                    </div>
                    {/* Next Page */}
                    <button disabled={response.next === null} className="btn btn-secondary m-1"
                            onClick={() => setPage(page + 1)}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>}
                {/* PAGINATION END ----------------------------------------------------------------------------------*/}
            </div>

        </div>
    </div>);
}

export default PetListings;