import { collection, getDocs, getFirestore, onSnapshot, orderBy, query, startAt, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AccountsMap from '../Accounts/AccountsMap';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
import app from '../required';
import '../Accounts/Accounts.css'
const db = getFirestore(app);


const Account_converted = ({ profile }) => {
    const [SearchKey, setSearchKey] = useState(0)
    const [input, setInput] = useState('')

    // console.log('ACCOUNTS')
    const currentDate = new Date();
    var times = 0
    const [lead_data, set_lead_data] = useState([])
    const [selectedDate, setDate] = useState(moment(currentDate).format('YYYY-MM-DD'))
    // function filterOldLeads(leads) {
    //     const travelinFuture = leads.filter(lead => lead.travelEndDate < currentDate)

    // }
    async function fetchTheSearch() {
        var q;
        switch (SearchKey) {
            case "Name": {
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where('Traveller_name', '>=', input),
                    where("Traveller_name", '<=', input + '\uf8ff'),
                )
                break;
            }
            case "Trip_id": {
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where("TripId", "==", input),
                    orderBy("Travel_Date")
                )
                break;
            }
            case "Contact_Number": {
                // console.log(typeof (input), parseInt(input), typeof (parseInt(input)))
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where("Contact_Number", "==", parseInt(input)),
                    orderBy("Travel_Date")
                )
                break;
            }
            case "Travel_date": {
                var before = new Date(input);
                before.setDate(before.getDate() - 1);
                // console.log(before)
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where("Travel_Date", ">", before),
                    where("Travel_Date", "<=", new Date(input)),
                    orderBy("Travel_Date")
                )
                break;
            }
            default:
                q = null;

        }
        getQueryDatafromDatbase(q)


    }
    async function getQueryDatafromDatbase(q) {
        try {
            var querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length != 0) {
                let list = []
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                set_lead_data(list)
                setInput('')
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    function getlead() {
        var CurrentDate = new Date()
        const q = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Converted"),
            where('Travel_Date', '>', CurrentDate),
            where("quotation_flg", "==", true),
            orderBy("Travel_Date")
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
            // Beep()
        });
    }
    useEffect(() => {
        var CurrentDate = new Date()
        const q = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Converted"),
            where('Travel_Date', '>', CurrentDate),
            where("quotation_flg", "==", true),
            orderBy("Travel_Date")
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
            // Beep()
        });
    }, []);
    function Beep() {
        var audio = new Audio('/assets/Notification/Notification.mp3');
        audio.play();
    }

    return (
        <div >
            <div className='global_search'>
                <button onClick={() => getlead()}>Refresh</button>
                <select name='search_type' id='firestore' className='option_selector' onChange={(e) => setSearchKey(e.target.value)}>
                    <option value={0}>select</option>
                    <option value="Name">Name</option>
                    <option value="Trip_id">TripId</option>
                    <option value="Contact_Number">Contact Number</option>
                    <option value="Travel_date">Travel Month</option>
                </select>
                <input placeholder='search your selection' className={SearchKey == 'Travel_date'?"date":null}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <input
                    className='global_search_button'
                    type="button"
                    value="Search "
                    onClick={() => fetchTheSearch()}
                ></input>


            </div>
            {
                lead_data.map((data, index) => (
                    <>
                        <AccountsMap key={index} data={data} profile={profile} getUpdatedlead={getlead} />
                        {/* <VouchersCompo key={index} data={data}  /> */}
                    </>
                ))
            }
        </div>
    );
}

export default Account_converted;
