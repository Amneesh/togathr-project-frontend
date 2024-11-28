// import React, { useEffect, useState } from "react";
// import "../css/VendorDetailDescription.css";
// import dummyData from "../utils/dummyData.json";
// import {
//   createDataInMongo,
//   getOverviewData,
//   readDataFromMongo,
//   readDataFromMongoBasedOnPlaceId,
// } from "../../../back-end/mongoRoutingFile";
// import Modal from "./ModalPopupBox";
// import axios from "axios";
// import BudgetCategory from "../utils/BudgetCategory";

// const VendorDetailDesc = ({ vendorData, getVendorType, isToGathrVendorSelected }) => {
//   const [infoData, setInfoData] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [review, setReview] = useState([]);
//   const [placeID, setplaceID] = useState(vendorData.place_id);
//   const [name, setName] = useState("");
//   const [rating, setRating] = useState(0);
//   const userData = localStorage.getItem("user-info"); //new
//   const userDataObj = JSON.parse(userData);
//   const userEmail = userDataObj.email;

//   const [vendorCategory, setVendorCategory] = useState(BudgetCategory.MISC);
//   // const [budgetItemName, setBudgetItemName] = useState('Vendor Booking');
//   const [selectedPackagePrice, setSelectePackagePrice] = useState(0);

//   useEffect(() => {
//     console.log("vendorData", vendorData, getVendorType, isToGathrVendorSelected);
//     // console.log(dummyData)
//     dummyData.map((el) => {
//       if (vendorData && vendorData.types && (vendorData.types.some((type) => type === el.category))) {
//         setVendorCategory(el.item_type);
//         console.log("BUDGET CATEGROY: --------------", el.item_type);
//         el.rating.map((ratingEl) => {
//           if (vendorData.rating <= 3) {
//             if (ratingEl.val <= 3) {
//               console.log("BELOW 3", ratingEl.packages);
//               setInfoData(ratingEl.packages);
//             }
//           } else {
//             if (ratingEl.val > 3) {
//               console.log("ABOVE 3", ratingEl.packages);
//               setInfoData(ratingEl.packages);
//             }
//           }
//         });
//       }
//     });
//   }, [vendorData]);

//   const handleBookNow = (vendorsData, typeOfSave) => {
//     const userData = localStorage.getItem("user-info");
//     const userDataObj = JSON.parse(userData);
//     const userEmail = userDataObj.email;
//     const eventId = localStorage.getItem("eventId");

//     const bookNowData = {
//       ...vendorsData,
//       email: userEmail,
//       eventID: eventId,
//       type: typeOfSave,
//     };
//     //console.log('testAamn', bookNowData);

//     createDataInMongo("booked_vendors", bookNowData).then((response) => {
//       console.log(
//         "Budget Item Name is being set to: ====================",
//         getVendorType.vendorName
//       );
//       const budgetItem = {
//         itemName: vendorData.name,
//         budgetCategory: "Miscellaneous",
//         estimateAmount: parseFloat(selectedPackagePrice),
//         paidAmount: parseFloat(0),
//         dueAmount: parseFloat(selectedPackagePrice),
//         totalCost: parseFloat(0),
//         budgetPercent: parseFloat(10),
//       };

//       addItemToBudget(budgetItem);
//     });
//   };

//   const addItemToBudget = (budgetItem) => {
//     console.log("EVENT ID: to be fetch event: ", vendorData.eventID);
//     console.log("Item to be added is: ", budgetItem);
//     alert("Item added to Budget List!");
//   };

//   // Function to fetch reviews for the specific vendor
//   const getReviews = async () => {
//     try {
//       console.log("place id", vendorData.place_id);
//       const response = await readDataFromMongoBasedOnPlaceId(
//         "reviews",
//         vendorData.place_id
//       );
//       console.log("Response from readReviews:", response);
//       if (Array.isArray(response)) {
//         setReviews(response); // Replace the current list with fetched reviews
//       }
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
    
//   };

