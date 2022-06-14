import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import './Payments.css'
import VouchersCompo from './Vouchers_compo';
const Vouchers = (props) => {
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    const db = getFirestore(app);

    async function datahandle() {
        if (props.auth) {
            let list = []
            const q = query(collection(db, "Trip"), where("quotation_flg", "==", true), where("Lead_Status", "==", "Converted"));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot)
            try{
                if (querySnapshot.docs.length == 0) {
                    setopen(false)
                }                
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // doc.data() is never undefined for query doc snapshots
                });
                setLead_data(list)
                console.log(list);
                setopen(false)
            }
            catch (error){
                console.log(error)
            }
        }
        else {
            setopen(false)
            setLead_data([])
        }

    }
    useEffect(() => {
        datahandle()
    }, []);
    return (
        <div>
            <div className='global_search'>
                <select name='search_type' id='firestore' className='option_selector'>
                    <option value="Name">Name</option>
                    <option value="Trip_id">TripId</option>
                    <option value="Contact">Contact_Number</option>
                    <option value="Budget">Budget</option>
                </select>
                <input placeholder='search your selection'></input>
                <input
                className='global_search_button'
                type="button"
                value="Search "
                ></input>

            </div>
            <div className='details_of_specific_trip_main_container'>
                {
                    lead_data.map((data,index)=>(
                        <>
                        <VouchersCompo data={data}/>
                        </>
                    ))
                }

            </div>
        </div>
    );
}

export default Vouchers;
