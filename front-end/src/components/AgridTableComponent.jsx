import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
// import NodemailerEmail from './NodemailerEmail';
import Modal from './ModalPopupBox';
import axios from 'axios';
const baseUrl = 'http://localhost:9999';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { updateDataInMongo, createDataInMongo, readSingleDataFromMongo } from '../../api/mongoRoutingFile'
import { HfInference } from '@huggingface/inference';
import { useSnackbar } from './SnackbarContext';
import { useScrollTrigger } from '@mui/material';
import TogathrLoader from './TogathrLoader.jsx'


ModuleRegistry.registerModules([ClientSideRowModelModule]);
const rowSelection = {
    mode: 'multiRow',
    headerCheckbox: true,
};




const AgridTable = (props) => {
    // console.log(props.json[0]);
    const { sendDataToParent, confirmedGuests } = props;

    // console.log(props.json[2], 'setttttt-----');

    const subjectData = ``;
    const templateData = ``;
    const showSnackbar = useSnackbar();

    const [email, setEmailInputValue] = useState([]);
    const [message, setTemplateInputValue] = useState(templateData);
    const [subject, setSubjectInputValue] = useState(subjectData);
    const [nameOfGuest, setNameOfGuest] = useState();
    const [emailWithName, setEmailWithName] = useState();
    const [guestAllData, setGuestAllData] = useState([]);
    const [emailAttachment, setAttachment] = useState([]);
    const [answerJson, setAnswerJson] = useState([]);
    const [mainData, setMainData] = useState(props.json[0]);
    const [guestListName, setGuestListName] = useState(props.json[1]);
    // const [updateData, setUpdateData] = useState(false);
    const [newInsertedId, setNewInsertedId] = useState(props.json[2] || localStorage.getItem('guestId'));
    const [emailSent, setEmailSent] = useState(false);


    const [user_form_firstName, setFormFirstName] = useState('');
    const [user_form_lastName, setFormLastName] = useState('');
    const [user_form_email, setFormEmail] = useState('');
    const [user_form_phone, setFormPhone] = useState('');
    const [user_form_address, setFormAddress] = useState('');
    const [GuestListSaved, setGuestListSaved] = useState(false);
    const [quickFilterText, setquickFilterText] = useState('');

    // const [mongoData, setMongoData] = useState([]);

    // for ai text generation start
    const [aiTextInput, setAiTextInput] = useState('');

    const [aiImageInput, setAiImageInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);

    const [icsContentGetter, seticsContent] = useState([]);

    const [iSterminate, setiSterminate] = useState(true);
    // for ai text generation end
    const [guestsConfirmed, setGuestsConfirmed] = useState([]);

    const [addedGuestNewInsertedId, setAddedGuestNewInsertedId] = useState('');
    const [loader, setLoader] = useState(null);

    // const [dataGot, setDataGot] = useState(false); // Flag to prevent multiple calls

    const handleFirstNameChange = (event) => { setFormFirstName(event.target.value); }
    const handleLastNameChange = (event) => { setFormLastName(event.target.value); }
    const handleEmailChange = (event) => { setFormEmail(event.target.value); }
    const handleAddressChange = (event) => { setFormAddress(event.target.value); }
    const handlePhoneChange = (event) => { setFormPhone(event.target.value); }


    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));
    const [currentemailID, setCurrentEmailID] = useState(JSON.parse(localStorage.getItem('user-info')).email);


    const getCurrentEmailID = () => {
        const currentEmailID = JSON.parse(localStorage.getItem('user-info')).email;
        setCurrentEmailID(currentEmailID);
    }

    useEffect(() => {
        getCurrentEmailID();
    }, []);
    useEffect(() => {

    }, [iSterminate]);


    const getEventID = async () => {
        const currentEventID = localStorage.getItem('eventId');
        setEventID(currentEventID);

        await readSingleDataFromMongo('events', currentEventID).then(response => {
            console.log('Response from updateData:', response);
            console.log(response._id);
            if (response) {
                const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Product//EN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${response._id}@example.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${response.eventDate.replace(/-/g, '')}T120000Z
DTEND:${response.eventDate.replace(/-/g, '')}T130000Z
SUMMARY:${response.eventName}
DESCRIPTION:Event Type: ${response.eventType}\nHosted by: ${response.createdBy}
LOCATION:${response.location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;
                seticsContent(icsContent);
            } else {
                seticsContent(`BEGIN:VCALENDAR
                VERSION:2.0
                PRODID:-//Your Organization//Your Product//EN
                METHOD:PUBLISH
                BEGIN:VEVENT
                UID:1234567890@example.com
                DTSTAMP:20231001T120000Z
                DTSTART:20231010T130000Z
                DTEND:20231010T140000Z
                SUMMARY:Meeting Invitation
                DESCRIPTION:This is a meeting invitation.
                LOCATION:Online
                STATUS:CONFIRMED
                SEQUENCE:0
                BEGIN:VALARM
                TRIGGER:-PT15M
                DESCRIPTION:Reminder
                ACTION:DISPLAY
                END:VALARM
                END:VEVENT
                END:VCALENDAR`);
            }

            console.log(response, 'sat');

        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    };

    useEffect(() => {
        // Get initial event ID from localStorage
        getEventID();

        // Define a function to handle storage events
        const handleStorageChange = (event) => {
            if (event.key === 'eventId') {
                getEventID(); // Update state with new event ID
            }
        };

        // Listen for storage events (for changes from other tabs)
        window.addEventListener('storage', handleStorageChange);

        // Set up an interval to check for changes in the same tab
        const intervalId = setInterval(() => {
            const currentEventID = localStorage.getItem('eventId');
            if (currentEventID !== eventID) {
                getEventID(); // Update state if localStorage has changed
            }
        }, 1000); // Check every second

        // Cleanup function
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [eventID]);

    useEffect(() => {
        // console.log(answerJson);
        // updateEmailStatus();

    }, [answerJson]);






    useEffect(() => {

        console.log(mainData, "maindata");




        const statusCounts = {
            uninvited: 0,
            invited: 0,
            accepted: 0,
            rejected: 0,
            tentative: 0
        };

        // Use reduce to count the statuses
        mainData.forEach(person => {
            if (person.status) {
                const status = person.status.toLowerCase(); // Convert status to lowercase for uniformity
                if (statusCounts.hasOwnProperty(status)) {
                    statusCounts[status]++;
                }
            }
        });

        console.log(statusCounts, ' sendDataToParent(mainData.length);');
        sendDataToParent(statusCounts);
    }, [mainData]);



    // useEffect(() => {

    // }, [emailSent])

    useEffect(() => {
        console.log(newInsertedId);
    }, [newInsertedId])

    useEffect(() => {
        console.log(addedGuestNewInsertedId);
    }, [addedGuestNewInsertedId])


    useEffect(() => {
        if (typeof confirmedGuests === 'function') {
            confirmedGuests(guestsConfirmed);
        } else {
            console.error('confirmedGuests is not a function');
        }
    }, [guestsConfirmed])




    const inference = new HfInference("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");

    const handleTextQuery = async () => {
        setLoading(true);
        setError(null);
        setResponse('');

        try {
            const stream = inference.chatCompletionStream({
                model: "microsoft/Phi-3-mini-4k-instruct",
                messages: [{ role: "user", content: aiTextInput }],
                max_tokens: 500,
            });


            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.choices[0]?.delta?.content || "";
                setResponse(fullResponse);
                setTemplateInputValue(fullResponse);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        event.preventDefault();
        setAiTextInput(event.target.value);
    };

    // for ai text generation end



    const handleSendGuestData = () => {

        const guestData = {
            first_name: user_form_firstName,
            last_name: user_form_lastName,
            email: user_form_email,
            address: user_form_address,
            phone: user_form_phone,
            status: 'uninvited'
        }

        setMainData([...mainData, guestData]);

    }





    // const handleAttachmentChange = (event) => {
    //     const files = event.target.files;
    //     const maxSize = 5 * 1024 * 1024;
    //     const validFiles = [];

    //     if (files.length > 0) {
    //         Array.from(files).forEach((file) => {
    //             if (file.size <= maxSize) {
    //                 validFiles.push(file); // Add the file to the valid list
    //             } else {
    //                 alert(`File "${file.name}" is too large. Maximum file size is 5MB.`);
    //             }
    //         });

    //         setAttachment(validFiles); // Update state with valid files only
    //         console.log('Selected valid files:', validFiles);
    //     } else {
    //         console.warn('No files selected.');
    //         setAttachment([]); // Clear the attachment state if no files are selected
    //     }
    // };


    const handleSendEmail = async () => {
        // Create data for MongoDB
        // createDataToMongo();

        if (email.length <= 0) {
            return alert('Please select some email ');
        }

        // Create a FormData instance
        const formData = new FormData();



        // // Append email, subject, and message to FormData
        const data = {

            "email": JSON.stringify(email),
            "subject": subject,
            "message": message + ` <p>Please respond to this email by clicking one of the links below:</p>
            <p><a href="https://email-rsvp-page.vercel.app/?email=${email}&name=${nameOfGuest}">Invitation form</a></p>`,
            "nameOfGuest": nameOfGuest,
            "guestAllData": JSON.stringify(guestAllData),

        }
        // formData.append('email', JSON.stringify(email));
        // formData.append('subject', subject);
        // formData.append('message', message);
        // formData.append('nameOfGuest', nameOfGuest);
        // formData.append('guestAllData', JSON.stringify(guestAllData));
        // formData.append('icsContent', icsContentGetter);

        // console.log(guestAllData);


        // if (emailAttachment.length > 0) {
        //     emailAttachment.forEach(file => {
        //         console.log('Appending file:', file);
        //         // formData.append('files', file); // Ensure this matches the backend field name
        //     });
        // } else {
        //     console.warn('No files attached.');
        // }

        setLoader(true);

        try {
            // console.log(formData);
            // const response = await axios.post(`${baseUrl}/email/sendemail`, formData, {
            const response = await axios.post('https://togather-project-backend.vercel.app/api/email', data)

            //     headers: {
            //         'Content-Type': 'multipart/form-data', // Important for file uploads
            //     },
            // });
            console.log('Response:', response.data);
            if (response.data.message === 'Email sent successfully' || response.data) {
                // setEmailSent(true);
                handleEmailSentStatus(response.data.responses); // for front-end invite status change
                setLoader(null);

                showSnackbar('Email sent successfully');
            } else {
                console.error(response.data);
                setLoader(null);
            }
        } catch (error) {
            setLoader(null)
            console.error('Error:', error);
            alert('An error occurred while sending the email. Please try again.');
        }
    };


    const handleEmailSentStatus = (emailIvitedData) => {

        const updatedData = mainData.map((excelEntry) => {
            const matchedAnswerEntry = emailIvitedData.flat().find(
                (answerEntry) => answerEntry.email === excelEntry.email
            );
            if (matchedAnswerEntry) {
                return { ...excelEntry, status: matchedAnswerEntry.status };
            }
            return excelEntry; // Return unchanged if no match
        });


        setMainData(updatedData);

        if (newInsertedId == '') {
            createDataToMongo('guest_management', updatedData);
        } else {
            updateDataMongo('guest_management', updatedData, newInsertedId);
        }
        console.log("Updated excelJson:", updatedData); // Log the updated data to console
    };


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:5555/api/answers');
    //             const answers = response.data;
    //             console.log(answers);
    //             updateEmailStatus(answers);
    //             setAnswerJson(answers);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     // Fetch data immediately on component mount
    //     fetchData();

    //     // Set up interval to fetch data every 5 seconds
    //     const interval = setInterval(fetchData, 10000);

    //     // Cleanup function to clear the interval on component unmount
    //     return () => clearInterval(interval);
    // }, []); // Empty dependency array to run only on mount and unmount


    const handleStatusCheck = async () => {
        try {
            const response = await axios.get('https://togather-project-backend.vercel.app/api/getAnswers');
            const answers = response.data;
            console.log(answers);
            updateEmailStatus(answers)
            setAnswerJson(answers);
        } catch (error) {
            console.log(error);
        }
    };


    // checking if data has been updated or not startttt

    const arraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;

        return arr1.every((item, index) => {
            return JSON.stringify(item) === JSON.stringify(arr2[index]);
        });
    };
    // checking if data has been updated or not endddddd


    function updateEmailStatus(answers) {

        console.log(answers, 'gg')
        const matchedEntries = [];

        const updatedData = mainData.map((excelEntry) => {
            const matchedAnswerEntry = answers.find(
                (answerEntry) => answerEntry.email === excelEntry.email
            );

            if (matchedAnswerEntry) {

                matchedEntries.push({ ...excelEntry, status: matchedAnswerEntry.status });

                return { ...excelEntry, status: matchedAnswerEntry.status };
            }

            return excelEntry; // Return unchanged if no match
        });
        setMainData(updatedData);
        setGuestsConfirmed(matchedEntries);

        const onlyAccepted = matchedEntries.filter(item => item.status === "accepted");

        const guestAcceptedData = onlyAccepted.map((guest) => ({
            ...guest,
            checkIn: null,
            showCheckInButton: true,
        }));






        // createDataToMongo('guest_accepted', guestAcceptedData);
        console.log(matchedEntries.filter(item => item.status === "accepted"), '-------------yess--------matched');

        //  confirmedGuests(matchedEntries);
        // console.log('Matched Entries:', matchedEntries);

        if (!arraysEqual(mainData, updatedData)) { // checking if data updated or not in front-end

            if (newInsertedId == '') {
                createDataToMongo('guest_management', updatedData);

            } else {
                console.log(updatedData + "ssss  " + newInsertedId + "new isn");
                updateDataMongo('guest_management', updatedData, newInsertedId);


            }
            if (addedGuestNewInsertedId == '') {
                createDataToMongoForCheckedGuests('guest_accepted', guestAcceptedData);

            } else {

                updateDataMongo('guest_accepted', guestAcceptedData, addedGuestNewInsertedId);
            }

        } else {
            console.log('No updates made.');
        }




    }

    const handleCheckIn = () => {

    }

    //**************************************************************************************************


    const createDataToMongo = async (collectionName, updatedData) => {

        const data = {
            email: currentemailID,
            eventID: eventID,
            guestList: updatedData,
            guestListName: guestListName
        };
        console.log(data);




        createDataInMongo(collectionName, data).then(response => {
            console.log('Response from createdData:', response._id);
            // toast('Guest List Saved Successfully!');
            showSnackbar('Guest List Saved Successfully');
            setGuestListSaved(true);
            setNewInsertedId(response._id);
            //  localStorage.setItem('guestId', response._id);
            localStorage.setItem('guestId', response._id);
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }

    const createDataToMongoForCheckedGuests = async (collectionName, updatedData) => {

        const data = {
            email: currentemailID,
            eventID: eventID,
            guestList: updatedData,
            guestListName: guestListName
        };
        console.log(data);

        createDataInMongo(collectionName, data).then(response => {
            setAddedGuestNewInsertedId(response._id);
            localStorage.setItem('checkedGuestListID', response._id);
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }

    const updateDataMongo = async (collectionName, updatedData, newInsertedId) => {
        // event.preventDefault();
        // console.log(mongoData);
        console.log(newInsertedId, 'newInserted---------------');
        const data = {
            email: currentemailID,
            eventID: eventID,
            guestList: updatedData,
            guestListName: guestListName
        }

        updateDataInMongo(collectionName, newInsertedId, data).then(response => {
            console.log('Response from updateData:', response);
            // toast('Data update successfully');
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    };

    // **************************************************************************************************




    const EmailInputhandleChange = (event) => {
        setEmailInputValue(event.target.value);
    };
    const TemplateInputhandleChange = (event) => {
        setTemplateInputValue(event.target.value);
    };
    const SubjectInputhandleChange = (event) => {
        setSubjectInputValue(event.target.value);
    };


    const handleSave = async (event) => {

        event.preventDefault();
        createDataToMongo('guest_management', mainData);
    };




    const [columnDefs, setColumnDefs] = useState([
        { field: 'first_name', headerName: 'First Name', editable: true },
        { field: 'last_name', headerName: 'Last Name', editable: true },
        { field: 'phone', headerName: 'Phone Number', editable: true },
        { field: 'email', headerName: 'Email Address', editable: true },
        { field: 'address', headerName: 'Home Address', editable: true },
        { field: 'status', headerName: 'Current Status', editable: true },
    ]);

    const onRowSelected = (params) => {
        const selectedRows = params.api.getSelectedRows();
        console.log(selectedRows);
        // guestEmailData.push(selectedRows);
        setGuestAllData(selectedRows);
        // <NodemailerEmail userData={selectedRows} />

        const emails = selectedRows.map(item => item.email);

        const name = selectedRows.map(item => item.first_name + " " + item.last_name);

        console.log(name);
        setNameOfGuest(name);
        setEmailInputValue(emails);

        setEmailWithName({
            email: emails,
            name: name
        })
    };

    const onSearchChange = (event) => {
        const value = event.target.value;
        console.log(value);
        setquickFilterText(value);
    };

    // const onDeleteSelected = () => {
    //     const gridApi = gridRef.current.api;
    //     const selectedRows = gridApi.getSelectedRows();
    //     gridApi.applyTransaction({ remove: selectedRows });
    //   };

    //   const gridRef = React.useRef();

    const handleRowDelete = (event) => {
        if (guestAllData.length > 0) {
            console.log(guestAllData, 'guestAllData');
            console.log(mainData, 'mainData');
            const emailsToDelete = guestAllData.map(person => person.email);
            const updatedPeople = mainData.filter(person => !emailsToDelete.includes(person.email));
            setMainData(updatedPeople);
            if (updatedPeople.length > 0) {
                createDataToMongo('guest_management', updatedData)
            }
        } else {
            alert('Please select a guest to delete');
        }
    }

    // const composeEmailValidate = () =>{

    //     if(guestAllData.length > 0){
    //        setiSterminate(false);
    //     }else{
    //         alert('Please select a guest to send an email');
    //         setiSterminate(true);
    //     }

    // }



    return (
        <>
            {/* <div><ToastContainer /></div> */}

            {
                loader ?
                    <TogathrLoader />
                    : <></>
            }
            <section className='guest-table'>

                <div className="guest-table-header">
                    <h4>Guest List</h4>

                    <button onClick={handleStatusCheck}><i className="fa-solid fa-arrows-rotate"></i> Refresh</button>

                    <button className='save-button' onClick={handleSave}><i className="fa-solid fa-floppy-disk"></i> Save List</button>

                </div>

                <div className="guest-table-body">

                    <div className='global-search-table'>
                        <input type="text" placeholder="Search..." onChange={onSearchChange} />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <div className="table-actions">

                        <div className='addGuestButton'>

                            <Modal
                                buttonId="addGuest"
                                buttonLabel="Add Guest"
                                modalHeaderTitle="Add Guest"
                                modalBodyHeader="Fill guest info directly to your list"
                                // modalBodyHeader="Insert your body header here"
                                modalBodyContent={
                                    <div>

                                        <form>

                                            <div className="form-fields">
                                                <label htmlFor='first_name'>First Name</label>
                                                <input type="text" id='first_name' name='first_name' onChange={handleFirstNameChange} value={user_form_firstName} />
                                            </div>

                                            <div className="form-fields">
                                                <label htmlFor='last_name'>Last Name</label>
                                                <input type="text" id='last_name' name='last_name' onChange={handleLastNameChange} value={user_form_lastName} />
                                            </div>

                                            <div className="form-fields">
                                                <label htmlFor='email'>Email</label>
                                                <input type="text" id='email' name='email' onChange={handleEmailChange} value={user_form_email} />
                                            </div>

                                            <div className="form-fields">
                                                <label htmlFor='phone'>Phone</label>
                                                <input type="text" id='phone' name='phone' onChange={handlePhoneChange} value={user_form_phone} />
                                            </div>

                                            <div className="form-fields">
                                                <label htmlFor='address'>Address</label>
                                                <input type="text" id='address' name='address' onChange={handleAddressChange} value={user_form_address} />
                                            </div>

                                        </form>
                                    </div>
                                }
                                saveDataAndOpenName="Save and Continue"
                                saveDataAndOpenId="saveAndContinue"
                                saveDataAndOpenFunction={() => handleSendGuestData()}
                                saveDataAndCloseName="Save and close"
                                saveDataAndCloseId="saveAndClose"
                                saveDataAndCloseFunction={() => handleSendGuestData()}

                                buttonAlign='column'
                                onModalClose={() => console.log('Modal 1 closed')}
                                closeModalAfterDataSend='false'
                            />
                        </div>

                        {/* <div className="deleteGuestButton">
                            <button className='button-purple' onClick={handleDeleteGuest}>Delete Guest</button>
                        </div>
                         */}
                        <div className='send-email-button'>


                            <Modal
                                buttonId="composeEmail"
                                buttonLabel="Compose Email"
                                // buttonOpenFunction ={()=>{composeEmailValidate()}}
                                // terminateModalOpenAfterButtonClick={iSterminate}
                                modalHeaderTitle="Compose Invite"
                                modalBodyHeader="Send a message to your guest/s"
                                modalBodyContent={
                                    <form>
                                        <div className="form-fields">
                                            <label htmlFor='emails'>Email</label>
                                            <input type="text" id='emails' name='emails' onChange={EmailInputhandleChange}
                                                value={email} />
                                        </div>
                                        <div className="form-fields">
                                            <label htmlFor='subject'>Subject</label>
                                            <input type="text" id='subject' name='subject' onChange={SubjectInputhandleChange} value={subject}></input>
                                        </div>

                                        <div className="form-fields">
                                            <div className='form-sub-field'>
                                                <label htmlFor='content'>Template </label>
                                                <button className='button-green-fill' onClick={handleTextQuery} disabled={loading}>
                                                    {loading ? 'Loading...' : 'Generate AI text'}
                                                </button>
                                            </div>

                                            <input type='text' value={aiTextInput} onChange={handleInputChange} placeholder="Generate AI based email here..." />
                                            <br />
                                            <textarea rows='10' cols='50' id='content' name='content' onChange={TemplateInputhandleChange} value={message}></textarea>
                                        </div>

                                        {/* <div className="form-fields">
                                            <label htmlFor='attachment'>Attachment</label> */}
                                        {/* < input type="file"  onChange={handleAttachmentChange} /> */}
                                        {/* </div>*/}
                                    </form>

                                }
                                saveDataAndOpenName="Send Invite"
                                saveDataAndOpenId="sendInvite"
                                saveDataAndOpenFunction={() => handleSendEmail()}
                                buttonAlign='column'
                                onModalClose={() => console.log('Modal 1 closed')}
                                closeModalAfterDataSend="true"
                            />

                        </div>
                    </div>

                </div>

                <div className="guest-table-footer">
                    <div className="guest-final-table">
                        <button className="delete-row" onClick={handleRowDelete}><i className="fa-solid fa-trash-can"></i> Delete Selected</button>
                        <div className={"ag-theme-quartz"} style={{ width: "100%", height: 500, margin: "0 auto" }}>
                            {/* <button onClick={onDeleteSelected}>Delete Selected</button> */}
                            <AgGridReact
                                quickFilterText={quickFilterText}
                                rowData={mainData}
                                columnDefs={columnDefs}
                                rowSelection={rowSelection}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 25, 50]}
                                onRowSelected={onRowSelected}
                            />
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};
export default AgridTable;







