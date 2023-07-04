import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect } from 'react';
import app from '../required';

const Row = ({ data, totalAttendance,fetch_Attendance,user }) => {
    const db = getFirestore(app);
    function DeleteEntry() {
        var date = moment(data.dateObject.toDate()).format('DD-MM-YYYY')
        var index = totalAttendance.findIndex((value) => value.date == date)
        // console.log(index)
        totalAttendance.splice(index, 1);
        updateAttendance(totalAttendance,user)

    }
    async function updateAttendance(data, user) {
        const AttendanceRef = doc(db, "Attendance", user);
        await updateDoc(AttendanceRef, {
            attendance: data
        });
        // console.log(data)
        fetch_Attendance(user)
    }


    return (

        <tr className={data.LatePermisson == 'true' ? 'row2' : 'row'}>
            <td className='r'>{moment(data.dateObject.toDate()).format('DD-MMMM-YYYY')}</td>
            <td className='r'>{data.CheckIn}</td>
            <td className='r'>{data.checkOut}</td>
            <td className='r'>{data.TotalWorkingHours} Hr</td>
            <td className='r'>{data.Status}</td>
            {/* <td>
                <button
                 onClick={() => DeleteEntry()}
                 >Delete</button>
            </td> */}
        </tr>
    );
}

export default Row;
