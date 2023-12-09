// TODO: import form field

function OwnerForm() {
    return <>
        <div class="row mt-2 pb-3 border rounded">
            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="owner-name">Name</label></div>
                    <div>
                        <input class="form-control" id="owner-name" name="owner" required type="text"/>
                        <div class="invalid-feedback">
                            Please enter the owner's name.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="email">Email</label></div>
                    <div>
                        <input class="form-control" id="email" name="email" required type="email"/>
                        <div class="invalid-feedback">
                            Please enter the owner's email.
                        </div>
                    </div>
                    <!-- Pattern="[0-9]*" -->
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="phone">Phone</label></div>
                    <div>
                        <input class="form-control" id="phone" name="phone" required type="tel"/>
                        <div class="invalid-feedback">
                            Please enter the owner's phone number.
                        </div>
                    </div>
                    <!-- Pattern="[0-9]*" -->
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div><label for="location">Location</label></div>
                    <div>
                        <input class="form-control" id="location" name="location" required type="text"/>
                        <div class="invalid-feedback">
                            Please enter the owner's location.
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-row mt-3">
                <div class="col form-group">
                    <div>
                        <label for="owner-birthday">Birthday</label>
                    </div>
                    <div>
                        <input class="form-control" id="owner-birthday" name="owner-birthday" required type="date"/>
                        <div class="invalid-feedback">
                            Please enter the owner's birthday.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default OwnerForm;