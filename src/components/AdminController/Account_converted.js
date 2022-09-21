import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AccountsMap from '../Accounts/AccountsMap';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
import app from '../required';
const db = getFirestore(app);


const Account_converted = ({ profile }) => {
    // console.log('ACCOUNTS')
    const currentDate = new Date();
    var times = 0
    const [lead_data, set_lead_data] = useState([])
    const [selectedDate, setDate] = useState(moment(currentDate).format('YYYY-MM-DD'))
    // function filterOldLeads(leads) {
    //     const travelinFuture = leads.filter(lead => lead.travelEndDate < currentDate)

    // }
    useEffect(() => {
        var CurrentDate = new Date()
        const q = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Converted"),
            where('Travel_Date', '>', CurrentDate),
            where("quotation_flg", "==", true)
        );
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
        // Beep()
    }, []);
    function Beep() {
        var audio = new Audio('/assets/Notification/Notification.mp3');
        audio.play();
    }

    return (
        <div>
            {
                lead_data.map((data, index) => (
                    <>
                        <AccountsMap key={index} data={data} profile={profile} />
                        {/* <VouchersCompo key={index} data={data}  /> */}
                    </>
                ))
            }
        </div>
    );
}

export default Account_converted;
