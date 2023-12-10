import { useEffect, useState } from 'react';
import { Row, Button, Col, ListGroup } from 'react-bootstrap';
import Heading from '../../components/Heading';
import { useNavigate } from "react-router-dom";
import axios from 'axios'

function Shelters() {
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [shelters, setShelters] = useState([]);

    useEffect(() => {
        if (token === null) {
            navigate("/login");
        } 
        else {
            var reqUrl = API_URL + "accounts/";
            if (page !== 1) {
                reqUrl += "?page=" + page;
                reqUrl += "&paginate=true";
            } else {
                reqUrl += "?paginate=true";
            }
            axios({
                method: "GET",
                url: reqUrl,
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((response) => {
                console.log(response.data);
                setShelters(response.data.results);
                setHasNext(response.data.next !== null);
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [token, API_URL, navigate, page]);

    return (<>
        <Row className="mt-3">
            <Heading header="Shelters" subheader="View all shelters here!" />
        </Row>

        <ListGroup>
            {(Array.isArray(shelters) && shelters.length > 0) ?
                shelters.map(shelter => {
                    return (<ListGroup.Item key={shelter.id}>
                        <div className="d-flex flex-row justify-content-between">
                            <div className="d-flex flex-row">
                                <img className="rounded-circle" src={API_URL + shelter.avatar.substring(1)} alt={shelter.first_name + " " + shelter.last_name} width="50" height="50"/>
                                <h4 className="ms-2 my-auto">{shelter.first_name} {shelter.last_name}</h4>
                            </div>
                            <Button className="mx-2" onClick={() => {navigate(`/shelter/${shelter.id}`)}}>View Profile</Button>
                        </div>
                    </ListGroup.Item>);
                }) :
                <p>No shelters found.</p>
            }
        </ListGroup>

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

export default Shelters;