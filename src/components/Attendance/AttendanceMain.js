import React from 'react';
import readXlsxFile from 'read-excel-file';
import { fromEvent } from "file-selector";
import moment from 'moment';
import app from '../required';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import './Attendance.css'

const AttendanceMain = ({ profile }) => {
    const db = getFirestore(app);
    const [Attendance, setData] = useState()


    async function fetch_Attendance(userId) {
        try {
            const docRef = doc(db, "Attendance", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data())
                console.log("Document data:", docSnap.data(), typeof (docSnap.data()));
            }
        }
        catch (error) {
            console.log({ error })
        }


    }
    useEffect(() => {
        fetch_Attendance(profile.AttendanceId)
    }, []);
    return (
        <div>
            {
                Attendance ? <>
                    <div style={{ display: 'flex' }}>
                        <div className='DateCol'>
                            <span style={{ fontSize: '1.3rem' }}>Date</span>
                            {
                                Object.keys(Attendance)
                                    .map((Key, index) => (
                                        <span style={{ borderTop: '1px solid' }} key={index}>{Key}</span>

                                    ))
                            }
                        </div>
                        <div className='DateCol'>
                            <span style={{ fontSize: '1.3rem' }}>Check In</span>
                            {
                                Object.keys(Attendance)
                                    .map((Key, index) => (
                                        <span style={{ borderTop: '1px solid' }} key={index}>{Attendance[Key].CheckIn}</span>

                                    ))
                            }
                        </div>
                        <div className='DateCol'>
                            <span style={{ fontSize: '1.3rem' }}>check Out</span>
                            {
                                Object.keys(Attendance)
                                    .map((Key, index) => (
                                        <span style={{ borderTop: '1px solid' }} key={index}>{Attendance[Key].checkOut}</span>

                                    ))
                            }
                        </div>
                        <div className='DateCol'>
                            <span style={{ fontSize: '1.3rem' }}>Total Hr.</span>
                            {
                                Object.keys(Attendance)
                                    .map((Key, index) => (
                                        <span style={{ borderTop: '1px solid' }} key={index}>{Attendance[Key].TotalWorkingHours}</span>

                                    ))
                            }
                        </div>
                        <div className='DateCol'>
                            <span style={{ fontSize: '1.3rem' }}>Status</span>
                            {
                                Object.keys(Attendance)
                                    .map((Key, index) => (
                                        <span style={{ borderTop: '1px solid' }} key={index}>{Attendance[Key].Status}</span>

                                    ))
                            }
                        </div>


                    </div>
                </> : <></>
            }

        </div>
    );
}

export default AttendanceMain;
