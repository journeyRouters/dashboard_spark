import React, { useState } from 'react';
import { doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import app from '../../required';
import { useEffect } from 'react';
const db = getFirestore(app);
function StreamData() {
    const [lastCount, setlastCount] = useState(0)
    const [valueToUpdate, setvalueToUpdate] = useState(null)
    function StreamingCount() {
        const documentRef = doc(db, "Support", "tripCount");
        const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                // Handle the document data
                // console.log("Document data:", docSnapshot.data().tripCount);
                setlastCount(docSnapshot.data().tripCount)
            } else {
                console.log("Document does not exist.");
            }
        });

    }
    function Inputcontroller(value) {
        setvalueToUpdate(value)
    }
    async function updated_last_Transaction() {
        if (valueToUpdate == null) {
            alert('Nothing to update')
            return
        }
        else {
            const documentRef = doc(db, "Support", "tripCount");
            const dataToUpdate = {
                tripCount: valueToUpdate,
            };
            try {
                await updateDoc(documentRef, dataToUpdate);
                alert(" field updated successfully!");
            } catch (error) {
                console.error("Error updating document field: ", error);
            }
        }
    }
    useEffect(() => {
        StreamingCount()
    }, [])
    return (
        <div 
        style={{
            marginBottom:"5rem",
        }}
        >
            <h3>last Transaction {lastCount}</h3>
            <sapn>Check out your last Correct TripId remove last 4 digit and do +1 to remaing and input in the field</sapn><br />
            <input type='number' onChange={(e) => Inputcontroller(e.target.value)}></input>
            <button onClick={() => updated_last_Transaction()}>Update Trip Counter</button>
        </div>
    );
}

export default StreamData;