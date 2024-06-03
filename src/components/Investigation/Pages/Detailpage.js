import queryString from 'query-string';
import React from 'react';
import { useLocation } from 'react-router-dom';

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
           {data}
        </div>
    );
}

export default Detailpage;