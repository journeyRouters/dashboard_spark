import React from 'react';
import { controllIfDateObjectIsNull, controllIfValueIsNull } from './Personal';

function Accounts({ userprofileData }) {
    var list = ['January2024','Feburary2024','March2024']
    return (<>
        <div className='personal_details_page'>
            <h3 className='header_Data'>Bank Name -{controllIfValueIsNull(userprofileData.UserDetails.FirstName)}</h3>
            <h3>Banking Name - {controllIfDateObjectIsNull(userprofileData.UserDetails.DateOfJoining)}</h3>
            <h3>Bank Account Number- {controllIfValueIsNull(userprofileData.UserDetails.CurrentAddress)}</h3>
            <h3>I.F.S.C Code - {controllIfValueIsNull(userprofileData.UserDetails.PermanentAddress)}</h3>
            <h3>Branch - {controllIfValueIsNull(userprofileData.UserDetails.PersonalContactNumber)}</h3>
            <h3>Bank Official Address- {controllIfValueIsNull(userprofileData.UserDetails.OfficialContactNumber)}</h3>
        </div>
        <div className='Accounts_details_page'>
            <h3>Slary Slips</h3>
            <div className='AllSlipsContainer'>
                {
                    list.map((data, index) =>
                        <div className='Slips'>
{data}
                        </div>)
                }
            </div>
        </div>
    </>
    );
}

export default Accounts;