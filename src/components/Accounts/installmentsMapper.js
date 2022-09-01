import React, { useState } from 'react';

const InstallmentsMapper = ({ index, handleInstallments, data }) => {
    // console.log(data)
    const[satatus,setstatus]=useState(data.Status)
     function statusHandler(response){
        setstatus(response.target.value)
     }
    return (
        <div className='uni_installments'>
            <div>{data.Date}</div>
            <div> INR:-{data.amount}/-</div>

            <div>
                <input style={{ width: '9rem' }} disabled={data.Status == 'Complete'} placeholder='Tranction ID' />

            </div>
            <div>
                <input style={{ width: '9rem' }} type="number" min="1" max="5" disabled={data.Status == 'Complete'} placeholder='recived Amount' />
            </div>
            <div>
                <select value={satatus} disabled={data.Status == 'Complete'} onChange={(response)=>statusHandler(response)}>
                    <option value="Complete"> complete</option>
                    <option value="Due">Due</option>
                    <option value="Pending">Pending</option>

                </select>
            </div>

        </div>
    );
}

export default InstallmentsMapper;
