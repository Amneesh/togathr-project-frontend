import React from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const DownloadExcelSheet = () => {

    const [data, setData] = React.useState([]);


    const headers = [
        { header: 'first_name', key: 'first_name' },
        { header: 'last_name', key: 'last_name' },
        { header: 'email', key: 'email' },
        { header: 'address', key: 'address' },
        { header: 'phone', key: 'phone' },
    ];
    const generateExcelFile = (data, headers) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers.map((header) => header.header) });

        XLSX.utils.book_append_sheet(workbook, worksheet, 'data');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        return excelBuffer;
    };

    const downloadExcelFile = (excelBuffer, filename) => {
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, filename);
    };

    const handExcelSheetDownload = () => {
        const excelBuffer = generateExcelFile(data, headers);
        const filename = 'event_guest_list.xlsx';
        downloadExcelFile(excelBuffer, filename);
    };

    return (
        <div>
            {/* <button className='button-purple' onClick={handExcelSheetDownload}>Download Excel File</button> */}
            <p  onClick={handExcelSheetDownload}><span className="link-purple">Download Excel</span> and add your guest information into it</p>
        </div>
    )
}

export default DownloadExcelSheet
