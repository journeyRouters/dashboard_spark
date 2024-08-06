import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';

const db = getFirestore(app);

function Dumpleads() {
    const [dumpleads, setDumpleads] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    
    const months = moment.months();

    function getAllUserProfiles(selectedMonth) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), selectedMonth, 1);
        const lastDay = new Date(date.getFullYear(), selectedMonth + 1, 0); // last day of the selected month

        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', '==', 'Dump'),
                    where("updated_last", ">=", firstDay),
                    where("updated_last", "<=", lastDay), // Add this line to filter by end of month
                    where("quotation_flg", "==", true));
                
                getConvertedDataForUserProfile(usersProfile, DataQuery, setDumpleads);
            });
        });
    }

    useEffect(() => {
        getAllUserProfiles(selectedMonth);
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="month-selector" style={{ marginRight: '10px' }}>Select Month:</label>
                <select 
                    id="month-selector" 
                    value={selectedMonth} 
                    onChange={handleMonthChange} 
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                    ))}
                </select>
            </div>
            <Verticlechart Data={dumpleads} Comment={'Dump Leads'} />
        </div>
    );
}

export default Dumpleads;
