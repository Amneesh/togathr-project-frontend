import React from 'react';
import '../css/EventCard.css';
import UnsplashImages from './UnsplashImages';

const EventCard = ({ event, onClick }) => {
    return (
        <div className="event-card" onClick={onClick}>

            <div className="card-image">
                <UnsplashImages query={event.eventType} numberOfImages={'1'}  randomPage={'1'}/>
            </div>

            <div className="event-card-content">
                <h4>{event.eventName}</h4>
                <p><i className="fa-regular fa-calendar"></i> {new Date(event.eventDate).toLocaleDateString()}</p>
                <p><i className="fa-solid fa-location-dot"></i> {event.location}</p>
            </div>
        </div>
    );
};

export default EventCard;