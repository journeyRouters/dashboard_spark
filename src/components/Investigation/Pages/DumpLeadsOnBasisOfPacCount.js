import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile, getDumpLeadsAccordingTopax } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
import moment from 'moment';

const db = getFirestore(app);

function DumpLeadsOnBasisOfPacCount() {
    const [DumpLeadsOnBasisOfPacCount, setDumpLeadsOnBasisOfPacCount] = useState([]);
    const [selectedPax, setSelectedPax] = useState(8);
    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const Pax = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const months = moment.months();
    useEffect(() => {
        const unsubscribe = getAllUserProfiles(selectedMonth, selectedPax);

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [selectedPax, selectedMonth]);

    function getAllUserProfiles(selectedMonth, selectedPax) {
        // Create date range for the selected month
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), selectedMonth, 1);
        const lastDay = new Date(date.getFullYear(), selectedMonth + 1, 0); // last day of the selected month
        // console.log(firstDay)
        // Query to get profiles with specified access types
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));

        // Listen to the query snapshot
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();

                // Query to get Trip data based on selected month, pax count, and other conditions
                const DataQuery = query(collection(db, "Trip"),
                    where("updated_last", ">=", firstDay),
                    where("updated_last", "<=", lastDay),
                    where('Lead_Status', '==', 'Dump'),
                    where("quotation_flg", "==", true),
                    where("assign_to.uid", "==", usersProfile.uid)
                );

                // Process the data and update the state
                getDumpLeadsAccordingTopax(usersProfile, DataQuery, setDumpLeadsOnBasisOfPacCount, selectedPax);
            });
        });
    }


    const handlePaxChange = (event) => {
        setSelectedPax(parseInt(event.target.value));
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value));
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
