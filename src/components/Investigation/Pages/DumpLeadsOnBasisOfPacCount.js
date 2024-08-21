import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
import moment from 'moment';

const db = getFirestore(app);

function DumpLeadsOnBasisOfPacCount() {
    const [DumpLeadsOnBasisOfPacCount, setDumpLeadsOnBasisOfPacCount] = useState([]);
    const [selectedPax, setSelectedPax] = useState(2);
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const Pax = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const months = moment.months();

    useEffect(() => {
        const unsubscribe = getAllUserProfiles(selectedPax, selectedMonth);
        
        // Clean up the subscription on unmount or when selectedPax or selectedMonth changes
        return () => {
            unsubscribe && unsubscribe();
        };
    }, [selectedPax, selectedMonth]);

    function getAllUserProfiles(selectedPax, monthIndex) {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), monthIndex, 1);
        const lastDay = new Date(date.getFullYear(), monthIndex + 1, 0); // last day of the selected month

        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', '==', 'Dump'),
                    where("updated_last", ">=", firstDay),
                    where('Pax', '==', selectedPax),
                    where("updated_last", "<=", lastDay),
                    where("quotation_flg", "==", true));
                
                getConvertedDataForUserProfile(usersProfile, DataQuery, setDumpLeadsOnBasisOfPacCount);
            });
        });
    }
   
    const handlePaxChange = (event) => {
        setSelectedPax(parseInt(event.target.value));
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="pax-selector" style={{ marginRight: '10px' }}>Select Pax:</label>
                <select
                    id="pax-selector"
                    value={selectedPax}
                    onChange={handlePaxChange}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {Pax.map((pax, index) => (
                        <option key={index} value={pax}>{pax}</option>
                    ))}
                </select>
            </div>
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
            <Verticlechart Data={DumpLeadsOnBasisOfPacCount} Comment={'Dump Leads on pax count'} />
        </div>
    );
}

export default DumpLeadsOnBasisOfPacCount;
