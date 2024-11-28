import Rating from '@mui/material/Rating';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";

const VendorReviewList = ({reviewMessage, rating, reviewOwner,reviewDate}) => {

    const [isExpanded, setIsExpanded] = useState(false);

    // Split the text into words
   const characterLimit = 100;

  // Check if the review message exceeds the character limit
  const shouldShowReadMore = reviewMessage.length > characterLimit;

    // Function to toggle the expanded state
    const toggleReadMore = () => {
        setIsExpanded((prev) => !prev);
    };



    return (
        <div className='review-container' >

            <div className="review-header">

                <div className="review-stars">
                <Rating name="read-only" value={Number(rating)} readOnly />

                </div>
                <p>|</p>
                <div className="review-date-time">
                    <p>{reviewOwner}</p>
                </div>
                <p>|</p>
                <div className="review-name">
                    <p>{reviewDate}</p>
                </div>

            </div>

            <div className="review-body">

                {/* Display only the first 15 words if not expanded */}
                <p>
                    {isExpanded
                        ? reviewMessage
                        : reviewMessage.substring(0, characterLimit) + (shouldShowReadMore ? "..." : "")}
                </p>
                {/* Show "Read More" button if the text has more than 15 words */}
                {shouldShowReadMore && (
                    <div className="show-button">
                    <button className="button-purple" onClick={toggleReadMore}>
                        {isExpanded ? "Read Less" : "Read More"}
                    </button>
                    </div>
                )}
            </div>


        </div>
    )
}

export default VendorReviewList
