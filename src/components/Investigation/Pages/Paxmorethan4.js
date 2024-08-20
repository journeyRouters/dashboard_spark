import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';

const db = getFirestore(app);

function Paxmorethan4() {
    const [Paxmorethan4, setPaxmorethan4] = useState([]);
    const [selectedPax, setSelectedPax] = useState(8);
    const Pax = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    useEffect(() => {
        const unsubscribe = getAllUserProfiles(selectedPax);
        
        // Clean up the subscription on unmount or when selectedPax changes
        return () => {
            unsubscribe && unsubscribe();
        };
    }, [selectedPax]);

    function getAllUserProfiles(selectedPax) {
        
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));

        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where('Lead_Status', 'in', ['Hot', 'Active', 'Cold', 'Paymentawaited']),
                    where('Pax', '==', selectedPax),
                    where("quotation_flg", "==", true));

                getConvertedDataForUserProfile(usersProfile, DataQuery, setPaxmorethan4);
            });
        });
    }

    const handlePaxChange = (event) => {
        setSelectedPax(parseInt(event.target.value));
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="pax-selector" style={{ marginRight: '10px' }}>Select Pax:</label>
                <select
                    id="pax-selector"
                    value={selectedPax}
                    onChange={handlePaxChange}
                    style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    {Pax.map((pax, index) => (
                        <option key={index} value={pax}>{pax}</option>
                    ))}
                </select>
            </div>
            <Verticlechart Data={Paxmorethan4} Comment={'Dump Leads'} />
        </div>
    );
}

export default Paxmorethan4;
