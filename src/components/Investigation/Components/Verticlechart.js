import React from 'react';
import Chartbar from './Chartbar';
import './Chartbar.css'
function Verticlechart({ Data}) {
    const SortedData = Data.sort((a,b)=>b.Number-a.Number)
    console.log(SortedData)
    return (
        <div className='verticale_chart_size'>
            {
                SortedData.map((Data,index) =>
                    <Chartbar Data={Data} key={index}/>
                )
            }

        </div>
    );
}

export default Verticlechart;