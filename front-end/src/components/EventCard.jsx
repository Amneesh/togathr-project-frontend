import React, { useState , useEffect} from "react";
import '../css/EventCard.css';
import UnsplashImages from './UnsplashImages';
import { createDataInMongo , formatDate} from "../../api/mongoRoutingFile";
import TextToggle from './TextToggle';
import AOS from "aos";
import "aos/dist/aos.css";
const EventCard = ({ event, onClick }) => {

       
    return (
        <div className="event-card" >

            <div className="card-image" onClick={onClick}>
                <UnsplashImages query={event.eventType} numberOfImages={'1'}  randomPage={'2'}/>
            </div>

            <div className="event-card-content">
                <h4>{event.eventName}</h4>
                <p><i className="fa-regular fa-calendar"></i> {formatDate(event.eventDate)}</p>
                <div className='event-location'><i className="fa-solid fa-location-dot"></i>  <TextToggle  text={event.location} maxLength={10} /> </div>
            </div>
        </div>
    );
};

export default EventCard;