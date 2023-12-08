import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchFilters from "../../components/SearchFilters";
import ResponsiveSearchFilters from "../../components/ResponsiveSearchFilters";
import axios from "axios";


const SearchResults = () => {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    // States ----------------------------------------------------------------------------------------------------------
    const [filters, setFilters] = useState({
        "shelter": [],
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
        console.log(filters);
        axios({
            method: "POST", url: `${API_URL}pet_listings/search_results/?page=${page}`,
            data: JSON.stringify(filters), headers: {
                "Authorization": "Bearer " + token, "Content-Type": "application/json"
            }
        }).then(response => {
            setResponse(response.data);
        })
    }, [filters, page, navigate]);

    // Event Handlers --------------------------------------------------------------------------------------------------
    const handleSortChange = (e) => {
        // Update the `filters` state with the new sort value
        setFilters({...filters, sort: e.target.value});
    };

    // Rendering Functions ---------------------------------------------------------------------------------------------
    const renderItem = (listing) => {
        return (<div className="col-md-3 d-flex align-items-center flex-column position-relative"
                     key={`Listing: ${listing.id}`}>
            <img className="img-fluid full-img px-2" alt={`${listing.id}`}
                 src={`${API_URL}${listing.pet_pictures[0].path.replace('/media/', 'media/pet_listing_pics/')}`}/>
            <a className="stretched-link text-decoration-none"
               onClick={() => navigate(`/pet_listings/details/${listing.id}`)}>
                <h5>{listing.pet_name}</h5>
            </a>
        </div>);
    }

    function renderRows() {
        const rows = [];
        // const lastRowItems = petListings.length % 4;

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
        <div className="d-flex flex-row justify-content-between mt-4">
            {/* Arrow and Text */}
            <div className="d-flex flex-row">
                <div className="d-flex justify-content-center align-items-center">
                    <button className="btn" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
                <div className="mx-3">
                    <h1 className="mt-4 mb-0">Search Results for "<span id="search-term"></span>"</h1>
                    <p className="subtitle">{response.count} Results</p>
                </div>
            </div>
            {/* Sorting */}
            <div className="d-flex flex-row justify-content-center align-items-center">
                <p className="m-0">Sort</p>
                <select aria-label="sort by select dropdown"
                        className="form-select mx-2"
                        id="sort"
                        defaultValue="name"
                        onChange={handleSortChange}>
                    <option value="name">Name</option>
                    <option value="weight">Size</option>
                </select>
            </div>
        </div>

        <div className="d-flex flex-row mt-3">
            <ResponsiveSearchFilters filters={filters} setFilters={setFilters}/>
            <SearchFilters filters={filters} setFilters={setFilters}/>
            {/* Results Grid */}
            <div className="col-md-10 mx-4">
                {renderRows()}

                {/* PAGINATION BEGIN --------------------------------------------------------------------------------*/}
                {response.count === 0 ? null : <div className="pagination-controls my-3 d-flex justify-content-center">
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
    </div>)

}

export default SearchResults;