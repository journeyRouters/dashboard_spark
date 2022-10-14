import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Box from '../../CreateQuote/Box';
import app from '../../required';
const db = getFirestore(app);

const CreateQuote = ({ uid }) => {
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
        
    }, []);
    return (
        <>
            {
                lead_data.length!=0 ? <>
                    yes
                    {/* <Box
                        email={props.auth.email}
                        data={user_uni_data}
                        updateTableDataAfterQuote={updateTableDataAfterQuote}
                        set_popupopner={set_popupopner}
                        profile={props.userProfile}
                    /> */}
                </> : <>Na</>
            }
        </>
    );
}

export default CreateQuote;
