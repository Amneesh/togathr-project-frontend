import React from 'react';
import { useState, useEffect } from 'react';
import { generateWorkspaceLink } from '../../api/loginApi.js';


export const EventDetail = () => {
    // const eventId = '613a3b65e544f12aef7f583b';
    // const [event, setEvent] = useState(null);
    const eventId = localStorage.getItem("eventId");
    const [shareableLink, setShareableLink] = useState('');
    const userData = localStorage.getItem("user-info");
    const userDataObj = JSON.parse(userData);
    const userId = userDataObj.email;

    const generateLink = async () => {
        try {
            const eventId = localStorage.getItem("eventId");
            if(eventId) {
                const result = await generateWorkspaceLink({ eventId });
                const link = result.data.shareableLink;
                setShareableLink(link);
            } else {
                setShareableLink('No event has been created yet');
            }
          
        } catch (error) {
            console.log(error)
        }
    }
    
  return true ? (
    <div>
        <h2>Event Name</h2>
        <p>Event Description</p>

        { userId && (
            <div>
                <button className="w-auto py-2 px-4 my-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                 onClick={generateLink}>Show Shareable Workspace Link</button>
                {shareableLink && <p>Share this link: <strong><a href={shareableLink}>{shareableLink}</a></strong></p>}
            </div>
        )}
    </div>
    ) : <p>Loading...</p>;
}
