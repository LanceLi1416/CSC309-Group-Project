import ResponsiveSearchFilters from "../../components/ResponsiveSearchFilters";
import SearchFilters from "../../components/SearchFilters";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from 'axios';


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


function SearchResultsGrid() {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    // TODO: fill pet listings into the grid
    const [ filterParams, setFilterParams ] = useSearchParams();
    const [ totalPages, setTotalPages ] = useState(1);
    const [ petListings, setPetListings ] = useState([]);


    const query = useMemo(() => ({
        page : parseInt(filterParams.get("page") ?? 1),
        shelter : filterParams.getAll("shelter") ?? [],
        status : filterParams.getAll("status") ?? [],
        gender : filterParams.getAll("gender") ?? [],
        start_date : filterParams.get("start_date") ?? "",
        end_date: filterParams.get("end_date") ?? "",
        pet_type: filterParams.getAll("pet_type") ?? [],
        sort: filterParams.get("sort") ?? "name" // TODO: Add search pet name option
    }), [ filterParams ]);

    console.log(query);

    useEffect(() => {
        axios({
            method: "POST",
            url: `${API_URL}pet_listings/search_results/`,
            data: JSON.stringify(query),
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            setPetListings(response.data.results); // TODO
            console.log(response);
            setTotalPages(Math.ceil(response.data.count / 8));
        })
    }, [ filterParams ]);

    // useEffect(() => {
    //     const params = to_url_params(query);
    //     // need to post
    //     fetch(`${API_URL}?${params}`)
    //     .then(response => response.json())
    //     .then(json => {
    //         setPetListings(json.data);
    //         setTotalPages(json.meta.total_pages);
    //     });
    // }, [ query ]);

    return <>
    <ResponsiveSearchFilters />
    <SearchFilters setFilterParams={setFilterParams} />
    {/* Results Grid */}
    <div className="col-md-10 mx-4">
        <div className="row mx-2">
            {petListings.map((listing) => (
                <div className="col-md-3 d-flex align-items-center flex-column position-relative"
                     key={listing.id}>
                    <img className="img-fluid full-img px-2" src={listing.pictures} />
                    <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>{listing.pet_name}</h5></a>
                </div>
            ))}
            {/* <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 1" className="img-fluid full-img px-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 1</h5></a>
            </div>
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 2" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 2</h5></a>
            </div>
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 3" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 3</h5></a>
            </div>
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 4" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 4</h5></a>
            </div> */}
        </div>
        <div className="row mx-2">
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 5" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 5</h5></a>
            </div>
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 6" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 6</h5></a>
            </div>
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 7" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 7</h5></a>
            </div>
            <div className="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 8" className="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a className="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 8</h5></a>
            </div>
        </div>

        {/* Previous and Next Page */}
        <div className="d-flex justify-content-between mb-4">
            { query.page < totalPages
              ? <button onClick={() => setFilterParams({...query, page: query.page + 1})}>Next</button>
              : <></> }

            { query.page > 1
              ? <button onClick={() => setFilterParams({...query, page: query.page - 1})}>Previous</button>
              : <></> }


            <p>Page {query.page} out of {totalPages}</p>
            {/* <a class="btn btn-primary btn-md" href="">
                <i class="bi bi-arrow-left"></i>
            </a>
            <a class="btn btn-primary btn-md" href="">
                <i class="bi bi-arrow-right"></i>
            </a> */}
        </div>
    </div>
    </>
}

export default SearchResultsGrid;