import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import './page.css';
const db = getFirestore(app);


const TeameditComponent = ({ data }) => {
    const [percentage, setpercentage] = useState(0)
    useEffect(() => {
        fetch_profile()
    }, []);
    async function fetch_profile() {
        // console.log(args)
        try {
            const docRef = doc(db, "Profile", data.value);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                Converted(docSnap.data())
            }
        }
        catch (error) {
            console.log({ error })
        }


    }
    async function Converted(profile) {
        var currentMonth = moment(new Date()).format('MMMM')

        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", data.value),
                where('Lead_Status', 'in', ['Converted']), where("quotation_flg", "==", true),
                where("month", "==", currentMonth));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            performencePercentage(list.length, profile)

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    function performencePercentage(convertedCount, profile) {
        var month = moment(new Date()).format('MMMM-YYYY')
        var target = profile.Target[`${month}`]
        var percent = (convertedCount / target) * 100;
        setpercentage(parseInt(percent))
    }
    return (
        <div >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '30%', border: '1px solid' }}>
                <li>
                    {data.label} 
                </li>
                <div style={{ width: '30%', display: 'flex', justifyContent: 'space-between' }}>
                    <div className='myBar' style={{ width: percentage }}></div>{percentage}%
                </div>
            </div>
        </div>
    );
}

export default TeameditComponent;
