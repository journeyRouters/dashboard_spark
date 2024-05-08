import React, { useState, useEffect } from 'react';
import { doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import app from '../../required';

const db = getFirestore(app);

function StreamData() {
    const [lastCount, setLastCount] = useState(0);
    const [valueToUpdate, setValueToUpdate] = useState('');

    useEffect(() => {
        const documentRef = doc(db, "Support", "tripCount");
        const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setLastCount(docSnapshot.data().tripCount);
            } else {
                console.log("Document does not exist.");
            }
        });

        // Cleanup the listener on component unmount
        return unsubscribe;
    }, []);

    function handleInputChange(value) {
        setValueToUpdate(value);
    }

    async function updateLastTransaction() {
        if (!valueToUpdate) { // Checks for empty string or any falsy value
            alert('Please enter a value to update');
            return;
        }

        const documentRef = doc(db, "Support", "tripCount");
        const dataToUpdate = {
            tripCount: parseInt(valueToUpdate),
        };

        try {
            await updateDoc(documentRef, dataToUpdate);
            alert("Trip count updated successfully!");
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Failed to update trip count.");
        }
    }

    return (
        <div style={{ marginBottom: "5rem" }}>
            <h3>Last Transaction: {lastCount}</h3>
            <span>Check out your last Correct TripId, remove the last 4 digits and do +1 to the remaining, then input in the field.</span><br />
            <input type='number' onChange={(e) => handleInputChange(e.target.value)}></input>
            <button onClick={updateLastTransaction}>Update Trip Counter</button>
        </div>
    );
}

export default StreamData;
