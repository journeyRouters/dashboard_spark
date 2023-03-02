import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../required';
import './Driver.css';
import DriverComponents from './DriverComponents';
const db = getFirestore(app);

const LeadFromCallers = () => {
    const [lead_data, setLead_data] = useState([])
    var today = new Date()
    var currentdate = moment(today).format('YYYY-MM-DD')
    const [selectedDate, setSeletctedDate] = useState(currentdate)
    const [profile, setprofile] = useState([])

    async function getLeadByDate() {
        let list = []
        // console.log(selectedDate)
        var q = query(collection(db, "Trip"), 
        where('callingStatusChangeDate', '==', selectedDate),
        where('callingStatus','==','Converted')
        );
        // console.log(date)
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
                console.log(doc.data())
            });
            try {
                // console.log(list)
                setLead_data(list)
            }
            catch (e) { console.log(e) }
            // console.log(list);
        }
        catch (error) {
            console.log(error.message)
        }

    }
    useEffect(() => {
        const q = query(collection(db, "Profile"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
            });
            setprofile(Profile)
            // console.log(Profile,);
        });
        return () => unsubscribe()

    }, []);

    useEffect(() => {
        getLeadByDate(currentdate)
    }, []);
    return (
        <div>
            <div className='Driver_header'>
                <div>
                    <input onChange={(e) => setSeletctedDate(e.target.value)} type='date' value={selectedDate}></input>
                    <button onClick={() => getLeadByDate(selectedDate)}>Search</button>
                </div>
                <span style={{ background: 'yellow' }}>Total uploaded leads= {lead_data.length}</span>
            </div>
            <div style={{ background: 'cyan' }}>
                {lead_data.map((data, index) => (
                    <DriverComponents key={index} profile={profile} data={data} index={index} getLeadByDate={getLeadByDate} selectedDate={selectedDate} />
                ))}
            </div>
        </div>
    );
}

export default LeadFromCallers;
