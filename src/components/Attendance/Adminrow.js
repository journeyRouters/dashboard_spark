import { CheckOutlined } from '@material-ui/icons';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import app from '../required';

const Adminrow = ({ data, totalAttendance, fetch_Attendance }) => {
    const db = getFirestore(app);
    const [CheckIn, setCheckIn] = useState(data.CheckIn)
    const [CheckOut, setCheckout] = useState(data.checkOut)
    const [totalHr, setTotalHr] = useState(data.TotalWorkingHours)
    const [status, setStatus] = useState(data.Status)

    function ChangeCheckInTime(e) {
        setCheckIn(e.target.value)
        data.CheckIn = e.target.value
        // calculateHr()
    }
    function checkOutTime(e) {
        setCheckout(e.target.value)
        data.checkOut = e.target.value
        // calculateHr()
    }
    function updateThePermmisionTrue(index) {
        totalAttendance[index].LatePermisson = 'true'
        // console.log(data.userId)
        updateAttendance(totalAttendance, data.userId)
    }

    function updateThePermmisionFalse(index) {
        totalAttendance[index].LatePermisson = 'false'
        // console.log(totalAttendance)
        updateAttendance(totalAttendance, data.userId)
    }

    function updateTheChanges(index) {
        totalAttendance[index].CheckIn = CheckIn
        totalAttendance[index].checkOut = CheckOut
        totalAttendance[index].TotalWorkingHours = totalHr
        totalAttendance[index].Status = status
        updateAttendance(totalAttendance, data.userId)

    }
    function findTheIndex(indicator) {
        var date = moment(data.dateObject.toDate()).format('DD-MM-YYYY')
        var index = totalAttendance.findIndex((value) => value.date == date)
        if (index != -1) {
            if (indicator == 0) { updateThePermmisionTrue(index) }
            if (indicator == 1) { updateThePermmisionFalse(index) }
            if (indicator == 2) { updateTheChanges(index) }
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
    function calculateHr() {
        let Hr = new Date("01/01/2023 " + `${CheckOut}`).getHours() - new Date("01/01/2023 " + `${CheckIn}`).getHours();
        let min = new Date("01/01/2023 " + `${CheckOut}`).getMinutes() - new Date("01/01/2023 " + `${CheckIn}`).getMinutes();
        // console.log(Hr, min);

        if (min < 0) {
            Hr = Hr - 1
            min = 60 + min
        }
        setTotalHr(`${Hr}:${min}`)
        if (Hr >= 8) {
            setStatus('Present')
        }
        else if (Hr >= 5) {
            setStatus('Half Day')
        }
        else if (Hr < 5) {
            setStatus('Absent')

        }
        // console.log(Hr, min);
    }
    useEffect(() => {
        calculateHr()
    }, [ChangeCheckInTime, checkOutTime]);
    return (
        <tr className={data.LatePermisson == 'true' ? 'row2' : 'row'}>
            <td className='r'>{moment(data.dateObject.toDate()).format('DD-MMMM-YYYY')}</td>
            <td className='r'>
                <input value={CheckIn} onChange={(e) => ChangeCheckInTime(e)}></input>
            </td>
            <td className='r'>
                <input value={CheckOut} onChange={(e) => checkOutTime(e)}></input>
            </td>
            <td className='r'>{totalHr} Hr</td>
            <td className='r'>{status}</td>
            <td className='r'>
                <button  style={{marginRight:'1rem'}} onClick={() => findTheIndex(2)}>Update</button>

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
