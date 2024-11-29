import React, { useEffect, useState } from 'react';
import '../css/MainHeader.css';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Modal from './ModalPopupBox';
import { createDataInMongo } from '../../api/mongoRoutingFile';
import { logoutUser, openAI, saveTasksToDatabase } from '../../api/loginApi';
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const MainHeader = ({ onCreateEvent, setActiveItem, myEvents, setMyEvents, setEventId, showHeaderControls }) => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [collaborators, setCollaborators] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [maxBudget, setMaxBudget] = useState('');

    const [isMobileView, setIsMobileView] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const savedEventId = localStorage.getItem('eventId');

    const handleEventChange = (event) => {
        const selectedEventId = event.target.value;
        setEventId(selectedEventId);
        console.log('Event id changed: ', selectedEventId);
        localStorage.setItem("eventId", selectedEventId);
    };

    useEffect(() => {
        AOS.init({
            duration: 700,
            easing: "ease-out-cubic",
        });
    }, []);
    // For Mobile screen
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 640);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        const userData = JSON.parse(data);
        setUserInfo(userData);
    }, []);

    const addNewEventToMyEvents = (newEvent) => {
        setMyEvents((myEvents) => [...myEvents, newEvent]);
    };

    const createEvent = async (e) => {
        // e.preventDefault();
        // Get createdBy after userInfo is set
        const createdBy = userInfo?.email || "not specified";

        const eventData = {
            eventName,
            eventType,
            createdBy,
            eventDate,
            location,
            tasks: [],
            collaborators: [createdBy],
            guestCount,
            maxBudget,
            budgetItems: [],
        };

        try {
            createDataInMongo('events', eventData).then(response => {
                localStorage.setItem("eventId", response._id);
                setEventId(response._id);
                console.log('Response I got after crating new event: ', response);
                const updatedEventData = { ...eventData, _id: response._id };
                generateAndSaveTaskList(eventType, createdBy, response._id);
                showSnac('Event successfully created!');
                setActiveItem('overview');
                addNewEventToMyEvents(updatedEventData);
            });

            // Reset form
            setEventName('');
            setEventType('');
            setEventDate('');
            setLocation('');
            setGuestCount('');
            setMaxBudget('');

        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            // onClose();
        }
    };

    const generateAndSaveTaskList = async (eventType, createdBy, eventId) => {
        console.log("data to pass", eventType, createdBy, eventId)

        if (eventType) {

            const request = `Make a task list for ${eventType} for the event planner, without the heading`;
            const response = await openAI(request);
            const taskList = response.data.tasks;
            const tasksArray = taskList.split("\n");
            console.log('taskarray', tasksArray)
            const result = await saveTasksToDatabase({ tasksArray, createdBy, eventId });
            eventId = result.data.eventId;
            localStorage.setItem("eventId", eventId);

        }
    }

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0]);
        console.log(ll, 'll');
        setLocation(value);
        setCoordinates(ll);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMobileNav = (location) => {
        setActiveItem(location);
        toggleMenu();
    }

    const linkMenuClick = (link) => {
        toggleMenu();
    }


    const handleLogout = async () => {
        // try {
        const userEmail = JSON.parse(localStorage.getItem("user-info")).email;

        const logoutData = {
            "email": userEmail,
            "collectionName": "users"
        }
        logoutUser(logoutData).then(response => {
            console.log('Response from createdData:', response);
            const keyToKeep = 'vendor-user-info';
            const valueToKeep = localStorage.getItem(keyToKeep);
            // Clear all local storage
            localStorage.clear();
            // Restore the key you wanted to keep
            if (valueToKeep !== null) {
                localStorage.setItem(keyToKeep, valueToKeep);
            }
            navigate("/landingPage");


        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });

    };

    return (

        <header className="main-header-root">
            {isMobileView ? (
                <div
                    className="hamburger cursor-pointer"
                    onClick={toggleMenu}>
                    <h3 className='ham-icon'><i className="fa-solid fa-bars"></i></h3>
                </div>
            )
                : ''}

            {isMenuOpen && (
                <div className="full-screen-menu" >
                    <div className='mobile-nav-header'>
                        <a href='#' className='close-menu' onClick={toggleMenu}><i className="fa-solid fa-close"></i></a>
                        <div className='logo-section'>
                            <img className='mobile-nav-logo' src="/src/resources/assets/Logo/togatherLogo.png" alt="togather-logo"></img>
                        </div>
                    </div>
                    <ul>
                        <li><a href="#" onClick={() => handleMobileNav('myevents')}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3383_67372)">
                                    <path
                                        d="M9.75 1.5V6.75H1.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H9.75ZM11.25 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25L0 8.25H11.25V0Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M15.75 1.5C15.9489 1.5 16.1397 1.57902 16.2803 1.71967C16.421 1.86032 16.5 2.05109 16.5 2.25V6.75H14.25V1.5H15.75ZM15.75 0H12.75V8.25H18V2.25C18 1.65326 17.7629 1.08097 17.341 0.65901C16.919 0.237053 16.3467 0 15.75 0V0Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M3.75 11.2502V16.5002H2.25C2.05109 16.5002 1.86032 16.4212 1.71967 16.2806C1.57902 16.1399 1.5 15.9491 1.5 15.7502V11.2502H3.75ZM5.25 9.75024H0V15.7502C0 16.347 0.237053 16.9193 0.65901 17.3412C1.08097 17.7632 1.65326 18.0002 2.25 18.0002H5.25V9.75024Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M16.5 11.2502V15.7502C16.5 15.9491 16.421 16.1399 16.2803 16.2806C16.1397 16.4212 15.9489 16.5002 15.75 16.5002H8.25V11.2502H16.5ZM18 9.75024H6.75V18.0002H15.75C16.3467 18.0002 16.919 17.7632 17.341 17.3412C17.7629 16.9193 18 16.347 18 15.7502V9.75024Z"
                                        fill="#4E4E4E"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3383_67372">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            All Events
                        </a></li>
                        <li><a href="#" onClick={() => handleMobileNav('overview')}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3383_67373)">
                                    <path
                                        d="M3.375 14.6252V16.5002H2.25C2.05109 16.5002 1.86032 16.4212 1.71967 16.2806C1.57902 16.1399 1.5 15.9491 1.5 15.7502V14.6252H3.375ZM4.875 13.1252H0V15.7502C0 16.347 0.237053 16.9193 0.65901 17.3412C1.08097 17.7632 1.65326 18.0002 2.25 18.0002H4.875V13.1252Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M16.5 14.6252V15.7502C16.5 15.9491 16.421 16.1399 16.2803 16.2806C16.1397 16.4212 15.9489 16.5002 15.75 16.5002H14.625V14.6252H16.5ZM18 13.1252H13.125V18.0002H15.75C16.3467 18.0002 16.919 17.7632 17.341 17.3412C17.7629 16.9193 18 16.347 18 15.7502V13.1252Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M3.375 8.06225V9.93725H1.5V8.06225H3.375ZM4.875 6.56226H0V11.4372H4.875V6.56226Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M16.5 8.06225V9.93725H14.625V8.06225H16.5ZM18 6.56226H13.125V11.4372H18V6.56226Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M3.375 1.5V3.375H1.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H3.375ZM4.875 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25L0 4.875H4.875V0Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M9.93749 14.6252V16.5002H8.0625V14.6252H9.93749ZM11.4375 13.1252H6.5625V18.0002H11.4375V13.1252Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M9.93749 8.06225V9.93725H8.0625V8.06225H9.93749ZM11.4375 6.56226H6.5625V11.4372H11.4375V6.56226Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M9.93749 1.5V3.375H8.0625V1.5H9.93749ZM11.4375 0H6.5625V4.875H11.4375V0Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M15.75 1.5C15.9489 1.5 16.1397 1.57902 16.2803 1.71967C16.421 1.86032 16.5 2.05109 16.5 2.25V3.375H14.625V1.5H15.75ZM15.75 0H13.125V4.875H18V2.25C18 1.65326 17.7629 1.08097 17.341 0.65901C16.919 0.237053 16.3467 0 15.75 0V0Z"
                                        fill="#4E4E4E"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3383_67373">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Overview
                        </a></li>
                        <li><a href="#" onClick={() => handleMobileNav('vendors')}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3383_67376)">
                                    <path
                                        d="M15.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25L0 18H18V2.25C18 1.65326 17.7629 1.08097 17.341 0.65901C16.919 0.237053 16.3467 0 15.75 0V0ZM5.25 16.5V12.75C5.25 12.5511 5.32902 12.3603 5.46967 12.2197C5.61032 12.079 5.80109 12 6 12H12C12.1989 12 12.3897 12.079 12.5303 12.2197C12.671 12.3603 12.75 12.5511 12.75 12.75V16.5H5.25ZM16.5 16.5H14.25V12.75C14.25 12.1533 14.0129 11.581 13.591 11.159C13.169 10.7371 12.5967 10.5 12 10.5H6C5.40326 10.5 4.83097 10.7371 4.40901 11.159C3.98705 11.581 3.75 12.1533 3.75 12.75V16.5H1.5V2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H15.75C15.9489 1.5 16.1397 1.57902 16.2803 1.71967C16.421 1.86032 16.5 2.05109 16.5 2.25V16.5Z"
                                        fill="#4E4E4E"
                                    />
                                    <path
                                        d="M9 2.99951C8.40666 2.99951 7.82664 3.17546 7.33329 3.5051C6.83994 3.83475 6.45543 4.30328 6.22836 4.85146C6.0013 5.39964 5.94189 6.00284 6.05765 6.58478C6.1734 7.16673 6.45912 7.70127 6.87868 8.12083C7.29824 8.54039 7.83279 8.82611 8.41473 8.94187C8.99667 9.05762 9.59987 8.99821 10.1481 8.77115C10.6962 8.54409 11.1648 8.15957 11.4944 7.66622C11.8241 7.17287 12 6.59286 12 5.99951C12 5.20386 11.6839 4.4408 11.1213 3.87819C10.5587 3.31558 9.79565 2.99951 9 2.99951ZM9 7.49951C8.70333 7.49951 8.41332 7.41154 8.16665 7.24672C7.91997 7.08189 7.72771 6.84763 7.61418 6.57354C7.50065 6.29945 7.47095 5.99785 7.52882 5.70688C7.5867 5.4159 7.72956 5.14863 7.93934 4.93885C8.14912 4.72907 8.41639 4.58621 8.70737 4.52833C8.99834 4.47046 9.29994 4.50016 9.57403 4.61369C9.84812 4.72722 10.0824 4.91948 10.2472 5.16616C10.412 5.41283 10.5 5.70284 10.5 5.99951C10.5 6.39734 10.342 6.77887 10.0607 7.06017C9.77936 7.34148 9.39783 7.49951 9 7.49951Z"
                                        fill="#4E4E4E"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3383_67376">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Vendors
                        </a></li>
                        <li><a href="#" onClick={() => handleMobileNav('budget')}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3383_67375)">
                                    <path
                                        d="M14.25 6V5.301C14.249 4.29322 13.8482 3.32699 13.1356 2.61438C12.423 1.90177 11.4568 1.50099 10.449 1.5H9.75V0H8.25V1.5H7.551C6.64899 1.50096 5.77672 1.82268 5.0901 2.40763C4.40347 2.99259 3.94726 3.80267 3.80299 4.69307C3.65872 5.58347 3.83581 6.49615 4.30259 7.26799C4.76938 8.03983 5.49544 8.62052 6.351 8.90625L8.25 9.54V15H7.551C6.94092 14.9994 6.356 14.7568 5.92461 14.3254C5.49321 13.894 5.2506 13.3091 5.25 12.699V12H3.75V12.699C3.75099 13.7068 4.15177 14.673 4.86438 15.3856C5.57699 16.0982 6.54322 16.499 7.551 16.5H8.25V18H9.75V16.5H10.449C11.351 16.499 12.2233 16.1773 12.9099 15.5924C13.5965 15.0074 14.0527 14.1973 14.197 13.3069C14.3413 12.4165 14.1642 11.5038 13.6974 10.732C13.2306 9.96017 12.5046 9.37948 11.649 9.09375L9.75 8.46V3H10.449C11.0591 3.0006 11.644 3.24321 12.0754 3.67461C12.5068 4.106 12.7494 4.69092 12.75 5.301V6H14.25ZM11.175 10.5157C11.6934 10.6883 12.1336 11.0397 12.4166 11.5071C12.6996 11.9745 12.8071 12.5274 12.7198 13.0667C12.6324 13.6061 12.356 14.0968 11.94 14.451C11.5239 14.8053 10.9954 14.9998 10.449 15H9.75V10.0403L11.175 10.5157ZM8.25 7.95975L6.825 7.48425C6.30655 7.3117 5.86643 6.96028 5.5834 6.49289C5.30037 6.0255 5.1929 5.47264 5.28023 4.93326C5.36755 4.39387 5.64397 3.90317 6.06002 3.54896C6.47607 3.19475 7.00459 3.00015 7.551 3H8.25V7.95975Z"
                                        fill="#4E4E4E"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3383_67375">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Budget Calculator
                        </a></li>
                        <li><a href="#" onClick={() => handleMobileNav('guests')}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3383_67377)">
                                    <path
                                        d="M16.5 7.5H18V18H0V4.5C0 3.90326 0.237053 3.33097 0.65901 2.90901C1.08097 2.48705 1.65326 2.25 2.25 2.25H10.5V3.75H2.25C2.05109 3.75 1.86032 3.82902 1.71967 3.96967C1.57902 4.11032 1.5 4.30109 1.5 4.5V4.6815L7.4085 10.5915C7.83734 11.0007 8.40729 11.2289 9 11.2289C9.59271 11.2289 10.1627 11.0007 10.5915 10.5915L13.6815 7.5H15.8032L11.652 11.652C11.3038 12.0003 10.8903 12.2766 10.4353 12.4652C9.98026 12.6537 9.49254 12.7507 9 12.7507C8.50746 12.7507 8.01974 12.6537 7.56471 12.4652C7.10967 12.2766 6.69623 12.0003 6.348 11.652L1.5 6.80325V16.5H16.5V7.5ZM15.75 2.25V0H14.25V2.25H12V3.75H14.25V6H15.75V3.75H18V2.25H15.75Z"
                                        fill="#4E4E4E"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3383_67377">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Guests
                        </a></li>
                        <li><a href="#" onClick={() => handleMobileNav('collaborators')}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_3383_67374)">
                                    <path
                                        d="M18.0002 8.98811C18.0002 8.19802 17.6886 7.43981 17.1329 6.87811C16.5773 6.31642 15.8225 5.99661 15.0324 5.98811C14.3749 4.67848 13.3111 3.61683 12.0002 2.96186C11.9617 2.19314 11.6292 1.4686 11.0715 0.938126C10.5139 0.40765 9.77361 0.111816 9.00392 0.111816C8.23423 0.111816 7.49399 0.40765 6.9363 0.938126C6.37861 1.4686 6.04615 2.19314 6.00767 2.96186C4.69348 3.61629 3.6269 4.67919 2.96792 5.99111C2.18149 6.00188 1.43082 6.32144 0.877931 6.88083C0.325043 7.44022 0.0142765 8.19457 0.0127013 8.98108C0.0111261 9.76759 0.318869 10.5232 0.869511 11.0848C1.42015 11.6464 2.16954 11.9689 2.95592 11.9829C3.61216 13.306 4.68236 14.3789 6.00392 15.0384C6.0424 15.8071 6.37486 16.5316 6.93255 17.0621C7.49024 17.5926 8.23048 17.8884 9.00017 17.8884C9.76986 17.8884 10.5101 17.5926 11.0678 17.0621C11.6255 16.5316 11.958 15.8071 11.9964 15.0384C13.318 14.3789 14.3882 13.306 15.0444 11.9829C15.8315 11.9713 16.5824 11.6508 17.1354 11.0906C17.6883 10.5303 17.9989 9.77525 18.0002 8.98811ZM9.00017 1.50011C9.29685 1.50011 9.58686 1.58809 9.83353 1.75291C10.0802 1.91773 10.2725 2.152 10.386 2.42609C10.4995 2.70018 10.5292 3.00178 10.4714 3.29275C10.4135 3.58372 10.2706 3.85099 10.0608 4.06077C9.85106 4.27055 9.58378 4.41341 9.29281 4.47129C9.00184 4.52917 8.70024 4.49946 8.42615 4.38593C8.15206 4.2724 7.91779 4.08014 7.75297 3.83347C7.58815 3.58679 7.50017 3.29679 7.50017 3.00011C7.50017 2.60229 7.65821 2.22076 7.93951 1.93945C8.22082 1.65815 8.60235 1.50011 9.00017 1.50011ZM1.50017 8.98811C1.50017 8.69144 1.58815 8.40143 1.75297 8.15476C1.91779 7.90808 2.15206 7.71583 2.42615 7.60229C2.70024 7.48876 3.00184 7.45906 3.29281 7.51694C3.58378 7.57481 3.85106 7.71767 4.06083 7.92745C4.27061 8.13723 4.41347 8.40451 4.47135 8.69548C4.52923 8.98645 4.49952 9.28805 4.38599 9.56214C4.27246 9.83623 4.0802 10.0705 3.83353 10.2353C3.58686 10.4001 3.29685 10.4881 3.00017 10.4881C2.60235 10.4881 2.22082 10.3301 1.93951 10.0488C1.65821 9.76747 1.50017 9.38594 1.50017 8.98811ZM9.00017 16.5001C8.7035 16.5001 8.41349 16.4121 8.16682 16.2473C7.92015 16.0825 7.72789 15.8482 7.61435 15.5741C7.50082 15.3 7.47112 14.9984 7.529 14.7075C7.58687 14.4165 7.72974 14.1492 7.93951 13.9395C8.14929 13.7297 8.41657 13.5868 8.70754 13.5289C8.99851 13.4711 9.30011 13.5008 9.5742 13.6143C9.84829 13.7278 10.0826 13.9201 10.2474 14.1668C10.4122 14.4134 10.5002 14.7034 10.5002 15.0001C10.5002 15.3979 10.3421 15.7795 10.0608 16.0608C9.77953 16.3421 9.398 16.5001 9.00017 16.5001ZM11.6087 13.5459C11.3525 13.0779 10.9752 12.6875 10.5162 12.4155C10.0573 12.1435 9.53365 12 9.00017 12C8.4667 12 7.94304 12.1435 7.4841 12.4155C7.02516 12.6875 6.64783 13.0779 6.39167 13.5459C5.58365 13.0784 4.91352 12.4057 4.44917 11.5959C4.91766 11.3406 5.30887 10.964 5.58181 10.5056C5.85475 10.0472 5.99937 9.52383 6.00052 8.99032C6.00167 8.45681 5.85931 7.93281 5.58835 7.47322C5.31739 7.01364 4.92781 6.63539 4.46042 6.37811C4.92451 5.57776 5.59042 4.91314 6.39167 4.45061C6.64783 4.91857 7.02516 5.30899 7.4841 5.58097C7.94304 5.85295 8.4667 5.99646 9.00017 5.99646C9.53365 5.99646 10.0573 5.85295 10.5162 5.58097C10.9752 5.30899 11.3525 4.91857 11.6087 4.45061C12.4099 4.91314 13.0758 5.57776 13.5399 6.37811C13.0725 6.63539 12.683 7.01364 12.412 7.47322C12.141 7.93281 11.9987 8.45681 11.9998 8.99032C12.001 9.52383 12.1456 10.0472 12.4185 10.5056C12.6915 10.964 13.0827 11.3406 13.5512 11.5959C13.0868 12.4057 12.4167 13.0784 11.6087 13.5459ZM15.0002 10.4874C14.7035 10.4874 14.4135 10.3994 14.1668 10.2346C13.9201 10.0697 13.7279 9.83548 13.6144 9.56139C13.5008 9.2873 13.4711 8.9857 13.529 8.69473C13.5869 8.40376 13.7297 8.13648 13.9395 7.9267C14.1493 7.71692 14.4166 7.57406 14.7075 7.51619C14.9985 7.45831 15.3001 7.48801 15.5742 7.60154C15.8483 7.71508 16.0826 7.90733 16.2474 8.15401C16.4122 8.40068 16.5002 8.69069 16.5002 8.98736C16.5002 9.38519 16.3421 9.76672 16.0608 10.048C15.7795 10.3293 15.398 10.4874 15.0002 10.4874Z"
                                        fill="#4E4E4E"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3383_67374">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            Collaborators
                        </a></li>
                    </ul>

                    <div className='links-menu'>
                        <ul>
                            <li><a href="#" onClick={() => linkMenuClick('faq')}>FAQ</a></li>
                            <li><a href="#" onClick={() => linkMenuClick('help')}>Help</a></li>
                            <li><a href="#" onClick={() => linkMenuClick('privacy_policy')}>Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
            )}

            {showHeaderControls ? (
                <div className="left-section">
                    <div>
                        <Modal


                            buttonClassName="button-green-fill"
                            buttonId="createNewSheet "
                            buttonLabel="Create New Event"
                            modalHeaderTitle="New Event Detail"
                            modalBodyHeader="Add detail over here"
                            // modalBodyHeader="Insert your body header here"
                            modalBodyContent={
                                <form>
                                    <input
                                        type="text"
                                        placeholder="Event Name"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Event Type"
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                        required
                                    />
                                    <PlacesAutocomplete value={location} onChange={setLocation} select={handleSelect} >
                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                            <div>
                                                <input {...getInputProps({ placeholder: 'Search Places...' })} />
                                                <div>
                                                    {loading && <div>Loading...</div>}
                                                    {suggestions.map((suggestion) => {
                                                        const style = {
                                                            color: suggestion.active ? 'black' : 'var(--primary-purple)',
                                                            backgroundColor: suggestion.active ? 'var(--secondary-purple)' : 'var(--secondary-purple)',

                                                        };
                                                        return (
                                                            <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                                                                {suggestion.description}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </PlacesAutocomplete>
                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Guest Count"
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Budget"
                                        value={maxBudget}
                                        onChange={(e) => setMaxBudget(e.target.value)}
                                        required
                                    />
                                    {/* <button className='btn-create-event' type="submit">Create Event</button> */}
                                </form>
                            }
                            saveDataAndOpenName="Save"
                            saveDataAndOpenId="save"
                            saveDataAndOpenFunction={() => createEvent()}
                            closeButtonID="closeSheet"
                            closeButtonName='Close'
                            buttonAlign='row'
                            onModalClose={() => console.log('Modal 1 closed')}
                            closeModalAfterDataSend="true"


                        />

                    </div>

                    {(myEvents && myEvents.length > 0) ? ( // Check if myEvents has items
                        <select className="dropdown" onChange={handleEventChange} value={savedEventId}>
                            <option value="">Select Event</option> {/* Default option */}
                            {myEvents.map((event) => (
                                <option key={event._id} value={event._id}>
                                    {event.eventName} {/* Adjust according to your event object structure */}
                                </option>
                            ))}
                        </select>
                    ) : null} {/* Hide dropdown if there are no events */}
                </div>
            ) : null
            }


            <div className="right-section">


                <div>
                    <Dropdown>
                        <Dropdown.Toggle
                            as="span"
                            variant="success"
                            id="dropdown-basic"

                        >
                            <div className="user-image">

                                {userInfo && userInfo.image != '' ?
                                
                                    <img src={userInfo.image} alt="profileImage" />
                                    :
                                    <></>}
                            </div>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { setActiveItem('user_profile') }}> User Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>   Log out </Dropdown.Item>


                        </Dropdown.Menu>
                    </Dropdown>
                </div>

            </div>
        </header >
    );
};

export default MainHeader;
