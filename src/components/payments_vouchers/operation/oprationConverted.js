import React from 'react';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import VouchersCompo from '../Vouchers_compo';
const db = getFirestore(app);

const OprationConverted = ({profile}) => {
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
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

export default OprationConverted;
