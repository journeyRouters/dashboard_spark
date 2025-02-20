import { collection, getDocs, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import '../Accounts/Accounts.css';
import AccountsMap from '../Accounts/AccountsMap';
import app from '../required';
const db = getFirestore(app);


const Account_converted = ({ }) => {
    const [Destination, setDestination] = useState('')
    const profile = JSON.parse(localStorage.getItem('profile'));
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [SearchKey, setSearchKey] = useState(0)
    const [input, setInput] = useState('')
    var times = 0
    const [lead_data, set_lead_data] = useState([])
    function HandleDestinationSearchControl() {
        const q = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Converted"),
            where('Destination', '==', Destination),
            where("quotation_flg", "==", true),
            orderBy("Travel_Date")
        );
        getQueryDatafromDatbase(q)
    }

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
            times = times + 1
            querySnapshot.forEach((doc) => {
                converted.push(doc.data());
            });
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
            times = times + 1
            querySnapshot.forEach((doc) => {
                converted.push(doc.data());
            });
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
                <input placeholder='search your selection' className={SearchKey == 'Travel_date' ? "date" : null}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <input
                    className='global_search_button'
                    type="button"
                    value="Search "
                    onClick={() => fetchTheSearch()}
                >
                </input>
                <div>
                    <select onChange={(ele) => setDestination(ele.target.value)}>
                        <option value={'Select Destination'}>change Destination</option>
                        <option value={'Dubai'}>Dubai</option>
                        <option value={'Maldives'}>Maldives</option>
                        <option value={'Thailand'}>Thailand</option>
                        <option value={'Singapore'}>Singapore</option>
                        <option value={'Malaysia'}>Malaysia</option>
                        <option value={'Bali'}>Bali</option>
                        <option value={'Himachal'}>Himachal</option>
                        <option value={'Ladakh'}>Ladakh</option>
                        <option value={'Kerala'}>Kerala</option>
                        <option value={'Kashmir'}>Kashmir</option>
                        <option value={'Andaman'}>Andaman</option>
                        <option value={'Goa'}>Goa</option>
                        <option value={'Singapore'}>Singapore</option>
                        <option value={'Rajasthan'}>Rajasthan</option>
                        <option value={'Vietnam'}>Vietnam</option>
                        <option value={'Northeast'}>Northeast</option>
                        <option value={'Europe'}>Europe</option>
                        <option value={'Turkey'}>Turkey</option>
                        <option value={'Mauritius'}>Mauritius</option>
                        <option value={'Baku'}>Baku</option>
                        <option value={'Almaty'}>Almaty</option>
                        <option value={'Srilanka'}>Srilanka</option>
                    </select>
                    <button onClick={() => HandleDestinationSearchControl()}>Search</button>
                </div>
            </div>
            {
                lead_data.map((data, index) => (

                    <AccountsMap key={index} data={data} profile={profile} getUpdatedlead={getlead} />

                ))
            }
        </div>
    );
}

export default Account_converted;