//   // Fetch reviews when the component mounts or when the vendor ID changes
//   useEffect(() => {
//     if (vendorData && vendorData.place_id) {
//       getReviews();
//     }
//   }, [vendorData]);

//   const handleCloseReview = async () => {
//     console.log("close the review");
//   };

//   // Handle adding a new review
//   const handleAddReview = async (name, review, rating) => {
//     console.log(
//       "Adding review:",
//       review,
//       "for place_id:",
//       vendorData.place_id,
//       name,
//       rating
//     );
//     const data = {
//       review: review,
//       place_id: vendorData.place_id,
//       userEmail: userEmail,
//       name: name,
//       rating: rating,
//     };

//     try {
//       const response = await createDataInMongo("reviews", data);
//       console.log("Response from creating review:", response);

//       if (response && response._id) {
//         console.log("Review successfully added with ID:", response._id);

//         setReview(""); // Clear the input field
//         getReviews(); // Refresh the reviews list
//       } else {
//         console.warn("Failed to add review");
//       }
//     } catch (error) {
//       console.error("Error saving review:", error);
//     }
//   };

//   const handleGetPackage = (e) => {
//     console.log(e.target.value);
//     const index = e.target.value;
//     setSelectePackagePrice(infoData[index].price);
//     console.log(
//       "Selected Item price: ===================",
//       infoData[index].price
//     );
//   };

//   const handleAddToFavorites = () => {
//     const eventId = localStorage.getItem("eventId");
//     const favoriteVendorData = {
//       ...vendorData,
//       email: userEmail,
//       vendorId: vendorData.place_id,
//       eventID: eventId, // Using place_id as unique identifier for the vendor
//     };

//     // Save to MongoDB in the "favorites" collection
//     createDataInMongo("favorites", favoriteVendorData).then((response) => {
//       console.log("Vendor added to favorites:", response);
//       alert("Vendor added to favorites!");
//     });
//   };

//   return (
//     <>
//       <main>
//         <section>
//           <article className="banner">
//             <img
//               src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${(vendorData && vendorData.photos && vendorData.photos[0] && vendorData.photos[0].photo_reference) ? (vendorData.photos[0]?.photo_reference) : ''}&key=AIzaSyBP_kVHT7Zcd117_K3IYr5BNHaRH5htk6E`}
//               alt=""
//             />
//             <div className="pos">
//               <div className="flex-1">
//                 <h1>{vendorData.name ? vendorData.name : "Name"}</h1>
//                 <div className="hrt">
//                   <button onClick={handleAddToFavorites}>
//                     <i className="fa-solid fa-heart"></i>
//                   </button>
//                   <button
//                     className="button-1"
//                     onClick={(e) => handleBookNow(vendorData, "book")}
//                   >
//                     Book now
//                   </button>
//                 </div>
//               </div>

//               <div className="stars">
//                 <p>{vendorData.rating ? vendorData.rating : "3.0"}</p>
//                 <p>{vendorData.user_ratings_total}</p>
//               </div>
//               <div>
//                 <div className="address">
//                   <p>
//                     {" "}
//                     <i className="fa-solid fa-location-dot"></i>{" "}
//                     {vendorData.vicinity
//                       ? vendorData.vicinity
//                       : "7961 140 St, Surrey, BC V3W 5K5"}{" "}
//                   </p>
//                   <p>
//                     <i className="fa-brands fa-facebook"></i>
//                   </p>
//                 </div>

//                 <div className="phone-inst">
//                   <p>
//                     {" "}
//                     <i className="fa-solid fa-phone"></i> 778-123-4567
//                   </p>
//                   <p>
//                     <i className="fa-brands fa-instagram"></i>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </article>
//         </section>

