import { AccountBalanceWalletTwoTone, FileCopyOutlined, GroupAddTwoTone, PublicOutlined, SearchTwoTone, Speed } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../App.css';

function TeamLeader({ }) {

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
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Attendance</p>
                </NavLink>
            </div> */}
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
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/VouchersAndPayments'>
                    <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                    <p>Vouchers & payments</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/Dynamicdatachart'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>New Investigation</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/AdminInvestigation'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Investigation</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/Team'>
                    <GroupAddTwoTone style={{ marginRight: "1rem" }} />
                    <p>Team</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/LeavePolicy'>
                    <PublicOutlined style={{ marginRight: "1rem" }} />
                    <p>leave policy
                    </p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/ManageLeaves'>
                    <PublicOutlined style={{ marginRight: "1rem" }} />
                    <p>Manage Leave
                    </p>
                </NavLink>
            </div>
        </div>
    );
}

export default TeamLeader;