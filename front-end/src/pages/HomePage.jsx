import React, { useState , useEffect} from 'react';
import SideBar from '../components/SideBar';
import MainContent from '../components/MainContent';
import CreateEventPopup from "../components/CreateEventPopup";

export const HomePage = () => {
  const [activeItem, setActiveItem] = useState('myevents');
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [eventId, setEventId] = useState(localStorage.getItem('eventId'));
  const [myEvents, setMyEvents] = useState();
  const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

  useEffect(() => {
    if(eventId == null){
      setActiveItem('myevents');
    }else{
      setActiveItem('overview')
    }
  }, [eventID]); 


  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <>
      <div className='container'>
        {eventId && ( // Only render SideBar if any event is selected
          <SideBar activeItem={activeItem} setActiveItem={setActiveItem} />
        )}
        <MainContent activeItem={activeItem} setActiveItem={setActiveItem} onCreateEvent={togglePopup} eventId={eventId} setEventId={setEventId} myEvents={myEvents} setMyEvents={setMyEvents}/>
        <CreateEventPopup isOpen={isPopupOpen} onClose={togglePopup} setActiveItem={setActiveItem} setEventId={setEventId} myEvents={myEvents} setMyEvents={setMyEvents}/>
      </div>
    </>
  );
}
