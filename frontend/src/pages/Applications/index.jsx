import { useEffect, useState, useCallback } from 'react';
import { Row, Accordion, Dropdown, Button, Col } from 'react-bootstrap';
import Heading from '../../components/Heading';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import formatDateTimeString from '../../utils/formatDateTimeString';
import ApplicationForm from '../ApplicationForm';

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

function Applications() {
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [applications, setApplications] = useState([]);

    const getApplications = useCallback((filters=[], sort="", filtersUpdated=false) => {
        var newReqBody = {};
        if (filters.length > 0) {
            newReqBody.filters = filters;
        }
        if (sort !== "") {
            newReqBody.sort = sort;
        }
        var reqUrl = API_URL + "applications/all/";
        if (page !== 1 && !filtersUpdated) {
            reqUrl += "?page=" + page;
        }

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
    }, [API_URL, token, page]);

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        } 
        else {
            getApplications();
        }
    }, [token, page, navigate, getApplications]);

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedSort, setSelectedSort] = useState("");
    const handleFilterToggle = (filter) => {
        const updatedFilters = [...selectedFilters];
        var filtersUpdated = false;
        if (updatedFilters.includes(filter)) {
            // filter is already selected, remove it
            const index = updatedFilters.indexOf(filter);
            updatedFilters.splice(index, 1);
        } else {
            // filter is not selected, add it
            updatedFilters.push(filter);
            setPage(1);
            filtersUpdated = true;
        }

        setSelectedFilters(updatedFilters);
        getApplications(updatedFilters, selectedSort, filtersUpdated);
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
        const last_modified_string = formatDateTimeString(application.last_modified);    
        const handleStatusChange = (statusOption) => {
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
    
        return (
            <Accordion.Item eventKey={application.id}>
                <Accordion.Header>
                    <Dropdown className="mx-2 d-flex flex-row justify-content-end">
                        <Dropdown.Toggle variant={STATUS_TO_COLOR[application.status]} id="statusDropdown">
                            Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleStatusChange('accepted')}>Accepted</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange('denied')}>Denied</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange('pending')}>Pending</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange('withdrawn')}>Withdrawn</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    Application last modified on {last_modified_string}
                    <Button className="ms-3" onClick={() => {navigate(`/application/${application.id}/comments`)}}>
                        View Comments
                    </Button>
                </Accordion.Header>
                <Accordion.Body><ApplicationForm id={application.id}/></Accordion.Body>
            </Accordion.Item>
        );
    }

    return (<>
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        <Row className="mt-2 d-flex flex-row">
            <Heading header="Applications" subheader="View your applications here!" />
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
        
        <div className="mt-3 mb-4 d-flex flex-row justify-content-center">
            <Col md={6} className="mx-2 d-flex justify-content-end">
                <Button onClick={() => {setPage(page - 1);}} disabled={page === 1}>{'<'}</Button>
            </Col>
            <Col md={6} className="mx-2 d-flex justify-content-start">
                <Button onClick={() => {setPage(page + 1)}} disabled={!hasNext}>{'>'}</Button>
            </Col>
        </div>
    </>);
}

export default Applications;