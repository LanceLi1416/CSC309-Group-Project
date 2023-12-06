import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Comment, Form, Header } from 'semantic-ui-react'
import Rating from '@mui/material/Rating';
import CloseIcon from '@mui/icons-material/Close';
import ReportIcon from '@mui/icons-material/Report';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

function ShelterComment() {
    const { shelter_id } = useParams();
    const [comments, setComments] = useState([]);
    const [shelter, setShelter] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [starValue, setStarValue] = useState(5);
    const [replyTarget, setReplyTarget] = useState(null);
    const [reload, setReload] = useState(false);
    const url = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const page = useRef(1);
    const nextPageExists = useRef("");
    const prevDisabled = useRef(false);
    const nextDisabled = useRef(false);

    useEffect(() => {
        async function loadData() {
            try {
                const accessToken = localStorage.getItem('access_token');
                axios.defaults.headers.common['Authorization'] = "Bearer " + accessToken;
                const response = await axios.get(`${url}comments/shelter/` + shelter_id);
                const response2 = await axios.get(`${url}accounts/` + shelter_id);
                setShelter(response2.data);

                nextPageExists.current = response.data.next;
                
                if (response.data.next === null) {
                    nextDisabled.current = true;
                }
                if (page.current === 1) {
                    prevDisabled.current = true;
                }

                let all_comments = response.data.results;
                for (let i = 0; i < all_comments.length; i++) {
                    const response3 = await axios.get(`${url}accounts/comments/` + all_comments[i].commenter);
                    all_comments[i].commenter_info = response3.data;
                    if (all_comments[i].replies.length > 0) {
                        for (let j = 0; j < all_comments[i].replies.length; j++) {
                            const response4 = await axios.get(`${url}accounts/comments/` + all_comments[i].replies[j].commenter);
                            all_comments[i].replies[j].commenter_info = response4.data;
                        }
                    }
                }
                setComments(all_comments);
            } catch (error) {
                // TODO: If error code is 401, redirect to unauthorized page??
                // TODO: If error code is 404, redirect to not found page??
                // Not sure about how to handle these cases yet
            }
        }
        loadData();
    }, [shelter_id, reload]);

    function sendRequest() {
        let comment = document.getElementById("comment-box").value;
        setCommentError(null);
        const data = {
            "stars": starValue,
            "comment": comment
        }
        if (starValue === null || starValue === 0) {
            setCommentError("Please select a star rating");
            return;
        }
        if (replyTarget === null) {
            axios.post(`${url}comments/shelter/${shelter_id}/`, data)
            .then(() => {
                document.getElementById("comment-box").value = "";
                setStarValue(5);
                setReload(!reload);
            }).catch((error) => {
                if (error.response.data.comment) {
                    setCommentError(error.response.data.comment);
                }
            });
        } else {
            axios.post(`${url}comments/shelter/${shelter_id}/${replyTarget.id}/`, data)
            .then(() => {
                document.getElementById("comment-box").value = "";
                setStarValue(5);
                setReplyTarget(null);
                setReload(!reload);
            }).catch((error) => {
                if (error.response.data.comment) {
                    setCommentError(error.response.data.comment);
                }
            });
        }
    }

    function reportComment(comment_id) {
        // redirect to report form
        navigate(`/report/shelter/${shelter_id}/${comment_id}`);
    }

    async function prevPage() {
        nextDisabled.current = false;
        if (page.current === 1) {
            return;
        }
        page.current -= 1;
        if (page.current === 1) {
            prevDisabled.current = true;
        }
        try {
            const response = await axios.get(`${url}comments/shelter/` + shelter_id + `/?page=${page.current}`);
            nextPageExists.current = response.data.next;
            let all_comments = response.data.results;
            for (let i = 0; i < all_comments.length; i++) {
                const response3 = await axios.get(`${url}accounts/comments/` + all_comments[i].commenter);
                all_comments[i].commenter_info = response3.data;
                if (all_comments[i].replies.length > 0) {
                    for (let j = 0; j < all_comments[i].replies.length; j++) {
                        const response4 = await axios.get(`${url}accounts/comments/` + all_comments[i].replies[j].commenter);
                        all_comments[i].replies[j].commenter_info = response4.data;
                    }
                }
            }
            setComments(all_comments);
        } catch (error) {
            // TODO: If error code is 401, redirect to unauthorized page??
            // TODO: If error code is 404, redirect to not found page??
            // Not sure about how to handle these cases yet
        }
    }

    async function nextPage() {
        console.log(nextPageExists.current);
        prevDisabled.current = false;
        if (nextPageExists.current === null) {
            return;
        }
        page.current += 1;
        try {
            const response = await axios.get(`${url}comments/shelter/` + shelter_id + `/?page=${page.current}`);
            nextPageExists.current = response.data.next;
            if (nextPageExists.current === null) {
                nextDisabled.current = true;
            }
            let all_comments = response.data.results;
            for (let i = 0; i < all_comments.length; i++) {
                const response3 = await axios.get(`${url}accounts/comments/` + all_comments[i].commenter);
                all_comments[i].commenter_info = response3.data;
                if (all_comments[i].replies.length > 0) {
                    for (let j = 0; j < all_comments[i].replies.length; j++) {
                        const response4 = await axios.get(`${url}accounts/comments/` + all_comments[i].replies[j].commenter);
                        all_comments[i].replies[j].commenter_info = response4.data;
                    }
                }
            }
            setComments(all_comments);
        } catch (error) {

        }
    }

    return (
        <div id="comment-section">
            <Comment.Group className="comment-group">
            <Header className="heading-text" as='h3' dividing>
                <ArrowBackIcon id="back-button" onClick={() => {navigate(`/shelter/${shelter_id}`)}}/>
                Comments for Shelter - { shelter.first_name + " " + shelter.last_name}
            </Header>

            {comments.map((comment, index) => (
            <Comment key={index}>
                <Comment.Avatar src={comment.commenter_info.avatar} />
                <Comment.Content>
                <Comment.Author className="no-hover" as='a'>{comment.commenter_info.first_name} {comment.commenter_info.last_name}</Comment.Author>
                <Comment.Metadata>
                    <div>{new Date(comment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</div>
                </Comment.Metadata>
                <div className="comment-stars">
                    <Rating name="read-only" value={comment.stars} readOnly />
                </div>
                <Comment.Text>
                    <p>{comment.comment}</p>
                </Comment.Text>
                <Comment.Actions>
                    <Comment.Action onClick={() => setReplyTarget({
                        name: comment.commenter_info.first_name + " " + comment.commenter_info.last_name,
                        id: comment.id
                    })}>Reply</Comment.Action>
                    <ReportIcon fontSize="small" className="report-icon" onClick={() => reportComment(comment.id)}/>
                </Comment.Actions>
                </Comment.Content>
                {comment.replies.length > 0 && comment.replies.map((reply, index) => (
                <Comment.Group key={index}>
                    <Comment>
                    <Comment.Avatar src={reply.commenter_info.avatar} />
                    <Comment.Content>
                        <Comment.Author className="no-hover" as='a'>{reply.commenter_info.first_name} {reply.commenter_info.last_name}</Comment.Author>
                        <Comment.Metadata>
                        <div>{new Date(reply.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}</div>
                        </Comment.Metadata>
                        <Comment.Text>
                        <p>{reply.comment}</p>
                        </Comment.Text>
                        <Comment.Actions>
                            <Comment.Action onClick={() => setReplyTarget({
                                name: reply.commenter_info.first_name + " " + reply.commenter_info.last_name,
                                id: reply.id
                            })}>Reply</Comment.Action>
                            <ReportIcon fontSize="small" className="report-icon" onClick={() => reportComment(comment.id)}/>
                        </Comment.Actions>
                    </Comment.Content>
                    </Comment>
                </Comment.Group>
                ))}
            </Comment>))}
  
            <Form reply>
                <div className="review-text">Write a review!</div>
                {!replyTarget && <Rating
                name="simple-controlled"
                value={starValue}
                onChange={(event, newStarValue) => {
                    setStarValue(newStarValue);
                }}
                />}
                <Form.TextArea id="comment-box"/>
                <div id="submit-container">
                {
                replyTarget && (<div className="reply-container">
                    <div className="reply-text">Replying to {replyTarget.name}</div> 
                    <CloseIcon className="close-icon" onClick={() => setReplyTarget(null)} />
                    </div>
                    )
                }
                {commentError && <p className='error-text'>{commentError}</p>}
                <Button onClick={() => sendRequest()} content='Add Comment' labelPosition='left' icon='edit' primary />
                </div>
                </Form>
                <div className="button-div">
                    <Button disabled={prevDisabled.current} onClick={() => prevPage()}><ArrowCircleLeftIcon /></Button> 
                    <Button disabled={nextDisabled.current} onClick={() => nextPage()}><ArrowCircleRightIcon /></Button>
                </div>
            </Comment.Group>
        </div>
      );
}
export default ShelterComment;