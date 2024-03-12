import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import VouchersCompo from '../Vouchers_compo';
const db = getFirestore(app);

const Duringstay = ({}) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)

    function filterDuringStay(list){
        var CurrentDate=new Date()
       let value= list.filter((lead)=>(lead.Travel_Date.toDate ()<=CurrentDate))
       setLead_data(value)
    }
    async function getLeadOnBoard() {
        var CurrentDate=new Date()
        try {
            let list = []
            var q = query(collection(db, "Trip"), 
             where('Lead_Status', '==', 'Converted'),
             where('travelEndDate','>',CurrentDate),
             where("quotation_flg","==",true),
             );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length === 0) {
                setopen(false)
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                filterDuringStay(list)
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

export default Duringstay;
