import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import './PendingPayments.css';
const db = getFirestore(app);

const OprationConverted = ({ }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    const [input, setInput] = useState()

    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        var CurrentDate = new Date()
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                // where("assign_to.uid", "==", props.auth.uid),
                where('Lead_Status', '==', 'Converted'),
                where('Travel_Date', '>', CurrentDate),
                where("quotation_flg", "==", true));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                // console.log(list);
                setopen(false)
            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }
    async function fetchTheSearch() {
        var q;
        q = query(collection(db, "Trip"),
            where("TripId", "==", input))

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
    function reset() {
        setInput('')
        getLeadOnBoard()

    }
    const handleNavigation = (data) => {
        // console.log(data)
        const encodedData = encodeURIComponent(JSON.stringify(data));
        const url = `/OperationFileManager?TripId=${encodedData}`;
        window.open(url, '_blank');
    };
    useEffect(() => {
        getLeadOnBoard()
    }, []);
    return (
        <div>
            <div className='global_search_adminpage'>
                <button onClick={() => reset()}>Refresh</button>
                <label>Trip Id</label>
                <input placeholder='search your selection' onChange={(e) => setInput(e.target.value)}
                ></input>
                <input
                    className='global_search_button'
                    type="button"
                    value="Search "
                    onClick={() => fetchTheSearch()}
                ></input>
            </div>
            {
                <table className="lead-data-table">
                    <thead>
                        <tr>
                            <th>Trip ID</th>
                            <th>Traveller Name</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Destination</th>
                            <th>Travel Date</th>
                            <th>sales Person</th>
                            <th>Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lead_data.map((data, index) => (
                            <tr key={index} onClick={()=>handleNavigation(data.TripId)}>
                                <td>{data.TripId}</td>
                                <td>{data.Traveller_name}</td>
                                <td>{data.Contact_Number}</td>
                                <td>{data.Email}</td>
                                <td>{data.Destination}</td>
                                <td>{data.Travel_Date?.toDate().toLocaleDateString() || "N/A"}</td>
                                <td>{data.assign_to.name}</td>
                                <td>{data.updated_last?.toDate().toLocaleDateString() || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }

        </div>
    );
}

export default OprationConverted;
