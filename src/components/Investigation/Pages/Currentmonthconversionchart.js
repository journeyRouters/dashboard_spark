import React, { useEffect, useState } from 'react';
import Verticlechart from '../Components/Verticlechart';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../../required';
import moment from 'moment';
const db = getFirestore(app);
function Currentmonthconversionchart({ }) {
    const [currentMonthConvertedData, setcurrentMonthConvertedData] = useState([])
    const currentMonth = moment(new Date()).format('MMMM')

    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]),
            where("user_type", "==", "show"));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', '==', 'Converted'),
                    where("quotation_flg", "==", true),
                    where("month", "==", currentMonth));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setcurrentMonthConvertedData);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={currentMonthConvertedData} />
        </div>
    );
}

export default Currentmonthconversionchart;