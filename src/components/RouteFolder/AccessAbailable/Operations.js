import { AccountTreeTwoTone, SearchTwoTone, Speed } from '@material-ui/icons';
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
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint'  to='/PendingPayments'>
                    <Speed style={{ marginRight: "1rem" }} />
                    <p>Pending Payments</p>
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
                <NavLink className='sidebarCardContaint' to='/Flights'>
                    <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                    <p>Flights</p>
                </NavLink>
            </div>
          
        </div>
    );
}

export default Operations;