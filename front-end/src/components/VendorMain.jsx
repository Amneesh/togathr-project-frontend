import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UnsplashImages from './UnsplashImages';
import VendorsList from './VendorsList';
import { useState, useEffect } from 'react';
import '../css/VendorDetailDescription.css';
import Heart from "react-animated-heart";
import { useSnackbar } from './SnackbarContext';


import {  readDataFromMongoWithParam, DeleteDataInMongo } from '../../api/mongoRoutingFile';
import VendorTogatherDetailedPage from './VendorTogatherDetailedPage';

import Popover from '@mui/material/Popover';

export default function VendorMain() {
    const showSnackbar = useSnackbar();

    // popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverState, setPopoverState] = useState({});


    const handleClick = (event, id) => {
        setPopoverState({ [id]: event.currentTarget });
    };

    const handleClose = (id) => {
        setPopoverState((prevState) => ({
            ...prevState,
            [id]: null,
        }));
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // popover
    const [activeTab, setActiveTab] = useState('tab1');

    const [value, setValue] = React.useState(0);
    const [vendType, setVendorType] = useState([]);
    const [location, setLocation] = useState({ lat: null, long: null });

    const [error, setError] = useState(null);

    const [favoriteVendors, setFavoriteVendors] = useState([]);

    const [showAllCategoryCards, setshowAllCategoryCards] = useState(true);
    const [showAllVendorCards, setshowAllVendorCards] = useState(false);

    const [userEmail, setUserEmail] = useState(JSON.parse(localStorage.getItem("user-info")).email);
    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

    const [bookedList, setBookedList] = useState([]);
    const [favoriteList, setFavoriteList] = useState([]);


    const [isClick, setClick] = useState(true);

    const category_cards = [
        { id: 1, categoryName: "Venues", categoryType: "event_venue", categoryQuery: "business conferences, corporate events, industry seminars" },
        { id: 2, categoryName: "Caterers", categoryType: "catering", categoryQuery: "wedding planning, bridal shows, wedding venues" },
        { id: 3, categoryName: "Photographers", categoryType: "photographer", categoryQuery: "skills workshops, hands-on training, personal development" },
        { id: 4, categoryName: "Liquor store", categoryType: "liquor_store", categoryQuery: "live music, music festivals, concert tickets" },
        { id: 5, categoryName: "Musicians", categoryType: "night_club", categoryQuery: "team building, company retreats, corporate getaways" },
        // { id: 6, categoryName: "Dj", categoryType: "establishment", categoryQuery: "charity events, fundraising galas, benefit concerts" },
        { id: 7, categoryName: "Florist", categoryType: "florist", categoryQuery: "trade shows, art exhibitions, product showcases" },
        { id: 8, categoryName: "Rental Equipments", categoryType: "hardware_store", categoryQuery: "networking mixers, business meetups, professional gatherings" },
        { id: 9, categoryName: "Makeup Artist", categoryType: "beauty_salon", categoryQuery: "family reunions, picnics, community gatherings" },
        { id: 10, categoryName: "Car rental", categoryType: "car_rental", categoryQuery: "networking mixers, business meetups, professional gatherings" },
        { id: 11, categoryName: "Event Transport", categoryType: "car_rental", categoryQuery: "family reunions, picnics, community gatherings" },
        { id: 12, categoryName: "Convenience Store", categoryType: "convenience_store", categoryQuery: "family reunions, picnics, community gatherings" },

    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleVendorType = (vendorType) => {
        setVendorType(vendorType);
        setshowAllCategoryCards(!showAllCategoryCards);
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (position.coords) {
                        setLocation({ lat: latitude, long: longitude });
                    }
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getLocation();
        console.log('location', location);
    }, []);

    const handleComponentChangeStatus = () => {

        setshowAllCategoryCards(!showAllCategoryCards);
    }


    const handleTabClick = async (tab) => {
        setActiveTab(tab);
        if (tab == 'tab1') {
            setshowAllCategoryCards(true);
        }

        if (tab == 'tab2') {
            readBookedVendors();
        }

        if (tab == 'tab3') {
            readFavoriteVendors();
        }


    };



    const deleteFavorites = (favoriteID) => {


        DeleteDataInMongo('favorites', favoriteID).then(response => {
            console.log('Response from updateData:', response);
            // toast('Deleted Successfully')
            showSnackbar('Vendor removed from favorites.');

            readFavoriteVendors();


        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });



    }

    const handleUnBookNow = (bookedID) => {
        DeleteDataInMongo('booked_vendors', bookedID).then(response => {
            console.log('Response from updateData:', response);
            showSnackbar('Booking has been removed.');
            readBookedVendors();


        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }


    const readBookedVendors = async () => {
        try {
            const queryParams = new URLSearchParams({
                user_email: userEmail,
                eventID: eventID,
            }).toString();

            const result = await readDataFromMongoWithParam('booked_vendors', queryParams);

            if (result && result.length > 0) {
                console.log(result + '6666666666');
                setBookedList(result);
            } else {
                console.log(false);
            }
        } catch (error) {
            console.error('Error checking event:', error);

        }
    }

    const readFavoriteVendors = async () => {
        try {
            const queryParams = new URLSearchParams({
                user_email: userEmail,
                eventID: eventID,
            }).toString();

            const result = await readDataFromMongoWithParam('favorites', queryParams);

            if (result && result.length > 0) {
                console.log(result + '6666666666');
                setFavoriteList(result);
            } else {
                console.log(false);
            }
        } catch (error) {
            console.error('Error checking event:', error);

        }
    }

    return (

        <>

            {!showAllCategoryCards ? <div className="container-back" onClick={handleComponentChangeStatus}>
                <i className="fa-solid fa-chevron-left"></i>
            </div> : <></>}


            <div className="tabs">
                <button onClick={() => handleTabClick('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>All Vendors</button>
                <button onClick={() => handleTabClick('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>Booked Vendors</button>
                <button onClick={() => handleTabClick('tab3')} className={activeTab === 'tab3' ? 'active' : ''}>Favourites</button>
            </div>

            <div style={{ display: activeTab === 'tab1' ? 'block' : 'none' }}>
                <section className='all-category-vendor'>
                    {showAllCategoryCards ? <div className="vendor-category-cards">
                        {category_cards.map((card, index) => (
                            <div
                                className='vendor-category-card'
                                key={card.id}
                                onClick={() => handleVendorType({ vendorType: card.categoryType, vendorName: card.categoryName })} // Changed here
                            >
                                <div className="card-image">
                                    <UnsplashImages query={card.categoryName} numberOfImages={'1'} randomPage={index} />
                                </div>
                                <div className="card-content">
                                    <h4>{card.categoryName}</h4>
                                </div>
                                <div>

                                </div>
                            </div>
                        ))}
                    </div> :

                        <div className='vendor-details'>
                            <VendorsList getVendorType={vendType} currentLocation={location} />
                        </div>

                    }
                </section>

            </div>
            <div style={{ display: activeTab === 'tab2' ? 'block' : 'none' }}>
                <section className='all-booked-vendor'>
                    {bookedList.length > 0 ? (
                        <div className="vendor-all-cards">
                            {bookedList.map((bookedVendor, index) => (
                                <div
                                    className="vendor-custom-card"
                                    key={bookedVendor._id}
                                >
                                    <div className="vendor-card-image">
                                        <UnsplashImages
                                            query={bookedVendor.business_name}
                                            numberOfImages={'1'}
                                            randomPage={'1'}
                                        />
                                    </div>
                                    <div>
                                        {/* <button >
                    <i className="fa-solid fa-heart"></i>
                  </button> */}
                                    </div>
                                    <div className="vendor-card-info">
                                        <div className="vendor-card-content">
                                            <h5>{bookedVendor.business_name}</h5>
                                            {/* <p>Contact no.: {vendor.user_phone}</p> */}
                                            <p>{bookedVendor.business_location}</p>
                                            <div className='vendor-package-all'>
                                                <a
                                                    className="vendor-show-package"
                                                    aria-describedby={`popover-${bookedVendor._id}`}
                                                    onClick={(event) => handleClick(event, bookedVendor._id)}
                                                >                                                    Package Details
                                                </a>
                                                <Popover
                                                    id={`popover-${bookedVendor._id}`}
                                                    open={Boolean(popoverState[bookedVendor._id])}
                                                    anchorEl={popoverState[bookedVendor._id]}
                                                    onClose={() => handleClose(bookedVendor._id)}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <div className='vendor-package-data'>
                                                        <h5>Package Name : <span>{bookedVendor.package_name}</span></h5>
                                                        <h5>Package Price : <span>{bookedVendor.package_price} / {bookedVendor.pricing_method}</span></h5>
                                                        <h5>Package Includes : <span>{bookedVendor.package_includes}</span></h5>


                                                    </div>
                                                </Popover>
                                            </div>
                                        </div>
                                        <button className="button-purple-fill" onClick={() => handleUnBookNow(bookedVendor._id)}>Unbook</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Booked Vendors.</p>
                    )}
                </section>
            </div>
            <div style={{ display: activeTab === 'tab3' ? 'block' : 'none' }}>


                <section className='all-favorite-vendor'>
                    {favoriteList.length > 0 ? (
                        <div className="vendor-all-cards">
                            {favoriteList.map((bookedVendor, index) => (
                                <div
                                    className="vendor-custom-card"
                                    key={bookedVendor._id}
                                >
                                    <div className="vendor-card-image">
                                        {
                                            bookedVendor.business_image != '' ?
                                                <img src={bookedVendor.business_image} alt='vendor image' />
                                                :
                                                <UnsplashImages
                                                    query={bookedVendor.business_name}
                                                    numberOfImages={'1'}
                                                    randomPage={'1'}
                                                />
                                        }
                                    </div>
                                    <div>
                                        {/* <button >
                    <i className="fa-solid fa-heart"></i>
                  </button> */}
                                    </div>
                                    <div className="vendor-card-info">

                                        <div className="vendor-card-content">
                                            <h5>{bookedVendor.business_name}</h5>
                                            <p>{bookedVendor.business_location}</p>
                                        </div>
                                        <Heart isClick={isClick} onClick={() => deleteFavorites(bookedVendor._id)} />

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Favorite Vendors.</p>
                    )}
                </section>



            </div>

        </>
    );
}
