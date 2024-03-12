import { FileCopyOutlined, PublicTwoTone, SearchTwoTone } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Caller(props) {
    return (
        <div>
            <div className='sidebarCard' >
                <div className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </div>
            </div>
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Attendance</p>
                </NavLink>
            </div> */}
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CallerCreateQuote'>
                    <FileCopyOutlined style={{ marginRight: "1rem" }} />
                    <p>Create Quote</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CallerFollowUp'>
                    <FileCopyOutlined style={{ marginRight: "1rem" }} />
                    <p>Quotation Followup</p>
                </NavLink>
            </div>

            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/CallerInvestigation'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Investigation</p>
                </NavLink>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/LeavePolicy'>
                    <PublicTwoTone style={{ marginRight: "1rem" }} />
                    <p>leave policy
                    </p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <PublicOutlined style={{ marginRight: "1rem" }} />
                    <p>Manage Leave
                    </p>
                </NavLink>
            </div> */}
        </div>
    );
}

export default Caller;