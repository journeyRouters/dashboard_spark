import React, { useEffect, useState } from 'react';
import moment from 'moment';

const NightsController = ({ nights, checkIn, controlsetCheckIn }) => {
    const [checkIndate, setCheckIndate] = useState(checkIn)
    const [checkOut, setCheckOut] = useState(null)
    // console.log(checkIn)
    function test(date, days) {
        let date_ = new Date(date);
        date_.setDate(date_.getDate() + days);
        controlsetCheckIn(moment(date_).format('YYYY-MM-DD'))
        // setCheckIndate(moment(date_).format('YYYY-MM-DD'))
        setCheckOut(date_)
        // console.log()
        return date_;
    }
    useEffect(() => {
        // test(checkIn, nights)
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
