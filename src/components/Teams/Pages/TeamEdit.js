import React from 'react';
import './page.css'
import TeameditComponent from './TeameditComponent';

const TeamEdit = ({ profile, TeamProfile }) => {
    // console.log(TeamProfile)
    return (
        <div>
            <div style={{ overflowY: 'scroll', height: '44rem' }}>
                <div>
                    <h1>Team Members</h1>
                    <ul>
                        {TeamProfile.map((data, index) =><TeameditComponent data={data} key={index}/>)}
                            
                    </ul>
                </div>
            </div>
        </div >
    );
}

export default TeamEdit;
