import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);
function RepeatedClientLeads() {
    const [Leads , setLeads] = useState([])
    const firstDay = moment().startOf('month').toDate();
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
                    where("Campaign_code", "==", "Repeated"),
                    where("assigned_date_time", ">=", firstDay));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setLeads);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={Leads} Comment={`Repeated Client Leads ${moment(firstDay).format('MMMM')}`}/>
        </div>
    );
}

export default RepeatedClientLeads;
