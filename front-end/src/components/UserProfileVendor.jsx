import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'

import Modal from './ModalPopupBox';
import { updateVendorData, getAllDataOfVendor, checkVendorPasswordValidation, updateVendorPassword } from '../../api/loginApi.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    readDataFromMongoWithParam,
} from '../../api/mongoRoutingFile';
// import togatherImage from "../resources/assets/Images/togather-image-1.jpg"

import { useNavigate } from "react-router-dom";
import { updateDataInMongo } from '../../api/mongoRoutingFile';


export default function UserProfileVendor() {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [vendorInfo, setVendorInfo] = useState(JSON.parse(localStorage.getItem('vendor-user-info')));

    // State for form fields
    const [firstName, setFirstName] = useState(vendorInfo ? vendorInfo.firstName || '' : '');
    const [lastName, setLastName] = useState(vendorInfo ? vendorInfo.lastName || '' : '');
    const [email, setEmail] = useState(vendorInfo ? vendorInfo.email || '' : '');
    const [userName, setUserName] = useState(vendorInfo ? vendorInfo.name || '' : '');
    const [phone, setPhone] = useState(vendorInfo ? vendorInfo.phone || '' : '');
    const [vendorImage, setVendorImage] = useState(vendorInfo ? vendorInfo.image || '' : '')
    const [currentPassword, setCurrentPassword] = useState('');
    const [validatePassword, setValidatePassword] = useState(false);
    const [token, setToken] = useState(vendorInfo ? vendorInfo.token : "");

    const [vendorInfoMongo, setVendorInfoMongo] = useState(null);
    const [vendorInfoMongoID, setVendorInfoMongoID] = useState(null);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordsMatchValidate, setPasswordsMatchValidate] = React.useState(false);

    const [passwordMessage, setPasswordMessage] = useState(null);

    const [passwordUpdateMessage, setpasswordUpdateMessage] = useState('');
    // Update the user info when component mounts
    const [downloadURL, setDownloadURL] = useState("");
    const [pastEvents, setPastEvents] = useState([]);


    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [images, setImages] = useState([]);

    const [userDP, setUserDP] = useState(null);
    const [uploading, setUploading] = useState(false);



    // const togglePassword = (index) => {
    //     if (index == '1') {
    //         setVisible1(!visible1);
    //     }
    //     if (index == '2') {
    //         setVisible2(!visible2);
    //     }
    //     if (index == '3') {
    //         setVisible3(!visible3);
    //     }

    // };








    const photoUploadTOdatabaseAndFrontEnd = async () => {


        if (!userDP) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", userDP);

        // Debug FormData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            //   setUploadStatus("Uploading...");
            const response = await axios.post("https://togather-project-backend.vercel.app/api/uploadImage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            //   setUploadStatus("File uploaded successfully!");
            console.log(response.data.downloadURL);
            setDownloadURL(response.data.downloadURL);
            getUpdatedData(vendorInfoMongo, response.data.downloadURL);
            updateDataToMongo(response.data.downloadURL);

        } catch (error) {
            console.error("Error uploading file:", error);
            //   setUploadStatus("Failed to upload file.");
        }

    };

    // const handleAwsImages = async () => {

    //     try {
    //         const response = await axios.get('http://localhost:3031/images');
    //         setImages(response.data);
    //     } catch (error) {
    //         console.error("Error fetching images:", error);
    //     }

    // }

    // const handleNewPasswordChange = (e) => {
    //     setNewPassword(e.target.value);
    //     checkPasswordsMatch(e.target.value, confirmPassword);
    // };

    // const handleConfirmPasswordChange = (e) => {
    //     setConfirmPassword(e.target.value);
    //     checkPasswordsMatch(newPassword, e.target.value);

    // };

    // const checkPasswordsMatch = (newPass, confirmPass) => {
    //     setpasswordUpdateMessage('');

    //     if (newPass === confirmPass && newPass != '' && newPass != '') {
    //         setPasswordsMatch(true);
    //         setPasswordsMatchValidate(true);
    //         console.log(true);

    //     } else {
    //         setPasswordsMatch(false);
    //         setPasswordsMatchValidate(false);
    //         console.log(false);

    //     }
    // };

    useEffect(() => {

        console.log(vendorImage);

    }, [vendorImage])

    useEffect(() => {

        console.log(vendorInfo);
    }, [vendorInfo])

    useEffect(() => {


        const fetchUserData = async () => {
            try {
                const queryParams = {
                    and: [
                        { email: email }
                    ]
                };


                const result = await readDataFromMongoWithParam('vendors', JSON.stringify(queryParams));

                if (result && result.length > 0) {
                    console.log(result[0], 'agya vendor data');
                    setVendorInfoMongo(result[0]);
                    setVendorInfoMongoID(result[0]._id);
                } else {
                    console.log(false);
                }
            } catch (error) {
                console.error('Error checking event:', error);
            }
        }

        fetchUserData();

    }, [email])


    useEffect(() => {



        const fetchPastEvents = async () => {

            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

                // Define your query parameters
                const queryParams = {
                    and: [
                        { collaborators: { $in: [email] } },

                        { eventDate: { $lt: today } } // Assuming 'eventDate' is the field storing the event date
                    ]
                };

                // Fetch data from MongoDB
                const result = await readDataFromMongoWithParam('events', JSON.stringify(queryParams));

                if (result && result.length > 0) {
                    console.log(result, 'agya user past events');
                    setPastEvents(result);
                } else {
                    console.log(false);
                }
            } catch (error) {
                console.error('Error checking event:', error);
            }
        };

        if (email) { // Fetch only if email is provided
            fetchPastEvents();
        }
    }, [email])



    const handleDeleteImage = async () => {
        const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/demofb29.appspot.com/o/anonymous-image.png?alt=media&token=90a2189e-51c1-4743-b12f-470d3b487623';
        setVendorImage(imageUrl);
        getUpdatedData(vendorInfoMongo, imageUrl);
        updateDataToMongo(imageUrl);

    };

    const handleUserDataUpdate = async () => {

        // if (newPassword != '' && confirmPassword != '' && passwordsMatch) {

        //     const response = await updateVendorPassword(newPassword, email);
        //     console.log(response.data.passwordUpdate);
        //     setpasswordUpdateMessage(response.data.passwordUpdate)
        // }

        const obj = {
            email,
            name: userName,
            firstName,
            lastName,
            phone: phone,
            image: vendorImage,


        };
        updateDataInMongo('vendors', vendorInfoMongoID, obj).then(response => {
            console.log('Response from updateData:', response.updatedData);
            setVendorInfo(response.updatedData);
            getUpdatedData(response.updatedData, vendorImage);
            // toast('Data update successfully');
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });


    };




    const updateDataToMongo = async (imageUrl) => {
        const data = vendorInfoMongo;
        console.log(vendorInfoMongo, 'ss');
        delete vendorInfoMongo.token;
        delete vendorInfoMongo._id;

        const update_data = {
            ...data,
            image: imageUrl
        }

        
        updateDataInMongo('vendors', vendorInfoMongoID, update_data).then(response => {
            console.log('Response from updateData:', response.updatedData);

        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }







    const getUpdatedData = async (response, userImage) => {
        localStorage.setItem('vendor-user-info', JSON.stringify(
            {
               
                ...response,
                image: userImage,
                token: token
            }
        ))

        setVendorInfo(JSON.parse(localStorage.getItem('user-info')));
        setVendorImage(userImage);

        // } catch {
        //     console.log("Error fetching user data");
        // }
    };


    // const handlePasswordValidate = async () => {
    //     try {
    //         console.log(currentPassword, email);
    //         const response = await checkVendorPasswordValidation(currentPassword, email);
    //         console.log(response.data.passwordValue);
    //         setPasswordMessage(response.data.message);
    //         if (response.data.passwordValue) {
    //             setValidatePassword(true);
    //         } else {
    //             setValidatePassword(false);
    //         }
    //     } catch {
    //         setValidatePassword(false);
    //         setPasswordMessage("Error validating password");
    //         console.log("Error validating password");
    //     }
    // }



    // const handleLogout = async () => {
    //     // try {
    //         const vendorEmail = JSON.parse(localStorage.getItem("vendor-user-info")).email;

    //     const logoutData = {
    //         "email": vendorEmail,
    //         "collectionName": "vendors"
    //     }
    //     logoutUser(logoutData).then(response => {
    //         console.log('Response from createdData:', response);
    //         console.log('vendor', result);
    //             localStorage.removeItem("vendor-user-info");
    //             navigate("/landingPage");


    //     })
    //         .catch(error => {
    //             console.error('Failed to update data:', error);
    //         });

    // };


    return (
        <div className='vendor-profile-container-page'>
            <div className="user-profile-main-container">
                <div className="user-profile-main-header">

                    <h2> <i className="fa-regular fa-user"></i> My Profile</h2>
                </div>
                <ToastContainer />
                <div className="user-profile-accordion">
                    <div className='user-profile-accordion'>
                        <hr />
                        <section className='user-photo-section'>
                            <div className='user-photo-container'>
                                <div className='user-photo'>
                                    <img src={vendorImage} alt='User Photo' />
                                </div>
                                <div className='user-photo-name'>
                                    <h4>{firstName} {lastName}</h4>
                                </div>
                            </div>
                            <div className='user-photo-buttons'>
                                <div className='upload-photo-button'>
                                    <Modal
                                        buttonId="uploadNewPhoto"
                                        buttonLabel="Upload new photo"
                                        backgroundColorButton="'black'"
                                        modalHeaderTitle="Upload Your Photo"
                                        modalBodyContent={
                                            <form>
                                                <div className='togather-file-attachment'>
                                                    <label htmlFor="file" className="custum-file-upload">
                                                        <div className="icon">
                                                            {/* Your SVG icon here */}
                                                        </div>
                                                        <input id="file" type="file" onChange={(e) => setUserDP(e.target.files[0])} />
                                                    </label>
                                                </div>
                                            </form>
                                        }
                                        saveDataAndOpenName="Upload Photo"
                                        saveDataAndOpenId="uploadPhoto"
                                        saveDataAndOpenFunction={photoUploadTOdatabaseAndFrontEnd}
                                        closeButtonID="closeModal"
                                        closeButtonName='Close'
                                        buttonAlign='row'
                                        onModalClose={() => console.log('Modal closed')}
                                        closeModalAfterDataSend="true"
                                    />
                                </div>
                                <button className='button-purple' onClick={handleDeleteImage}>Delete Photo</button>
                            </div>
                        </section>
                        <hr />
                        <section className='user-form-section'>
                            <form className="user-form" action="">
                                <section className='name-section'>
                                    <div className="form-group">
                                        <label htmlFor="first_name">First Name</label>
                                        <input type="text" id="first_name" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="last_name">Last Name</label>
                                        <input type="text" id="last_name" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                    </div>
                                    <div className="form-group lastChild">
                                        <label htmlFor="user_name">User Name</label>
                                        <input type="text" id="user_name" name="user_name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                                    </div>
                                </section>
                                <hr />
                                <section className='contact-section'>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" className='readOnly' name="email" value={email} readOnly />
                                    </div>
                                    <div className="form-group lastChild">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                    </div>
                                </section>
                                <hr />
                                {/* {vendorInfo.type === 'appLogin' && (
                                    <>

                                        <section className='password-section'>
                                            <div className="form-group ">

                                                <label htmlFor="current_password">Current Password</label>

                                                <div className="passcode">
                                                    <input type={visible1 ? 'text' : 'password'} id="current_password" name="current_password" onChange={(e) => setCurrentPassword(e.target.value)} required />

                                                    {!visible1 ? <i className="fa-regular fa-eye-slash" onClick={() => togglePassword(1)}></i>
                                                        : <i className="fa-regular fa-eye" onClick={() => togglePassword(1)}></i>}

                                                </div>

                                                {validatePassword ? <p className='password-message-green'>{passwordMessage}</p> : <p className='password-message-red'>{passwordMessage}</p>}

                                                <button className='button-green-fill' type='button' onClick={handlePasswordValidate}>Change Password</button>



                                            </div>


                                        </section>

                                        {validatePassword ?

                                            <section className='password-section'>
                                                <div className="form-group">


                                                    <label htmlFor="new_password">New Password</label>



                                                    <div className="passcode">
                                                        <input type={visible2 ? 'text' : 'password'} id="new_password" name="new_password" onChange={handleNewPasswordChange} required />
                                                        {!visible2 ? <i className="fa-regular fa-eye-slash" onClick={() => togglePassword(2)}></i>
                                                            : <i className="fa-regular fa-eye" onClick={() => togglePassword(2)}></i>}
                                                    </div>
                                                    <div className="password-button">
                                                        {passwordsMatchValidate ?
                                                            <p className='password-message-green'> Password match</p>
                                                            :
                                                            <p className='password-message-red'> Password doesnt match</p>
                                                        }
                                                    </div>




                                                </div>
                                                <div className="form-group lastChild">

                                                    <label htmlFor="confirm_password">Confirm Password</label>


                                                    <div className="passcode">
                                                        <input type={visible3 ? 'text' : 'password'} id="confirm_password" name="confirm_password" onChange={handleConfirmPasswordChange} required />
                                                        {!visible3 ? <i className="fa-regular fa-eye-slash" onClick={() => togglePassword(3)}></i>
                                                            : <i className="fa-regular fa-eye" onClick={() => togglePassword(3)}></i>}
                                                    </div>


                                                    <div className="password-button">
                                                        {passwordsMatchValidate ?
                                                            <p className='password-message-green'> Password match</p>
                                                            :
                                                            <p className='password-message-red'> Password doesnt match</p>
                                                        }
                                                    </div>


                                                </div>
                                                {passwordUpdateMessage != '' ? <p className='password-message-blue'>{passwordUpdateMessage}</p> : <></>}

                                            </section>
                                            : <></>}
                                        <hr />
                                    </>
                                )} */}
                                <section className="user-form-buttons">
                                    <button type="button" className="button-purple">Cancel</button>
                                    <button type="button" className="button-purple-fill" onClick={handleUserDataUpdate}>Save Changes</button>
                                    {/* <button onClick={handleLogout} className="button-green-fill"> Logout </button> */}
                                </section>

                                <section>

                                </section>
                            </form>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}
