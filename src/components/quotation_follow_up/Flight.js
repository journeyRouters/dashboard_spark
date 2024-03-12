import { collection, getDocs, getFirestore, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import '../payments_vouchers/Payments.css';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
import app from '../required';
const Flight = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [lead_data, setLead_data] = useState([])
    const db = getFirestore(app);
    const[lastDocument,setlastDocument]=useState(null)
    async function getLeadOnBoard() {
        var CurrentDate = new Date()
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where('Lead_Status', '==', 'Converted'),
                where('Travel_Date', '>', CurrentDate),
                where("quotation_flg", "==", true),
                orderBy('Travel_Date'),
                limit(50),
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
                // console.log(list)
            }
            let lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
            setlastDocument(lastDocument)
        }
        catch (erorr) {
            console.log(erorr)
        }

    }

    async function fetchNext50Documents(lastDocument) {
        var CurrentDate = new Date()
        try {
            const q = query(
                collection(db, "Trip"),
                where('Lead_Status', '==', 'Converted'),
                where('Travel_Date', '>', CurrentDate),
                where("quotation_flg", "==", true),
                orderBy('updated_last'),
                startAfter(lastDocument),
                limit(50)
            );

            const querySnapshot = await getDocs(q);
            const list = [];

            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            setLead_data(list)
            let lastDocumentfile= querySnapshot.docs[querySnapshot.docs.length - 1];
            setlastDocument(lastDocumentfile)
        }

        catch (error) {
            console.error("Error fetching documents: ", error);
            throw error; // Rethrow the error for handling in the calling code
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

                        <VouchersCompo key={index} data={data} datahandle={getLeadOnBoard} profile={profile} />

                    ))
                }

            </div>
            <button onClick={()=>fetchNext50Documents(lastDocument)}>Next 50 files</button>
        </div>
    );
}

export default Flight;
