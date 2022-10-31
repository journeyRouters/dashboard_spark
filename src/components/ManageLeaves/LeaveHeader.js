import React from 'react';
import './Leave.css'

const LeaveHeader = () => {
    return (
        <div className='Leave_header' >
            <div className='unitDivCL'>
                <span>Casual Leave</span>
                <img alt='casual Leave'src='/assets/leaveAssets/casual.png' className='logoCL'/>
                <span>10 Days</span>

            </div>
            <div className='unitDivCL'>
            <span>Leave Without Pay</span>
                <img alt='Leave Without Pay'src='/assets/leaveAssets/LWP.jpeg' className='logoCL'/>
                <span>10 Days</span>
            </div>
            <div className='unitDivCL'>
            <span>Privileged Leave</span>
                <img alt='Privileged Leave'src='/assets/leaveAssets/relax.jpg' className='logoCL'/>
                <span>12 Days</span>
            </div>
            <div className='unitDivCL'>
            <span>Sick Leave</span>
                <img alt='Sick Leave'src='/assets/leaveAssets/sick.jpeg' className='logoCL'/>
                <span>12 Days</span>
            </div>
            <div className='unitDivCL'>
            <span>Maternity Leave</span>
                <img alt='maternity Leave'src='/assets/leaveAssets/maternity.jpg' className='logoCL'/>
                <span>26 weeeks</span>

            </div>

        </div>
    );
}

export default LeaveHeader;
