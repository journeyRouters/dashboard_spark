import { AccountTreeTwoTone, FileCopyOutlined, PersonOutlineOutlined, SearchTwoTone, Speed, TrendingUp } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Admin({ }) {
    return (
        <div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </NavLink>
            </div>
            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/WebLeadLoader'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>WebLeadLoader</p>
                </NavLink>
            </div>
            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/CallerLead'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Lead From Callers</p>
                </NavLink>
            </div>
            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/CallerLeadAssinger'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Caller's lead</p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/Test'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Export meeting data</p>
                </NavLink>
            </div> */}
            {/* <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>UploadAttendance</p>
                </NavLink>
            </div> */}
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/Dynamicdatachart'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Investigation</p>
                </NavLink>
            </div>

            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/SeekCreateQuote'>
                    <FileCopyOutlined style={{ marginRight: "1rem" }} />
                    <p>Create Quote</p>
                </NavLink>
            </div>
            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/ControleLeads'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Driver</p>
                </NavLink>
            </div>
            <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/Whatsappleads'>
                    <TrendingUp style={{ marginRight: "1rem" }} />
                    <p>What's app</p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard'>
                <NavLink className='sidebarCardContaint' to='/Test'>
                    <PersonOutlineOutlined style={{ marginRight: "1rem" }} />
                    <p>Website Lead</p>
                </NavLink>
            </div> */}
        </div>
    );
}

export default Admin;