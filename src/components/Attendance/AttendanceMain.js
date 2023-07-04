import React from 'react';
import readXlsxFile from 'read-excel-file';
import { fromEvent } from "file-selector";
import moment from 'moment';
import app from '../required';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import './Attendance.css'
import Row from './Row';
import Adminrow from './Adminrow';

const AttendanceMain = ({ profile }) => {
    const db = getFirestore(app);
    const [Attendance, setData] = useState([])
    const [AttendanceFlg, setAttendanceflg] = useState(false)
    const [selectedDate, setselectedDate] = useState(null)
    const [AttendanceReport, setAttendanceReport] = useState(null)

    function updateAttendanceTableData() {
        if (selectedDate != null) {
            var key = new Date(selectedDate)
            var new_tableData = Attendance.filter((data) => data.dateObject.toDate() >= key)
            // console.log(new_tableData)
            contAbsent(new_tableData)
            sortAttendanceByDate(new_tableData)
        }
        else {
            alert('Please Select a Date')
        }

    }
    function contAbsent(data) {
        var obj = {
            Absent: null,
            HalfPresent: null,
            Present: null,
            Allowed: null,
            HalfPresentDueTo: null
        }
        var new_tableData = data.filter((data) => data.Status == 'Absent')
        obj.Absent = new_tableData.length
        CountPresent(data, obj)
    }
    function CountPresent(data, obj) {
        var new_tableData = data.filter((data) => data.Status == 'Present')
        obj.Present = new_tableData.length
        CountHalfPresent(data, obj)
    }
    function CountHalfPresent(data, obj) {
        var new_tableData = data.filter((data) => data.Status == '½Present')
        obj.HalfPresent = new_tableData.length
        CountHalfPresentDueToContinousLate(data, obj)
    }
    function CountHalfPresentDueToContinousLate(data, obj) {
        var new_tableData = data.filter((data) => data.Status == '½Present(Due to Continous Late)')
        obj.HalfPresentDueTo = new_tableData.length
        CountAllowed(data, obj)
    }
    function CountAllowed(data, obj) {
        var new_tableData = data.filter((data) => data.LatePermisson == 'true')
        obj.Allowed = new_tableData.length
        setAttendanceReport(obj)
    }


    async function fetch_Attendance(userId) {
        try {
            const docRef = doc(db, "Attendance", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data().attendance);
                sortAttendanceByDate(docSnap.data().attendance)
                // console.log(docSnap.data().attendance)
                contAbsent(docSnap.data().attendance)
                setAttendanceflg(true)
            }
        }
        catch (error) {
            console.log({ error })
        }


    }
    function sortAttendanceByDate(Attendance) {
        let sortedAttendance = Attendance.sort(
            (p1, p2) => (p1.dateObject < p2.dateObject) ? 1 : (p1.dateObject > p2.dateObject) ? -1 : 0);
        // console.log(sortedAttendance)
        setData(sortedAttendance)

    }

    useEffect(() => {
        fetch_Attendance(profile.AttendanceId)
        // console.log(typeof(Attendance))

    }, []);
    return (
        <div>
            <div className='filterBarAttendance'>
                <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-between' }}>
                    <input type={'date'} placeholder='select a date' onChange={(e) => setselectedDate(e.target.value)}></input>
                    <button onClick={() => updateAttendanceTableData()}>Find</button>
                    <button onClick={() => fetch_Attendance(profile.AttendanceId)}>Reset</button>
                </div>
                <div>
                    {
                        AttendanceReport != null ? <div>
                            <h3>Present:- {AttendanceReport.Present}</h3>
                            <h3>Absent:- {AttendanceReport.Absent}</h3>
                            <h3>½Present:- {AttendanceReport.HalfPresent + AttendanceReport.HalfPresentDueTo}</h3>
                            <h3>Allowed:- {AttendanceReport.Allowed}</h3>

                        </div> : <></>
                    }
                </div>
            </div>
            {
                AttendanceFlg ? <>
                    <div style={{ display: 'flex' }}>
                        <table className='Table'>
                            <thead>
                                <tr className='row'>
                                    <th className='r'>Date</th>
                                    <th className='r'>Check In</th>
                                    <th className='r'>Check Out</th>
                                    <th className='r'>total Hr.</th>
                                    <th className='r'>Status</th>
                                    {/* <th className='r' >Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Attendance.map((data, index) => <>
                                        <Row
                                            user={profile.AttendanceId}
                                            data={data}
                                            key={index}
                                            totalAttendance={Attendance}
                                            fetch_Attendance={fetch_Attendance} />
                                    </>)
                                }

                            </tbody>

                        </table>

                    </div>
                </> : <></>
            }

        </div>
    );
}

export default AttendanceMain;
