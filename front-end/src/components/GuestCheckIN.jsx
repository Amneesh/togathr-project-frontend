import React, { useState, useMemo, useEffect, useCallback } from 'react';
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



const GuestCheckIN = (guestsConfirmed) => {

    const [quickFilterText, setquickFilterText] = useState('');
    const [mainGuestConfirmed, setMainGuestConfirmed] = useState(
        guestsConfirmed.guestsConfirmed.map((guest) => ({
          ...guest, // Spread existing guest data
          checkIn: null, // Add the checkIn field with the default value
          showCheckInButton: true, 
        }))
      );

    console.log('gotGridtABLE', guestsConfirmed.guestsConfirmed);

    const CustomButtonComponent = (props) => {
        const onClick = () => {
            const currentDateTime = new Date().toLocaleString(); // Get current date and time
            onCheckInClick(props.data, currentDateTime); // Trigger the state update in parent
        };

        return props.data.showCheckInButton ? (
            <div className="check-in-button"><button className="button-purple" onClick={onClick}><span>Check In</span></button></div>
        ) :<div className="checked-in-icon"><i className="fa-solid fa-circle-check"></i></div>;
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


    const onCheckInClick = (rowData, currentDateTime) => {
        setMainGuestConfirmed((prevGuests) => 
            prevGuests.map((guest) => 
                guest.email === rowData.email 
                    ? { ...guest, checkIn: currentDateTime, showCheckInButton: false } 
                    : guest
            )
        );
    };
   

    const onSearchChange = (event) => {
        const value = event.target.value;
        console.log(value);
        setquickFilterText(value);
    };

    return (
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
                            rowData={mainGuestConfirmed}
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
    )
}

export default GuestCheckIN
