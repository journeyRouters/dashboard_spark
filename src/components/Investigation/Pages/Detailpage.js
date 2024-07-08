import { doc, getDoc, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommentsUniCompo from '../../quotation_follow_up/CommentsUniCompo';
import app from '../../required';
import Allquotes from './Components/Allquotes';
import Installmentmapper from './Components/Installmentmapper';
import './Page.css';


function Detailpage() {
    const db = getFirestore(app);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const data = query.get('TripId');
    const [Data, setData] = useState({});
    const [parsedData, setParsedData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            try {
                let convertedValue = JSON.parse(decodeURIComponent(data));
                setParsedData(convertedValue);
                latestTripData(convertedValue);
            } catch (e) {
                console.error('Failed to parse data:', e);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [data]);

    async function latestTripData(TripId) {
        try {
            const docRef = doc(db, "Trip", TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setData(docSnap.data());
                // console.log(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {
                loading ? <div>Loading ............</div> :
                    <div>
                        <div className='Leadsdetails'>
                            <div >
                                <p className='Leadsdetails_tripId'>TripId - {parsedData}</p>
                            </div>
                            <div>
                                <p>Client Name - {Data.Traveller_name}</p>
                                <p>Contact Number - {Data.Contact_Number}</p>
                                <p>Destination - {Data.Destination}</p>
                                <p>Status - {Data.Lead_Status}</p>
                            </div>
                            <div>
                                <p>Travel Date - {moment(Data.Travel_Date.toDate()).format('DD-MM-YYYY')}</p>
                                <p>Travel Duration - {Data.Travel_Duration}</p>
                                <p>Pax - {Data.Pax}</p>
                                <p>Child - {Data.Child}</p>
                            </div>
                            <div>
                                <p>Sales Person - {Data.assign_to.name}</p>
                                <p>Lead type - {Data.Campaign_code}</p>
                                <p>Lead Assigned - {moment(Data.assigned_date_time.toDate()).format('DD/MMM/YYYY')}</p>
                                <p>Converted Date- {Data.updated_last == null ? "" : moment(Data.updated_last.toDate()).format('DD-MM-YYYY')}</p>
                            </div>
                            {/* <div>
                                <p>Travel Date - {moment(Data.Travel_Date.toDate()).format('DD-MM-YYYY')}</p>
                                <p>Budget - {Data.Budget}</p>
                            </div> */}
                        </div>
                        <div className='Comments_and_allQuotes'>
                            <CommentsUniCompo row={Data} />
                            <Allquotes TripId={parsedData} />
                        </div>

                        <Installmentmapper Data={Data} />

                    </div>
            }

        </div>
    );
}

export default Detailpage;
