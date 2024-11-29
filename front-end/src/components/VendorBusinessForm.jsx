import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import togathrVendorLogo from '../resources/assets/Logo/togathr-vendor-logo.png'
import { createDataInMongo, readDataFromMongoWithParam, DeleteDataInMongo, updateDataInMongo } from '../../api/mongoRoutingFile';
import { useSnackbar } from './SnackbarContext';
import UnsplashImages from './UnsplashImages';


const VendorBusinessForm = () => {
    const showSnackbar = useSnackbar();
    const [vendorActive, setVendorActive] = useState(null);
    const [vendorProfile, setVendorProfile] = useState(JSON.parse(localStorage.getItem('vendor-user-info')));
    const [expanded, setExpanded] = useState("panel2");
    const [vendorList, setVendorList] = React.useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [businessID, setBusinessID] = useState([]);
    const [formData, setFormData] = useState(
        {
            // first_name: '',
            // last_name: '',
            // user_phone: '',
            user_email: vendorProfile.email,
            business_name: '',
            business_email: '',
            business_license_number: '',
            business_phone: '',
            business_location: '',
            business_type: '',
            business_description: '',
            years_of_experience: '',
            pricing_method: '',

            basic_plan_price: '',
            basic_plan_includes: '',


            advance_plan_price: '',
            advance_plan_includes: '',


            premium_plan_price: '',
            premium_plan_includes: ''


        }

    )

    useEffect(() => {


        chooseExisting();
    }, [vendorProfile])



    const handleChangeForm = async (e) => {
        console.log(e);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

    }

    const handleSubmitAllForm = () => {

        if (formData.first_name == '' || formData.last_name == '' || formData.user_phone == '') {
            handleChange('panel1')(true);
            return
        }
        if (formData.business_name == '' || formData.business_email == '' || formData.business_license_number == '' || formData.business_phone == '' || formData.business_location == '' || formData.business_type == '' || formData.business_description == '' || formData.years_of_experience == '' || formData.business_license_number == '') {
            handleChange('panel2')(true);
            return

        }
        if (formData.pricing_method == '' || formData.basic_plan_price == '' || formData.basic_plan_includes == '' || formData.advance_plan_price == '' || formData.advance_plan_includes == '' || formData.premium_plan_price == '' || formData.premium_plan_includes == '') {
            handleChange('panel3')(true);
            return
        }




        // setSelectedOption(event.target.value);
        if (businessID.length > 0) {
            const data = formData;
            delete data._id;
            // console.log(data, 'aaa');
            console.log(businessID) + 'sss';
            updateDataInMongo('vendor_data', businessID, data).then(response => {
                console.log(response);
                showSnackbar('Data has been updated');
                // localStorage.setItem('vendor_data', response._id);
            }).catch(error => {
                console.error('Failed to update data:', error);
            });
        } else {
            createDataInMongo('vendor_data', formData).then(response => {
                console.log(response._id);
                setBusinessID(response._id);
                setVendorActive(true);
                setFormVisible(false);
                chooseExisting();
                // localStorage.setItem('vendor_data', response._id);
            }).catch(error => {
                console.error('Failed to update data:', error);
            });
        }

    }

    const handleChange = (panel) => (isExpanded) => {
        console.log(isExpanded);
        setExpanded(isExpanded ? panel : false);
    };

    const handleLinkClick = (id) => {
        if (vendorList) {
            const selectedData = vendorList.find((item) => item._id === id);
            console.log(selectedData);
            setFormData(selectedData);
            setBusinessID(id);
            setFormVisible(true);



            console.log(id);
        }
    };
    useEffect(() => {

    }, [formData]);

    useEffect(() => {
        console.log('yes', businessID);
    }, [businessID]);

    const handleDelete = async (id) => {
        console.log(id);

        DeleteDataInMongo('vendor_data', id).then(response => {
            console.log('Response from updateData:', response);
            // toast('Deleted Successfully')
            showSnackbar('Deleted Successfully', 'Business Data has been deleted successfully.');
            chooseExisting();
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });

    }

    const chooseExisting = async () => {

        try {

            const queryParams = {
                and: [
                    { user_email: vendorProfile.email }
                ]
            };


            const result = await readDataFromMongoWithParam('vendor_data', JSON.stringify(queryParams));

            if (result && result.length > 0) {
                setVendorList(result);
            } else {
                console.log(false);
            }
        } catch (error) {
            console.error('Error checking event:', error);

        }

    }


    const handleBack = () => {
        setBusinessID([]);
        setFormVisible(false);
        chooseExisting();
    }

    const handleButtonClick = () => {
        setVendorActive(null);
    };

    const handleAddBusiness = () => {
        setBusinessID([]);
        setFormVisible(true);
        setFormData({
            // first_name: '',
            // last_name: '',
            // user_phone: '',
            user_email: vendorProfile.email,
            business_name: '',
            business_email: '',
            business_license_number: '',
            business_phone: '',
            business_location: '',
            business_type: '',
            business_description: '',
            years_of_experience: '',
            pricing_method: '',

            basic_plan_price: '',
            basic_plan_includes: '',


            advance_plan_price: '',
            advance_plan_includes: '',


            premium_plan_price: '',
            premium_plan_includes: ''



        })
    }

    const handleCancelForm = () => {
        setFormVisible(false);
    }


    return (
        <div>
            <div className='custom-modal-maker'>

                <div id="modal-container"
                    className={`${vendorActive == true ? ('four') : vendorActive == false ? ('fourClose') : vendorActive == null ? ('') : ''}`} >
                    <div className="modal-background" onClick={handleButtonClick}>
                        <div className="welcomeModalContainer">
                            <div className="welcomeModalContent">
                                <div className="welcomeModalImage"><img src={togathrVendorLogo} alt="togather-VENDOR-logo" /></div>
                                <h3>Thank you for registering your business</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <section className="togather-vendor-page">

                <div className='togather-vendor-body'>
                    <div className="vendor-tile">
                        <div className="vendor-content">
                            <h2>Please fill in the details below to complete your sign-up.</h2>
                            <p>Effort showcase your services with ToGathr – the ultimate platform for connecting with clients planning memorable events. Whether it’s an intimate gathering or a grand celebration, ToGathr helps you reach the right audience and grow your business. Join today and start attracting more event planners!</p>
                        </div>
                        <div className="svg-container">
                            <svg
                                width="335"
                                height="263"
                                viewBox="0 0 335 263"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="svg-background"
                            >
                                <path
                                    opacity="0.5"
                                    d="M53.5426 262C19.7249 234.211 -32.2648 167.081 30.3184 120.875C108.547 63.1169 200.833 207.511 239.948 120.875C279.062 34.238 242.392 16.2568 176.387 1"
                                    stroke="#F500E5"
                                />
                                <path
                                    opacity="0.5"
                                    d="M137.663 262C94.0326 181.518 72.2174 33.0558 334 83.0657"
                                    stroke="#F500E5"
                                />
                                <path
                                    opacity="0.5"
                                    d="M20.5809 1C11.2423 64.8365 38.8521 206.408 224 262"
                                    stroke="#F500E5"
                                />
                            </svg>
                        </div>
                    </div>
                </div>


                <div className='togather-vendor-footer'>

                    <section className='togather-vendor-banner'>
                        {formVisible ? <div className="back-button">
                            <i className="fa-solid fa-chevron-left" onClick={handleBack}></i>

                        </div> :
                            <>
                                <div className="togather-vendor-heading" >
                                    <h3>ALL BUSINESSES</h3>

                                </div>
                                <div className="togather-add-new">
                                    <button className="button-green-fill" onClick={handleAddBusiness}>Add New Business</button>
                                </div>
                            </>
                        }
                    </section>
                    {!formVisible ?

                        <div className="vendor-business-card-section">
                            <div className="vendor-business-cards">

                                {vendorList && vendorList.map((item, index) => (

                                    <div className='vendor-business-card' key={index}>


                                        <div className="vendor-business-card-header" onClick={() => handleLinkClick(item._id)}>
                                            <UnsplashImages query={item.business_type} numberOfImages={'1'} randomPage={'1'} />
                                        </div>

                                        <div className="vendor-business-card-body">
                                            <div className="vendor-card-content">
                                                <h4 className="card-title">{item.business_name}</h4>
                                                <p className="card-text">{item.business_type}</p>
                                            </div>

                                            <div className="vendor-delete" onClick={() => handleDelete(item._id)}>
                                                <i className="fa-regular fa-trash-can"></i>

                                            </div>
                                        </div>




                                    </div>

                                ))}

                            </div>
                        </div>

                        :

                        <div className='togather-vendor-form-page'>
                            <div className='togather-vendor-form'>
                                {/* <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >


                                        <h4>Personal Information</h4>

                                    </AccordionSummary>
                                    <AccordionDetails>

                                        <div className='user-profile-accordion'>
                                            <section className='user-form-section'>
                                                <form className="user-form" action="">
                                                    <section className='name-section'>
                                                        <div className="form-group">
                                                            <label htmlFor="first_name">First Name</label>
                                                            <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChangeForm} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="last_name">Last Name</label>
                                                            <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChangeForm} required />
                                                        </div>


                                                        <div className="form-group">
                                                            <label htmlFor="user_email">Email</label>
                                                            <input type="email" id="user_email" className='readOnly' name="user_email" value={vendorProfile.email} readOnly />
                                                        </div>


                                                        <div className="form-group lastChild">
                                                            <label htmlFor="user_phone">Phone Number</label>
                                                            <input type="tel" id="user_phone" name="user_phone" value={formData.user_phone} onChange={handleChangeForm} required />
                                                        </div>

                                                    </section>
                                                </form>
                                            </section>
                                        </div>


                                    </AccordionDetails>
                                </Accordion> */}


                                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3bh-content"
                                        id="panel3bh-header"
                                    >
                                        <h4>Business Information</h4>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='user-profile-accordion'>
                                            <section className='user-form-section'>
                                                <form className="user-form" action="">
                                                    <section className='business-section'>
                                                        <div className="form-group">
                                                            <label htmlFor="business_name">Business Name</label>
                                                            <input type="text" id="business_name" name="business_name" value={formData.business_name} onChange={handleChangeForm} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="business_email">Business Email</label>
                                                            <input type="email" id="business_email" name="business_email" value={formData.business_email} onChange={handleChangeForm} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="business_license_number">Business License Number</label>
                                                            <input type="text" id="business_license_number" name="business_license_number" value={formData.business_license_number} onChange={handleChangeForm} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="business_phone">Business Phone</label>
                                                            <input type="tel" id="business_phone" name="business_phone" value={formData.business_phone} onChange={handleChangeForm} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="business_location">Business Location</label>
                                                            <input type="text" id="business_location" name="business_location" value={formData.business_location} onChange={handleChangeForm} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="business_type">Business Type</label>
                                                            {/* <input type="text" id="business_type" name="business_type" value={formData.business_type} onChange={handleChangeForm} /> */}
                                                            <select
                                                                name="business_type"
                                                                id="business_type"
                                                                value={formData.business_type} // Controlled by state
                                                                onChange={handleChangeForm} // Updates state when value changes
                                                            >
                                                                <option value="" disabled>
                                                                    Select a category
                                                                </option>
                                                                <option value="event_venue">Venues</option>
                                                                <option value="catering">Caterers</option>
                                                                <option value="photographer">Photographers</option>
                                                                <option value="liquor_store">Liquor Store</option>
                                                                <option value="night_club">Musicians</option>
                                                                <option value="establishment">DJ</option>
                                                                <option value="florist">Florist</option>
                                                                <option value="hardware_store">Rental Equipment</option>
                                                                <option value="beauty_salon">Makeup Artist</option>
                                                                <option value="car_rental">Car Rental</option>
                                                                <option value="event_transport">Event Transport</option> {/* Unique value */}
                                                                <option value="convenience_store">Convenience Store</option>
                                                            </select>

                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="business_description">Business Description</label>
                                                            <input type="text" id="business_description" name="business_description" value={formData.business_description} onChange={handleChangeForm} />
                                                        </div>
                                                        <div className="form-group lastChild">
                                                            <label htmlFor="years_of_experience">Years of Experience</label>
                                                            <input type="text" id="years_of_experience" name="years_of_experience" value={formData.years_of_experience} onChange={handleChangeForm} required />
                                                        </div>

                                                        {/* <div className="form-group lastChild">
                                                    <label htmlFor="product_services_image">Services/Product Image</label>
                                                    <input type="text" id="product_services_image" name="product_services_image" value={formData.product_services_image} onChange={handleChangeForm} required />
                                                </div> */}

                                                    </section>
                                                </form>
                                            </section>
                                        </div>


                                    </AccordionDetails>
                                </Accordion>

                                <hr />

                                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel3bh-content"
                                        id="panel3bh-header"
                                    >
                                        <h4>Services Information</h4>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className='user-profile-accordion'>
                                            <section className='user-form-section'>
                                                <form className="user-form" action="">
                                                    <section className='service-section'>
                                                        <div className="form-group">
                                                            <label htmlFor="pricing_method">Pricing Method</label>
                                                            <div className="radio-buttons"><input type="radio" name="pricing_method" value="per_person" checked={formData.pricing_method === 'per_person'} onChange={handleChangeForm} /> <label>Rate Per Person  </label></div>
                                                            <div className="radio-buttons"><input type="radio" name="pricing_method" value="hourly_rate" checked={formData.pricing_method === 'hourly_rate'} onChange={handleChangeForm} /><label>Hourly Rate</label></div>
                                                        </div>
                                                    </section>
                                                </form>
                                            </section>
                                        </div>


                                        <hr />
                                        <div className='user-profile-accordion'>
                                            <section className='user-form-section'>
                                                <form className="user-form" action="">

                                                    <section className='basic-planning'>
                                                        <h5>Basic Plan</h5>
                                                        <div className="form-group">
                                                            <label htmlFor="basic_plan_price">Price</label>
                                                            <input type="text" id="basic_plan_price" name="basic_plan_price" value={formData.basic_plan_price} onChange={handleChangeForm} required />
                                                        </div>
                                                        <div className="form-group lastChild">
                                                            <label htmlFor="basic_plan_includes">Includes</label>
                                                            <input type="text" id="basic_plan_includes" name="basic_plan_includes" value={formData.basic_plan_includes} onChange={handleChangeForm} required />
                                                        </div>
                                                    </section>
                                                </form>
                                            </section>
                                        </div>


                                        <hr />
                                        <div className='user-profile-accordion'>
                                            <section className='user-form-section'>
                                                <form className="user-form" action="">
                                                    <section className='advance-planning'>
                                                        <h5>Advance Plan</h5>
                                                        <div className="form-group">
                                                            <label htmlFor="advance_plan_price">Price</label>
                                                            <input type="text" id="advance_plan_price" name="advance_plan_price" value={formData.advance_plan_price} onChange={handleChangeForm} required />
                                                        </div>
                                                        <div className="form-group lastChild">
                                                            <label htmlFor="advance_plan_includes">Includes</label>
                                                            <input type="text" id="advance_plan_includes" name="advance_plan_includes" value={formData.advance_plan_includes} onChange={handleChangeForm} required />
                                                        </div>
                                                    </section>
                                                </form>
                                            </section>
                                        </div>


                                        <hr />
                                        <div className='user-profile-accordion'>
                                            <section className='user-form-section'>
                                                <form className="user-form" action="">
                                                    <section className='premium-planning'>
                                                        <h5>Premium Plan</h5>
                                                        <div className="form-group">
                                                            <label htmlFor="premium_plan_price">Price</label>
                                                            <input type="text" id="premium_plan_price" name="premium_plan_price" value={formData.premium_plan_price} onChange={handleChangeForm} required />
                                                        </div>
                                                        <div className="form-group lastChild">
                                                            <label htmlFor="premium_plan_includes">Includes</label>
                                                            <input type="text" id="premium_plan_includes" name="premium_plan_includes" value={formData.premium_plan_includes} onChange={handleChangeForm} required />
                                                        </div>
                                                    </section>
                                                </form>
                                            </section>
                                        </div>


                                    </AccordionDetails>

                                </Accordion>


                                <div className='user-profile-accordion'>
                                    <section className='user-form-section'>
                                        <form className="user-form" action="">
                                            <section className="user-form-buttons">
                                                <button type="button" className="button-purple" onClick={handleCancelForm}>Cancel</button>
                                                <button type="button" className="button-purple-fill" onClick={handleSubmitAllForm}>Save Form</button>
                                            </section>
                                        </form>

                                    </section>
                                </div>
                            </div>
                        </div>

                    }
                </div>

            </section>
        </div>

    )
}

export default VendorBusinessForm
