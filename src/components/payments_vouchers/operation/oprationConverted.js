import React from 'react';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import VouchersCompo from '../Vouchers_compo';
const db = getFirestore(app);

const OprationConverted = ({}) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    const [input, setInput] = useState()

    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        var CurrentDate=new Date()
        try {
            let list = []
            var q = query(collection(db, "Trip"), 
            // where("assign_to.uid", "==", props.auth.uid),
             where('Lead_Status', '==', 'Converted'),
             where('Travel_Date','>',CurrentDate),
             where("quotation_flg","==",true));
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
        catch (erorr){ 
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
                    lead_data.map((data, index) => (
                        <>
                            <VouchersCompo key={index} data={data} datahandle={getLeadOnBoard} profile={profile}/>
                        </>
                    ))
                }
            
        </div>
    );
}

export default OprationConverted;
