import React from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
const TeamCards = ({ title, description, imageUrl, linkedinURL }) => {
    return (
        <div  data-aos="flip-right"
        className="landing-page-team-card">
            <div className="team-card">
            
                <div className="team-card-content">
                <div className="team-card-image">
                        <img src={imageUrl} alt='team-member'/>
                    </div>
                    <div className="team-card-description">
                        <h3 className="team-card-title">{title}</h3>
                        <div className="team-profile">
                        <p className="team-card-text">{description}</p>
                        <a href={linkedinURL} target='_blank' rel='noopener noreferrer'> <i className="fa-brands fa-linkedin"></i> </a>
                        </div>
                       

                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeamCards
