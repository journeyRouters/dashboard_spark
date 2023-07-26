import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Row from '../../quotation_follow_up/Row';
import app from '../../required';
import LookupPage from '../support/LookupPage';
import './page.css'
const db = getFirestore(app);


const FollowUp = ({ uid, profile, auth, setcount }) => {
    const [lead_data, setLead_data] = useState([])
    const [assigned_date_time, setAssign_date_time] = useState('')
    const [open, setopen] = useState(true)

  
    async function getLeadOnBoard() {
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true)
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
                setLead_data(list)
                setcount(list.length)
                // console.log(list)
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
    }, []);
    
    return (
        <div>
            <div className='theBar'>
                <span>Trip Id</span>
                <div className='theBar_'>
                    <span>Name</span>
                    <span>Lead Status</span>
                    <span>Destination</span>
                    <span>Departure city</span>
                </div>
            </div>
            <div style={{overflowY:'scroll',height:'44rem'}}>
                {lead_data &&
                    (lead_data.slice(0).reverse()).map((row, index) => (
                        <div className='setAliners' key={index}>
                            <div style={{ border: '1px solid blue' }}>
                                <div style={{ border: '1px solid', background: 'red', width: '1rem' }}>{index + 1}</div>
                                <Row
                                    auth={auth}
                                    profile={profile}
                                    key={index}
                                    row={row}
                                    getLeadOnBoard={getLeadOnBoard}
                                    setAssign_date_time={setAssign_date_time}
                                // updateTableDataAfterConversion={updateTableDataAfterConversion}
                                // datahandle={datahandle}
                                />
                            </div>
                            <LookupPage row={row} />
                        </div>
                    ))}
            </div>

        </div>
    );
}

export default FollowUp;
