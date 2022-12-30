import moment from 'moment';
import React, { useEffect } from 'react';

const Row = ({ data, totalAttendance }) => {
   

    return (

        <tr className={data.LatePermisson == 'true' ? 'row2' : 'row'}>
            <td className='r'>{moment(data.dateObject.toDate()).format('DD-MMMM-YYYY')}</td>
            <td className='r'>{data.CheckIn}</td>
            <td className='r'>{data.checkOut}</td>
            <td className='r'>{data.TotalWorkingHours} Hr</td>
            <td className='r'>{data.Status}</td>
        </tr>
    );
}

export default Row;
