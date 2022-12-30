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


    async function fetch_Attendance(userId) {
        try {
            const docRef = doc(db, "Attendance", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data().attendance);
                sortAttendanceByDate(docSnap.data().attendance)
                // setData(docSnap.data().attendance)
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
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Attendance.map((data, index) => <>
                                        <Row data={data} key={index} totalAttendance={Attendance} />
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
