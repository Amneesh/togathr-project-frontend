// import React, { useEffect, useState } from 'react';
// // import '../css/VendorDetailDescription.css';
// import { readDataFromMongo } from '../../../back-end/mongoRoutingFile.js';

// const FavVendors = () => {
//   const [favVendorData, setFavVendorData] = useState();
//   const userData = localStorage.getItem("user-info");
//   const userDataObj = JSON.parse(userData);
//   const userEmail = userDataObj.email;
//   const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

//   useEffect(() => {
    
//     getData();
//   }, []);

//   const getData = () => {
//     console.log('Fetching favorite vendors for user:', userEmail, eventID);    
//     readDataFromMongo('favorites', userEmail, eventID).then(response => {
//       console.log('Response from favorites:', response);
//       setFavVendorData(response); 
//     });
//   };

//   const getDataFromDB = () => {
//     console.log('Fetching favorite vendors for user:', userEmail, eventID);
//   }

//   return (
//     <div className='grid-book'>
//       {(favVendorData && (favVendorData.length > 0)) ? (
//         favVendorData.map((vendor, index) => (
//           <article className="other-photog" key={index}>
//             <img
//               className="image2"
//               alt={vendor.name}
//               src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${vendor.photos?.[0]?.photo_reference}&key=AIzaSyBP_kVHT7Zcd117_K3IYr5BNHaRH5htk6E` || "placeholder-image-url"}
//             />
//             <div className="pad-photo">
//               <div>
//                 <strong>{vendor.name}</strong>
//                 {/* Optionally add price or other details */}
//               </div>
//               <div className="flex-photog">
//                 <p>{vendor.vicinity}</p>
//                 <p>{vendor.rating ? `${vendor.rating}/5` : "No rating"}</p>
//               </div>
//             </div>
//           </article>
//         ))
//       ) : (
//         <p>No Favorites Yet!</p>
//       )}
//     </div>
//   );
// };

// export default FavVendors;