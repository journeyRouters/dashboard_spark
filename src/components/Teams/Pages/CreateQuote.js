import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Box from '../../CreateQuote/Box';
import DriverComponents from '../../leadDriver/DriverComponents';
import app from '../../required';
import Createleadcomponent from '../support/Createleadcomponent';
const db = getFirestore(app);

const CreateQuote = ({ uid, profile,TeamProfile }) => {
    // console.log(uid)
    const [lead_data, setLead_data] = useState([])

    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid), where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                console.log(list)
            }
        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    useEffect(() => {
        getLeadOnBoard()
        console.log(lead_data.length)

    }, []);
    return (
        <>
            {
                lead_data ? <>
                    {
                        lead_data.map((data, index) => (
                            <>
                           <Createleadcomponent data={data} getLeadOnBoard={getLeadOnBoard} TeamProfile={TeamProfile} index={index}/>
                            </>
                        ))
                    }
                </> : <>Na</>
            }
        </>
    );
}

export default CreateQuote;
