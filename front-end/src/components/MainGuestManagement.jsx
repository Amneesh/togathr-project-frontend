import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Modal from './ModalPopupBox';
import * as XLSX from "xlsx";
import AOS from "aos";
import "aos/dist/aos.css";
import AgridTableComponent from './AgridTableComponent'
import 'react-toastify/dist/ReactToastify.css';
import TotalGuestPieChart from './TotalGuestPieChart';

import { DeleteDataInMongo,readDataFromMongoWithParam, readSingleDataFromMongo, createDataInMongo, updateDataInMongo } from "../../api/mongoRoutingFile"
import DownloadExcelSheet from './DownloadExcelSheet';
import { useSnackbar } from './SnackbarContext';
import GuestCheckIN from './GuestCheckIN';
// import ApexChart from './TestCharts'

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";


ModuleRegistry.registerModules([ClientSideRowModelModule]);
const rowSelection = {
    mode: 'multiRow',
    headerCheckbox: false,
};




const MainGuestManagement = () => {

    // const cropData = {
    //     name:'wheat',
    //     crops:[
    //         {
    //             "month": "January 2023",
    //             "year": "2023",
    //             "price": 50
    //         },
    //         {
    //             "month": "February 2023",
    //             "year": "2023",
    //             "price": 52
    //         },
    //         {
    //             "month": "March 2023",
    //             "year": "2023",
    //             "price": 54
    //         },
    //         {
    //             "month": "April 2023",
    //             "year": "2023",
    //             "price": 55
    //         },
    //         {
    //             "month": "May 2023",
    //             "year": "2023",
    //             "price": 58
    //         },
    //         {
    //             "month": "June 2023",
    //             "year": "2023",
    //             "price": 60
    //         },
    //         {
    //             "month": "July 2023",
    //             "year": "2023",
    //             "price": 62
    //         },
    //         {
    //             "month": "August 2023",
    //             "year": "2023",
    //             "price": 65
    //         },
    //         {
    //             "month": "September 2023",
    //             "year": "2023",
    //             "price": 63
    //         },
    //         {
    //             "month": "October 2023",
    //             "year": "2023",
    //             "price": 65
    //         },
    //         {
    //             "month": "November 2023",
    //             "year": "2023",
    //             "price": 64
    //         },
    //         {
    //             "month": "December 2023",
    //             "year": "2023",
    //             "price": 63
    //         }
    //     ]
    // }



    const showSnackbar = useSnackbar();
    // const [value, setValue] = React.useState(0);

    const [jsonData, setJsonData] = useState([]);
    const [guestListName, setGuestListName] = useState('');
    const [sheetName, setSheetName] = useState('');
    const [showSheet, setShowSheet] = useState(false);
    const [total_guest_count, set_total_guest_count] = useState(null);

    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));
    const [currentemailID, setCurrentEmailID] = useState(JSON.parse(localStorage.getItem('user-info')).email);

    const [answerJson, setAnswerJson] = useState([]);


    const handleGuestListName = (event) => { setGuestListName(event.target.value); }
    const handleSheetNameChange = (event) => { setSheetName(event.target.value); setGuestListName(event.target.value) };



    const [guestlist, setGuestList] = React.useState([]);
    const [newFlow, setnewFlow] = React.useState(false);
    const [existingFlow, setExistingFlow] = React.useState(false);
    const [selectedGuestList, setSelectedGuestList] = React.useState('');
    const [selectedGuestListName, setSelectedGuestListName] = React.useState('');

    const [documentId, setDocumentID] = React.useState();

    const [donut_data, set_donut_data] = useState([]);
    const [bar_data, set_bar_data] = useState([]);

    const [guestListID, setGuestListID] = useState(localStorage.getItem('guestId'));

    const [isClickedShowList, setisClickedShowList] = useState(false);
    // kk
    const [guestsConfirmedPass, setGuestsConfirmedPass] = useState([]);

    const [allGuestFilter, setAllGuestFilter] = useState([]);

    const [quickFilterText, setquickFilterText] = useState('');
    const [activeTab, setActiveTab] = useState('tab1');

    const [guestCheckedInData, setGuestCheckedInData] = useState([]);

    useEffect(() => {
        AOS.init({
            disable: "phone",
            duration: 700,
            easing: "ease-out-cubic",
        });
    }, []);
    const getCurrentEmailID = () => {
        const currentEmailID = JSON.parse(localStorage.getItem('user-info')).email;
        setCurrentEmailID(currentEmailID);
    }

    const refreshComponent = () => {
        setisClickedShowList(true);
        setnewFlow(false);
        setExistingFlow(false);
        set_total_guest_count(null);
        setSelectedGuestList('');
        setSelectedGuestListName('');

    }
    const getEventID = () => {
        const currentEventID = localStorage.getItem('eventId');

        setEventID(currentEventID);
        console.log('tt', currentEventID)
        refreshComponent()
    };
    useEffect(() => {
        getCurrentEmailID();
    }, []);

    useEffect(() => {
        getEventID();
        const handleStorageChange = (event) => {
            if (event.key === 'eventId') {
                getEventID();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        const intervalId = setInterval(() => {
            const currentEventID = localStorage.getItem('eventId');
            if (currentEventID !== eventID) {
                getEventID();
            }
        }, 1000);


        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(intervalId);
        };
    }, [eventID]);

    const handleCustomSheetGuestData = () => {
        setnewFlow(true);
        setShowSheet(true);
        setJsonData([]);
    }

    const [file, setFile] = useState(null);

    const handleConvert = () => {
        setnewFlow(true);
        setShowSheet(false);
        setExistingFlow(false);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);

                addStatusToList(json);
            };
            reader.readAsBinaryString(file);
        }

        const data = {
            email: currentemailID,
            guestList: jsonData,
            name: guestListName
        }

        console.log(data);
        // <AgGridTable json={json} />

    };

    useEffect(() => {
        console.log('Updated Guest List:', jsonData);
    }, [jsonData]);

    useEffect(() => {
        getEventID();
    }, [eventID]);




    function addStatusToList(json) {
        const newGuestJson = json.map((item) => {
            return { ...item, status: 'uninvited' };
        });
        setJsonData(newGuestJson);

    }

    // kkk

    const chooseNew = () => {
        setnewFlow(true);
        setExistingFlow(false);
    }

    const chooseExisting = async () => {
        setisClickedShowList(true);
        console.log(currentemailID);
        console.log(eventID);
        setnewFlow(false);
        const user_email = currentemailID;

        try {
            const queryParams = new URLSearchParams({
                user_email: user_email,
                eventID: eventID,
            }).toString();

            const result = await readDataFromMongoWithParam('guest_management', queryParams);

            if (result && result.length > 0) {
                console.log(result + '6666666666');
                setGuestList(result);
            } else {
                console.log(false);
               

            }
        } catch (error) {
            console.error('Error checking event:', error);
           
        }
        
      
        setExistingFlow(true);
    }


    useEffect(() => {
        localStorageGuest()
    }, []);

    const localStorageGuest = () => {
        if (guestListID) {
            readSingleDataFromMongo('guest_management', guestListID).then(response => {
                console.log('Response from single:', response.guestList);

                setSelectedGuestList(response.guestList);
                setSelectedGuestListName(response.guestListName);
                // console.log(id);
                // setDocumentID(id);
                setnewFlow(false);

                setExistingFlow(true);
                setisClickedShowList(false);

            })
                .catch(error => {
                    console.error('Failed to update data:', error);
                });

        } else {
            setisClickedShowList(true);
        }
    }





    const handleLinkClick = (id) => {
        const selectedData = guestlist.find((item) => item._id === id);
        console.log(selectedData);
        setSelectedGuestList(selectedData.guestList);
        setSelectedGuestListName(selectedData.guestListName);
        console.log(id);
        setDocumentID(id);
    };

    useEffect(() => {
        console.log(selectedGuestList, selectedGuestListName);
    }, [selectedGuestList, selectedGuestListName]);



    const handleDelete = async (id) => {
        console.log(id);

        DeleteDataInMongo('guest_management', id).then(response => {
            console.log('Response from updateData:', response);
            // toast('Deleted Successfully')
            showSnackbar('Deleted Successfully', 'Data has been deleted successfully.');
            chooseExisting();
        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }

    useEffect(() => {

        const totalSum = Object.values(donut_data).reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);

        set_total_guest_count(totalSum);

    }, [donut_data]);




    const handleDataFromAgGrid = (data) => {
        console.log(data, 'child-parent');
        set_donut_data(data);

    }

    const handleConfirmedGuest = (data) => {
        //     console.log('gotcha-mate', data);
        //   //  setGuestsConfirmedPass(data);
        //   const guestAcceptedData = data.map((guest) => ({
        //     ...guest,
        //     checkIn: null,
        //     showCheckInButton: true, 
        // }));
        // const 
        //   createDataInMongo('guest_accepted', guestAcceptedData).then(response => {
        //     console.log('Response from createdData:', response._id);
        //     // toast('Guest List Saved Successfully!');

        // })
        //     .catch(error => {
        //         console.error('Failed to update data:', error);
        //     });

        //   setGuestsConfirmedPass(data.map((guest) => ({
        //     ...guest,
        //     checkIn: null,
        //     showCheckInButton: true, 
        //   })));

    }


    useEffect(() => {
        if (selectedGuestList.length > 0) {
            setAllGuestFilter(selectedGuestList);
            //  getAnswersForCheckIN(selectedGuestList);

        }
    }, [selectedGuestList]);

    useEffect(() => {
        if (jsonData.length > 0) {
            setAllGuestFilter(jsonData);
            // getAnswersForCheckIN(jsonData);
        }
    }, [jsonData]);

    useEffect(() => {
        console.log(guestsConfirmedPass, 'telus');


        // Call updateDataMongo when guestsConfirmedPass changes
        if (guestsConfirmedPass.length > 0 && localStorage.getItem('checkedGuestListID') != null) {

            updateDataMongo('guest_accepted', guestsConfirmedPass, localStorage.getItem('checkedGuestListID'));
            set_bar_data(guestsConfirmedPass);

        }
    }, [guestsConfirmedPass]); // Add dependencies here


    const handleTabClick = async (tab) => {
        setActiveTab(tab);
        if (tab === 'tab3') {
            if (localStorage.getItem('checkedGuestListID') != null) {
                readSingleDataFromMongo('guest_accepted', localStorage.getItem('checkedGuestListID')).then(response => {
                    console.log('Response from single:', response.guestList);
                    setGuestsConfirmedPass(response.guestList);
                    setGuestCheckedInData(response);

                })
                    .catch(error => {
                        console.error('Failed to update data:', error);
                    });
            }
        }

    };

    // const getAnswersForCheckIN = async (data) => {
    //     console.log('data', data);
    //     try {
    //         const response = await axios.get('http://localhost:5555/api/answers');
    //         const answers = response.data;
    //         console.log(answers);
    //         updateEmailStatus(answers, data)
    //         setAnswerJson(answers);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // function updateEmailStatus(answers, data) {
    //     console.log(answers, 'gg')
    //     const matchedEntries = [];

    //     const updatedData = data.map((excelEntry) => {
    //         const matchedAnswerEntry = answers.find(
    //             (answerEntry) => answerEntry.email === excelEntry.email
    //         );

    //         if (matchedAnswerEntry) {

    //             matchedEntries.push({ ...excelEntry, status: matchedAnswerEntry.status });

    //             return { ...excelEntry, status: matchedAnswerEntry.status };
    //         }

    //         return excelEntry; // Return unchanged if no match
    //     });
    //     //   setMainData(updatedData);
    //     // const acceptedData = matchedEntries.filter(item => item.status === "accepted");

    //     // const newFinalGuestCheckIn = acceptedData.map((guest) => ({
    //     //     ...guest,
    //     //     checkIn: null,
    //     //     showCheckInButton: true,
    //     // }));
    //     // console.log(newFinalGuestCheckIn, 'ACCEPTED');

    //     setGuestsConfirmedPass(matchedEntries.map((guest) => ({
    //         ...guest,
    //         checkIn: null,
    //         showCheckInButton: true, 
    //       })));

    //     //  confirmedGuests(matchedEntries);
    //     console.log('Matched Entries:', matchedEntries);
    //     }
    // if (!arraysEqual(mainData, updatedData)) { // checking if data updated or not in front-end

    //     if (newInsertedId == '') {
    //         createDataToMongo(updatedData);
    //     } else {
    //         updateDataMongo(updatedData, newInsertedId);
    //     }

    // } else {
    //     console.log('No updates made.');
    // }



    // checkin--function

    const CustomButtonComponent = (props) => {
        const onClick = () => {
            const currentDateTime = new Date().toLocaleString(); // Get current date and time
            onCheckInClick(props.data, guestsConfirmedPass, currentDateTime); // Trigger the state update in parent
        };

        return props.data.showCheckInButton ? (
            <div className="check-in-button"><button className="button-purple" onClick={onClick}><span>Check In</span></button></div>
        ) : <div className="checked-in-icon"><i className="fa-solid fa-circle-check"></i></div>;
    };

    const [columnDefs] = useState([
        { field: 'first_name', headerName: 'First Name', editable: true },
        { field: 'last_name', headerName: 'Last Name', editable: true },
        { field: 'phone', headerName: 'Phone Number', editable: true },
        { field: 'email', headerName: 'Email Address', editable: true },
        { field: 'status', headerName: 'Current Status', editable: true },
        {
            field: 'checkIn',
            headerName: 'Check-in',
            cellRenderer: 'checkInButtonRenderer',
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
            cellRenderer: CustomButtonComponent,
        },
    ]);


    const onCheckInClick = (rowData, guestsConfirmedPass, currentDateTime) => {
        console.log(guestsConfirmedPass, '-------------eeee----------')
        // const newCheckedInGuests =  guestsConfirmedPass.map((guest) =>
        //         guest.email === rowData.email
        //             ? { ...guest, checkIn: currentDateTime, showCheckInButton: false }
        //             : guest
        //     )
        // console.log(newCheckedInGuests, 'HELLO----------');
        // setGuestsConfirmedPass(newCheckedInGuests);
        setGuestsConfirmedPass((prevGuests) =>
            prevGuests.map((guest) =>
                guest.email === rowData.email
                    ? { ...guest, checkIn: currentDateTime, showCheckInButton: false }
                    : guest
            )
        );
        console.log(guestsConfirmedPass, 'asjoeokefwnfejkwnekfjwfw');

    };


    const onSearchChange = (event) => {
        const value = event.target.value;
        console.log(value);
        setquickFilterText(value);
    };

    const updateDataMongo = async (collectionName, updatedData, newInsertedId) => {

        console.log('colelctioname' + collectionName + "data: " + updatedData + "newid: " + newInsertedId);
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

    // checkin-function
    return (

        <>

            <div className="tabs">
                <button onClick={() => handleTabClick('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>Guest List</button>
                <button onClick={() => handleTabClick('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>Guest Stats</button>
                <button onClick={() => handleTabClick('tab3')} className={activeTab === 'tab3' ? 'active' : ''}>Guest Check-in</button>
            </div>

            <div className="tab-content">
                <div style={{ display: activeTab === 'tab1' ? 'block' : 'none' }}>
                    <section className='addGuestsSection'>
                        <h3 className='visually-hidden'>Add Guests</h3>

                        <div className="addGuestsFeature">
                            <div className='addGuestCard' >
                                <div className='addGuestCardHeader'>
                                    <h4>New List</h4>
                                    <div className='sheetModal' >

                                        <Modal

                                            buttonId="createNewSheet "
                                            buttonLabel="Create New Sheet"
                                            modalHeaderTitle="New Sheet Detail"
                                            modalBodyHeader="Add detail over here"
                                            // modalBodyHeader="Insert your body header here"
                                            modalBodyContent={
                                                <form>
                                                    <div className="form-fields">
                                                        <label htmlFor='sheet_name'>Sheet Name</label>
                                                        <input type="text" id='sheet_name' name='sheet_name' onChange={handleSheetNameChange} value={sheetName} />
                                                    </div>
                                                </form>
                                            }
                                            saveDataAndOpenName="Save"
                                            saveDataAndOpenId="save"
                                            saveDataAndOpenFunction={() => handleCustomSheetGuestData()}
                                            closeButtonID="closeSheet"
                                            closeButtonName='Close'
                                            buttonAlign='row'
                                            onModalClose={() => console.log('Modal 1 closed')}
                                            closeModalAfterDataSend="true"




                                        />

                                    </div>
                                    {/* <button className='button-purple' onClick={chooseNew}>Create New</button> */}
                                </div>
                                <div className='addGuestCardBody'>
                                    <p>Create a new list.</p>
                                </div>
                            </div>
                            <div className='addGuestCard' >
                                <div className='addGuestCardHeader'>
                                    <h4>Select from existing</h4>
                                    <button className='button-purple' onClick={chooseExisting}>Choose Existing</button>
                                </div>
                                <div className='addGuestCardBody'>
                                    <p>Select from existing saved guest lists</p>
                                </div>
                            </div>
                            <div className='addGuestCard'>
                                <div className='addGuestCardHeader'>
                                    <h4>Import Template</h4>
                                    <div className='excelModal' >

                                        <Modal

                                            buttonId="ImportExcelSheet "
                                            buttonLabel="Import Excel Sheet"
                                            modalHeaderTitle="Import Excel Sheet"
                                            modalBodyHeader="Upload your guest excel sheet here"
                                            modalBodyContent={
                                                <form>
                                                    <div className="form-fields">
                                                        <label htmlFor="excelSheetName">Guest list Name</label>
                                                        <input type="text" id="excelSheetName" required name="excelSheetName" onChange={handleGuestListName} />
                                                    </div>

                                                    <div className="form-fields">

                                                        < input
                                                            type="file"
                                                            accept=".xls,.xlsx"
                                                            onChange={(e) => setFile(e.target.files[0])}
                                                        />
                                                    </div>
                                                </form>
                                            }
                                            saveDataAndOpenName="Upload File"
                                            saveDataAndOpenId="uploadFile"
                                            saveDataAndOpenFunction={() => handleConvert()}
                                            closeButtonID="closeModal"
                                            closeButtonName='Close'
                                            buttonAlign='column'
                                            onModalClose={() => console.log('Modal 1 closed')}
                                            closeModalAfterDataSend="true"
                                        />


                                    </div>

                                </div>
                                <div className='addGuestCardBody'>
                                    <DownloadExcelSheet />
                                </div>
                            </div>
                        </div>

                    </section>
                    <section className='guestList'>

                        {

                            newFlow ?                  
                            <><section className='option-modals'>

                            </section>

                                    <div>
                                        {jsonData.length > 0 || showSheet ?
                                            <div className='body-data-table' >
                                                <h3 >{guestListName}</h3>
                                                <AgridTableComponent sendDataToParent={handleDataFromAgGrid} confirmedGuests={handleConfirmedGuest} key={jsonData} json={[jsonData, guestListName, '']} />
                                            </div>
                                            :
                                            <></>}
                                    </div>
                                    
                                </>

                                : <>
                                    {isClickedShowList ?
                                        <div className='no-data'>
                                            <p>Guest list not available yet. Go ahead and add some guests to get started.</p>
                                        </div> : <></>
                                    }


                                </>

                        }

                        {existingFlow && isClickedShowList ?

                            <div className='allGuestLists'>


                                {guestlist.length > 0 ?
                                    <>
                                        <h5>Choose one of the lists</h5>

                                        <ul className='existing-guests'>
                                            {guestlist.map((item, index) => (

                                                <li className='existing-guest-card' key={index}>
                                                    <a href="#" onClick={() => handleLinkClick(item._id)}>
                                                        {item.guestListName}
                                                    </a>
                                                    <button onClick={() => handleDelete(item._id)}><i className="fa-solid fa-trash"></i></button>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                    :
                                    <h5>There are no saved guest Lists</h5>
                                }
                            </div>
                            : <></>}

                        {selectedGuestList.length > 0 && existingFlow ?


                            <div className='guest-table-existing' >
                                <h3>{selectedGuestListName}</h3>
                                <AgridTableComponent sendDataToParent={handleDataFromAgGrid} confirmedGuests={handleConfirmedGuest} key={selectedGuestListName} json={[selectedGuestList, selectedGuestListName, documentId]} />

                            </div> : <></>}

                        {/* <ApexChart crops={cropData}/> */}

                    </section>
                </div>
                <div style={{ display: activeTab === 'tab2' ? 'block' : 'none' }}>
                    <section className='guestChartSection'>

                        {total_guest_count > 0 ?
                            <TotalGuestPieChart timeLineData={selectedGuestList.length} donutData={donut_data} barData={bar_data} />
                            : <p>Guest Statistics not available yet. Go ahead and add some guests under Guest List to get started.</p>
                        }

                    </section>
                </div>
                <div style={{ display: activeTab === 'tab3' ? 'block' : 'none' }}>
                    <section className="guest-check-in">
                        {guestsConfirmedPass.length > 0 ?
                            // <GuestCheckIN guestsConfirmed={guestsConfirmedPass} />
                            <section className='guest-table'>
                                <div className="guest-table-body">
                                    <div className='global-search-table'>
                                        <input type="text" placeholder="Search..." onChange={onSearchChange} />
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                </div>

                                <div className="guest-table-footer">
                                    <div className="guest-final-table guest-checkIn-table">

                                        <div className={"ag-theme-quartz"} style={{ width: "100%", height: 500, margin: "0 auto" }}>
                                            {/* <button onClick={onDeleteSelected}>Delete Selected</button> */}
                                            <AgGridReact
                                                quickFilterText={quickFilterText}
                                                rowData={guestsConfirmedPass.filter(item => item.status === "accepted")}
                                                columnDefs={columnDefs}
                                                // rowSelection={rowSelection}
                                                pagination={true}
                                                paginationPageSize={10}
                                                paginationPageSizeSelector={[10, 25, 50]}

                                            />
                                        </div>
                                    </div>

                                </div>
                            </section>




                            :
                            <p>Guest Check-in not available yet. Go ahead and add some guests under Guest List to get started.</p>

                        }
                    </section>
                </div>
            </div>




            {/* <div> <ToastContainer /></div> */}

            <div className='guest-management-tool'>








            </div>
        </>
    )
}

export default MainGuestManagement
