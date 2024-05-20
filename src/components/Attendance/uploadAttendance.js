import { async } from "@firebase/util";
import { fromEvent } from "file-selector";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import readXlsxFile from 'read-excel-file';
import app from "../required";
const UploadAttendance = () => {
    const db = getFirestore(app);
    const[date,setDate]=useState(new Date())
    async function UploadFile() {
        var today = new Date(date)
        // today.setDate(today.getDate() - 1);
        var key = moment(date).format('DD-MM-YYYY')
        const handles = await window.showOpenFilePicker({ multiple: false });
        const files = await fromEvent(handles);
        const path = files[0].path
        readXlsxFile(files[0]).then((rows) => {
            for (let i = 1; i <= rows.length - 1; i++) {
                let Row = rows[i]
                getPrevAttendance(Row[1]).then((data) => {
                    switch (data) {
                        case 0: {
                            setDoc(doc(db, "Attendance", Row[1]), {
                                attendance: [
                                    {
                                        userId: Row[1],
                                        Name: Row[2],
                                        CheckIn: Row[6],
                                        checkOut: Row[7],
                                        TotalWorkingHours: Row[9],
                                        LatePermisson: '',
                                        date: key,
                                        Status: Row[12],
                                        dateObject: today
                                    }
                                ]
                            });
                            break;
                        }
                        default: {
                            var todayAttendance =
                            {
                                userId: Row[1],
                                Name: Row[2],
                                CheckIn: Row[6],
                                checkOut: Row[7],
                                TotalWorkingHours: Row[9],
                                LatePermisson: '',
                                date: key,
                                Status: Row[12],
                                dateObject: today
                            }
                            data.attendance.push(todayAttendance)
                            updateAttendance(data,Row[1])

                        }
                    }
                })
            }

        })

    }
     function HandaleDate(e){
        setDate(e.target.value)
     }
    async function updateAttendance(data, user){
        const AttendanceRef = doc(db, "Attendance", user);
        await updateDoc(AttendanceRef, {
            attendance: data.attendance

        });
    }
    async function getPrevAttendance(user) {
        const docrefToget = doc(db, "Attendance", user)
        const dataFromDB = await getDoc(docrefToget)
        if (dataFromDB.exists()) {
            return dataFromDB.data()
        }
        return 0
    }
    return (
        <div>
            <input type={'date'} value={date} onChange={(e)=>HandaleDate(e)}></input>
            <button onClick={() => UploadFile()}>upload</button>
            

        </div>
    );
}

export default UploadAttendance;
