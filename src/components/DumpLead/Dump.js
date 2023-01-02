import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import FollowUp from '../quotation_follow_up/Follow_up';
import app from '../required';
import './Dump.css'

const Dump = ({ auth, profile_ }) => {
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState()


    async function getLeadOnBoard() {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // console.log(props.target.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where('Lead_Status', '==', 'Dump',),
                where("quotation_flg", "==", true),
                where("updated_last", ">", firstDay),
                orderBy("updated_last")
            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {

            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                console.log(list)

            }
        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    useEffect(() => {
        getLeadOnBoard()
    }, []);
    return (
        <div>
            <div className='DumpHeader'>
                <div>
                    <label>From</label><br />
                    <input type={'date'}></input>
                </div>
                <div>
                    <label>To</label><br />
                    <input type={'date'}></input>
                </div>
                <button>Last 10 Days</button>
                <button>last 15 Days</button>
            </div>
            {
                lead_data ?
                    <FollowUp auth={auth} profile={profile_} data={lead_data} adminFlg={true} /> :
                    <></>
            }

        </div>
    );
}

export default Dump;
