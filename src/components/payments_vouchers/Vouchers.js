import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import app from '../required';
import './Payments.css';
import VouchersCompo from './Vouchers_compo';
const Vouchers = (props) => {
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    const [profile, setProfile] = useState(null)
    const db = getFirestore(app);

    async function getProfile(auth) {
        try {
            const docRef = doc(db, "Profile", auth.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data())
                getLeadOnBoard(docSnap.data().Lead_converted)
                console.log(docSnap.data())
            } else {
                console.log("No such document!");
            }
        }
        catch (error) {
            console.log({ error })
        }
    }
    async function getLeadOnBoard(list) {
        let list_ = []
        console.log(profile)

        for (let index = 0; index < list.length; index++) {
            const docRef = doc(db, "Trip", list[index]);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                list_.push(docSnap.data())
                console.log("ps:", docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        setLead_data(list_)
        setopen(false)



    }
    async function updateprofile_Lead_followUp(tripid) {
        var pre_Lead_followUp = profile.Lead_followUp
        var elementIndex = pre_Lead_followUp.indexOf(tripid)
        var new_Lead_followUp = pre_Lead_followUp.splice(elementIndex, 1)
        const docref = doc(db, "Profile", profile.uid)
        await updateDoc(docref, {
            "Lead_followUp": pre_Lead_followUp
        })
    }
    
    
    useEffect(() => {
        getProfile(props.auth)
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
                            <VouchersCompo key={index} data={data} datahandle={getProfile} />
                        </>
                    ))
                }

            </div>
        </div>
    );
}

export default Vouchers;
