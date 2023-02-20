import moment from 'moment';
import React from 'react';

const TableRow = ({ data }) => {
    // console.log((data))
    return (
        <tr className='row'>
            {/* <td className='r'>{moment(data.dateObject.toDate()).format('DD-MMMM-YYYY')}</td> */}
            <td className='r'>{data.TripId}</td>
            <td className='r'>{data.Traveller_name}</td>
            <td className='r'>{data.Destination}</td>
            <td className='r'>{data.Departure_City}</td>
            <td className='r'>{data.Pax}</td>
            <td className='r'>{data.assign_to.name}</td>
            <td className='r'>{data.Contact_Number}</td>
            <td><button>Ready to talk</button></td>
            <td><button>Dump</button></td>
        </tr>
    );
}

export default TableRow;
