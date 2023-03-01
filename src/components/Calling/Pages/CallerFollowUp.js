import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import TableRow from './TableRow';

const FollowUp = ({ profile }) => {
    const [lead_data, setLead_data] = useState([])
    const db = getFirestore(app);
    const [open, setopen] = useState(true)
    function updateTableDataAfterConversion(tripid) {
        var pre_tableData = lead_data
        var remaining_data = pre_tableData.filter((data) => data.TripId !== tripid)
        // console.log(remaining_data, pre_tableData)
        setLead_data(remaining_data)
    }
    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('Lead_Status', '==', 'Dump'),
                where('callingStatus', 'in', ['Cold', 'Active', 'Hot'])
            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                setLead_data(list)
                setopen(false)
            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }
    useEffect(() => {
        getLeadOnBoard()
    }, [updateTableDataAfterConversion]);
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <table className='Table'>
                    <thead>
                        <tr className='row'>
                            <th className='r'>TripId</th>
                            <th className='r'>Name</th>
                            <th className='r'>Destination</th>
                            <th className='r'>Departure City</th>
                            <th className='r'>Pax</th>
                            <th className='r'>Follower</th>
                            <th className='r'>Contact_Number</th>
                            <th className='r'>Action</th>
                            <th className='r'>Change Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lead_data.map((data, index) => <>
                                <TableRow data={data} key={index} updateTableDataAfterConversion={updateTableDataAfterConversion} />
                            </>)
                        }

                    </tbody>

                </table>

            </div>
        </div>
    );
}

export default FollowUp;
