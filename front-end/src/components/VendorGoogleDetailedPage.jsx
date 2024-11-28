
import Rating from '@mui/material/Rating';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import UnsplashImages from './UnsplashImages';
import Heart from "react-animated-heart";
import { useSnackbar } from './SnackbarContext';
import { updateDataInMongo, createDataInMongo, readSingleDataFromMongo, DeleteDataInMongo, readDataFromMongoWithParam } from '../../api/mongoRoutingFile'
import VendorReviewList from './VendorReviewList';
import Modal from './ModalPopupBox';

import noImageAvailable from '../resources/assets/Images/no-image-available.jpg'


const VendorGoogleDetailedPage = ({ vendorData }) => {
    console.log(vendorData, '===-----------');
    const showSnackbar = useSnackbar();

    const [selectedPackage, setSelectedPackage] = useState([]);

    const [isClick, setClick] = useState(false);
    const [favoriteID, setFavoriteID] = useState(null);

    const [booked, setBooked] = useState(false);
    const [bookedID, setBookedID] = useState(null);
    const [vendorMainData, setVendorMainData] = useState(vendorData);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
    const [userEmail, setUserEmail] = useState(JSON.parse(localStorage.getItem("user-info")).email);

    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

    const [bookingData, setBookingData] = useState(null);

    const [vendorID, setVendorID] = useState(vendorData.place_id);
    const [value, setValue] = React.useState(2);
    const [reviewMessage, setReviewMessage] = useState('');
    const [rating, setRating] = useState(0);

    const [reviewList, setReviewList] = useState([]);
    const [overallRating, setOverallRating] = useState(vendorData.rating || 0);


    useEffect(() => {

        handleCheckBookedEvent();
        handleCheckFavEvent();
    }, [vendorID, eventID, userEmail]);

    useEffect(() => {

        readReviews();

    }, [vendorID]);

    const handleCheckBookedEvent = async () => {
        try {
            const queryParams = new URLSearchParams({
                business_id: vendorID,
                eventID: eventID,
                email: userEmail,
            }).toString();

            const result = await readDataFromMongoWithParam('booked_vendors', queryParams);

            if (result && result.length > 0) {
                console.log(result);
                setBookingData(result);
                setBookedID(result[0]._id);
                console.log(true);
                setBooked(true);
            } else {
                console.log(false);
                setBooked(false);

            }
        } catch (error) {
            console.error('Error checking event:', error);
            setBookingExists(null); // Reset state on error
        }
    };

    const handleCheckFavEvent = async () => {
        try {
            const queryParams = new URLSearchParams({
                business_id: vendorID,
                eventID: eventID,
                email: userEmail,
            }).toString();

            const result = await readDataFromMongoWithParam('favorites', queryParams);

            if (result && result.length > 0) {
                console.log(result);
                setFavoriteID(result[0]._id);
                console.log(true);
                setClick(true);
            } else {
                console.log(false);
                setClick(false);

            }
        } catch (error) {
            console.error('Error checking event:', error);
            setClick(null); // Reset state on error
        }
    };



    useEffect(() => {

    }, [bookedID]);

    useEffect(() => {

    }, [favoriteID]);







    const handleFavorites = () => {


        if (isClick == false) {
            const data = vendorData;
            // delete data._id;
            const favData = {
                ...data,
                business_image: vendorData.imageUrl,
                business_name: vendorData.name,

                business_location: vendorData.vicinity,
                business_type: vendorData.types[0],

                business_id: vendorData.place_id,
                email: userEmail,
                eventID: eventID,
            }


            createDataInMongo('favorites', favData).then(response => {

                console.log('Response from createdData:', response._id);
                showSnackbar('Vendor added to favorites');
                setFavoriteID(response._id);
                setClick(true);


            }).catch(error => {
                console.error('Failed to update data:', error);
            });

        } else {
            DeleteDataInMongo('favorites', favoriteID).then(response => {
                console.log('Response from updateData:', response);
                // toast('Deleted Successfully')
                showSnackbar('Vendor removed from favorites.');
                setClick(false);


            })
                .catch(error => {
                    console.error('Failed to update data:', error);
                });

        }

    }

    const handleAddReview = async () => {


        const currentDateTime = new Date();
        const formattedDate = currentDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });




        const newReview = {
            place_id: vendorID,
            review_rating: rating,
            review_message: reviewMessage,
            review_date: formattedDate,
            review_owner: userInfo.name, // Add review owner if available
        };
        console.log('New review:', newReview);

        createDataInMongo('reviews', newReview).then(response => {
            console.log('Response from updateData:', response._id);
            showSnackbar('Thank you for your review!');


            readReviews();
            // toast('Data update successfully');
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });


        setReviewMessage('');

    }

    const readReviews = async () => {

        const queryParams = new URLSearchParams({
            place_id: vendorID,
        }).toString();

        const result = await readDataFromMongoWithParam('reviews', queryParams);

        if (result && result.length > 0) {
            console.log(result, '---------------------------');
            setReviewList(result);
            const singleDigitAverageRating = calculateSingleDigitAverageRating(result);
            setOverallRating(singleDigitAverageRating);
            console.log('Single-Digit Average Rating:', singleDigitAverageRating);

        } else {
            console.log('false');


        }

    }
    const calculateSingleDigitAverageRating = (reviews) => {
        const totalRatings = reviews.reduce((sum, review) => sum + review.review_rating, 0);
        const averageRating = totalRatings / reviews.length;
        return Math.round(averageRating); // Rounds down to the nearest whole number
    };

    const updateDataVendorBooking = async (collectionName, updatedData, newInsertedId) => {
        // event.preventDefault();
        // console.log(mongoData);
        // console.log(newInsertedId, 'newInserted---------------');
        // const data = {
        //     email: currentemailID,
        //     eventID: eventID,
        //     guestList: updatedData,
        //     guestListName: guestListName
        // }

        updateDataInMongo(collectionName, newInsertedId, data).then(response => {
            console.log('Response from updateData:', response);
            // toast('Data update successfully');
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    };
    return (
        <div className="vendor-togather-description-page">
            <div className='vendor-detail-page'>
                <section className='vendor-detail-page-header'>
                    <div className="vendor-detail-image-container">
                        <div className="vendor-detail-image">
                            {vendorData.imageUrl ?
                                <img src={vendorData.imageUrl} alt="Vendor Image" />
                                :
                                <img src={noImageAvailable} alt="Vendor Image" />
                            }

                        </div>
                        <div className="vendor-detail-content">
                            <div className="vendor-detail-content-left">
                                <h4>{vendorData.name}</h4>
                                <Rating name="read-only" value={Number(overallRating)} readOnly />
                                <p>{vendorData.vicinity}</p>
                            </div>
                            <div className="vendor-detail-content-right">
                                <Heart isClick={isClick} onClick={handleFavorites} />
                            </div>
                        </div>
                    </div>
                </section>
                <hr />
                {/* <section className='vendor-detail-page-content'>
                    <div className="vendor-detail-page-content">
                        <h3>BIO</h3>
                        <div className="vendor-detail-page-sub-content">
                            <div className="sub-content-description">
                                <h5>Info</h5> :
                                <p>{vendorData.business_description}</p>
                            </div>
                            <div className="sub-content-year">
                                <h5>In Business</h5> :   {vendorData.years_of_experience > 1
                                    ? <p>{vendorData.years_of_experience} Years</p> :
                                    <p>{vendorData.years_of_experience} Year</p>
                                }
                            </div>
                            <div className="sub-content-owner">
                                <h5>Owner</h5> :
                                <p>{vendorData.first_name} {vendorData.last_name}</p>
                            </div>

                        </div>
                    </div>
                </section> */}

                <section className='vendor-detail-footer'>
                    <div className="vendor-detail-footer-container">
                        <div className="vendor-detail-footer-container-header">
                            <h3>Ratings & Reviews</h3>
                        </div>
                        <div className="vendor-detail-footer-container-body">
                            {reviewList.length > 0 ?
                                <>
                                    <div className="review-all-list">
                                        {reviewList.map((review, index) => (
                                            <div
                                                className="vendor-custom-card"
                                                key={review._id}
                                            >
                                                <VendorReviewList reviewMessage={review.review_message} rating={review.review_rating} reviewOwner={review.review_owner} reviewDate={review.review_date} />
                                                <br />
                                            </div>

                                        ))}
                                    </div>
                                </>
                                : <p>No reviews yet</p>}

                        </div>
                        <div className="vendor-detail-footer-container-footer">
                            <div className='review-button' >

                                <Modal

                                    buttonId="write_review "
                                    buttonLabel="Write a review"

                                    modalBodyHeader="Your feedback matters!"
                                    // modalBodyHeader="Insert your body header here"
                                    modalBodyContent={
                                        <form>
                                            <div className="form-rating">
                                                <Rating
                                                    name="simple-uncontrolled"
                                                    onChange={(event, newValue) => {
                                                        console.log(newValue);
                                                        setRating(newValue);
                                                    }}
                                                    defaultValue={0}
                                                />
                                            </div>
                                            <div className="form-fields">
                                                <label htmlFor='sheet_name'>Sheet Name</label>
                                                <textarea type="text" id='review_message' name='review_message' onChange={(e) => { setReviewMessage(e.target.value) }} value={reviewMessage} />
                                            </div>
                                        </form>
                                    }
                                    saveDataAndOpenName="Submit"
                                    saveDataAndOpenId="Submit"
                                    saveDataAndOpenFunction={() => handleAddReview()}
                                    closeButtonID="Cancel"
                                    closeButtonName='Cancel'
                                    buttonAlign='row'
                                    onModalClose={() => console.log('Modal 1 closed')}
                                    closeModalAfterDataSend="true"




                                />

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default VendorGoogleDetailedPage
