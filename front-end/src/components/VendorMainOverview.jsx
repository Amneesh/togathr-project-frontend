import React from 'react'
import testImage from '../resources/assets/Images/togather-image-2.webp'
const vendors = [
    {
        id: 1,
        name: "Vendor e",
        image: testImage,
        price: "$10",
        place: "Location One",
        rating: 4.5
    },
    {
        id: 2,
        name: "Vendor Two",
        image: testImage,
        price: "$15",
        place: "Location Two",
        rating: 4.0
    },
    {
        id: 3,
        name: "Vendor Three",
        image: testImage,
        price: "$20",
        place: "Location Three",
        rating: 5.0
    }
];
const VendorCard = ({ vendor }) => {
    return (
        <div className="ven-card">
            <div className="ven-header">
                <img src={vendor.image} alt={vendor.name} />
            </div>
            <div className="ven-footer">
                <h4>{vendor.name}</h4>
                <p>Starts from : {vendor.price}</p>
                <div className="ven-footer-content">
                    <p><i className="fa-solid fa-location-dot"></i> {vendor.place}</p>
                    <p>&#11088; {vendor.rating}</p>
                </div>
            </div>
        </div>
    );
};
const VendorMainOverview = ({active}) => {
    return (
        <div className='vendor-main-overview'>
            <div className='vendor-main-overview-header'>
                <h3>Chosen Vendors</h3>
                <div className="vendor-header-content">
                    <h4>Choose from 500+ of the best rated vendors on ToGathr</h4>
                    <button className='button-purple-fill' onClick={(e)=>active('vendors')}>View Vendors</button>
                </div>
            </div>
            {/* <div className='vendor-main-overview-footer'>
                <div className="vendor-footer-header">
                    <h3>Vendor Suggestions</h3>
                    <button className='button-purple' >View All</button>
                </div>
                <div className='vendor-footer-cards'>

                    {vendors.map(vendor => (
                        <VendorCard key={vendor.id} vendor={vendor} />
                    ))}

                </div>

            </div> */}

        </div>
    )
}

export default VendorMainOverview
