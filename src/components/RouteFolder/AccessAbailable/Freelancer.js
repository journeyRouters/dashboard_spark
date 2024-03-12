import { AccountBalanceWalletTwoTone, FileCopyOutlined, SearchTwoTone, Speed } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Freelancer({ }) {
    return (
        <div>
            <div className='sidebarCard' >
                <div className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </div>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/RapidFire'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Rapid Fire</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CreateQuotes'>
                    <FileCopyOutlined style={{ marginRight: "1rem" }} />
                    <p>Create Quote</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/FollowUp'>
                    <FileCopyOutlined style={{ marginRight: "1rem" }} />
                    <p>Quotation Followup</p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard' >
                      <NavLink className='sidebarCardContaint'>
                        <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                        <p>Converted Files</p>
                      </NavLink>
                    </div> */}
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/VouchersAndPayments'>
                    <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                    <p>Vouchers & payments</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/FreeLancerInvestigation'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Investigation</p>
                </NavLink>
            </div>

        </div>
    );
}

export default Freelancer;