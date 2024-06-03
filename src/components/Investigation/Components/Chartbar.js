import React, { useState } from 'react';
import './Chartbar.css';
import MyDrawer from './Mydrawer';

function Chartbar({ Data }) {
    const [drawerStatus, setDrawerStatus] = useState(false);

    const toggleDrawer = (status) => {
        setDrawerStatus(status);
    };

    const width = Data.Number * 6 + '%';
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    return (
        <div className='Chart_Bar_Parent' onClick={() => toggleDrawer(!drawerStatus)}>
            <label className='Chart_Bar_Name' >{Data.Name}</label>
            <MyDrawer anchor='right' open={drawerStatus} Data={Data.Data} />
            <div className='bar_and_Number'>
                <div style={{ width: `${width}`, height: '1.2rem', background: randomColor, borderRadius: '0 rem' }}></div>
                <span style={{ color: randomColor, marginLeft: '1rem' }}>{Data.Number}</span>
            </div>
        </div>
    );
}

export default Chartbar;
