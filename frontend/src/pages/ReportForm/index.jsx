import React from 'react'
import { Form, Header } from 'semantic-ui-react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

function ReportForm() {
    const { shelter_id, comment_id } = useParams();
    const [category, setCategory] = React.useState("other");
    const [otherInfo, setOtherInfo] = React.useState(null);
    const url = "http://localhost:8000/";

    // if comment id exist, redirect to 404
    // if user is not authenticated to view page:
    //     redirect to login page
    useEffect(() => {
        async function validate() {
            try {
                const accessToken = localStorage.getItem('access_token');
                axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
                const shelter = await axios.get(`${url}accounts/` + shelter_id);
                if (shelter === null || shelter.is_shelter === false) {
                    // redirect to 404
                }
                const comment = await axios.get(`${url}comments/shelter/${shelter_id}/${comment_id}/`);
                if (comment === null) {
                    // redirect to 404
                }
            } catch (error) {
            }
        }
        validate();
    });

    function sendRequest() {
        const data = {
            "category": category,
            "other_info": otherInfo
        }
        // POST /comments/shelter/<int:shelter_id>/<int:comment_id>/report/
        axios.post(`${url}comments/shelter/${shelter_id}/${comment_id}/report/`, data)
    }

    return (
        <div className="report-container">
            <div className="rep-form-cont">
                <Header as='h3' dividing>
                Report Form for Comment
                </Header>
                <Form>
                    <Form.Group inline>
                        <label>Category</label>
                        <Form.Radio
                        label='Spam'
                        value='spam'
                        checked={category === 'spam'}
                        onChange={() => setCategory("spam")}
                        />
                        <Form.Radio
                        label='Sexually explicit'
                        value='sexually_explicit'
                        checked={category === 'sexually_explicit'}
                        onChange={() => setCategory("sexually_explicit")}
                        />
                        <Form.Radio
                        label='Violence'
                        value='violence'
                        checked={category === 'violence'}
                        onChange={() => setCategory("violence")}
                        />
                        <Form.Radio
                        label='Misinformation'
                        value='misinformation'
                        checked={category === 'misinformation'}
                        onChange={() => setCategory("misinformation")}
                        />
                        <Form.Radio
                        label='Other'
                        value='other'
                        checked={category === 'other'}
                        onChange={() => setCategory("other")}
                        />
                    </Form.Group>
                <Form.TextArea id="other-info" label='Other info' placeholder='Write any other information you want to report!' 
                onChange={() => setOtherInfo(document.getElementById("other-info").value)}/>
                <Form.Button onClick={() => sendRequest()}>Submit</Form.Button>
                </Form>
            </div>
        </div>
    )
}

export default ReportForm