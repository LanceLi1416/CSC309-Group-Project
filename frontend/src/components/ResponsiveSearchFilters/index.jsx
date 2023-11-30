function ResponsiveSearchFilters() {
    return <>
    {/* Filter Options Dropdown Button, For Smaller Screens */}
    <div className="row" id="filter-toggle">
        <button className="btn btn-outline-primary" id="filter-toggle-button">Show Filters</button>
        <div className="p-2 border full-height" id="filter-small">
            {/* Filter By Date */}
            <div className="mb-4 d-flex flex-column">
                <h5>Date Added</h5>
                <div>
                    <label className="subtitle" for="start-date">From</label>
                    <input className="form-control" id="start-date" placeholder="Start Date" type="date" />
                </div>
                <div>
                    <label className="subtitle" for="end-date">To</label>
                    <input className="form-control" id="end-date" placeholder="Start Date" type="date" />
                </div>
            </div>
            {/* Filter By Pet Type */}
            <div className="mb-4">
                <h5>Pet Type</h5>
                <div className="form-check">
                    <input className="form-check-input" id="dog" name="pet-type" type="checkbox" value="dog" />
                    <label for="dog">Dog</label><br />
                    <input className="form-check-input" id="cat" name="pet-type" type="checkbox" value="cat" />
                    <label for="cat">Cat</label><br />
                    <input className="form-check-input" id="bird" name="pet-type" type="checkbox" value="bird" />
                    <label for="bird">Bird</label><br />
                    <input className="form-check-input" id="other" name="pet-type" type="checkbox" value="other" />
                    <label for="other">Other</label>
                </div>
            </div>
            {/* Filter By Gender */}
            <div className="mb-4">
                <h5>Gender</h5>
                <div className="form-check">
                    <input className="form-check-input" id="female" name="gender" type="checkbox" value="female" />
                    <label for="female">Female</label><br />
                    <input className="form-check-input" id="male" name="gender" type="checkbox" value="male" />
                    <label for="male">Male</label><br />
                </div>
            </div>
            {/* Filter By Shelter */}
            <div className="mb-4">
                <h5>Shelter</h5>
                <div className="form-check">
                    <input className="form-check-input" id="shelter-a" name="shelter" type="checkbox" value="shelter-a" />
                    <label for="shelter-a">Shelter A</label><br />
                    <input className="form-check-input" id="shelter-b" name="shelter" type="checkbox" value="shelter-b" />
                    <label for="shelter-b">Shelter B</label><br />
                </div>
            </div>
            {/* Filter By Status */}
            <div className="mb-4">
                <h5>Status</h5>
                <div className="form-check">
                    <input className="form-check-input" id="available" name="status" type="checkbox" value="available" />
                    <label for="available">Available</label><br />
                    <input className="form-check-input" id="adopted" name="status" type="checkbox" value="adopted" />
                    <label for="adopted">Adopted</label><br />
                    <input className="form-check-input" id="pending" name="status" type="checkbox" value="pending" />
                    <label for="pending">Pending</label><br />
                    <input className="form-check-input" id="withdrawn" name="status" type="checkbox" value="withdrawn" />
                    <label for="withdrawn">Withdrawn</label><br />
                </div>
            </div>
            {/* Save Search */}
            <div className="mb-1">
                <button className="btn btn-outline-primary" type="submit">Save Search</button>
            </div>
        </div>
    </div>
    </>
}

export default ResponsiveSearchFilters;