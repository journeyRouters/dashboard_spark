import moment from 'moment';
import React, { useState } from 'react';

const Flightmappingcomponent = ({ data, profile, index, getLeadByDate, selectedDate }) => {
    const [Status, setStatus] = useState(data.Lead_Status)


    return (
        <div key={index} className={data.assign_flg ? 'Driver_components_' : 'Driver_components1'}>
            <div>
                <span>TripId:-{data.TripId}</span><br />
                <span>Contact:-{data.Contact_Number}</span><br />
                <span>Name:-{data.Traveller_name}</span><br />
                <span>Pax:-{data.Pax}</span><br />
                <span>Child:-{data.Child}</span><br />
            </div>
            <div>
                {/* <span> Date:-{moment((data.Travel_Date).toDate()).format('DD-MMM-YYYY')}</span><br /> */}
                <span>Destination:-{data.Destination}</span><br />
                <span style={{ color: 'yellow', background: 'black' }}>Travel Date:-{moment(data.Travel_Date.toDate()).format('DD-MMMM-YYYY')}</span><br />
                <span>Budget:-{data.Budget}</span><br />Comments:-
                <div className='limitComments'>{data.Comment}</div><br />
                <span style={{ color: 'yellow', background: 'black' }}>Lead Status:- {Status}</span>
            </div>
            <div style={{marginRight:'1rem'}}>
                {
                    data.assign_flg ? <span>Owner:-{data.assign_to.name}</span> : <></>
                }<br />
                <p >Lead Source:-
                    {data.Campaign_code}
                </p>
            </div>
        </div>

    );
}

export default Flightmappingcomponent;
