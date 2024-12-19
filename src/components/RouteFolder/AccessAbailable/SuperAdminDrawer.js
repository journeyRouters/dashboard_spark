import { AccountTreeTwoTone, PublicOutlined, PublicTwoTone, SearchTwoTone, Speed } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../../App.css';

function SuperAdminDrawer({ }) {
    return (
        <div>
            <div className='sidebarCard' >
                <div className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </div>
            </div>

            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/ControleLeads'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Driver</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'  to='/PendingPayments'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Pending Payments</p>
                </NavLink>
            </div>
            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/ManageAllTeam'>
                    <PublicTwoTone style={{ marginRight: "1rem" }} />
                    <p>Teams
                    </p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/SeekCreateQuote'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Current Lead</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/AdminFollowUpManagement'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Followed Lead</p>
                </NavLink>
            </div>

            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/ConvertedFiles'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Converted</p>
                </NavLink>
            </div>

            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/CanceledTripOperations'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Cancel Trips</p>
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
                <NavLink className='sidebarCardContaint' to='/DuringStayFiles'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>During Stay</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/PostStayFiles'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Post Stay</p>
                </NavLink>
            </div>

            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/ControleUsers'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>User Controller</p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CallerLead'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Caller's lead</p>
                </NavLink>
            </div> */}
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/Flights'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Flights</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/LeavePolicy'>
                    <PublicOutlined style={{ marginRight: "1rem" }} />
                    <p>leave policy
                    </p>
                </NavLink>
            </div>

        </div>
    );
}

export default SuperAdminDrawer;