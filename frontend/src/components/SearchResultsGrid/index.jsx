function SearchResultsGrid(pet_listings) {
    // TODO: fill pet listings into the grid

    return <>
    {/* Results Grid */}
    <div class="col-md-10 mx-4">
        <div class="row mx-2">
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 1" class="img-fluid full-img px-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 1</h5></a>
            </div>
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 2" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 2</h5></a>
            </div>
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 3" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 3</h5></a>
            </div>
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 4" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 4</h5></a>
            </div>
        </div>
        <div class="row mx-2">
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 5" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 5</h5></a>
            </div>
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 6" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 6</h5></a>
            </div>
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 7" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 7</h5></a>
            </div>
            <div class="col-md-3 d-flex align-items-center flex-column position-relative">
                <img alt="Image 8" class="img-fluid full-img p-2" src="../petpal/static/media/svgs/petpal.svg" />
                <a class="stretched-link text-decoration-none" href="pet-detail.html"><h5>Pet 8</h5></a>
            </div>
        </div>

        {/* Previous and Next Page */}
        <div class="d-flex justify-content-between mb-4">
            <a class="btn btn-primary btn-md" href="">
                <i class="bi bi-arrow-left"></i>
            </a>
            <a class="btn btn-primary btn-md" href="">
                <i class="bi bi-arrow-right"></i>
            </a>
        </div>
    </div>
    </>
}

export default SearchResultsGrid;