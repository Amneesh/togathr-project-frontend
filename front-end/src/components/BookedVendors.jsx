// import React, { useEffect, useState } from 'react';
// import '../css/VendorDetailDescription.css';
// import { readDataFromMongo } from '../../../back-end/mongoRoutingFile';


// const BookedVendors = () => {
//   const [bookedVendorData, setBookedVendorData] = useState([]);
//   const userData = localStorage.getItem("user-info");
//   const userDataObj = JSON.parse(userData);
//   const userEmail = userDataObj.email;
//   const [eventID, setEventID] = useState(localStorage.getItem('eventId'));
  
//   useEffect(() => {
//     // Get initial event ID from localStorage
//     getEventID();

//     // Define a function to handle storage events
//     const handleStorageChange = (event) => {
//         if (event.key === 'eventId') {
//             getEventID(); // Update state with new event ID
//         }
//     };

//     // Listen for storage events (for changes from other tabs)
//     window.addEventListener('storage', handleStorageChange);

//     // Set up an interval to check for changes in the same tab
//     const intervalId = setInterval(() => {
//         const currentEventID = localStorage.getItem('eventId');
//         if (currentEventID !== eventID) {
//             getEventID(); // Update state if localStorage has changed
//         }
//     }, 1000); // Check every second

//     // Cleanup function
//     return () => {
//         window.removeEventListener('storage', handleStorageChange);
//         clearInterval(intervalId);
//     };
// }, [eventID]);

// const getEventID = () => {
//   const currentEventID = localStorage.getItem('eventId');
//   setEventID(currentEventID);
// };

//   const getData = () => {
//     console.log('eventIdAmn', eventID,  userEmail);

//     readDataFromMongo('booked_vendors', userEmail, eventID).then(response => {
//       console.log('Response from booked_vendors:', response);
//       setBookedVendorData(response);
//     });
//   }

//   useEffect(() => {
//     getData();
//   }, [eventID]);
    
//   return (
//     <div className='grid-book'>
//       {bookedVendorData.map((vendor, index) => (
//         <article className="other-photog" key={index}>
//           <img
//             className="image2"
//             alt={vendor.name}
//             src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${vendor.photos[0].photo_reference}&key=AIzaSyBP_kVHT7Zcd117_K3IYr5BNHaRH5htk6E` || "placeholder-image-url"}
//           />
//           <div className="pad-photo">
//             <div>
//               <strong>{vendor.name}</strong>
//               {/* <p>Starts from $2600/-</p> */}
//             </div>
//             <div className="flex-photog">
//               <p>{vendor.vicinity}</p>
//               <p>{vendor.rating ? `${vendor.rating}/5` : "No rating"}</p>
//             </div>
//           </div>
//         </article>
//       ))}
//     </div>
//   );
// }

// export default BookedVendors
