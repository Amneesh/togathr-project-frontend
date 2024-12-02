import React, { useEffect, useState } from 'react';
import { readSingleDataFromMongo, updateDataInMongo } from "../../api/mongoRoutingFile";
import { TaskList } from './TaskList';
import GuestListOverview from './GuestListOverview'
import VendorMainOverview from './VendorMainOverview';
import DonutChart from './DonutChart';
import ProgressChartBar from './ProgressChartBar';
import '../css/Overview.css'
import OverviewCollaborators from './OverviewCollaborators';
import Modal from './ModalPopupBox';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import VendorCategoryOverview from './VendorCategoryOverview';
import TogathrLoader from './TogathrLoader';
import Donut from './DonutChart';
const Overview = ({ setActiveItem, eventId }) => {
    const [event, setEvent] = useState(null);
    const [budgetList, setBudgetList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [chartLabels, setChartLabels] = useState(['']);
    const [totalCost, setTotalCost] = useState(0);
    const [totalDue, setTotalDue] = useState(0);

    const [userInfo, setUserInfo] = useState(null);
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [collaborators, setCollaborators] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [maxBudget, setMaxBudget] = useState('');

    const setupChart = (budgetItems, cost, due) => {
        // console.log(`At this point of time BudgetItems = ${budgetItems}----- Total Cost: ${cost} and Total Due: ${due}`);
        setTotalCost(cost);
        setTotalDue(due);

        let chartDetails = new Map();
        budgetItems?.map(item => {
            if (chartDetails.has(item.budgetCategory)) {
                if (parseFloat(item.totalCost) && parseFloat(item.totalCost) > 0) {
                    chartDetails.set(item.budgetCategory, parseFloat(chartDetails.get(item.budgetCategory)) + parseFloat(item.totalCost));
                } else {
                    chartDetails.set(item.budgetCategory, parseFloat(chartDetails.get(item.budgetCategory)) + parseFloat(item.estimateAmount));
                }
            } else {
                if (parseFloat(item.totalCost) && parseFloat(item.totalCost) > 0) {
                    chartDetails.set(item.budgetCategory, parseFloat(item.totalCost));
                } else {
                    chartDetails.set(item.budgetCategory, parseFloat(item.estimateAmount));
                }
            }
        })
        let listOfCategories = [];
        let costOfEachCategory = []
        chartDetails.forEach((value, key) => {
            // console.log(`Key: ${key} Value: ${value}`)
            listOfCategories.push(key);
            costOfEachCategory.push(parseFloat(value));
        })
        // console.log('Chart labels: ', listOfCategories);
        // console.log('Category cost: ', costOfEachCategory);
        setChartLabels(listOfCategories);
        setChartData(costOfEachCategory);
        console.log('OVERALL MAP: ===================', chartDetails);
        console.log('CATEGORIES: +++++++++++++++', listOfCategories);
        console.log('COST OF CATEGORIES: +================ is', costOfEachCategory);
    }

    const handleClick = () => {
        setActiveItem('budget');
    }
    useEffect(() => {
        if (eventId) {
            const fetchEventInfo = async () => {
                const selectedEventID = eventId;
                if (selectedEventID) {
                    try {
                        readSingleDataFromMongo('events', selectedEventID).then(response => {
                            // let allBudgetItems = response['budget_items'];
                            let eventObject = response;

                            // Selected event data for header and edit event
                            setEvent(eventObject);
                            setBudgetList(eventObject.budgetItems);
                            setEventName(eventObject.eventName);
                            setEventType(eventObject.eventType);
                            setEventDate(eventObject.eventDate);
                            setLocation(eventObject.location);
                            setGuestCount(eventObject.guestCount);
                            setMaxBudget(eventObject.maxBudget);

                            let totalBudgetCost = 0;
                            let totalDueAmount = 0;
                            eventObject.budgetItems && eventObject.budgetItems.length > 0 ? eventObject.budgetItems.map(item => {

                                // Calculate total amount
                                if (parseFloat(item.totalCost)) {
                                    console.log('INSIDE FIRST IF')
                                    if (parseFloat(item.totalCost) > 0) {
                                        totalBudgetCost += parseFloat(item.totalCost);
                                    } else {
                                        totalBudgetCost += parseFloat(item.estimateAmount);
                                    }
                                } else {
                                    totalBudgetCost += parseFloat(item.estimateAmount);
                                }
                                // Calculate due amount
                                if (parseFloat(item.dueAmount)) {
                                    totalDueAmount += parseFloat(item.dueAmount);
                                }
                            }) : '';

                            setupChart(eventObject.budgetItems, totalBudgetCost, totalDueAmount);
                        })
                    } catch (e) {
                        setError('Failed to fetch event information!');
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            }
            fetchEventInfo();
        }

    }, [eventId]);

    const updateEvent = async () => {
        const data = localStorage.getItem('user-info');
        const userData = JSON.parse(data);
        const createdBy = userData?.email
        const updatedEvent = {
            eventName: eventName,
            eventType: eventType,
            eventDate: eventDate,
            location: location,
            guestCount: guestCount,
            maxBudget: maxBudget,
        }

        updateDataInMongo('events', eventId, updatedEvent).then((response) => {
            // generateAndSaveTaskList(eventType, createdBy, response._id);
            setEvent(updatedEvent);
        })
    }

    // const generateAndSaveTaskList = async (eventType, createdBy, eventId) => {

    //     if (eventType) {

    //         const request = `Make a task list for ${eventType} for the event planner, without the heading`;
    //         const response = await openAI(request);
    //         console.log("response in component", response);
    //         const taskList = response.data.tasks;
    //         // console.log("In All events", response.data);
    //         const tasksArray = taskList.split("\n");
    //         // setTasks(tasksArray);

    //         const result = await saveTasksToDatabase({ tasksArray, createdBy, eventId });
    //         eventId = result.data.eventId;
    //         console.log("response", eventId);
    //         localStorage.setItem("eventId", eventId);

    //     }
    // }

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0]);
        setLocation(value);
        setCoordinates(ll);
    };

    return (
        <>
            {eventId != null ?
                <div className='overview-main-section'>

                    <section className='event-main-section'>

                        <div className='event-main-header'>
                            <h5>Your Event: </h5>
                            {/* <h5><i className="fa-regular fa-pen-to-square"></i> Edit</h5> */}
                            <div className='modal-box-root'>
                                <h5><i className="fa-regular fa-pen-to-square"></i> </h5>
                                <Modal
                                    buttonClassName="button-white-fill"
                                    buttonId="updateEvent "
                                    buttonLabel='Edit'
                                    modalHeaderTitle="Update Event Detail"
                                    modalBodyHeader="Update details"
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
                                                readOnly
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
                                        </form>
                                    }
                                    saveDataAndOpenName="Update"
                                    saveDataAndOpenId="update"
                                    saveDataAndOpenFunction={() => updateEvent()}
                                    closeButtonID="closeSheet"
                                    closeButtonName='Close'
                                    buttonAlign='row'
                                    onModalClose={() => console.log('Modal update event closed')}
                                    closeModalAfterDataSend="true"
                                />

                            </div>
                        </div>

                        <div className='event-main-body'>
                            <h1>{event ? event.eventName : ''}</h1>
                        </div>

                        <div className='event-main-body'>
                            <div className='event-type'>
                                {event ? ` ${event.eventType}` : ''}
                            </div>

                            <div className="event-content">
                                <p> <i className='fa fa-user' style={{ color: 'var(--accent-pink)' }}></i> {event ? event.guestCount : ''}</p>
                                <p className='event-address-text'>   <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent-blue)' }}></i> {event ? event.location : ''}</p>
                                <p>  <i className="fa-solid fa-calendar" style={{ color: 'var(--accent-yellow)' }}></i> {event ? event.eventDate : ''}</p>
                            </div>

                        </div>

                    </section>

                    <section className='overview-feature-container'>

                        <div className="overview-left-container">
                            <TaskList TaskeventId={eventId} TaskeventType={eventType} />
                        </div>

                        <div className="overview-right-container">

                            <div className="overview-top-container">

                                <div className="overview-budget-widget">

                                    <div className="budget-add-overview">

                                        <div className='guest-add-overview-header '>
                                            <h3>Budget</h3>
                                            <button onClick={handleClick} className='button-purple'>View More</button>
                                        </div>

                                        <div className="overview-budget-body">
                                            <div className='budget-numbers'>
                                                <div className='budget-add-content'>
                                                    <h5>Total Cost</h5>
                                                    <h2>${totalCost}</h2>
                                                </div>
                                                <div className='budget-add-content'>
                                                    <h5>Due</h5>
                                                    <h2>${totalDue}</h2>
                                                </div>
                                            </div>
                                        </div>

                                        {chartData && chartData.length > 0 ? (
                                            <div className='abcdef'>
                                                <Donut
                                                Chart labels={chartLabels} data={chartData} position={'right'} style={{ width: '50px', height: '50px' }} />
                                            </div>
                                        ) : <div className='max-budget-indicator'>
                                            <DonutChart labels={['Your Budget']} data={event ? [event.maxBudget] : [0]} position={'right'} style={{ width: '50px', height: '50px' }} />
                                        </div>}

                                    </div>

                                </div>

                                <div className="overview-guest-widget">
                                    {/* <TogathrLoader/> */}
                                    <GuestListOverview active={setActiveItem}
                                    
                                    donutdata = {  event ? event.guestCount : ''}/>
                                </div>

                            </div>
                            <div className="overview-collab-widget"><OverviewCollaborators active={setActiveItem} /></div>
                        </div>

                    </section>
                    <section className='vendor-category-overview'>
                        <VendorCategoryOverview active={setActiveItem} />
                    </section>

                    <section className='oveview-vendor'>
                        <VendorMainOverview active={setActiveItem} />
                    </section>
                </div>
                : <div> Please choose any event first!</div>}
        </>
    );
};

export default Overview;