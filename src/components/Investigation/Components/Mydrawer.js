import { Drawer } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './Mydrawer.css'
import moment from 'moment';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { AccountTreeTwoTone } from '@material-ui/icons';
import queryString from 'query-string';
function Mydrawer({ open, Data }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(open);
    const navigate = useNavigate();
    const threeDaysAgo = moment().subtract(3, 'days').toDate();
    // const threeDaysAgo = moment().subtract(3, 'days').startOf('day').toDate();

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
  
    useEffect(() => {
        setIsDrawerOpen(open);
    }, [open]);

    return (
        <div>
            <Drawer anchor='right' open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                <div className='Drawer' onClick={handleOutsideClick}>
                    {
                        Data.map((item, index) =>
                            <div className='Drawer_Details_Card_Parent' key={index}>
                                <div className='Drawer_Details_Card_Left'>
                                    <h3 className='Drawer_Details_Card_tripId_border' onClick={()=>handleNavigation(item)}>{item.TripId}</h3>
                                    <h3>{item.Traveller_name}</h3>
                                    <h3>{item.Contact_Number}</h3>
                                    <h3>{moment(item.Travel_Date.toDate()).format('DD-MM-YYYY')}</h3>
                                    <h3>{item.Destination}</h3>

                                </div>
                                <div className='Drawer_Details_Card_Right'>
                                    <h3>{item.assign_to.name}</h3>
                                    <h3>{item.month}</h3>
                                    <h3>{moment(item.assigned_date_time.toDate()).format('DD-MM-YYYY')}</h3>
                                    <h3>{item.updated_last == null ? "" : moment(item.updated_last.toDate()).format('DD-MM-YYYY')}</h3>

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
