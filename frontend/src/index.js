import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './App';
import Header from "./components/Header";
import Footer from "./components/Footer";
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/Search';
import PetListingDetail from './pages/PetListingDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Notifications from "./pages/Notifications";
import {NotificationProvider} from "./context/NotificationContext";

export default function App() {
    return (<NotificationProvider>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route exact path="/" element={<Home/>}/>
                    <Route exact path="/login" element={<Login/>}/>
                    <Route exact path="/register" element={<Register/>}/>
                    <Route exact path="/notifications" element={<Notifications/>}/>
                    {/* <Route exact path="/pet_listings" element={<PetListing/>} /> */}
                    <Route path="/pet_listings/:petListingID" element={<PetListingDetail/>}/>
                    <Route exact path="/search" element={<SearchResults/>}/>
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
