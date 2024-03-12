import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import app from '../required';
import './Payments.css';
import VouchersCompo from './Vouchers_compo';
const Vouchers = (props) => {
    const [lead_data, setLead_data] = useState([])
    const db = getFirestore(app);
    const profile = JSON.parse(localStorage.getItem('profile'));
    const auth = JSON.parse(localStorage.getItem('auth'));



    async function getLeadOnBoard() {
        // console.log(auth.uid)
        var CurrentDate = new Date()
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("assign_to.uid", "==", auth.uid),
                where('Lead_Status', '==', 'Converted'),
                where('Travel_Date', '>', CurrentDate),
                where("quotation_flg", "==", true));
            orderBy('Travel_Date')
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                // console.log(list)
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
            {/* <div className='global_search'>
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

            </div> */}
            <div className='details_of_specific_trip_main_container'>
                {
                    lead_data.map((data, index) => (

                        <VouchersCompo key={index} data={data} datahandle={getLeadOnBoard} profile={profile} />

                    ))
                }

            </div>
        </div>
    );
}

export default Vouchers;
