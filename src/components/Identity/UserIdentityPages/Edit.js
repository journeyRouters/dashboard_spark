import React from 'react';
import { controllIfDateObjectIsNull, controllIfValueIsNull } from './Personal';
import './UserIdentityPage.css'

function Edit({ userprofileData }) {
    var list = ['January2024', 'Feburary2024', 'March2024', 'April2024']

    return (
        <div className='personal_details_page'>
            <h3 className='header_Data'>First Name-
                <input value={controllIfValueIsNull(userprofileData.UserDetails.FirstName)} />
            </h3>
            <h3 className='header_Data'>Middle Name-
                <input value={controllIfValueIsNull(userprofileData.UserDetails.MiddleName)} />
            </h3>
            <h3 className='header_Data'>Last Name-
                <input value={controllIfValueIsNull(userprofileData.UserDetails.LastName)} />
            </h3>
            <h3>Joining Date-<input type='date' value={controllIfDateObjectIsNull(userprofileData.UserDetails.DateOfJoining)} /></h3>

            <h3>Current Address -<textarea value={controllIfValueIsNull(userprofileData.UserDetails.CurrentAddress)} /></h3>
            <h3>Permanent Address - <textarea value={controllIfValueIsNull(userprofileData.UserDetails.PermanentAddress)} /></h3>
            <h3>Personal Contact Number - <input type='number' value={controllIfValueIsNull(userprofileData.UserDetails.PersonalContactNumber)} /></h3>
            <h3>Official Contact Number -<input type='number' value={controllIfValueIsNull(userprofileData.UserDetails.OfficialContactNumber)} /></h3>
            <h3>Official Email - <input type='email' value={controllIfValueIsNull(userprofileData.UserDetails.OfficialEmail)} /></h3>
            <h3>Personal Email - <input type='email' value={controllIfValueIsNull(userprofileData.UserDetails.PersonalEmail)}/></h3>
            <h3>Emergency Contact Number - <input type='number' value={controllIfValueIsNull(userprofileData.UserDetails.EmergencyContactNumber)}/></h3>

            <h3>Designation - {controllIfValueIsNull(userprofileData.UserDetails.Designation)}</h3>
            <h3>Department - {controllIfValueIsNull(userprofileData.UserDetails.Department)}</h3>
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

            <h3>Previous Experience - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationExperience)}</h3>
            <h3>Previous Designation - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationDesignation)}</h3>
            <h3>Previous Department - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationDepartment)}</h3>
            <h3>Previous JoiningDate - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationJoiningDate)}</h3>
            <h3>Previous leaving Date - {controllIfValueIsNull(userprofileData.UserDetails.PreviousOrganisationleavingDate)}</h3>
            <h3>Previous Name - {controllIfValueIsNull(userprofileData.History.PreviousOrganisationName)}</h3>
            <div className='Experience_list'>
                <h3>Previous Specialization -</h3>
                <div className='Experience_list'>
                    {
                        userprofileData.History.PreviousOrganisationSpecialization.map((data, index) =>
                            <p className='experience' key={index}>{data},</p>
                        )
                    }
                </div>
            </div>


            <h3>Education</h3>
            <div>
                <h3>Intermediate</h3>
                <div className='Certificates'>
                    <img src={controllIfValueIsNull(userprofileData.UserDocuments.Intermediate)} />
                </div>
            </div>
            <div>
                <h3>Graduation</h3>
                <div className='Certificates'>
                    <img src={controllIfValueIsNull(userprofileData.UserDocuments.Graduation)} />
                </div>
            </div>
            <div>
                <h3>PostGraduate</h3>
                <div className='Certificates'>
                    <img src={controllIfValueIsNull(userprofileData.UserDocuments.PostGraduate)} />
                </div>
            </div>

            <h1>Accounts</h1>

            <h3 className='header_Data'>Bank Name -{controllIfValueIsNull(userprofileData.UserDetails.FirstName)}</h3>
            <h3>Banking Name - {controllIfDateObjectIsNull(userprofileData.UserDetails.DateOfJoining)}</h3>
            <h3>Bank Account Number- {controllIfValueIsNull(userprofileData.UserDetails.CurrentAddress)}</h3>
            <h3>I.F.S.C Code - {controllIfValueIsNull(userprofileData.UserDetails.PermanentAddress)}</h3>
            <h3>Branch - {controllIfValueIsNull(userprofileData.UserDetails.PersonalContactNumber)}</h3>
            <h3>Bank Official Address- {controllIfValueIsNull(userprofileData.UserDetails.OfficialContactNumber)}</h3>

            <div >
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
            <button>SAVE</button>

        </div>
    );
}

export default Edit;