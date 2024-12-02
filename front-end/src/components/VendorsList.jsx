import React, { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Map } from "./Map";
import "../css/Vendor.css";
import {  readDataFromMongoWithParam } from "../../api/mongoRoutingFile";
import UnsplashImages from './UnsplashImages';
import noImageAvailable from '../resources/assets/Images/no-image-available.jpg'
// const VendorsList = ({getVendorType, currentlatitude, currentlongitude}) => {
import VendorTogatherDetailedPage from './VendorTogatherDetailedPage'
import VendorGoogleDetailedPage from './VendorGoogleDetailedPage'

const VendorsList = ({ getVendorType, currentLocation }) => {


  //console.log('vendor list', getVendorType, currentLocation);
  const userData = localStorage.getItem("user-info");
  const userDataObj = JSON.parse(userData);
  const userEmail = userDataObj.email;
  const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: currentLocation.lat,
    lng: currentLocation.long,
  });
  const [radius, setRadius] = useState(5000); // Default radius in meters (5 km)
  const [vendorType, setVendorType] = useState(getVendorType.vendorType); // Default vendor type
  const [detailDescriptionCard, setDetailDescriptionCard] = useState(false);

  const [vendors, setVendors] = useState([]);


  const [toGathrVendorPage, setTogatherVendorPage] = useState(false);
  const [googleVendorPage, setGoogleVendorPage] = useState(false);

  const [toGathrVendors, setToGathrVendors] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedToGathrVendor, setSelectedToGathrVendor] = useState(null);
  const [activeTab, setActiveTab] = useState('tab1');
  const [isToGathrVendor, setIsToGathrVendor] = useState(true);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    console.log(ll, "ll");
    setAddress(value);
    setCoordinates(ll);
  };

  const selectedVendorSelection = (vendorSelection) => {

    setGoogleVendorPage(true);
    setTogatherVendorPage(false);


    setDetailDescriptionCard(true);
    setSelectedVendor(vendorSelection);
    setIsToGathrVendor(false);
    console.log(vendorSelection, "saassasassa", isToGathrVendor);
  };

  const selectedToGathrVendorSelection = (vendorSelection) => {
    console.log(vendorSelection, '3333----');
    setGoogleVendorPage(false);
    setTogatherVendorPage(true);
    setSelectedToGathrVendor(vendorSelection);

    setSelectedVendor(false);

    setDetailDescriptionCard(true);
    setIsToGathrVendor(true);
    console.log(vendorSelection, "saassasassa", isToGathrVendor);
  };

  // Fetch vendors based on coordinates, radius, and vendor type
  useEffect(() => {
    console.log(coordinates, radius, vendorType, "useEffect in list");
    fetchNearbyVendors();
    fetchToGathrVendors();
  }, [coordinates, radius, vendorType]);

  const fetchNearbyVendors = async () => {
    const location = `${coordinates.lat},${coordinates.lng}`;
    console.log(location, vendorType, radius);

    const url = `https://togather-project-backend.vercel.app/api/googlePlaces?location=${location}&type=${vendorType}&radius=${radius}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchToGathrVendors = async () => {
    console.log('vendortype', location, vendorType, radius);

    try {
   

      const queryParams = {
        and: [
            { business_type: vendorType}
        ]
    };
      const result = await readDataFromMongoWithParam('vendor_data', JSON.stringify(queryParams));

      if (result && result.length > 0) {
          console.log(result + '6666666666');
          setToGathrVendors(result);
        } else {
          console.log(false);
      }
  } catch (error) {
      console.error('Error checking event:', error);
     
  }
  
  };

  const handleComponentChangeStatus = () => {
    setDetailDescriptionCard(!detailDescriptionCard);
    setGoogleVendorPage(false);
    setTogatherVendorPage(false);
  };

  const handleTabClick = async (tab) => {
    setActiveTab(tab);
    // setDetailDescriptionCard(!detailDescriptionCard);
  };

  return (
    <div className="vendor-page">
      {/* {detailDescriptionCard ? (
       <>
       </>
      ) : (
        <></>
      )} */}

      {!detailDescriptionCard ? (
        <>
          <div className="vendor-header">
            <div className="vendor-header-title">
              <h2>{getVendorType.vendorName}</h2>
              <div className="vendor-header-search">
                <PlacesAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={handleSelect}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({ placeholder: "Search Places..." })}
                      />
                      <div className="search-box-places">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active
                              ? "#a8dadc"
                              : "#fff",
                          };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, { style })}
                              key={suggestion.placeId}
                            >
                              {suggestion.description}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
            </div>

            <div className="vendor-search-radius-filter">
             
              <div className="vendor-radius">
                <label htmlFor="radius">Radius: {radius} meters</label>
                <input type="range" id="radius" min="1000" max="20000" step="500" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <div className="vendor-body">
            <div className="vendor-map">
              <Map vendors={vendors} />
            </div>

           
          </div>

          <div className="tabs vendors-tabs">
            <button
              onClick={() => handleTabClick("tab1")}
              className={activeTab === "tab1" ? "active" : ""}
            >
              ToGathr Vendors
            </button>
            <button
              onClick={() => handleTabClick("tab2")}
              className={activeTab === "tab2" ? "active" : ""}
            >
              Google Vendors
            </button>
          </div>

          <div
            className="vendor-footer"
            style={{ display: activeTab === "tab1" ? "block" : "none" }}
          >
            {toGathrVendors && toGathrVendors.length > 0 ? (
              <div className="vendor-all-cards">
                {toGathrVendors.map((vendor, index) => (
                  <div
                    className="vendor-custom-card"
                    key={vendor._id}
                    onClick={() => selectedToGathrVendorSelection(vendor)}
                  >
                    <div className="vendor-card-image">
                      <UnsplashImages
                        query={vendor.business_name}
                        numberOfImages={'1'}
                        randomPage={'1'}
                      />
                    </div>
                    <div>
                      {/* <button >

                    <div className="vendor-body">
                        <div className="vendor-map">
                            <Map vendors={vendors} />
                        </div>


                        <div className='vendor-radius'>
                            <label htmlFor="radius">Radius: {radius} meters</label>
                            <input
                                type="range"
                                id="radius"
                                min="1000"
                                max="20000"
                                step="500"
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className='vendor-footer'>

                        {vendors.length > 0 ? (
                            <div className='vendor-all-cards'>
                                {vendors.map((vendor) => (
                                    <div className='vendor-custom-card' key={vendor.place_id} onClick={() => selectedVendorSelection(vendor)}>

                                        <div className='vendor-card-image'>

                                            {/* <UnsplashImages query={getVendorType.vendorName} numberOfImages={'1'} /> */}

                                            {vendor.photos && vendor.photos.length > 0 && (



                                                <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${vendor.photos[0].photo_reference}&key=${GOOGLE_PLACES_KEY}`} alt={vendor.name} />
                                            )}
                                        </div>
                                        <div>
                                        {/* <button >
                    <i className="fa-solid fa-heart"></i>
                  </button> */}
                    </div>
                    <div className="vendor-card-info">
                      <div className="vendor-card-content">
                        <h5>{vendor.business_name}</h5>
                        {/* <p>Contact no.: {vendor.user_phone}</p> */}
                        <p>{vendor.business_location}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
              </div>
            ) : (
              <p>No vendors found within the selected radius.</p>
            )}
          </div>

          <div
            className="vendor-footer"
            style={{ display: activeTab === "tab2" ? "block" : "none" }}
          >
            {vendors.length > 0 ? (
              <div className="vendor-all-cards">
                {vendors.map((vendor) => (
                  <div
                    className="vendor-custom-card"
                    key={vendor.place_id}
                    onClick={() => selectedVendorSelection(vendor)}
                  >
                    <div className="vendor-card-image">
                      {/* <UnsplashImages query={getVendorType.vendorName} numberOfImages={'1'} /> */}

                      {vendor.imageUrl != null ?

                        <img
                          src={vendor.imageUrl}
                          alt={vendor.name}
                        />
                        :

                        <img
                          src={noImageAvailable}
                          alt={vendor.name}
                        />


                      }
                    </div>

                    <div className="vendor-card-info">
                    <div className="vendor-card-content">
                      <h5>{vendor.name}</h5>
                      <p>Rating: {vendor.rating}</p>
                      <p>{vendor.vicinity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No vendors found within the selected radius.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="container-back" onClick={handleComponentChangeStatus}>
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          {googleVendorPage && (
            <div>
              <VendorGoogleDetailedPage vendorData={selectedVendor} />
              

            </div>
          )}
          {toGathrVendorPage && (
            <div>
           
              <VendorTogatherDetailedPage vendorData={selectedToGathrVendor} />
            </div>
          )}</>
      )}
      {/* Vendor Details */}

    </div>
  );
};

export default VendorsList;
