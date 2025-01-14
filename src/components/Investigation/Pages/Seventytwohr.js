import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { get72hrNon_respondedLeads } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';
const db = getFirestore(app);
function Seventytwohr() {
    const [SeventyTwohr, setSeventyTwohr] = useState([])
    const threeDaysAgo = moment().subtract(3, 'days').toDate();
    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', 'not-in', ['Dump', 'Converted','Cancel']),
                    where("quotation_flg", "==", true));
                    get72hrNon_respondedLeads(usersProfile, DataQuery, setSeventyTwohr);
            });
        });
    }
    useEffect(() => {
        getAllUserProfiles()
    }, [])
    return (
        <div>
            <Verticlechart Data={SeventyTwohr} Comment={'48 hr Waiting'} />
        </div>
    );
}

export default Seventytwohr;

