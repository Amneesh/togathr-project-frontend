import React, { useState, useEffect } from 'react'
import { useSnackbar } from './SnackbarContext';
import Chart from 'react-apexcharts';
import { parse } from 'postcss';

const GuestListOverview = ({ active, donutdata }) => {

    console.log('guestCount', donutdata);
    const showSnackbar = useSnackbar();

    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));
    const [guestlist, setGuestList] = React.useState([]);
    const [currentemailID, setCurrentEmailID] = useState(JSON.parse(localStorage.getItem('user-info')).email);
    const [series_total_guest_list, set_series_total_guest_list] = useState(null);
    const [totalGuestLength, setTotalGuestLength] = useState(null);


    const getCurrentEmailID = () => {
        const currentEmailID = JSON.parse(localStorage.getItem('user-info')).email;
        setCurrentEmailID(currentEmailID);
    }

    useEffect(() => {
        getCurrentEmailID();
    }, []);

    const getEventID = () => {
        const currentEventID = localStorage.getItem('eventId');
        setEventID(currentEventID);
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



    const options_total_guest_list = {
        labels: ["Uninvited"],
        chart: {
            type: 'donut',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '80%' // Adjust the size of the donut
                }
            }
        },
        fill: {
            colors: ['#5E11C9'] // Custom colors for each slice
        },
        tooltip: {
            enabled: true, // Enable tooltips
            formatter: function (val) {
                return val + "%"; // Format tooltip content
            }
        },
        dataLabels: {
            enabled: false, // Enable data labels
        },
        stroke: {
            width: 2 // Width of the stroke around the slices
        }
    };

    useEffect(() => {
      
    
    set_series_total_guest_list([Number(donutdata)]);
    setTotalGuestLength(Number(donutdata));
       console.log(donutdata, 'AGYA');
    }, [donutdata]);
    





    const handleNavigate = () => {
        active('guests');
    }

    return (
        <div className='guest-add-overview'>
            <div className="guest-add-overview-header">
                <h3>Guest</h3>
                <button className='button-purple' onClick={handleNavigate}>Add Guest</button>
            </div>

            <div className='guest-add-content'>

                <h5>Total Guests</h5>
                <h2>{totalGuestLength}</h2>

                <div className="donut-chart-content">
                    <Chart options={options_total_guest_list} series={series_total_guest_list && series_total_guest_list.length > 0 ? series_total_guest_list : 0 } type="donut" />
                </div>


                {/* 
                    {guestlist.length > 0 ?
                        <ul className='existing-guests-overview'>
                            {guestlist.map((item, index) => (

                                <li className='existing-guest-card-overview' key={index}>
                                    <a href="#" onClick={() => handleLinkClick(item._id)}>
                                        {item.guestListName}
                                    </a>
                                    <button onClick={() => handleDelete(item._id)}><i className="fa-solid fa-trash"></i></button>
                                </li>
                            ))}
                        </ul>
                        :
                        <>
                            <h5>You have not added any guest yet</h5>
                            
                        </>
                    } */}


            </div>
        </div>
    )
}

export default GuestListOverview
