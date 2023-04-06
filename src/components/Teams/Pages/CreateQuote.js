import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import Createleadcomponent from '../support/Createleadcomponent';
const db = getFirestore(app);

const CreateQuote = ({ uid, TeamProfile }) => {
    const [SearchKey, setSearchKey] = useState(0)
    const [lead_data, setLead_data] = useState([])
    const [input, setInput] = useState('')
    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid), where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
            }
        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    useEffect(() => {
        getLeadOnBoard()

    }, []);
    function reset() {
        setLead_data([])

    }
    async function fetchTheSearch() {
        var q;
        switch (SearchKey) {
            case "Name": {
                q = query(collection(db, "Trip"),
                    where('Traveller_name', '>=', input),
                    where("Traveller_name", '<=', input + '\uf8ff'),
                )
                break;
            }
            case "Trip_id": {
                q = query(collection(db, "Trip"),
                    where("TripId", "==", input),
                    orderBy("Travel_Date")
                )
                break;
            }
            case "Contact_Number": {
                q = query(collection(db, "Trip"),
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
                setLead_data(list)
                setInput('')

            }
        }
        catch (e) {
            console.log(e)
        }
    }
    return (

        <div style={{ overflowY: 'scroll', height: '44rem', }}>
            <div className='global_searchin'>
                <button onClick={() => reset()}>Refresh</button>
                <select name='search_type' id='firestore' className='option_selector' onChange={(e) => setSearchKey(e.target.value)}>
                    <option value={0}>select</option>
                    <option value="Name">Name</option>
                    <option value="Trip_id">TripId</option>
                    <option value="Contact_Number">Contact Number</option>
                    <option value="Travel_date">Travel Month</option>
                </select>
                <input placeholder='search your selection' type={SearchKey == 'Travel_date' ? "date" : String}
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
                lead_data ? <>
                    {
                        lead_data.map((data, index) => (

                            <Createleadcomponent key={index} data={data} getLeadOnBoard={getLeadOnBoard} TeamProfile={TeamProfile} index={index} />

                        ))
                    }
                </> : <>Na</>
            }
        </div>

    );
}

export default CreateQuote;
