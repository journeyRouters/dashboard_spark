import queryString from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Page.css'
import CommentsUniCompo from '../../quotation_follow_up/CommentsUniCompo';
import Allquotes from './Components/Allquotes';
function Detailpage() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const data = query.get('TripId');
    let parsedData = null;

    if (data) {
        try {
            parsedData = JSON.parse(decodeURIComponent(data));
        } catch (e) {
            console.error('Failed to parse data:', e);
        }
    }
    console.log('data at details page', parsedData)
    return (
        <div>
            <div className='Leadsdetails'>
                <div >
                    <p className='Leadsdetails_tripId'>TripId -{data}</p>
                </div>
                <div>
                    <p>Client Name-{ }</p>
                    <p>Status- { }</p>
                </div>
                <div>
                    <p>Contact_Number- { }</p>
                    <p>Flight- { }</p>
                </div>
                <div>
                    <p>Destination- { }</p>
                    <p>Travel Duration - { }</p>
                </div>
                <div>
                    <p>Travel Date- { }</p>
                    <p>Budget- { }</p>
                </div>
            </div>
            <div className='Comments_and_allQuotes'>
                {/* <CommentsUniCompo row={null}/> */}
                <Allquotes TripId={parsedData}/>
            </div>
        </div>
    );
}

export default Detailpage;