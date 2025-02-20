import { AccountBalanceWalletTwoTone } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

function SalesPerson({ }) {
    return (
        <div>
            <div className='sidebarCard' >
                <div className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </div>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/RapidFire'>
                    <p>Rapid Fire</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CreateQuotes'>
                    <p>Create Quote</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'to='/FollowUp'>
                    <p>Quotation Followup</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/VouchersAndPayments'>
                    <p>Vouchers & payments</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CancelTrip'>
                    <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                    <p>Cancel Trips</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/Dynamicdatachart'>
                    <p>Investigation</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/LeavePolicy'>
                    <p>leave policy
                    </p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <p>Manage Leave
                    </p>
                </NavLink>
            </div> */}
        </div>
    );
}

export default SalesPerson;