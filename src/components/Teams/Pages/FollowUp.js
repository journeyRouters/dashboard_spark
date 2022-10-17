import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Row from '../../quotation_follow_up/Row';
import app from '../../required';
import './page.css'
const db = getFirestore(app);


const FollowUp = ({ uid,profile,auth }) => {
    console.log(profile)
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    async function getLeadOnBoard() {
        // console.log(props.target.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==",uid),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true)
            );
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
                console.log(list)
                setopen(false)

            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }
    useEffect(() => {
        getLeadOnBoard()
    }, []);
    return (
        <div className='setAliners'>
            {lead_data &&
                (lead_data.slice(0).reverse()).map((row, index) => (
                    <Row
                        auth={auth}
                        profile={profile}
                        key={index}
                        row={row}
                        getLeadOnBoard={getLeadOnBoard}
                        // updateTableDataAfterConversion={updateTableDataAfterConversion}
                    // datahandle={datahandle}
                    />
                ))}
        </div>
    );
}

export default FollowUp;
