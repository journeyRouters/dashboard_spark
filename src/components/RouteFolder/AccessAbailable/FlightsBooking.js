import { AccountBalanceWalletTwoTone, PublicTwoTone } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../App.css';

function FlightsBooking(props) {
    return (
        <div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/Flights'>
                    <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                    <p>Converted Files</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/LeavePolicy'>
                    <PublicTwoTone style={{ marginRight: "1rem" }} />
                    <p>leave policy
                    </p>
                </NavLink>
            </div>
        </div>
    );
}

export default FlightsBooking;