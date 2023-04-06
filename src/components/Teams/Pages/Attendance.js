import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Adminrow from '../../Attendance/Adminrow';
import app from '../../required';

const Attendance = ({ profile,uid }) => {
    const db = getFirestore(app);
    const [Attendance, setData] = useState([])
    const [AttendanceFlg, setAttendanceflg] = useState(false)

    async function getProfileOfSelectedUser(){
        var docref= doc(db,'Profile',uid)
        const dataref=await getDoc(docref)
        if(dataref.exists()){
            fetch_Attendance(dataref.data().AttendanceId)
        }
    }

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
        getProfileOfSelectedUser()

    }, []);
    return (
        <div >

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
                                            <Adminrow data={data} key={index} totalAttendance={Attendance} fetch_Attendance={fetch_Attendance} />
                                        </>)
                                    }

                                </tbody>

                            </table>

                        </div>
                    </> : <></>
                }

            </div>
        </div>

    );
}

export default Attendance;
