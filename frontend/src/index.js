import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './App';
import Header from "./components/Header";
import Footer from "./components/Footer";
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Applications from './pages/Applications';
import ApplicationForm from './pages/ApplicationForm';
import './index.css';
import Notifications from "./pages/Notifications";
import {NotificationProvider} from "./context/NotificationContext";
import Profile from './pages/Profile';
import AdoptionInfo from './pages/AdoptionInfo';

import Unauthorized from "./pages/401_Unauthorized";
import Forbidden from "./pages/403_Forbidden";
import NotFound from "./pages/404_NotFound";

import Admin from "./pages/Admin";
import Users from "./pages/Users";

export default function App() {
    return (<NotificationProvider>
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/notifications" element={<Notifications/>}/>
                <Route exact path="/applications" element={<Applications/>}/>
                <Route exact path="/application/new" element={<ApplicationForm id="new"/>}/>
                <Route exact path="/profile" element={<Profile/>}/>
                <Route exact path="/users" element={<Users/>}/>
                <Route exact path="/adopt" element={<AdoptionInfo/>}/>
                <Route exact path="/admin" element={<Admin/>}/>

                <Route exact path="/401" element={<Unauthorized/>}/>
                <Route exact path="/403" element={<Forbidden/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    </NotificationProvider>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
    <App/>
</React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
