import { fromEvent } from "file-selector";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import readXlsxFile from 'read-excel-file';
import app from "../required";
const UploadAttendance = () => {
    const db = getFirestore(app);
    async function UploadFile() {
        var today = new Date()
        today.setDate(today.getDate() - 1);
        var key = moment(today).format('DD-MM-YYYY')
        //   console.log(auth)
        const handles = await window.showOpenFilePicker({ multiple: false });
        const files = await fromEvent(handles);
        const path = files[0].path
        readXlsxFile(files[0]).then((rows) => {
            console.log(rows)
            for (let i = 1; i <= rows.length - 1; i++) {
                let Row = rows[i]
                console.log(Row)
                setDoc(doc(db, "Attendance", Row[1]), {
                    [key]: {
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
                }, { merge: true });
            }

        })

    }
    return (
        <div>
            <button onClick={() => UploadFile()}>upload</button>

        </div>
    );
}

export default UploadAttendance;
