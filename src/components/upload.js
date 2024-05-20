import { fromEvent } from "file-selector";
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { getStorage, ref } from "firebase/storage";
import readXlsxFile from 'read-excel-file';
import app from "./required";
const storage = getStorage();
const db = getFirestore(app);


export async function UploadFile() {
    const handles = await window.showOpenFilePicker({ multiple: false });
    const files = await fromEvent(handles);
    // const [inProgress, setInProgress] = React.useState(false)
    const path = files[0].path
    // setInProgress(true)
    readXlsxFile(files[0]).then((rows) => {
        for (let i = 1; i <= rows.length - 1; i++) {
            let Row = rows[i]
            let id=`trp00${i}`
            setDoc(doc(db, "Trip", `trp00${i}`), {
                TripId: "TRP"+Math.random(),
                Lead_Status: Row[0],
                Campaign_code: Row[1],
                Date_of_lead: Row[2],
                Traveller_name: Row[3],
                Extra_Info: Row[4],
                Contact_Number: Row[5],
                Destination: Row[6],
                Comment: Row[7],
                Departure_City: Row[8],
                Travel_Date: Row[9],
                Travel_Duration: Row[10],
                Budget: Row[11],
                Pax: Row[12],
                Child: Row[13],
                Email: Row[14],
                Remark: Row[15],
                Follow_Up_date: Row[16],
                uploaded_by: "nandu",
                

            });
        }
    })
    const mountainsRef = ref(storage, path);
    const storageRef = ref(storage, `nandu/${path}`);
    // const uploadTask = uploadBytesResumable(storageRef, files[0]);
    // uploadTask.on('state_changed',
    //     (snapshot) => {
    //         switch (snapshot.state) {
    //             case 'paused':
    //                 console.log('Upload is paused');
    //                 break;
    //             case 'running':
    //                 console.log('Upload is running');
    //                 break;
    //         }
    //     },
    //     (error) => {
    //         switch (error.code) {
    //             case 'storage/unauthorized':
    //                 break;
    //             case 'storage/canceled':
    //                 break;
    //             case 'storage/unknown':
    //                 break;
    //         }
    //     },
    //     () => {
    //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //             console.log('File available at', downloadURL);
    //         });
    //     }
    // );
    return(
       "done"
    )
}
