import moment from 'moment';
import React from 'react';
import './UserIdentityPage.css'
function Personal({ userprofileData }) {

    return (
        <div className='personal_details_page'>
            <h3 className='header_Data'>Name -{controllIfValueIsNull(userprofileData.UserDetails.FirstName)} {controllIfValueIsNull(userprofileData.UserDetails.MiddleName)} {controllIfValueIsNull(userprofileData.UserDetails.LastName)}</h3>
            <h3>Joining Date - {controllIfDateObjectIsNull(userprofileData.UserDetails.DateOfJoining)}</h3>
            <h3>Current Address - {controllIfValueIsNull(userprofileData.UserDetails.CurrentAddress)}</h3>
            <h3>Permanent Address - {controllIfValueIsNull(userprofileData.UserDetails.PermanentAddress)}</h3>
            <h3>Personal Contact Number - {controllIfValueIsNull(userprofileData.UserDetails.PersonalContactNumber)}</h3>
            <h3>Official Contact Number - {controllIfValueIsNull(userprofileData.UserDetails.OfficialContactNumber)}</h3>
            <h3>Official Email - {controllIfValueIsNull(userprofileData.UserDetails.OfficialEmail)}</h3>
            <h3>Personal Email - {controllIfValueIsNull(userprofileData.UserDetails.PersonalEmail)}</h3>
            <h3>Emergency Contact Number - {controllIfValueIsNull(userprofileData.UserDetails.EmergencyContactNumber)}</h3>
        </div>
    );
}

export default Personal;

export const controllIfValueIsNull = (value) => {
    if (value == null) return '';
    else return value
}
export const controllIfDateObjectIsNull =(value)=>{
    if(value==null)return ''
    else{
        return moment(value.toDate()).format('DD-MM-YYYY')
    }
}