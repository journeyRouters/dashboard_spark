import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import './Payments.css'
import VouchersCompo from './Vouchers_compo';
const Vouchers = (props) => {
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    const [profile, setProfile] = useState(null)
    const db = getFirestore(app);


     // async function getProfile(auth) {
    //     try {
    //         const docRef = doc(db, "Profile", auth.uid);
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //             setProfile(docSnap.data())
    //         } else {
    //             console.log("No such document!");
    //         }
    //     }
    //     catch (error) {
    //         console.log({ error })
    //     }
    // }
    // async function getLeadOnBoard() {
    //     let list = []
    //     var q;
    //     if (profile.access_type === 'User') {
    //         q = query(collection(db, "Trip"), where('TripId', 'in', props.profile.Lead_Vouchers));
    //     }
    //     var querySnapshot;
    //     try {
    //         if (profile.Lead_Vouchers.lenght!== 0) {

    //             querySnapshot = await getDocs(q);
    //         }
    //         else {
    //             setLead_data([])
    //         }
    //     }
    //     catch {
    //         setopen(false)
    //     }

    // }
    // async function updateprofile_Lead_Vouchers(tripid){/**this function is  suspious get clear with team */
    //     var pre_Lead_Vouchers=profile.Lead_Vouchers
    //     var elementIndex=pre_Lead_Vouchers.indexOf(tripid)
    //     var new_Lead_Vouchers=pre_Lead_Vouchers.splice(elementIndex,1)
    //     const docref=doc(db,"Profile",profile.uid)
    //     await updateDoc(docref,{
    //         "Lead_Vouchers":new_Lead_Vouchers
    //     })
    // }
   
    // function updateTableDataAfterConversion(tripid){
    //     var pre_tableData=lead_data
    //    var new_tableData= pre_tableData.filter((data)=>data.TripId!==tripid)
    //    setLead_data(new_tableData)

    // }
    async function datahandle() {
        if (props.auth) {
            let list = []
            const q = query(collection(db, "Trip"), where("quotation_flg", "==", true), where("Lead_Status", "==", "Converted"));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot)
            try {
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
            catch (error) {
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
                    lead_data.map((data, index) => (
                        <>
                            <VouchersCompo data={data} datahandle={datahandle} />
                        </>
                    ))
                }

            </div>
        </div>
    );
}

export default Vouchers;
