import { Drawer } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './Mydrawer.css';
function Mydrawer({ open, Data }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(open);

    const toggleDrawer = (newOpen) => {
        setIsDrawerOpen(newOpen);
    };
    const handleOutsideClick = (event) => {
        event.stopPropagation();
    };
    const handleNavigation = (data) => {
        const encodedData = encodeURIComponent(JSON.stringify(data.TripId));
        const url = `/Detailpage?TripId=${encodedData}`;
        window.open(url, '_blank');
    };
    function exportToExcel(data) {
        var sheetname = moment(new Date()).format('DD-MMM-YYYY')
        const worksheetData = data.map(item => ({
            TripID: item.TripId,
            Destination: item.Destination,
            ClientName: item.Traveller_name,
            Number: item.Contact_Number,
            TravelDate: item.Travel_Date.toDate(),
            Lead_Assigned:item.assigned_date_time.toDate(),
            // updated_last:item.updated_last.toDate(),
            SalesPerson: item.assign_to.name,
            ConvertedMonth: item.month
        }));

        // Create a new worksheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${sheetname}.xlsx`);
    }
    useEffect(() => {
        setIsDrawerOpen(open);
    }, [open]);

    return (
        <div>
            <Drawer anchor='right' open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                <div className='Drawer' onClick={handleOutsideClick}>
                    <button className='export_button' onClick={()=>exportToExcel(Data)}>Export Data </button>
                    {
                        Data.map((item, index) =>
                            <div className='Drawer_Details_Card_Parent' key={index}>
                                <div className='Drawer_Details_Card_Left'>
                                    <h3 className='Drawer_Details_Card_tripId_border' onClick={() => handleNavigation(item)}>{item.TripId}</h3>
                                    <h3>Client - {item.Traveller_name}</h3>
                                    <h3>Contact no.- {item.Contact_Number}</h3>
                                    <h3>Date of Travel- {moment(item.Travel_Date.toDate()).format('DD-MM-YYYY')}</h3>
                                    <h3>Destination- {item.Destination}</h3>
                                    <h3>Pax- {item.Pax}</h3>
                                </div>
                                <div className='Drawer_Details_Card_Right'>
                                    <h3>Sales Person- {item.assign_to.name}</h3>
                                    <h3>Lead Status- {item.Lead_Status}</h3>                                    
                                    <h3>Lead Assigned- {moment(item.assigned_date_time.toDate()).format('DD-MM-YYYY')}</h3>
                                    <h3>Last Updated Date- {item.updated_last == null ? "" : moment(item.updated_last.toDate()).format('DD-MM-YYYY')}</h3>

                                </div>
                            </div>
                        )
                    }

                </div>
            </Drawer>
        </div>
    );
}

export default Mydrawer;
