import React from 'react';
import Chartbar from './Chartbar';
import './Chartbar.css'
function Verticlechart({ Data,Comment }) {
    const SortedData = Data.sort((a, b) => b.Number - a.Number)
    return (
        <div className='verticale_chart_size'>
            <h3>{Comment} {Data.reduce((sum, item) => sum + item.Number, 0)}</h3>
            {
                SortedData.map((Data, index) =>
                    <Chartbar Data={Data} key={index} />
                )
            }

        </div>
    );
}

export default Verticlechart;