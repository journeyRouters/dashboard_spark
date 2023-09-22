import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import app from '../required';
import '../payments_vouchers/Payments.css';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
const AllConvertedFile = (props) => {
    const [lead_data, setLead_data] = useState([])
    const db = getFirestore(app);



    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        var CurrentDate = new Date()
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("assign_to.uid", "==", props.auth.uid),
                where('Lead_Status', '==', 'Converted'),
                // where('Travel_Date', '>', CurrentDate),
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
            <div className='global_search' >
                {/* <button onClick={() => getLeadOnBoard()}>Refresh</button> */}
                <span style={{ color: 'white' }}>Lead - {lead_data.length}</span>
            </div>
            <div className='details_of_specific_trip_main_container'>
                {
                    lead_data.map((data, index) => (

                        <VouchersCompo key={index} data={data} datahandle={getLeadOnBoard} profile={props.profile} />

                    ))
                }

            </div>
        </div>
    );
}

export default AllConvertedFile;
