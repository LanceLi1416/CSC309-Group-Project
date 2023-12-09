function PetForm() {
    return <>
        <div class="row mt-2 pb-3 border rounded">
            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="pet-name">Name</label></div>
                    <div>
                        <input class="form-control" id="pet-name" name="pet-name" required type="text"/>
                        <div class="invalid-feedback">
                            Please enter the pet's name.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="pet-gender">Gender</label></div>
                    <div>
                        <select class="form-select" id="pet-gender" required>
                            <option value="" selected>Choose...</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                        </select>
                        <div class="invalid-feedback">
                            Please indicate the pet's gender.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="pet-birthday">Birthday</label></div>
                    <div>
                        <input class="form-control" id="pet-birthday" name="pet-birthday" required type="date"/>
                        <div class="invalid-feedback">
                            Please enter the pet's birthday.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="weight">Weight (kg)</label></div>
                    <div class="col-auto">
                        <div>
                            <input class="form-control"
                                   id="weight"
                                   max="1000"
                                   min="0"
                                   name="weight"
                                   placeholder="0"
                                   required
                                   type="number"/>
                            <div class="invalid-feedback">
                                Please enter the pet's weight.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="animal">Animal</label></div>
                    <div>
                        <input class="form-control" id="animal" name="animal" required type="text"/>
                        <div class="invalid-feedback">
                            Please enter the type of animal.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="breed">Breed</label></div>
                    <div>
                        <input class="form-control" id="breed" name="breed" required type="text"/>
                        <div class="invalid-feedback">
                            Please enter the pet's breed.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="colour">Colour(s)</label></div>
                    <div>
                        <input class="form-control" id="colour" name="colour" required type="text"/>
                        <div class="invalid-feedback">
                            Please enter the pet's colour(s).
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <label for="vaccinated">Vaccinated</label>
                    <div>
                        <input id="vaccinated" name="vaccinated" required type="checkbox" value="yes"/>
                        <div class="invalid-feedback">
                            The pet must be vaccinated.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="other-info">Other Information</label></div>
                    <div><textarea class="form-control" id="other-info" name="other-info" row="5"></textarea></div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label class="form-label" for="attachment">Upload Pictures</label></div>
                    <div>
                        <input accept=".jpg, .png, .jpeg"
                               class="form-control"
                               id="attachment"
                               multiple
                               name="attachments"
                               required
                               type="file"/>
                        <div class="invalid-feedback">
                            Please upload at least 1 pet picture.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default PetForm;