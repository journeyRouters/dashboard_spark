/* eslint-disable react/prop-types */

import axios from "axios";
import { useState } from "react";
import "./DriverCard.css";

const LeadStatusCtrl = ({ trip ,getrawleadsonboard}) => {
  const [leadStatus, setLeadStatus] = useState("");
  const LeadStatus = ["Active", "Interested", "Not Interested", 'Dump'];

  const changingLeadStatus = async () => {
    let updatedData = {
      Contact: trip.Contact,
      LeadId: trip.LeadId,
      NurtureLeadStatus: leadStatus,
      NurtureStatusHistory: [
        ...(trip.NurtureStatusHistory || []),
        {
          DateTimeStamp: new Date(),
          Status: leadStatus,
        },
      ],
    };
    try {
      await axios.put(
        `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander`,
        updatedData
      );
      setTimeout(() => {
        // window.location.reload();
      }, 1000);
      getrawleadsonboard()
    } catch (error) {
      console.error("Error saving status:", error);
    }
  };

  return (
    <>
      <div className="action-buttons">
        <div style={{ zIndex: 9 }} className="sorting-menu">
          <div className="menu-container">
            <select
              className="dropdown"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              {LeadStatus.map((status, id) => (
                <option key={id} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {leadStatus && (
              <div className="actions-button">
                <button
                  className="cancel-button "
                  onClick={() => setLeadStatus("")}
                >
                  Cancel
                </button>
                <button
                  className="save-button"
                  onClick={changingLeadStatus}
                  disabled={!leadStatus}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadStatusCtrl;
