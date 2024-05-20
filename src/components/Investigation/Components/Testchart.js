import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { React, useEffect, useState } from 'react';
import Verticlechart from './Verticlechart';
import app from '../../required';
import moment from 'moment';
const db = getFirestore(app);

function Testchart() {
    const [currentMonthConvertedData, setcurrentMonthConvertedData] = useState([])
    const currentMonth = moment(new Date()).format('MMMM')
    
    function getAllUserProfiles() {
        const q = query(collection(db, "Profile"), 
                        where("access_type", "in", ["User", "Team Leader", "freelance"]),
                        where("user_type", "==", "show"));
    
        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const userProfile = doc.data();
                getConvertedDataForUserProfile(userProfile);
            });
        });
    }
    
    function getConvertedDataForUserProfile(userProfile) {
        const q = query(collection(db, "Trip"),
                        where("assign_to.uid", "==", userProfile.uid),
                        where('Lead_Status', '==', 'Converted'),
                        where("quotation_flg", "==", true),
                        where("month", "==", currentMonth));
    
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
            const templateDataset = { Name: userProfile.name, Data: list, Number: list.length };
            // console.log(templateDataset)
            setcurrentMonthConvertedData((prevData) => [...prevData, templateDataset]);
        });
        return unsubscribe;
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

export default Testchart;