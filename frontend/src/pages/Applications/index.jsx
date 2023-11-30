import { useEffect, useState } from 'react';
import { Row, Accordion, Dropdown, Button, Col } from 'react-bootstrap';
import Heading from '../../components/Heading';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

const STATUS_TO_COLOR = {
    "accepted": "success",
    "denied": "danger",
    "pending": "warning",
    "withdrawn": "secondary"
};

const TIME_OPTION_TO_DISPLAY = {
    "creation_date": "Creation",
    "last_modified": "Last Modified",
    "": ""
};

// TODO: reload page after reqBody change (in case you were on page 2 and then you filter)
function Applications() {
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [reqBody, setReqBody] = useState({});
    const [applications, setApplications] = useState([]);
    const getApplications = (filters=[], sort="") => {
        var newReqBody = {};
        if (filters.length > 0) {
            newReqBody.filters = filters;
        }
        if (sort !== "") {
            newReqBody.sort = sort;
        }
        var reqUrl = API_URL + "applications/all/";
        if (page !== 1) {
            reqUrl += "?page=" + page;
        }
        setReqBody(newReqBody);

        axios({
            method: "POST",
            url: reqUrl,
            headers: {
                "Authorization": "Bearer " + token
            },
            data: newReqBody,
        }).then((response) => {
            setApplications(response.data.results);
            setHasNext(response.data.next !== null);
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        } 
        else {
            getApplications();
        }
    }, [token, page]);

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedSort, setSelectedSort] = useState("");
    const handleFilterToggle = (filter) => {
        const updatedFilters = [...selectedFilters];
        if (updatedFilters.includes(filter)) {
            // Filter is already selected, remove it
            const index = updatedFilters.indexOf(filter);
            updatedFilters.splice(index, 1);
        } else {
            // Filter is not selected, add it
            updatedFilters.push(filter);
        }

        setSelectedFilters(updatedFilters);
        getApplications(updatedFilters, selectedSort);
    };
    const handleSortChange = (sortOption) => {
        if(selectedSort === sortOption) {
            setSelectedSort("");
            getApplications(selectedFilters, "");
        }
        else {
            setSelectedSort(sortOption);
            getApplications(selectedFilters, sortOption);
        }
    };

    function Application({ application }) {
        const last_modified = new Date(application.last_modified);
        const [selectedStatus, setSelectedStatus] = useState("");
    
        const handleStatusChange = (statusOption) => {
            setSelectedStatus(statusOption);
            axios({
                method: "PUT",
                url: API_URL + "applications/",
                headers: {
                    "Authorization": "Bearer " + token
                },
                data: {
                    "id": application.id,
                    "status": statusOption
                }
            }).then((response) => {
                console.log(response.data);
                getApplications(selectedFilters, selectedSort);
            }).catch((error) => {
                if (error.response.status === 403) {
                    const formattedStatus = statusOption.charAt(0).toUpperCase() + statusOption.slice(1);
                    if (statusOption === application.status) {
                        alert("The status is already " + formattedStatus + ".");
                    }
                    else {
                        alert("You are not authorized to update the status to " + formattedStatus + ".");
                    }
                }
            });
        };
    
        // TODO: fix individual application styling display
        return (
            <Accordion.Item eventKey={application.id} className={"bg-" + STATUS_TO_COLOR[application.status]}>
                <Accordion.Header>[{application.status.toUpperCase()}] Application last modified on {last_modified.toLocaleDateString() + " " + last_modified.toLocaleTimeString()}</Accordion.Header>
                <Accordion.Body>
                    <Dropdown className="mb-2 d-flex flex-row justify-content-end">
                        <Dropdown.Toggle variant="primary" id="statusDropdown">
                            Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleStatusChange('accepted')}>Accepted</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange('denied')}>Denied</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange('pending')}>Pending</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange('withdrawn')}>Withdrawn</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </Accordion.Body>
            </Accordion.Item>
        );
    }

    const handlePrevPage = () => {
        if (page !== 1) {
            setPage(page - 1);
        }
    }
    const handleNextPage = () => {
        if (hasNext) {
            setPage(page + 1);
        }
    }

    // TODO: fix disabled button display
    return (<>
        <Row className="d-flex flex-row">
            <Heading header="Applications" subheader="View your applications here." />
            <Col className="d-flex flex-row justify-content-center justify-content-md-end">
                <Dropdown className="mx-3">
                    <Dropdown.Toggle variant="primary" id="filterDropdown">
                        Time Sort: {TIME_OPTION_TO_DISPLAY[selectedSort]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSortChange('creation_date')}>Creation</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSortChange('last_modified')}>Last Modified</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="ml-3">
                    <Dropdown.Toggle variant="primary" id="filterDropdown">
                        Filter by: {selectedFilters.length > 0 ? `${selectedFilters.length} selected` : ''}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ height: 'auto' }}>
                        <Button
                            variant={selectedFilters.includes('accepted') ? 'primary' : 'outline-primary'}
                            onClick={() => handleFilterToggle('accepted')}>Accepted
                        </Button>
                        <Button
                            variant={selectedFilters.includes('denied') ? 'primary' : 'outline-primary'}
                            onClick={() => handleFilterToggle('denied')}>Denied
                        </Button>
                        <Button
                            variant={selectedFilters.includes('pending') ? 'primary' : 'outline-primary'}
                            onClick={() => handleFilterToggle('pending')}>Pending
                        </Button>
                        <Button
                            variant={selectedFilters.includes('withdrawn') ? 'primary' : 'outline-primary'}
                            onClick={() => handleFilterToggle('withdrawn')}>Withdrawn
                        </Button>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>

        <Accordion>
            {(Array.isArray(applications) && applications.length > 0) ? 
                applications.map(application => {
                    return (
                        <Application application={application} key={application.id} />
                    );
                }) : 
                <p>No applications found.</p>
            }
        </Accordion>
        
        <div className="mt-4 d-flex flex-row justify-content-center">
            <Button className="mx-2" as={Col} md="6" onClick={handlePrevPage} disabled={page === 1}>Previous Page</Button>
            <Button className="ml-2" as={Col} md="6" onClick={handleNextPage} disabled={!hasNext}>Next Page</Button>
        </div>
    </>);
}

export default Applications;