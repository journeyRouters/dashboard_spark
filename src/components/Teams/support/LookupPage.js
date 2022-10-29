import React from 'react';
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import moment from 'moment';
const db = getFirestore(app);
const LookupPage = ({ row }) => {
    const [package_length, setpakage] = useState(0)
    const[responseTime,setresponseTime]=useState(0)
    async function Allquote() {
        let list = []
        const q = query(collection(db, "Quote"), where("value.travel_data.TripId", "==", row.TripId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setpakage(list.length)
    }
    async function calculateResponseTime(TripId) {
        var TripData;
        const docRef = doc(db, "Trip", TripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            TripData = docSnap.data()
        } else {
            console.log("document not found!");
        }
        var difference = TripData.dateTimeStampList[0].toDate() - TripData.assigned_date_time.toDate();
        var MinutesDifference = Math.floor(difference/1000/60);
        setresponseTime(MinutesDifference)
    }
    useEffect(() => {
        Allquote()
        calculateResponseTime(row.TripId)
    }, []);
    return (
        <>
            <div style={{ marginTop: '3rem' }}>o---o</div>
            <div style={{ border: '3px solid yellow', fontSize: '1.2rem', height: '8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{borderBottom:'1px solid'}}>Response Time: {responseTime} minutes </span><br />
                <span style={{borderBottom:'1px solid'}}>Total Quotation:- {package_length}</span><br />
                <span style={{borderBottom:'1px solid'}}>assign date :-{moment(row.assigned_date_time.toDate()).format('DD-MMM-YYYY')}</span>
            </div>
        </>
    );
}

export default LookupPage;
