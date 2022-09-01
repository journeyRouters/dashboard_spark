import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AccountsMap from '../Accounts/AccountsMap';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
import app from '../required';
const db = getFirestore(app);


const Account_converted = () => {
    // console.log('ACCOUNTS')
    const currentDate = new Date();
    var times = 0
    const[lead_data,set_lead_data]=useState([])
    const [selectedDate, setDate] = useState(moment(currentDate).format('YYYY-MM-DD'))
    
    useEffect(() => {
        const q = query(collection(db, "Trip"), where("Lead_Status", "==", "Converted"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const converted = [];
            // console.log(times)
            times = times + 1
            querySnapshot.forEach((doc) => {
                converted.push(doc.data());
            });
            // console.log(converted)
            set_lead_data(converted)
        });
    }, []);
    return (
        <div>
         {
              lead_data.map((data, index) => (
                <>
                <AccountsMap key={index} data={data} />
                    {/* <VouchersCompo key={index} data={data}  /> */}
                </>
            ))
         }
        </div>
    );
}

export default Account_converted;
