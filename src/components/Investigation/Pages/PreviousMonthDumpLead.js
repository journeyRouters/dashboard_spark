import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';

const db = getFirestore(app);

function PreviousMonthDumpLead() {
    const [DumpLeads, setDumpLeads] = useState([]);

    // Get the start and end of the previous month
    const startOfPrevMonth = moment().subtract(1, 'month').startOf('month').toDate();
    const endOfPrevMonth = moment().subtract(1, 'month').endOf('month').toDate();
    const prevMonthName = moment().subtract(1, 'month').format('MMMM');

    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', '==', 'Dump'),  
                    where("quotation_flg", "==", true),
                    where("assigned_date_time", ">=", startOfPrevMonth),
                    where("assigned_date_time", "<=", endOfPrevMonth));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setDumpLeads);
            });
        });
    }

    useEffect(() => {
        getAllUserProfiles();
    }, []);

    return (
        <div>
            <Verticlechart Data={DumpLeads} Comment={`${prevMonthName} Dump Leads`} />
        </div>
    );
}

export default PreviousMonthDumpLead;
