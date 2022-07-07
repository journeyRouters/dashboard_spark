import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
import app from '../required';
const db = getFirestore(app);


const Account_converted = () => {
    const currentDate = new Date();
    var times = 0
    const[lead_data,set_lead_data]=useState([])
    const [selectedDate, setDate] = useState(moment(currentDate).format('YYYY-MM-DD'))
    async function getConvertedData() {
        /**this function will fetch the data
         * which have travel date is next to current date
         */
        const q = query(collection(db, "Trip"), where("Lead_Status", "==", "Converted"), where("Lead_status_change_date", "==", selectedDate));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const converted = [];
            console.log(times)
            times = times + 1
            querySnapshot.forEach((doc) => {
                converted.push(doc.data());
            });
            console.log(converted)
            set_lead_data(converted)
        });
        return unsubscribe
    }
    useEffect(() => {
        getConvertedData()
    }, []);
    return (
        <div>
         {
              lead_data.map((data, index) => (
                <>
                    <VouchersCompo key={index} data={data} datahandle={getConvertedData} />
                </>
            ))
         }
        </div>
    );
}

export default Account_converted;
