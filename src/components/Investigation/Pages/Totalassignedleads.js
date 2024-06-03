
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
import moment from 'moment';
const db = getFirestore(app);
function Totalassignedleads() {
    // const threeDaysAgo = moment().subtract(3, 'days').startOf('day').toDate();
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    const [TotalassignedleadsCurrentMonth, setTotalassignedleadsCurrentMonth] = useState([])
    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('assigned_date_time', '>', firstDayOfMonth));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setTotalassignedleadsCurrentMonth);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={TotalassignedleadsCurrentMonth} Comment={'Current Month lead Assigned'} />
        </div>
    );
}

export default Totalassignedleads;

