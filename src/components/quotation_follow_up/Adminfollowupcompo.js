import React from 'react';
import './quote.css'
import CommentsUniCompo from './CommentsUniCompo';
import moment from 'moment';
function Adminfollowupcompo({ data }) {
    const lead_data=data[0]
    return (
        <div className='Details_Parent'>
            <div className='DetailsChild'>
                <div className='DeatailsData'>
                    <label>Trip Id:-</label>
                    <span className='DeatailsDataspan'>{lead_data.TripId}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Client Name:-</label>
                    <span className='DeatailsDataspan'>{lead_data.Traveller_name}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Contact:-</label>
                    <span className='DeatailsDataspan'>{lead_data.Contact_Number}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Pax:-</label>
                    <span className='DeatailsDataspan'>{lead_data.Pax}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Child:-</label>
                    <span className='DeatailsDataspan'>{lead_data.Child}</span>
                </div>
            </div>
            <div className='DetailsChild'>
                <div className='DeatailsData'>
                    <label>Budget:-</label>
                    <span className='DeatailsDataspan'>{lead_data.Budget}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Destination:-</label>
                    <span className='DeatailsDataspan'>{lead_data.Destination}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Assign To:-</label>
                    <span className='DeatailsDataspan'>{lead_data.assign_to.name}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Lead Status :-</label>
                    <span className='DeatailsDataspan'>{lead_data.Lead_Status}</span>
                </div>
            </div>
            <div className='DetailsChild'>
                <div className='DeatailsData'>
                    <label>Travel Date:-</label>
                    <span className='DeatailsDataspan'>{moment(lead_data.Travel_Date.toDate()).format('DD/MMM/YYYY')}</span>
                </div>
                <div className='DeatailsData'>
                    <label>Assign Date:-</label>
                    <span className='DeatailsDataspan'>{moment(lead_data.assigned_date_time.toDate()).format('DD/MMM/YYYY')}
                    </span>
                </div>
                <div className='DeatailsData'>
                    <label>Month:-</label>
                    <span className='DeatailsDataspan'>{lead_data.month}</span>
                </div>
                <button>download Invoice</button>
                <button>Download final package</button>
            </div>
            <CommentsUniCompo row={lead_data}/>
        </div>
    );
}

export default Adminfollowupcompo;