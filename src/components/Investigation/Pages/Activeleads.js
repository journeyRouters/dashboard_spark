import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);
function Activeleads() {
    const [ActiveLeads, setActiveLeads] = useState([])
    var datePrev = moment(new Date()).subtract(1, 'month').calendar()
    var PreviousMonth = moment(datePrev).format('MMMM')
    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', '==', 'Active'), 
                    where("quotation_flg", "==", true));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setActiveLeads);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={ActiveLeads} Comment={'Active Leads'}/>
        </div>
    );
}

export default Activeleads;

