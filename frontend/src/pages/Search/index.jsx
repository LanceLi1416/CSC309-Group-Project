import SearchResultsGrid from "../../components/SearchResultsGrid";
import { Link, useNavigate } from "react-router-dom";


function SearchResults() {
    const navigate = useNavigate();

    return <>
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
                <p className="subtitle">103 Results</p>
            </div>
        </div>
        {/* Sorting */}
        <div className="d-flex flex-row justify-content-center align-items-center">
            <p className="m-0">Sort</p>
            <select aria-label="sort by select dropdown" className="form-select mx-2" id="sort">
                <option value="relevance" value="name">Name</option>
                <option value="newest" value="age">Age</option>
                <option value="oldest" value="size">Size</option>
            </select>
        </div>
    </div>

    <div className="d-flex flex-row mt-3">
        <SearchResultsGrid />
    </div>
    </>
}

export default SearchResults;