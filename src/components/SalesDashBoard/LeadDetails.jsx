/* eslint-disable react/prop-types */
import "./WebLead.css"; // Import CSS file
import axios from "axios";

const LeadCard = ({ lead, onCreateLead, onNoResponse, onNotInterested }) => {
  return (
    <div className="lead-card">
      <div className="webLead_Basic_details">
        <div>
          <h3>{lead.FullName}</h3>
          <p>
            <strong>Email:</strong> {lead.Email}
          </p>
          <p>
            <strong>Contact:</strong> {lead.Contact}
          </p>
          <p>
            <strong>Package ID:</strong> {lead.PackageId}
          </p>
        </div>
        <div>
          <p>
            <strong>Destination:</strong> {lead.DestinationName}
          </p>
          <p>
            <strong>No of Pax:</strong> {lead.NoOfPax}
          </p>
          <p>
            <strong>Package Name:</strong> {lead.PackageName}
          </p>
          <p>
            <strong>Selling Price:</strong> {lead.SellingPrice}
          </p>
        </div>
      </div>

      {lead?.LeadStatus === "New" && (
        <div className="button-group">
          <button onClick={onCreateLead} className="action-button">
            Create Lead
          </button>
          <button onClick={onNoResponse} className="action-button no-response">
            No Responding
          </button>
          <button
            onClick={onNotInterested}
            className="action-button not-interested"
          >
            Not Interested
          </button>
        </div>
      )}
    </div>
  );
};

const LeadDetails = ({ leads }) => {
  const handleCreateLead = async (lead) => {
    const paylaod = {
      Contact: lead.Contact,
      LeadStatus: "Create",
      LeadId: lead.LeadId,
    };

    await statusChangeApi(paylaod);
  };

  const handleNoResponse = async (lead) => {
    const paylaod = {
      Contact: lead.Contact,
      LeadStatus: "NoResponding",
      LeadId: lead.LeadId,
    };

    await statusChangeApi(paylaod);
    console.log("No Response action for:", lead);
  };

  const handleNotInterested = async (lead) => {
    const paylaod = {
      Contact: lead.Contact,
      LeadStatus: "NotInterested",
      LeadId: lead.LeadId,
    };

    await statusChangeApi(paylaod);
    console.log("Not Interested action for:", lead);
  };

  const statusChangeApi = async (payload) => {
    try {
      const response = await axios.put(
        `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander`,
        payload
      );
      const data = await response.data;
      console.log(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  return (
    <div className="lead-container">
      {leads?.map((lead, index) => (
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
