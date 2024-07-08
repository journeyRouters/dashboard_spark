import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);
function Dumpleads() {
    const [Dumpleads, setDumpleads] = useState([])
    var datePrev = moment(new Date()).subtract(1, 'month').calendar()
    var PreviousMonth = moment(datePrev).format('MMMM')
    function getAllUserProfiles() {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', '==', 'Dump'),
                    where("updated_last", ">=", firstDay),
                    where("quotation_flg", "==", true));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setDumpleads);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={Dumpleads} Comment={'Dump Leads'} />
        </div>
    );
}

export default Dumpleads;

