import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import Rating from '@mui/material/Rating';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import UnsplashImages from './UnsplashImages';
import Heart from "react-animated-heart";
import { useSnackbar } from './SnackbarContext';
import { updateDataInMongo, createDataInMongo, readSingleDataFromMongo, DeleteDataInMongo, readDataFromMongoWithParam } from '../../api/mongoRoutingFile'
import VendorReviewList from './VendorReviewList';
import Modal from './ModalPopupBox';
import { getBudgetItemCategory } from '../utils/VendorCategory';

ModuleRegistry.registerModules([ClientSideRowModelModule]);
const rowSelection = {
    mode: 'singleRow',
    headerCheckbox: false,
    checkboxSelection: true,
    selectActiveRow: true,
    suppressRowClickSelection: true,
    suppressRowMouseEvents: true,
};



const VendorTogatherDetailedPage = ({ vendorData }) => {
    // console.log(vendorData, '===-----------');
    const showSnackbar = useSnackbar();

    const [selectedPackage, setSelectedPackage] = useState([]);
    const [packageData, setPackageData] = useState([
        {
            package_name: "Basic Package",
            package_price: `$ ${vendorData.basic_plan_price}`,
            package_includes: vendorData.basic_plan_includes

        },
        {
            package_name: "Advance Package",
            package_price: `$ ${vendorData.advance_plan_price} `,
            package_includes: vendorData.advance_plan_includes

        },
        {
            package_name: "Premium Package",
            package_price: `$ ${vendorData.premium_plan_price} `,
            package_includes: vendorData.premium_plan_includes

        }
    ]);
    const [isClick, setClick] = useState(false);
    const [favoriteID, setFavoriteID] = useState(null);

    const [booked, setBooked] = useState(false);
    const [bookedID, setBookedID] = useState(null);
    const [vendorMainData, setVendorMainData] = useState(vendorData);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("user-info")));
    const [userEmail, setUserEmail] = useState(JSON.parse(localStorage.getItem("user-info")).email);

    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

    const [bookingData, setBookingData] = useState(null);

    const [vendorID, setVendorID] = useState(vendorData._id);
    const [value, setValue] = React.useState(2);
    const [reviewMessage, setReviewMessage] = useState('');
    const [rating, setRating] = useState(0);

    const [reviewList, setReviewList] = useState([]);
    const [overallRating, setOverallRating] = useState(0);
    const [columnDefs, setColumnDefs] = useState([
        { field: 'package_name', headerName: 'Package', editable: false },
        { field: 'package_price', headerName: 'Price', editable: false },
        { field: 'package_includes', headerName: 'Includes', editable: false },

    ]);

    useEffect(() => {

        handleCheckBookedEvent();
        handleCheckFavEvent();
    }, [vendorID, eventID, userEmail]);

    useEffect(() => {

        readReviews();

    }, [vendorID]);

    const handleCheckBookedEvent = async () => {
        try {

            const queryParams = {
                and: [
                    { business_id: vendorID },
                    { eventID: eventID },
                    { email: userEmail }
                ]
            };

            const result = await readDataFromMongoWithParam('booked_vendors', JSON.stringify(queryParams));

            if (result && result.length > 0) {
                // console.log(result, 'sss');
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
            const queryParams = {
                and: [
                    { business_id: vendorID },
                    { eventID: eventID },
                    { email: userEmail }
                ]
            };
            const result = await readDataFromMongoWithParam('favorites', JSON.stringify(queryParams));

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

    }, [selectedPackage]);

    useEffect(() => {

    }, [bookedID]);

    useEffect(() => {

    }, [favoriteID]);

    const onRowSelected = (params) => {
        const selectedRows = params.api.getSelectedRows();
        //  console.log(selectedRows);
        setSelectedPackage(selectedRows);

    };

    const handleBookNow = () => {

        if (selectedPackage.length == 0) {
            showSnackbar("Error", "Please select the package");
        } else {

            const data = vendorData;
            delete data._id;
            const bookNowData = {
                business_name: data.business_name,
                business_email: data.business_email,
                business_phone: data.business_phone,
                business_location: data.business_location,
                business_type: data.business_type,
                business_description: data.business_description,
                years_of_experience: data.years_of_experience,
                pricing_method: data.pricing_method,
                package_name: selectedPackage[0].package_name,
                package_price: selectedPackage[0].package_price,
                package_includes: selectedPackage[0].package_includes,
                business_id: vendorID,
                email: userEmail,
                eventID: eventID,
            }

            //  console.log(bookNowData);
            createDataInMongo('booked_vendors', bookNowData).then(response => {

                console.log('Response from createdData:', response._id);
                showSnackbar('Vendor booked succesfully');
                setBookedID(response._id);
                setBooked(true);

                saveAsBudgetItem(bookNowData);

            }).catch(error => {
                console.error('Failed to update data:', error);
            });



        }

    }

    const saveAsBudgetItem = (data) => {
        const eventData = readSingleDataFromMongo('events', data.eventID).then(res => {
            console.log('Event Data is here::::::::::: ', res);
            console.log('ENTIRE DATA::::::::::::', data)
            const myEvent = res;
            const itemCategory = getBudgetItemCategory(data.business_type);
            let itemPrice = 0;
            try {
                // itemPrice = parseFloat(data.package_price);
                itemPrice = parseFloat(data.package_price.substring(2));
            } catch (e) {
                console.log(e);
            }
            const newBudgetItem = {
                id: Date.now(),
                itemName: data.business_name,
                estimateAmount: itemPrice,
                paidAmount: '',
                dueAmount: itemPrice,
                totalCost: '',
                budgetPercent: '',
                budgetCategory: itemCategory
            }
            myEvent.budgetItems.push(newBudgetItem);

            let sumOfBudgetEstimate = 0;
            myEvent.budgetItems.map(item => {
                sumOfBudgetEstimate += parseFloat(item.totalCost && item.totalCost > 0 ? item.totalCost : item.estimateAmount);
            });

            myEvent.budgetItems.map(item => {
                if (item.estimateAmount > 0) {
                    item.budgetPercent = (((item.totalCost && item.totalCost > 0 ? item.totalCost : item.estimateAmount) / sumOfBudgetEstimate) * 100).toFixed(2);
                } else {
                    item.budgetPercent = 0;
                }
            })


            const eventId = myEvent._id;
            delete myEvent._id;
            const updatedEvent = myEvent;

            const result = updateDataInMongo('events', eventId, updatedEvent).then(response => {
                myEvent._id = eventId;
                showSnackbar('Added as a budget item!');
            })
        });
    }

    const handleUnBookNow = () => {
        DeleteDataInMongo('booked_vendors', bookedID).then(response => {
            console.log('Response from updateData:', response);
            // toast('Deleted Successfully')
            showSnackbar('Booking has been removed.');
            setBooked(false);

        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }


    const handleFavorites = () => {


        if (isClick == false) {
            const data = vendorData;
            delete data._id;
            const favData = {
                ...data,
                business_id: vendorID,
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
            place_id: vendorData._id,
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


    }

    const readReviews = async () => {



        const queryParams = {
            and: [
                { place_id: vendorID },

            ]
        };

        const result = await readDataFromMongoWithParam('reviews', JSON.stringify(queryParams));

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
                            <UnsplashImages
                                query={vendorData.business_name}
                                numberOfImages={'1'}
                                randomPage={'1'}
                            />
                        </div>
                        <div className="vendor-detail-content">
                            <div className="vendor-detail-content-left">
                                <h4>{vendorData.business_name}</h4>
                                <Rating name="read-only" value={Number(overallRating)} readOnly />
                                <p>{vendorData.business_location}</p>
                            </div>
                            <div className="vendor-detail-content-right">
                                <Heart isClick={isClick} onClick={handleFavorites} />
                                {booked ? <button className="button-purple-fill" onClick={handleUnBookNow}>Cancel Booking</button> : <button className="button-purple-fill" onClick={handleBookNow}>Book Now</button>}
                            </div>
                        </div>
                    </div>
                </section>
                <hr />
                <section className='vendor-detail-page-content'>
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
                </section>
               
                {
                    !booked ? 
                    <>
                    <hr />
                <section className='vendor-detail-package'>
                    <div className="vendor-package-container">
                        <h3>App-Only Exclusive Vendor Pricing!</h3>
                        <h5>(Select a package before booking)</h5>
                        <div className="vendor-package-list">
                            <div className={"ag-theme-quartz"} style={{ width: "100%", maxWidth: 700, height: 500, margin: "0 auto" }}>
                                {/* <button onClick={onDeleteSelected}>Delete Selected</button> */}
                                <AgGridReact
                                    rowData={packageData}
                                    columnDefs={columnDefs}
                                    rowSelection={rowSelection}
                                    pagination={false}
                                    paginationPageSize={10}
                                    paginationPageSizeSelector={[10, 25, 50]}
                                    onRowSelected={onRowSelected}

                                />
                            </div>
                        </div>
                    </div>
                </section>
                </>
                :<></>
                 }
                <hr />
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
                                                    defaultValue={2}
                                                />
                                            </div>
                                            <div className="form-fields">
                                                <label htmlFor='sheet_name'>Review</label>
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

export default VendorTogatherDetailedPage
