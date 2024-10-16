import React from 'react';
import './WebLead.css'; // Import CSS file

// Individual lead card component
const LeadCard = ({ lead, onCreateLead, onNoResponse, onNotInterested }) => {
    return (
        <div className="lead-card">
            <div className='webLead_Basic_details'>
                <div>
                    <h3>{lead.FullName}</h3>
                    <p><strong>Email:</strong> {lead.Email}</p>
                    <p><strong>Contact:</strong> {lead.Contact}</p>
                    <p><strong>Package ID:</strong> {lead.PackageId}</p>
                </div>
                <div>
                    <p><strong>Destination:</strong> {lead.DestinationName}</p>
                    <p><strong>No of Pax:</strong> {lead.NoOfPax}</p>
                    <p><strong>Package Name:</strong> {lead.PackageName}</p>
                    <p><strong>Selling Price:</strong> {lead.SellingPrice}</p>
                </div>
            </div>




            {/* Action buttons */}
            <div className="button-group">
                <button onClick={onCreateLead} className="action-button">Create Lead</button>
                <button onClick={onNoResponse} className="action-button no-response">No Responding</button>
                <button onClick={onNotInterested} className="action-button not-interested">Not Interested</button>
            </div>
        </div>
    );
};

// Main component to display list of leads
const LeadDetails = ({ leads }) => {
    // console.log(leads)
    const handleCreateLead = (lead) => {
        console.log('Create Lead action for:', lead);
        // Add logic to handle "Create Lead" action
    };

    const handleNoResponse = (lead) => {
        console.log('No Response action for:', lead);
        // Add logic to handle "No Response" action
    };

    const handleNotInterested = (lead) => {
        console.log('Not Interested action for:', lead);
        // Add logic to handle "Not Interested" action
    };

    return (
        <div className="lead-container">
            {leads.map((lead, index) => (
                <LeadCard
                    key={index}
                    lead={lead}
                    onCreateLead={() => handleCreateLead(lead)}
                    onNoResponse={() => handleNoResponse(lead)}
                    onNotInterested={() => handleNotInterested(lead)}
                />
            ))}
        </div>
    );
};

export default LeadDetails;
