import React from 'react'
import { useState, useEffect } from 'react';
import togathrVendorLogo from '../resources/assets/Logo/togathr-vendor-logo.png'

import Dropdown from "react-bootstrap/Dropdown";
import { logoutUser } from "../../api/loginApi";
import { useNavigate } from "react-router-dom";

const MainHeaderVendor = (props) => {
    const navigate = useNavigate();

    const { setComponentActive } = props;
    const [vendorProfile, setVendorProfile] = useState(JSON.parse(localStorage.getItem('vendor-user-info')));

    const handleLogout = async () => {
        // try {
        const vendorEmail = JSON.parse(localStorage.getItem("vendor-user-info")).email;

        const logoutData = {
            "email": vendorEmail,
            "collectionName": "vendors"
        }
        logoutUser(logoutData).then(response => {
            console.log('Response from createdData:', response);
            localStorage.removeItem("vendor-user-info");
            navigate("/landingPage");
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });

    };

    // const handleChangeImportant = () => { // }
    return (
        <header className="main-header-root">

            <div className="left-section">

                <div className="togather-vendor-logo" onClick={() => { setComponentActive('vendor-form') }}>
                    <img src={togathrVendorLogo} alt="logo" />
                </div>

            </div>




            <div className="right-section">


                <Dropdown>
                    <Dropdown.Toggle
                        as="span"
                        variant="success"
                        id="dropdown-basic">

                        <div className="user-image"  >

                            {vendorProfile && vendorProfile.image != '' ?
                                <img src={vendorProfile.image} alt="profileImage" />
                                :
                                <></>}
                        </div>

                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setComponentActive('user-profile') }}> User Profile</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>   Log out </Dropdown.Item>


                    </Dropdown.Menu>
                </Dropdown>

            </div>

        </header >
    )
}

export default MainHeaderVendor
