import moment from 'moment';
import React from 'react';
import { controllIfValueIsNull } from './Personal';

function Professional({ userprofileData }) {
    return (
        <>
            <div className='personal_details_page'>
                <h3>Designation - {controllIfValueIsNull(userprofileData.UserDetails.Designation)}</h3>
                <h3>Department - {controllIfValueIsNull(userprofileData.UserDetails.Department)}</h3>
                <h3>Official Contact Number - {controllIfValueIsNull(userprofileData.UserDetails.OfficialContactNumber)}</h3>
                <h3>Official Email - {controllIfValueIsNull(userprofileData.UserDetails.OfficialEmail)}</h3>
                <h3>Personal Contact Number - {controllIfValueIsNull(userprofileData.UserDetails.PersonalContactNumber)}</h3>
                <h3>Personal Email - {controllIfValueIsNull(userprofileData.UserDetails.PersonalEmail)}</h3>
                <h3>Emergency Contact Number - {controllIfValueIsNull(userprofileData.UserDetails.EmergencyContactNumber)}</h3>
                <div className='Experience_list'>
                    <h3>Specialization -</h3>
                    <div className='Experience_list'>
                        {
                            userprofileData.UserDetails.Specialization.map((data, index) =>
                                <p className='experience' key={index}>{data},</p>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className='professional_details_page'>
                <h3>Previous Organisation Experience - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationExperience)}</h3>
                <h3>Previous Organisation Designation - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationDesignation)}</h3>
                <h3>Previous Organisation Department - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationDepartment)}</h3>
                <h3>Previous Organisation JoiningDate - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationJoiningDate)}</h3>
                <h3>Previous Organisation leaving Date - {controllIfValueIsNull(userprofileData.UserDetails.PreviousOrganisationleavingDate)}</h3>
                <h3>Previous Organisation Name - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationName)}</h3>
                <div className='Experience_list'>
                    <h3>Previous Organisation Specialization -</h3>
                    <div className='Experience_list'>
                        {
                            userprofileData.History.PreviousOrganisationSpecialization.map((data, index) =>
                                <p className='experience' key={index}>{data},</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </>

    );
}

export default Professional;