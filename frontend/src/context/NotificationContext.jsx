// NotificationContext.js
import React, {createContext, useContext, useState} from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => useContext(NotificationContext);

export const NotificationProvider = ({children}) => {
    const [notificationState, setNotificationState] = useState(false);

    const updateNotificationState = (newState) => {
        setNotificationState(newState);
    };

    return (<NotificationContext.Provider value={{notificationState, updateNotificationState: updateNotificationState}}>
        {children}
    </NotificationContext.Provider>);
};
