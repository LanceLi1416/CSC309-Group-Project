import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';


function SearchFilters() {
    const token = localStorage.getItem('access_token');
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [ startDate, setStartDate ] = useState("");
    const [ endDate, setEndDate ] = useState("");
    const [ filterParams, setFilterParams] = useSearchParams();

    console.log(filterParams);

    const petTypes = [
        { id: "dog", value: "Dog",
          checked: 
            filterParams.status !== undefined && filterParams.status.includes("dog")
            ? true : false
        },
        { id: "cat", value: "Cat", 
          checked: filterParams.status !== undefined && filterParams.status.includes("cat")
          ? true : false
        },
        { id: "bird", value: "Bird",
          checked: filterParams.status !== undefined && filterParams.status.includes("bird")
          ? true : false
        },
        { id: "other", value: "Other",
          checked: filterParams.status !== undefined && filterParams.status.includes("other")
          ? true : false
        }

    ];
    // const [ dogCheckbox, setDogCheckbox ] = useState(false);
    // const [ catCheckbox, setCatCheckbox ] = useState(false);
    // const [ birdCheckbox, setBirdCheckbox ] = useState(false);
    // const [ otherCheckbox, setOtherCheckbox ] = useState(false);
    
    const genders = [
        { id: "male", value: "Male",
          checked: filterParams.gender !== undefined && filterParams.gender.includes("male")
          ? true : false
        },
        { id: "female", value: "Female", 
          checked: filterParams.gender !== undefined && filterParams.gender.includes("female")
          ? true : false
        }
    ];
    // const [ maleCheckbox, setMaleCheckbox ] = useState(false);
    // const [ femaleCheckbox, setFemaleCheckbox ] = useState(false);
    
    const [ shelters, setShelters ] = useState([]);

    console.log(1);
    let tmp = [];
    useEffect(() => {
        console.log(2);
        axios({
            method: "GET",
            url: `${API_URL}accounts/`,
            headers: {
                "Authorization": "Bearer " + token
            }
        }).then((response) => {
            for (var shelter of response.data) {
                tmp.push({
                    id: shelter.id,
                    value: shelter.first_name + " " + shelter.last_name,
                    checked: filterParams.shelter !== undefined && filterParams.shelter.includes(shelter.id)
                    ? true : false
                });
            }
            setShelters(tmp);
        }
        ).catch((error) => {
            // if (error.response.status === 401) {
            //     navigate("/login");
            // }
        })
    }, []);

    
    const statuses = [
        { id: "available", value: "Available",
          checked: filterParams.status !== undefined && filterParams.shelter.includes("available")
          ? true : false
        },
        { id: "adopted", value: "Adopted",
          checked: filterParams.shelter !== undefined && filterParams.shelter.includes("adopted")
          ? true : false
        },
        { id: "pending", value: "Pending",
          checked: filterParams.shelter !== undefined && filterParams.shelter.includes("pending")
          ? true : false
        },
        { id: "withdrawn", value: "Withdrawn",
          checked: filterParams.shelter !== undefined && filterParams.shelter.includes("withdrawn")
          ? true : false
        }

    ];
    // const [ availableCheckbox, setAvailableCheckbox ] = useState(false);
    // const [ adoptedCheckbox, setAdoptedCheckbox ] = useState(false);
    // const [ pendingCheckbox, setPendingCheckbox ] = useState(false);
    // const [ withdrawnCheckbox, setWithdrawnCheckbox ] = useState(false);

    
    // const [ filterParams, setFilterParams ] = useSearchParams();

    // const handleSetPetTypes = (id) => {
    //     setPetTypes(petTypes.map((elem) =>
    //                 elem.id === id ? {...elem, checked: !elem.checked} : elem));
    // }

    // const handleSetGenders = (id) => {
    //     setGenders(genders.map((elem) =>
    //                 elem.id === id ? {...elem, checked: !elem.checked} : elem));
    // }

    // const handleSetStatuses = (id) => {
    //     setStatuses(genders.map((elem) =>
    //                 elem.id === id ? {...elem, checked: !elem.checked} : elem));
    // }

    const handleSetPetTypes = (id) => {
        for (let i = 0; i < petTypes.length; i++) {
            if (petTypes[i].id === id) {
                petTypes[i].checked = !petTypes[i].checked;

                break;
            }
        }
    }

    const handleSetGenders = (id) => {
        for (let i = 0; i < genders.length; i++) {
            if (genders[i].id === id) {
                console.log(genders[i]);
                genders[i].checked = !genders[i].checked;
                console.log(genders[i]);
                break;
            }
        }
    }

    const handleSetStatuses = (id) => {
        for (let i = 0; i < statuses.length; i++) {
            if (statuses[i].id === id) {
                statuses[i].checked = !statuses[i].checked;
                break;
            }
        }
    }

    const toFilterParams = (lst) => {
        let filterLst = [];
        for (let i = 0; i < lst.length; i++) {
            if (lst[i].checked) {
                filterLst.push(lst[i].id);
            }
        }
        console.log("IDIIDEID");
        console.log(filterLst);
        return filterLst;
    }

    const query = useMemo(() => ({
        page : parseInt(filterParams.get("page") ?? 1),
        shelter : filterParams.getAll("shelter") ?? [],
        status : filterParams.getAll("status") ?? [],
        gender : filterParams.getAll("gender") ?? [],
        // start_date : filterParams.get("start_date" ?? ""),
        // end_date: filterParams.get("end_date" ?? ""),
        pet_type: filterParams.getAll("pet_type" ?? []),
    }), [ filterParams ]);

    return <>
    {/* Filter Options */}
    <div className="p-2 border full-height" id="filter">
        <h3 className="mb-4">Filters</h3>
        {/* Filter By Date */}
        <div className="mb-4 d-flex flex-column">
            <h5>Date Added</h5>
            <div>
                <label className="subtitle" htmlFor="start-date">From</label>
                <input className="form-control"
                       id="start-date"
                       placeholder="Start Date" 
                       type="date"
                       onChange={setStartDate} />
            </div>
            <div>
                <label className="subtitle" htmlFor="end-date">To</label>
                <input className="form-control"
                       id="end-date" 
                       placeholder="Start Date" 
                       type="date"
                       onChange={setEndDate} />
            </div>
        </div>
        {/* Filter By Pet Type */}
        <div className="mb-4">
            <h5>Pet Type</h5>

            <div className="form-check">
            {petTypes.map((type) => (
                <div key={`Types: ${type.id}`}>
                    <input className="form-check-input"
                           name="pet-type" 
                           id={type.id}
                           type="checkbox"
                           value={type.id} 
                           onChange={event => {
                            if (event.target.checked) {
                                setFilterParams({pet_type: [...query.pet_type, type.id]});
                            } else {
                                setFilterParams({pet_type: [...query.pet_type.filter(x => x !== type.id)]});
                            }
                           }} />
                        {/* onClick={() => handleSetPetTypes(type.id)} /> */}
                    <label htmlFor={type.id}>{type.value}</label><br />
                </div>
            ))}

            </div>

            {/* <div className="form-check">
                <input className="form-check-input"
                       id="dog"
                       name="pet-type" 
                       type="checkbox"
                       value="dog"
                       onChange={handleSetPetTypes(id, petTypes)} />
                <label htmlFor="dog">Dog</label><br />
                <input className="form-check-input"
                       id="cat"
                       name="pet-type"
                       type="checkbox"
                       value="cat"
                       onChange={setCatCheckbox(!catCheckbox)} />
                <label htmlFor="cat">Cat</label><br />
                <input className="form-check-input"
                       id="bird"
                       name="pet-type"
                       type="checkbox"
                       value="bird"
                       onChange={setBirdCheckbox(!birdCheckbox)} />
                <label htmlFor="bird">Bird</label><br />
                <input className="form-check-input"
                       id="other" 
                       name="pet-type" 
                       type="checkbox" 
                       value="other"
                       onChange={setOtherCheckbox(!otherCheckbox)} />
                <label htmlFor="other">Other</label>
        </div> */}
        </div>
        {/* Filter By Gender */}
        <div className="mb-4">
            <h5>Gender</h5>
            <div className="form-check">

                {genders.map((gender) => (
                <div key={`Gender: ${gender.id}`}>
                    <input className="form-check-input"
                           name="gender"
                           id={gender.id}
                           type="checkbox"
                           value={gender.id}
                           onClick={() => handleSetGenders(gender.id)} />
                    <label htmlFor={gender.id}>{gender.value}</label>
                </div>
                ))}

                {/* <input className="form-check-input" 
                       id="female"
                       name="gender"
                       type="checkbox" 
                       value="female"
                       onChange={setFemaleCheckbox(!femaleCheckbox)} />
                <label htmlFor="female">Female</label><br />
                <input className="form-check-input"
                       id="male" 
                       name="gender" 
                       type="checkbox" 
                       value="male"
                       onChange={setMaleCheckbox(!maleCheckbox)} />
                <label htmlFor="male">Male</label><br /> */}
            </div>
        </div>
        {/* Filter By Shelter */}
        <div className="mb-4">
            <h5>Shelter</h5>
            <div className="form-check">
                {/* {shelters.map((shelter) => (
                    <div key={`Shelter: ${shelter.id}`}>
                        <input className="form-check-input" id={shelter.id} name="shelter" type="checkbox" value={shelter.value} />
                        <label htmlFor={shelter.id}>{shelter.value}</label><br />
                    </div>
                ))} */}
            </div>
        </div>

        {/* Filter By Status */}
        <div className="mb-4">
            <h5>Status</h5>

            <div className="form-check">

                {statuses.map((status) => (
                    <div key={`Status: ${status.id}`}>
                    
                        <input className="form-check-input" 
                               name="status"
                               id={status.id}
                               type="checkbox"
                               value={status.id}
                               onClick={() => handleSetStatuses(status.id)} />
                        <label htmlFor={status.id}>{status.value}</label>

                    </div>
                ))}

            </div>

            {/* <div className="form-check"> */}
                {/* <input className="form-check-input"
                       id="available" 
                       name="status"
                       type="checkbox" 
                       value="available"
                       onChange={setAvailableCheckbox(!availableCheckbox)} />
                <label htmlFor="available">Available</label><br />
                <input className="form-check-input"
                       id="adopted" 
                       name="status" 
                       type="checkbox" 
                       value="adopted"
                       onChange={setAdoptedCheckbox(!adoptedCheckbox)} />
                <label htmlFor="adopted">Adopted</label><br />
                <input className="form-check-input" 
                       id="pending" 
                       name="status" 
                       type="checkbox" 
                       value="pending"
                       onChange={setPendingCheckbox(!pendingCheckbox)} />
                <label htmlFor="pending">Pending</label><br />
                <input className="form-check-input" 
                       id="withdrawn" 
                       name="status" 
                       type="checkbox" 
                       value="withdrawn"
                       onChange={setWithdrawnCheckbox(!withdrawnCheckbox)} />
                <label htmlFor="withdrawn">Withdrawn</label><br />
            </div> */}
        </div>
        {/* Save Search */}
        {/* <div className="mb-1">
            <button className="btn btn-outline-primary"
                    onClick={() => {
                        setFilterParams({
                            shelter: [],
                            status: toFilterParams(statuses),
                            gender: toFilterParams(genders),
                            start_date: startDate,
                            end_date: endDate,
                            pet_type: toFilterParams(petTypes)

                        })
                    }}>Save Search</button>
        </div> */}
    </div>
    </>
}

export default SearchFilters;