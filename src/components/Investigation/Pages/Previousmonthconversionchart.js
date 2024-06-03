import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);
function Previousmonthconversionchart() {
    const [PreviousMonthConvertedData, setPreviousMonthConvertedData] = useState([])
    var datePrev = moment(new Date()).subtract(1, 'month').calendar()
    var PreviousMonth = moment(datePrev).format('MMMM')
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
                    where("month", "==", PreviousMonth));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setPreviousMonthConvertedData);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={PreviousMonthConvertedData} Comment={PreviousMonth+' Conversion'}/>
        </div>
    );
}

export default Previousmonthconversionchart;