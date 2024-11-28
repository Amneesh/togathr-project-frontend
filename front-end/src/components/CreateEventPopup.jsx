import React, { useEffect, useState } from 'react';
import '../css/createEvent.css';
import { createDataInMongo } from '../../api/mongoRoutingFile';
import { openAI, saveTasksToDatabase } from '../../api/loginApi';

const Popup = ({ isOpen, onClose, setActiveItem, setEventId, myEvents, setMyEvents }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [location, setLocation] = useState('');
    const [collaborators, setCollaborators] = useState('');
    const [guestCount, setGuestCount] = useState('');
    const [maxBudget, setMaxBudget] = useState('');

    useEffect(() => {
        const data = localStorage.getItem('user-info');
        const userData = JSON.parse(data);
        setUserInfo(userData);
    }, []);

    const addNewEventToMyEvents = (newEvent) => {
        setMyEvents((myEvents) => [...myEvents, newEvent]);
      };

    const createEvent = async (e) => {
        e.preventDefault();
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
        };

        try {
            createDataInMongo('events', eventData).then(response => {
                localStorage.setItem("eventId", response._id);
                setEventId(response._id);
                // console.log('Response I got after crating new event: ', response);
                const updatedEventData = { ...eventData, _id: response._id };
                generateAndSaveTaskList(eventType, createdBy, response._id);
                alert('Event successfully created!');
                setActiveItem('overview');

                addNewEventToMyEvents(updatedEventData);
            });

            // Reset form
            setEventName('');
            setEventType('');
            setEventDate('');
            setLocation('');
            setGuestCount('');

        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            onClose();
        }
    };

    const generateAndSaveTaskList = async (eventType, createdBy, eventId) => {
        console.log("data to pass", eventType, createdBy, eventId)

        if (eventType) {

            const request = `Make a task list for ${eventType} for the event planner, without the heading`;
            const response = await openAI(request);
            // console.log("response in component", response);
            const taskList = response.data.tasks;
            // console.log("des", response.data);
            const tasksArray = taskList.split("\n");
            // console.log('taskarray', tasksArray)
            // setTasks(tasksArray);

            const result = await saveTasksToDatabase({ tasksArray, createdBy, eventId });
            eventId = result.data.eventId;
            // console.log("response", eventId);
            localStorage.setItem("eventId", eventId);

        }
    }

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className='btn-close-create-event' type="button" onClick={onClose}>
                    <i className="fas fa-close mr-3 p-2"></i>
                </button>
                <h2>Create new event</h2>
                <form onSubmit={createEvent}>
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
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
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
                    <button className='btn-create-event' type="submit">Create Event</button>
                </form>
            </div>
        </div>



    );
};

export default Popup;