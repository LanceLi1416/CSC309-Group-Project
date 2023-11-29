import React, {useEffect, useState} from "react";
import generateNavigationLink from "../../utils/generateNavigationLink";
import formatDateTimeString from "../../utils/formatDateTimeString";
import {useNotificationContext} from "../../context/NotificationContext";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const NotificationsPage = () => {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    // States ----------------------------------------------------------------------------------------------------------
    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState({
        page: 1, filter: 'unread',
    });

    // Context ---------------------------------------------------------------------------------------------------------
    const {notificationState, updateNotificationState} = useNotificationContext();

    // Event handlers --------------------------------------------------------------------------------------------------
    function handleNotificationClick(notification) {
        const navigationLink = generateNavigationLink(notification);
        const is_read = notification.is_read;

        if (is_read === true) {
            console.log("Notification is already read");
            return;
        }

        // Mark notification as read
        axios.put(`${BASE_URL}/notifications/${notification.id}/`, {}, {
            headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }
        }).then((response) => {
            // Update notification state
            updateNotificationState(!notificationState);
            // Redirect to related link
            navigate(navigationLink);
        }).catch((error) => {
            console.log(error);
        });
    }

    // Initial fetch and setup -----------------------------------------------------------------------------------------
    useEffect(() => {
        const isReadParam = query.filter === 'unread' ? 'is_read=False&' : query.filter === 'read' ? 'is_read=True&' : '';
        const url = `${BASE_URL}/notifications?${isReadParam}page=${query.page}`;
        // Fetch notifications
        axios.get(url, {
            headers: {
                "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }
        }).then((response) => {
            setNotifications([...response.data.results]);
            setCount(response.data.count);
            setHasMore(response.data.next !== null)
        }).catch((error) => {
            console.log(error);
        });
    }, [query, notificationState]);

    const maxPage = Math.ceil(count / 15);
    return (<div>
        {/* Back Arrow */}
        <button className="btn" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i> Back
        </button>

        {/* Title */}
        <div className="d-flex justify-content-between align-items-center">
            {/* Display Total Number of Notifications */}
            {<h1>You
                have {count} {query.filter === 'unread' ? 'unread' : query.filter === 'read' ? 'read' : ''} {count === 1 ? 'notification' : 'notifications'}</h1>}

            {/* Dropdown for Filter */}
            <div className="my-3">
                <select value={query.filter} onChange={(e) => setQuery({page: 1, filter: e.target.value})}>
                    <option value="unread">Show unread notifications</option>
                    <option value="read">Show read notifications</option>
                    <option value="all">Show all notifications</option>
                </select>
            </div>
        </div>

        {/* Notification List */}
        <ul className="list-group my-3">
            {notifications.map((n) => (<li key={n.id} className="list-group-item list-group-item-action"
                                           onClick={() => handleNotificationClick(n)}>
                {/* Icon */}
                {n.is_read ? <i className="bi bi-envelope-open"></i> : <i className="bi bi-envelope-fill"></i>}
                &nbsp;
                {/* Time */}
                {formatDateTimeString(n.c_time)}
                &nbsp;
                {/* Message */}
                {n.message}
            </li>))}
        </ul>

        {/* Pagination Controls */}
        <div className="pagination-controls my-3 d-flex justify-content-center">
            {/* Previous Page */}
            <button onClick={() => setQuery({...query, page: query.page - 1})} disabled={query.page === 1}
                    className="btn btn-secondary m-1">
                <i className="bi bi-chevron-left"></i>
            </button>
            {/* Page Number */}
            <div className="m-1">
                Page
                <input onChange={(e) => {
                    if (e.target.value > 0 && e.target.value <= Math.ceil(count / 15)) {
                        setQuery({...query, page: parseInt(e.target.value)})
                    } else {
                        e.target.value = query.page.toString()
                    }
                }} type="number" min="1" max={Math.ceil(count / 15)} value={query.page} className="m-1 rounded"/>
                of {Math.ceil(count / 15)}
            </div>
            {/* Next Page */}
            <button onClick={() => setQuery({...query, page: query.page + 1})} disabled={!hasMore}
                    className="btn btn-secondary m-1">
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    </div>);
}

export default NotificationsPage;