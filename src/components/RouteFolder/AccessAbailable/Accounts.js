import { SearchTwoTone, Speed } from '@material-ui/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

function Accounts({ }) {
    return (
        <div>
            <div className='sidebarCard' >
                <div className='sidebarCardContaint' >
                    <img width={'128px'} src='./assets/img/jrlogo.png' />
                </div>
            </div>
            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/ConvertedFiles'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Converted</p>
                </NavLink>
            </div>

            <div className='sidebarCard' >
                <NavLink className='sidebarCardContaint' to='/PaymentMarking'>
                    <SearchTwoTone style={{ marginRight: "1rem" }} />
                    <p>Payments</p>
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

export default Accounts;