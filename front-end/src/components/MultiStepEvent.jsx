import React from 'react'
import { useState, useEffect, useRef } from 'react';
// import toGatherLogo from '../resources/assets/Logo/togatherLogo.png';
import { useNavigate } from 'react-router-dom';

import location_multi from '../resources/assets/Images/location-multi.png';
import budget_multi from '../resources/assets/Images/budget-multi.png';
import guest_count_multi from '../resources/assets/Images/guest-count-multi.png';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useSnackbar } from './SnackbarContext';

const MultiStepEvent = () => {
    const showSnackbar = useSnackbar();

    const navigate = useNavigate();

    const [welcomeModalActive, setWelcomeModalActive] = useState(true);
    const [modalClass, setModalClass] = useState('');

    const [currentStep, setCurrentStep] = useState(0);
    const [activeSection, setActiveSection] = useState('');
    const [location, setLocation] = useState('');

    const sectionsRef = useRef([]);

    // State to hold input values for each section
    const [formData, setFormData] = useState({
        eventType: '',
        eventName: '',
        eventDate: '',
        eventTime: '',
        location: '',
        maxBudget: '',
        guestCount: ''
    });

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.5 });

        sectionsRef.current.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        return () => {
            sectionsRef.current.forEach(section => {
                if (section) {
                    observer.unobserve(section);
                }
            });
        };
    }, []);

    useEffect(() => {

    }, [location])

    useEffect(() => {
        // setTimeout (() => {
        //     setWelcomeModalActive(false);
        //     }, 2500);
    }, [welcomeModalActive])

    const nextStep = () => {
        if (currentStep == '0') {
            if (formData.eventType == '' || formData.eventName == '') {
                showSnackbar('Please fill all fields.');
                return;
            }
        }
        if (currentStep == '1') {
            if (formData.eventDate == '' || formData.eventTime == '') {
                showSnackbar('Please fill all fields.');

                return;
            }
        }
        if (currentStep == '2') {
            if (location == '' || formData.maxBudget == '' || formData.guestCount == '') {
                showSnackbar('Please fill all fields.');

                return;
            }
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
        console.log(currentStep);
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleChange = async (event) => {
        console.log(event);
        const { name, value } = event.target;
        console.log(name, value);
        if (name === 'maxBudget' && value < 0) {
            showSnackbar('Please fill value more than zero');

            return; // Do not update state if value is negative
        }
        if (name === 'guestCount' && value < 0) {
            showSnackbar('Please fill value more than zero');
            return; // Do not update state if value is negative
        }
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options).replace(/(\d+)(?=\s)/, (match) => `${match}${getOrdinalSuffix(match)}`);
    };

    const getOrdinalSuffix = (num) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const value = num % 100;
        return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    };

    const handleSubmitMultiForm = () => {
        const finalData = {
            ...formData,
            'location': location,
            'createdBy': 'anonymous@ignite.com',
            "tasks": [],
            "collaborators": ["anonymous@ignite.com"],
        }


        console.log(finalData);
        localStorage.setItem('eventInfo', JSON.stringify(finalData));
        navigate("/signup?false");

    }

    const handleSelect = async (value) => {
        // setFormData({
        //     ...formData,
        //    'location': location
        // });
    };

    const handleButtonClick = () => {

        setWelcomeModalActive(false);
        // setModalClass(buttonId);


    };

    return (
        <>

            <div className='custom-modal-maker'>
                {/* <button  className={`button-green modal-button`} id='buttonGreen'  onClick={handleButtonClick}>click me</button> */}
                <div id="modal-container"
                    className={`${welcomeModalActive == true ? ('four') : welcomeModalActive == false ? ('fourClose') : welcomeModalActive == null ? ('') : ''}`} >
                    <div className="modal-background" onClick={handleButtonClick}>
                        <div className="welcomeModalContainer">
                            <div className="welcomeModalContent">
                                {/* <div className="welcomeModalImage"><img src={toGatherLogo} alt="togather-logo" /></div> */}
                                <h3>Welcome to your event planning journey</h3>
                            </div>
                        </div>




                    </div>
                </div>
            </div>
            <div className="multi-step-form">
                <div className="section-form-header">
                    <nav>
                        <ul>
                            {currentStep == "0" || currentStep == "1" || currentStep == "2" ? <>
                                <li className={activeSection === 'what' ? 'activeNav' : ''}>
                                    <a href="#what">What?</a>
                                </li>
                                <li className={activeSection === 'when' ? 'activeNav' : ''}>
                                    <a href="#when">When?</a>
                                </li>
                                <li className={activeSection === 'where' ? 'activeNav' : ''}>
                                    <a href="#where">Where, Who and How Much!</a>
                                </li>
                            </>
                                : <></>}
                            {currentStep == "3" ?
                                <li className={activeSection === 'submitSection' ? 'activeNav' : ''}>
                                    <a href="#submitSection">Almost There! Let’s start planning !</a>
                                </li>
                                : <></>}
                        </ul>
                    </nav>
                </div>

                <div className="section-form-body">
                    <div className="form-sections">
                        <section className='what-section' id="what" ref={el => sectionsRef.current[0] = el} style={{ display: currentStep === 0 ? 'flex' : 'none' }}  >
                            <div className="what-container" id="what-container">

                                <div className="multi-form">
                                    <div className="multi-form-group">
                                        <label htmlFor="event_type">Choose the type of your event.</label>
                                        <select name="eventType" id="event_type" value={formData.eventType} onChange={handleChange} required placeholder='none'>
                                            <option value=''>None</option>
                                            <option value="wedding">Wedding</option>
                                            <option value="birthday">Birthday</option>
                                            <option value="funeral">Funeral</option>
                                            <option value="corporate-event">Corporate Event</option>
                                            <option value="conference">Conference</option>
                                            <option value="anniversary">Anniversary</option>
                                            <option value="baby-shower">Baby Shower</option>
                                            <option value="engagement-party">Engagement Party</option>
                                            <option value="graduation">Graduation</option>
                                            <option value="retirement">Retirement Party</option>
                                            <option value="housewarming">Housewarming Party</option>
                                            <option value="holiday-party">Holiday Party</option>
                                            <option value="charity-event">Charity Event</option>
                                            <option value="sports-event">Sports Event</option>
                                            <option value="product-launch">Product Launch</option>
                                            <option value="music-festival">Music Festival</option>
                                            <option value="art-exhibition">Art Exhibition</option>
                                            <option value="reunion">Reunion</option>
                                            <option value="community-event">Community Event</option>
                                            <option value="fundraiser">Fundraiser</option>
                                            <option value="networking-event">Networking Event</option>
                                            <option value="seminar">Seminar</option>
                                            <option value="workshop">Workshop</option>
                                            <option value="team-building">Team Building</option>
                                            <option value="prom">Prom</option>
                                            <option value="festival">Festival</option>
                                            <option value="themed-party">Themed Party</option>

                                        </select>
                                    </div>
                                    <div className="multi-form-group">
                                        <label htmlFor="event_title">Give a title to your event.</label>
                                        <input
                                            type="text"
                                            name="eventName"
                                            value={formData.eventName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>


                        <section className='when-section' id="when" ref={el => sectionsRef.current[1] = el} style={{ display: currentStep === 1 ? 'flex' : 'none' }}  >

                            <div className="when-container" id="when-container">

                                <div className="multi-form when-group">
                                    <div className="multi-form-group when-subgroup">
                                        <h4 htmlFor="date">Set the date and time for the {formData.eventType}.</h4>
                                        <div className="multi-form-subgroup ">
                                            <input
                                                type="date"
                                                name="eventDate"
                                                value={formData.eventDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split("T")[0]}
                                            />
                                            <input
                                                type="time"
                                                name="eventTime"
                                                value={formData.eventTime}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>




                        <section className='where-section' id="where" ref={el => sectionsRef.current[2] = el} style={{ display: currentStep === 2 ? 'flex' : 'none' }} >

                            <div className="where-container" id="where-container">

                                <div className="where-cards">
                                    <div className="location-card where-card">
                                        <h4>Set the location</h4>
                                        <div className="where-card-img location-img"><img src={location_multi} alt="location-image" /></div>
                                        {/* <input type='text' name="location" value={formData.location} onChange={handleChange}></input> */}
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
                                                                width: "200px",
                                                                height: "100px",
                                                                overflow: "scroll",
                                                                padding: "10px",
                                                                position: "absolute",
                                                                left: "20%"

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

                                    </div>

                                    <div className="guest-card where-card">
                                        <h4>Guest Count</h4>
                                        <div className="where-card-img guest-img"><img src={guest_count_multi} alt="guest-count-image" /></div>
                                        <input type='number' name="guestCount" value={formData.guestCount} onChange={handleChange} placeholder='450 People'></input>

                                    </div>

                                    <div className="budget-card where-card">
                                        <h4>Set your Budget</h4>
                                        <div className="where-card-img budget-img"><img src={budget_multi} alt="budget-image" /></div>
                                        <input type='number' name="maxBudget" value={formData.maxBudget} onChange={handleChange} placeholder='$15,000' ></input>
                                    </div>
                                </div>


                            </div>

                        </section>
                        <section className='submit-section' id="submitSection" ref={el => sectionsRef.current[3] = el} style={{ display: currentStep === 3 ? 'flex' : 'none' }}  >
                            <div className="submit-container" id="submit-container">
                                <h2>{formData.eventName}</h2>
                                <div className="submit-box">

                                    <div className="submit-label">
                                        <p>on:</p>
                                        <p>at:</p>
                                        <p>in:</p>
                                        <p>with:</p>
                                        <p>under:</p>
                                    </div>
                                    <div className="submit-value">
                                        <h5>{formatDate(formData.eventDate)}</h5>
                                        <h5>{formData.eventTime}</h5>
                                        <h5>{location}</h5>
                                        {formData.guestCount > 1 ? <h5>{formData.guestCount} Guests</h5> : <h5>{formData.guestCount} Guest </h5>}
                                        <h5>$ {formData.maxBudget}</h5>
                                    </div>

                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="section-form-footer">
                    <div className="navigation-buttons">
                        {currentStep == "1" || currentStep == "2" || currentStep == "3" ? <button className='button-purple' onClick={prevStep} >Back</button> : <></>}
                        {currentStep == "0" || currentStep == "1" || currentStep == "2" ? <button className='button-purple-fill' onClick={nextStep} disabled={currentStep === 3}>Next</button> : <></>}
                        {currentStep == "3" ? <button className='button-purple-fill' onClick={handleSubmitMultiForm} >Let's Start</button> : <></>}

                    </div>
                </div>
            </div>
        </>
    )
}

export default MultiStepEvent
