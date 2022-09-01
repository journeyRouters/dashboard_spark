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



    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), 
            where("assign_to.uid", "==", props.auth.uid),
             where('Lead_Status', '==', 'Converted'),
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
    useEffect(() => {
        getLeadOnBoard()
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
                            <VouchersCompo key={index} data={data} datahandle={getLeadOnBoard} profile={props.profile}/>
                        </>
                    ))
                }

            </div>
        </div>
    );
}

export default Vouchers;
