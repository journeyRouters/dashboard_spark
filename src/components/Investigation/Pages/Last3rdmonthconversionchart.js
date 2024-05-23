import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);

function Last3rdmonthconversionchart() {
    const [last3rdMonthConvertedData, setlast3rdMonthConvertedData] = useState([])
    var datePrev = moment(new Date()).subtract(2, 'month').calendar()
    var last3rdMonth = moment(datePrev).format('MMMM')
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
                    where("month", "==", last3rdMonth));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setlast3rdMonthConvertedData);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={last3rdMonthConvertedData} />
        </div>
    );
}

export default Last3rdmonthconversionchart;