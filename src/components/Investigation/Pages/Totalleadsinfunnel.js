import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);
function Totalleadsinfunnel() {
    const [TotalLeadsInFunnel, setTotalLeadsInFunnel] = useState([])
    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', 'in', ['Active', 'Cold', 'Hot','Paymentawaited']),where("quotation_flg", "==", true));
                getConvertedDataForUserProfile(usersProfile, DataQuery, setTotalLeadsInFunnel);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={TotalLeadsInFunnel} Comment={'Leads in funnel'}/>
        </div>
    );
}

export default Totalleadsinfunnel;

