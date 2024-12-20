import React, { useEffect, useState } from "react";
import "../css/AllEvents.css";
import Modal from "./ModalPopupBox";
import UnsplashImages from './UnsplashImages';
import TextToggle from './TextToggle';

import { createDataInMongo, formatDate, DeleteDataInMongo } from "../../api/mongoRoutingFile";
import { saveTasksToDatabase } from "../../api/loginApi";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import generateAITaskList from "../../api/generateTasklistAI";
import TogathrLoader from "./TogathrLoader";

import { useSnackbar } from './SnackbarContext';

const AllEvents = ({ setEventId, myEvents, setMyEvents, setActiveItem }) => {

  const [loader, setloader] = useState(null);
  // const [userInfo, setUserInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const data = localStorage.getItem("user-info");
    const userData = JSON.parse(data);
    setUserInfo(userData);
  }, []);
  const addNewEventToMyEvents = (newEvent) => {
    if(myEvents.length > 0){
      setMyEvents((myEvents) => [...myEvents, newEvent]);
    }
   
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
      createDataInMongo("events", eventData).then((response) => {
        localStorage.setItem("eventId", response._id);
        setEventId(response._id);
        console.log("Response I got after crating new event: ", response);
        const updatedEventData = { ...eventData, _id: response._id };
        generateAndSaveTaskList(eventType, response._id);
        alert("Event successfully created!");
        showSnackbar('Event successfully created.');

        snack
        setActiveItem("overview");
        addNewEventToMyEvents(updatedEventData);
      });

      // Reset form
      setEventName("");
      setEventType("");
      setEventDate("");
      setLocation("");
      setGuestCount("");
      setMaxBudget("");
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      // onClose();
    }
  };

  const generateAndSaveTaskList = async (eventType, eventId) => {
    console.log("data to pass", eventType, eventId);

    if (eventType) {
      const tasklist = await generateAITaskList(eventType);
      const taskArray = tasklist.split("\n");

      const dataToSend = {
        eventId: eventId,
        taskArray: taskArray,
      };
      saveTasksToDatabase(dataToSend)
        .then((response) => {
          console.log("Response from save tasks", response);
        })
        .catch((error) => {
          console.error("Failed to save tasks:", error);
        });
    }
  };

  // const [userInfo, setUserInfo] = useState(userData());
  // const [events, setEvents] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // console.log('List of my events: ', myEvents);
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll, "ll");
    setLocation(value);
    setCoordinates(ll);
  };

  const handleDelete = async (id) => {
    console.log(id);

    DeleteDataInMongo('events', id).then(response => {
        console.log('Response from updateData:', response);
        // toast('Deleted Successfully')
        showSnackbar('Deleted Successfully', 'Event has been deleted successfully.');
        // chooseExisting();
        setMyEvents((prevEvents) => prevEvents.filter(event => event._id !== id));
        localStorage.removeItem('eventId');
    })
        .catch(error => {
            console.error('Failed to update data:', error);
        });
}

  return (
    <>
      <div>
        <div className="intro-container">
          <h2>Plan the Perfect Event with ToGathr!</h2>
          <p>
            Effortlessly bring your vision to life with ToGathr - the ultimate
            platform for organizing memorable events.Whether it's an intimate
            gathering or a grand celebration, ToGathr guides you every step of
            the way. Start planning today and watch your event come together
            beautifully!
          </p>
          {/* <button className="create-event-btn" onClick={onCreateEvent}>
                        Create New Event
                    </button> */}
          <div>
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
                    {/* <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                /> */}
                    <PlacesAutocomplete
                      value={location}
                      onChange={setLocation}
                      select={handleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div>
                          <input
                            {...getInputProps({
                              placeholder: "Search Places...",
                            })}
                          />
                          <div>
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                              const style = {
                                color: suggestion.active
                                  ? "black"
                                  : "var(--primary-purple)",
                                backgroundColor: suggestion.active
                                  ? "var(--secondary-purple)"
                                  : "var(--secondary-purple)",
                              };
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                  key={suggestion.placeId}
                                >
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
                closeButtonName="Close"
                buttonAlign="row"
                onModalClose={() => console.log("Modal 1 closed")}
                closeModalAfterDataSend="true"
              />
            </div>
          </div>
        </div>
        <div className="up-event-container">


          {myEvents && myEvents.length > 0 ? (
            <h3 className="up-events"> Your upcoming events!</h3>
          ) : (
            <h3 className="up-events"> No upcoming events!</h3>
          )}

         
          <div className="event-list">
          {myEvents && myEvents.length == 0 ? <h4 className="no-events">No Events</h4> : <></>}
            {myEvents
              ? myEvents.map((event, index) => (

                <div className="event-card" >
              
                    <button className="delete-button" onClick={() => handleDelete(event._id)}><i className="fa-solid fa-trash-can"></i> </button>

                <div className="card-image"  onClick={() => {
                    setEventId(event._id);
                    setActiveItem("overview");
                    localStorage.setItem("eventId", event._id);
                  }}>
                    <UnsplashImages query={event.eventType} numberOfImages={'1'} randomPage={'1'} />
                </div>
    
                <div className="event-card-content">
                    <h4>{event.eventName}</h4>
                    <p><i className="fa-regular fa-calendar"></i> {formatDate(event.eventDate)}</p>
                    <div className='event-location'><i className="fa-solid fa-location-dot"></i>  <TextToggle text={event.location} maxLength={10} /> </div>
                </div>
            </div>
            
              ))
              : <div className="no-events"> <h3>No events</h3></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllEvents;
