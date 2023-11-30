import ResponsiveSearchFilters from "../../components/ResponsiveSearchFilters";
import SearchFilters from "../../components/SearchFilters";
import SearchResultsGrid from "../../components/SearchResultsGrid";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";


function to_url_params(object) {
    var result = [];
    for (const key in object) {
        if (Array.isArray(object[key])) {
            for (const value of object[key]) {
                result.push(`${key}[]=${value}`);
            }
        }
        else {
            let value = object[key];
            result.push(`${key}=${value}`);
        }
    }
    return result.join('&');
}


function SearchResults() {
    const navigate = useNavigate();
    const [ filterParams, setFilterParams ] = useSearchParams();
    const [ totalPages, setTotalPages ] = useState(1);
    const [ petListings, setPetListings ] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    const query = useMemo(() => ({
        page : parseInt(filterParams.get("page") ?? 1),
        shelter : filterParams.getAll("shelter") ?? [],
        status : filterParams.getAll("status") ?? [],
        gender : filterParams.getAll("gender") ?? [],
        start_date : filterParams.get("start_date") ?? null,
        end_date: filterParams.get("end_date") ?? null,
        pet_type: filterParams.getAll("pet_type") ?? [],
        sort: filterParams.get("sort") ?? "name" // TODO: Add search pet name option
    }), [ filterParams ]);

    useEffect(() => {
        const params = to_url_params(query);
        fetch(`${API_URL}?${params}`)
        .then(response => response.json())
        .then(json => {
            setPetListings(json.data);
            setTotalPages(json.meta.total_pages);
        });
    }, [ query ]);

    return <>
    <div class="d-flex flex-row justify-content-between mt-4">
        {/* Arrow and Text */}
        <div class="d-flex flex-row">
            <div class="d-flex justify-content-center align-items-center">
            <button className="btn" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i> Back
            </button>
            </div>
            <div class="mx-3">
                <h1 class="mt-4 mb-0">Search Results for "<span id="search-term"></span>"</h1>
                <p class="subtitle">103 Results</p>
            </div>
        </div>
        {/* Sorting */}
        <div class="d-flex flex-row justify-content-center align-items-center">
            <p class="m-0">Sort</p>
            <select aria-label="sort by select dropdown" class="form-select mx-2" id="sort">
                <option value="relevance" value="name">Name</option>
                <option value="newest" value="age">Age</option>
                <option value="oldest" value="size">Size</option>
            </select>
        </div>
    </div>

    <div class="d-flex flex-row mt-3">
        <ResponsiveSearchFilters />
        <SearchFilters />
        <SearchResultsGrid petListings={petListings} 
                           totalPages={totalPages}
                           setFilterParams={setFilterParams}
                           query={query}
        />
        
    </div>
    </>
}

export default SearchResults;