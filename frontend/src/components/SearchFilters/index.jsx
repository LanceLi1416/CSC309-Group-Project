function SearchFilters() {
    return <>
    {/* Filter Options */}
    <div class="p-2 border full-height" id="filter">
        <h3 class="mb-4">Filters</h3>
        {/* Filter By Date */}
        <div class="mb-4 d-flex flex-column">
            <h5>Date Added</h5>
            <div>
                <label class="subtitle" for="start-date">From</label>
                <input class="form-control" id="start-date" placeholder="Start Date" type="date" />
            </div>
            <div>
                <label class="subtitle" for="end-date">To</label>
                <input class="form-control" id="end-date" placeholder="Start Date" type="date" />
            </div>
        </div>
        {/* Filter By Pet Type */}
        <div class="mb-4">
            <h5>Pet Type</h5>
            <div class="form-check">
                <input class="form-check-input" id="dog" name="pet-type" type="checkbox" value="dog" />
                <label for="dog">Dog</label><br />
                <input class="form-check-input" id="cat" name="pet-type" type="checkbox" value="cat" />
                <label for="cat">Cat</label><br />
                <input class="form-check-input" id="bird" name="pet-type" type="checkbox" value="bird" />
                <label for="bird">Bird</label><br />
                <input class="form-check-input" id="other" name="pet-type" type="checkbox" value="other" />
                <label for="other">Other</label>
            </div>
        </div>
        {/* Filter By Gender */}
        <div class="mb-4">
            <h5>Gender</h5>
            <div class="form-check">
                <input class="form-check-input" id="female" name="gender" type="checkbox" value="female" />
                <label for="female">Female</label><br />
                <input class="form-check-input" id="male" name="gender" type="checkbox" value="male" />
                <label for="male">Male</label><br />
            </div>
        </div>
        {/* Filter By Shelter */}
        <div class="mb-4">
            <h5>Shelter</h5>
            <div class="form-check">
                <input class="form-check-input" id="shelter-a" name="shelter" type="checkbox" value="1" />
                <label for="shelter-a">Shelter A</label><br />
                <input class="form-check-input" id="shelter-b" name="shelter" type="checkbox" value="2" />
                <label for="shelter-b">Shelter B</label><br />
            </div>
        </div>
        {/* Filter By Status */}
        <div class="mb-4">
            <h5>Status</h5>
            <div class="form-check">
                <input class="form-check-input" id="available" name="status" type="checkbox" value="available" />
                <label for="available">Available</label><br />
                <input class="form-check-input" id="adopted" name="status" type="checkbox" value="adopted" />
                <label for="adopted">Adopted</label><br />
                <input class="form-check-input" id="pending" name="status" type="checkbox" value="pending" />
                <label for="pending">Pending</label><br />
                <input class="form-check-input" id="withdrawn" name="status" type="checkbox" value="withdrawn" />
                <label for="withdrawn">Withdrawn</label><br />
            </div>
        </div>
        {/* Save Search */}
        <div class="mb-1">
            <button class="btn btn-outline-primary" type="submit">Save Search</button>
        </div>
    </div>
    </>
}

export default SearchFilters;