import React from 'react';
import './Chartbar.css'
function Chartbar({ Data }) {
    // console.log(Data)
    const width = Data.Number*6+'%'
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    if(Data.Number==0) randomColor='red'
    return (
        <div className='Chart_Bar_Parent'>
            <label className='Chart_Bar_Name' style={{  color: Data.Number==0?`red`:''}}>{Data.Name}</label>
            <div className='bar_and_Number'>
                <div style={{ width: `${width}`, height: '1.2rem', background: randomColor,borderRadius:'0 rem' }}></div>
                <span style={{  color: randomColor,marginLeft:'1rem' }}>{Data.Number}</span>
            </div>
        </div>
    );
}

export default Chartbar;