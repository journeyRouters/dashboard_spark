import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import app from '../required';

const Adminrow = ({ data, totalAttendance, fetch_Attendance }) => {
    const db = getFirestore(app);


    function updateThePermmisionTrue(index) {
        totalAttendance[index].LatePermisson = 'true'
        console.log(data.userId)
        updateAttendance(totalAttendance, data.userId)
    }
    function updateThePermmisionFalse(index) {
        totalAttendance[index].LatePermisson = 'false'
        // console.log(totalAttendance)
        updateAttendance(totalAttendance, data.userId)
    }
    function findTheIndex(indicator) {
        var date = moment(data.dateObject.toDate()).format('DD-MM-YYYY')
        var index = totalAttendance.findIndex((value) => value.date == date)
        if (index != -1) {
            if (indicator == 0) { updateThePermmisionTrue(index) }
            if (indicator == 1) { updateThePermmisionFalse(index) }
        }
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
            <td className='r'>
                {
                    data.LatePermisson == 'true' ?
                        <button onClick={() => findTheIndex(1)}>denied</button>
                        :
                        <button onClick={() => findTheIndex(0)}>Allow</button>

                }
            </td>

        </tr>
    );
}

export default Adminrow;
