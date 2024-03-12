import React from 'react';
import './UserIdentityPage.css'
import { controllIfDateObjectIsNull, controllIfValueIsNull } from './Personal';

function Educational({ userprofileData }) {
    return (
        <div className='personal_details_page'>
            <h3>Education</h3>
            <div>
                <h3>Intermediate</h3>
                <div className='Certificates'>
                    <img src={controllIfValueIsNull(userprofileData.UserDocuments.Intermediate)}/>
                </div>
            </div>
            <div>
                <h3>Graduation</h3>
                <div className='Certificates'>
                    <img src={controllIfValueIsNull(userprofileData.UserDocuments.Graduation)}/>
                </div>
            </div>
            <div>
                <h3>PostGraduate</h3>
                <div className='Certificates'>
                    <img src={controllIfValueIsNull(userprofileData.UserDocuments.PostGraduate)}/>
                </div>
            </div>


        </div>
    );
}

export default Educational;