import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Modal from './ModalPopupBox';
// import { updateUserData, getAllDataOfUser, checkCurrentPasswordValidation, updateUserPassword, getAllPastEvents } from '../../api/loginApi.js';
import { toast, ToastContainer } from 'react-toastify';
import { updateDataInMongo } from '../../api/mongoRoutingFile';
import 'react-toastify/dist/ReactToastify.css';
import togatherImage from "../resources/assets/Images/togather-image-1.jpg"
import UnsplashImages from './UnsplashImages'

import {
    readDataFromMongoWithParam,
} from '../../api/mongoRoutingFile';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function UserProfile() {

    const [file, setFile] = useState(null);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user-info')));
    const [userInfoMongo, setUserInfoMongo] = useState(null);
    const [userInfoMongoID, setUserInfoMongoID] = useState(null);

    // State for form fields
    const [firstName, setFirstName] = useState(userInfo ? userInfo.firstName || '' : '');
    const [lastName, setLastName] = useState(userInfo ? userInfo.lastName || '' : '');
    const [email, setEmail] = useState(userInfo ? userInfo.email || '' : '');
    const [userName, setUserName] = useState(userInfo ? userInfo.name || '' : '');
    const [phone, setPhone] = useState(userInfo ? userInfo.phone || '' : '');
    const [userImage, setUserImage] = useState(userInfo ? userInfo.image || '' : '')
    const [currentPassword, setCurrentPassword] = useState('');
    const [validatePassword, setValidatePassword] = useState(false);
    const [token, setToken] = useState(userInfo ? userInfo.token : "");
    const [downloadURL, setDownloadURL] = useState("");

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordsMatchValidate, setPasswordsMatchValidate] = React.useState(false);

    const [passwordMessage, setPasswordMessage] = useState(null);

    const [passwordUpdateMessage, setpasswordUpdateMessage] = useState('');
    // Update the user info when component mounts


    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [images, setImages] = useState([]);

    const [userDP, setUserDP] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [expanded, setExpanded] = useState("panel1");

    const [pastEvents, setPastEvents] = useState([]);

    const togglePassword = (index) => {
        if (index == '1') {
            setVisible1(!visible1);
        }
        if (index == '2') {
            setVisible2(!visible2);
        }
        if (index == '3') {
            setVisible3(!visible3);
        }

    };


    useEffect(() => {


        const fetchUserData = async () => {
            try {
                const queryParams = {
                    and: [
                        { email: email }
                    ]
                };


                const result = await readDataFromMongoWithParam('users', JSON.stringify(queryParams));

                if (result && result.length > 0) {
                    console.log(result[0], 'agya user data');
                    setUserInfoMongo(result[0]);
                    setUserInfoMongoID(result[0]._id);
                } else {
                    console.log(false);
                }
            } catch (error) {
                console.error('Error checking event:', error);
            }
        }

        fetchUserData();

    }, [email])

    const handleChange = (panel) => async (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

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
            getUpdatedData(userInfo, response.data.downloadURL);
            updateDataToMongo(response.data.downloadURL);

        } catch (error) {
            console.error("Error uploading file:", error);
            //   setUploadStatus("Failed to upload file.");
        }

    }
    //     

    //     const emailWhole = email + '_eventGuest';

    //     const formData = new FormData();
    //     formData.append('image', userDP);
    //     formData.append('emailWhole', emailWhole);
    //     formData.append('email', email);
    //     formData.append('portalType', 'eventGuest');


    //     setUploading(true);

    //     try {
    //         const response = await axios.post('http://localhost:3031/uploadDP', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         console.log(response.data.mongoResponse, 'rrr');
    //         if (response.data.mongoResponse) {
    //             setUserImage(response.data.imageURL);
    //             setUserInfo(prev => ({ ...prev, image: response.data.imageURL }));
    //             toast("Image updated successfully");
    //             getUpdatedData(email);

    //         }
    //     } catch (error) {
    //         console.error("Error uploading file:", error);
    //         // setMessage("Error uploading file: " + error.response.data);
    //     } finally {
    //         setUploading(false);
    //     }
    // };

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

        console.log(userImage);
    }, [userImage])

    useEffect(() => {

        console.log(userInfo);
    }, [userInfo])

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
        setUserImage(imageUrl);
        getUpdatedData(userInfo, imageUrl);
        updateDataToMongo(imageUrl);
    };

    const handleUserDataUpdate = async () => {

        // if (newPassword != '' && confirmPassword != '' && passwordsMatch) {

        //     const response = await updateUserPassword(newPassword, email);
        //     console.log(response.data.passwordUpdate);
        //     setpasswordUpdateMessage(response.data.passwordUpdate)
        // }
        try {
            const obj = {
                email,
                name: userName,
                firstName,
                lastName,
                phone: phone,
                image: userImage,


            };
            console.log(obj);

            updateDataInMongo('users', userInfoMongoID, obj).then(response => {
                console.log('Response from updateData:', response.updatedData);
                getUpdatedData(response.updatedData, userImage);
                // toast('Data update successfully');
            })
                .catch(error => {
                    console.error('Failed to update data:', error);
                });

        } catch {
            console.log("Error updating user data");
        }
    };
    const updateDataToMongo = async (imageUrl) => {
        const data = userInfo;
        delete userInfo.token;
        const update_data = {
            ...data,
            image: imageUrl
        }
        updateDataInMongo('users', userInfoMongoID, update_data).then(response => {
            console.log('Response from updateData:', response.updatedData);

        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }

    const getUpdatedData = async (response, userImage) => {




        localStorage.setItem('user-info', JSON.stringify(
            {
                // firstName: response.firstName,
                // lastName: response.lastName,
                // email: response.email,
                // phone: response.phone,
                // name: response.name,
                // image: userImage,
                // type: response.type,
                ...response,
                image: userImage,
                token: token
            }
        ))

        setUserInfo(JSON.parse(localStorage.getItem('user-info')));
        setUserImage(userImage);

        // } catch {
        //     console.log("Error fetching user data");
        // }
    };

    // const handlePasswordValidate = async () => {
    //     try {
    //         console.log(currentPassword, email);
    //         const response = await checkCurrentPasswordValidation(currentPassword, email);
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

    const addReminder = () => {

    }
    return (
        <>
            <div className="user-profile-main-container">
                <div className="user-profile-main-header">

                    <h2> <i className="fa-regular fa-user"></i> My Profile</h2>
                </div>
                <ToastContainer />
                <div className="user-profile-accordion">
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >

                            <Typography sx={{ padding: '0.5rem' }}>
                                Account
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className='user-profile-accordion'>
                              
                                <hr />
                                <section className='user-photo-section'>
                                    <div className='user-photo-container'>
                                        <div className='user-photo'>
                                            <img src={userImage} alt='User Photo' />
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
                                        {userInfo.type === 'appLogin' && (
                                            <>

                                                {/* <section className='password-section'> */}
                                                {/* <div className="form-group "> */}

                                                {/* <label htmlFor="current_password">Current Password</label> */}

                                                {/* <div className="passcode">
                                                            <input type={visible1 ? 'text' : 'password'} id="current_password" name="current_password" onChange={(e) => setCurrentPassword(e.target.value)} required />

                                                            {!visible1 ? <i className="fa-regular fa-eye-slash" onClick={() => togglePassword(1)}></i>
                                                                : <i className="fa-regular fa-eye" onClick={() => togglePassword(1)}></i>}

                                                        </div> */}

                                                {/* {validatePassword ? <p className='password-message-green'>{passwordMessage}</p> : <p className='password-message-red'>{passwordMessage}</p>} */}

                                                {/* <button className='button-green-fill' type='button' onClick={handlePasswordValidate}>Change Password</button> */}



                                                {/* </div> */}


                                                {/* </section> */}

                                                {/* {validatePassword ?

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
                                                    : <></>} */}
                                                <hr />
                                            </>
                                        )}
                                        <section className="user-form-buttons">
                                            <button type="button" className="button-purple">Cancel</button>
                                            <button type="button" className="button-purple-fill" onClick={handleUserDataUpdate}>Save Changes</button>
                                        </section>

                                    </form>
                                </section>
                            </div>
                        </AccordionDetails>
                    </Accordion>

                    {/* <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography sx={{ padding: '0.5rem' }}>
                                Reminder
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <section className="reminder-section">
                                <div className='reminder-button'>
                                    <Modal
                                        buttonId="reminder"
                                        buttonLabel="Add a reminder"
                                        backgroundColorButton="'black'"
                                        modalHeaderTitle="Add a reminder"
                                        modalBodyContent={
                                            <form className='reminder-form'>
                                                <div className="">
                                                    <textarea
                                                        // onChange={handleChange} // Update state on change
                                                        rows={5} // Number of visible text lines
                                                        cols={50} // Visible width of the textarea
                                                        placeholder="Add your task" // Placeholder text
                                                        style={{ resize: 'none', width: '100%' }} // Style to control resizing and width
                                                    />
                                                </div>
                                                <div className="reminder-date-time">
                                                    <div className="reminder-date">
                                                    <label htmlFor="reminderDate">Reminder Date</label>

                                                        <input
                                                            type="date"
                                                            id="reminderDate"
                                                            // onChange={(e) => setEventDate(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="reminder-time">
                                                        <label htmlFor="reminderTime">Reminder Time</label>
                                                    <input
                                                            type="time"
                                                            id="reminderTime"
                                                            // onChange={(e) => setEventDate(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="reminder-repetition">
                                                    <label htmlFor='repetition'>Repeat</label> 
                                                    <select name="repetition" id="repetition" defaultValue='never'>
                                                        <option value="never" >Never</option>
                                                        <option value="daily">Daily</option>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                    </select>
                                                </div>
                                            </form>
                                        }
                                        saveDataAndOpenName="Add a new task"
                                        saveDataAndOpenId="addNewTask"
                                        saveDataAndOpenFunction={addReminder}
                                        closeButtonID="closeModal"
                                        closeButtonName='Close'
                                        buttonAlign='row'
                                        onModalClose={() => console.log('Modal closed')}
                                        closeModalAfterDataSend="true"
                                    />
                                </div>
                            </section>
                            {/* <button onClick={handleAwsImages}>get iMGAES</button>
                            {
                                images ? <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`https://togather-aws-image.s3.us-east-1.amazonaws.com/${image}`}
                                            alt={image}
                                            style={{ width: '200px', height: '200px', margin: '10px' }}
                                        />
                                    ))}
                                </div> : <></>
                            } */}
                    {/* </AccordionDetails> */}
                    {/* </Accordion> */}


                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography sx={{ padding: '0.5rem' }}>
                                Past Events
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>


                            {pastEvents.length > 0 ? (

                                <div className='past-event-cards-container'>
                                    {pastEvents.map(event => (
                                        <div className="past-event-card" key={event._id}>
                                            <div className="past-event-image">
                                                <UnsplashImages query={event.eventType} numberOfImages={'1'} randomPage={'1'} />


                                            </div>
                                            <div className="past-event-content">
                                                <h3>{event.eventName}</h3>
                                                <p><i className="fa-regular fa-calendar"></i> {new Date(event.eventDate).toLocaleDateString()}</p>
                                                <p><i className="fa-solid fa-location-dot"></i> {event.location}</p>
                                            </div>


                                        </div>
                                    ))}
                                </div>

                            ) : (
                                <h4>No past events found.</h4>
                            )}

                        </AccordionDetails>

                    </Accordion>
                </div>
            </div>
        </>
    );
}
