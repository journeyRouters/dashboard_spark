import React from 'react';
import Application from './Application';
import LeaveHeader from './LeaveHeader';

const LeaveMainPage = ({profile,auth}) => {
    return (
        <div>
            <LeaveHeader/>
            <Application/>
        </div>
    );
}

export default LeaveMainPage;
