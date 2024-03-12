import { AccountTreeTwoTone, SearchTwoTone } from '@material-ui/icons';
import React from 'react';
import '../../../App.css';
import { NavLink } from 'react-router-dom';
function Operations({ }) {
    return (
        <div>
            <div className='sidebarCard' >
                <div className='sidebarCardContaint'>
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </div>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/OperationsFiles'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>converted</p>
                </NavLink>
            </div>
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Attendance</p>
                </NavLink>
            </div> */}
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
            {/* <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Investigation</p>
                </NavLink>
            </div> */}
        </div>
    );
}

export default Operations;