//         <section>
//           <article className="package">
//             <strong className="s1">App-Only Exclusive Vendor Pricing!</strong>
//             <p>(Select a package before booking)</p>
//           </article>
//         </section>
//         <section className="non-tab">
//           {infoData.map((el, index) => (
//             <article key={index} className="package-1">
//               <form />
//               <label htmlFor="basic-package">
//                 <input
//                   type="checkbox"
//                   id="basic-package"
//                   name="basic-package"
//                 />
//                 {el.type} Package
//               </label>{" "}
//               <br />
//               <strong>price</strong>
//               <p>{el.price}</p>
//               <strong>includes</strong>
//               <strong>{el.description}</strong>
//               {/* <p>- 2-hour session</p>
//                         <p>- 20 edited digital photos</p>
//                         <p> - Online gallery</p> */}
//             </article>
//           ))}
//         </section>

//         <section className="table-1">
//           <table>
//             <thead>
//               <tr>
//                 <th className="checkbox">Select Package</th>
//                 <th>Package</th>
//                 <th>Price</th>
//                 <th>Includes</th>
//               </tr>
//             </thead>
//             <tbody>
//               {infoData.map((el, index) => (
//                 <tr key={index}>
//                   <td className="checkbox">
//                     <input
//                       type="radio"
//                       name="package"
//                       value={index}
//                       onChange={handleGetPackage}
//                     />
//                   </td>
//                   <td>{el.type} Package</td>
//                   <td className="price">{el.price}</td>
//                   <td>
//                     <ul>
//                       <li>{el.description}</li>
//                     </ul>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* <section>
//                     <article>
//                         <strong>Scenes of Success </strong>
//                     </article>
//                 </section> */}
//         <section>
//           <div className="review-data">
//             <h4>Ratings and Reviews</h4>

//             {reviews.length > 0 ? (
//               <div className="rev">
//                 <ul>
//                   {reviews.map((rev, place_id) => (
//                     <li key={place_id}>
//                       <div className="flex-rating">
//                         <p>
//                           {" "}
//                           {rev.rating} <i class="fa-solid fa-star"></i>{" "}
//                         </p>
//                         <p> {rev.name}</p>
//                       </div>

//                       <p> {rev.review}</p>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ) : (
//               <p>No reviews available for this vendor.</p>
//             )}
//           </div>

//           <article className="buttons">
//             {/* <button className="button-2">View more</button> */}
//             <Modal
//               buttonId="writeReview"
//               buttonLabel="Write a Review"
//               modalHeaderTitle="Write a Review"
//               modalBodyContent={
//                 <form>
//                   <div className="form-fields">
//                     <label htmlFor="name">Name:</label>
//                     <input
//                       id="name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       placeholder="Enter your name"
//                       style={{
//                         border: "1px solid rgb(171, 170, 170)",
//                         width: "100%",
//                         borderRadius: "20px",
//                         padding: "10px",
//                       }}
//                       required
//                     />
//                     <label htmlFor="review">Review:</label>
//                     <textarea
//                       id="review"
//                       name="review"
//                       value={review}
//                       onChange={(e) => setReview(e.target.value)}
//                       placeholder="Write your review here"
//                       required
//                       rows="4"
//                       style={{
//                         display: "block",
//                         width: "100%",
//                         padding: "8px",
//                         marginTop: "5px",
//                       }}
//                     ></textarea>
//                     <label htmlFor="rating">Rating (1-5):</label>
//                     <select
//                       id="rating"
//                       value={rating}
//                       onChange={(e) => setRating(Number(e.target.value))}
//                       required
//                     >
//                       <option value="" disabled>
//                         Select rating
//                       </option>
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <option key={star} value={star}>
//                           {star} Star{star > 1 ? "s" : ""}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </form>
//               }
//               saveDataAndOpenName="Submit"
//               saveDataAndOpenId="submit"
//               saveDataAndOpenFunction={() =>
//                 handleAddReview(name, review, rating)
//               }
//               saveDataAndCloseName="Cancel"
//               saveDataAndCloseId="cancel"
//               saveDataAndCloseFunction={() => handleCloseReview()}
//               buttonAlign="row"
//               onModalClose={() => console.log("Modal closed")}
//               closeModalAfterDataSend="true"
//             />
//           </article>
//           <div></div>
//           <div></div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default VendorDetailDesc;
