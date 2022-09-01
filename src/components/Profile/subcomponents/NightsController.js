import React, { useEffect, useState } from 'react';
import moment from 'moment';

const NightsController = ({nights}) => {
    const[checkIndate,setCheckIndate]=useState(null)
    const[checkOut,setCheckOut]=useState(null)

    // function calculateCheckOutDate(nights) {
    //     var check = moment(checkIndate).add(7, 'days').calendar();
    //     console.log(check)
    //     setCheckOut(check)
    //     localStorage.setItem('Journeydate', check);
    // }
     function test(date,days) {
        let date_= new Date(date);
        date_.setDate(date_.getDate() + days);
        // console.log(moment(date_).format('DD MMMM YYYY'))
        setCheckOut(date_)
        return date_;
    }
    useEffect(() => {
        setCheckIndate(localStorage.getItem('Journeydate'))
        // calculateCheckOutDate(nights)
        // console.log(localStorage.getItem('Journeydate'))
        localStorage.setItem('Journeydate', test(localStorage.getItem('Journeydate'),nights));

        
    }, []);
    return (
        <div >
                <span style={{ color: 'pink' }}>Check In-{moment(checkIndate).format('DD MMMM YYYY')}</span><br />
                <span style={{ color: 'pink' }}>Check Out-{moment(checkOut).format('DD MMMM YYYY')}</span>
        </div>
    );
}

export default NightsController;
