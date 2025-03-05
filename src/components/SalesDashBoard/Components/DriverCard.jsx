/* eslint-disable react/prop-types */
import "./DriverCard.css";
import "./commentModal.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LeadStatusCtrl from "./LeadStatusCtrl";
import Comments from "./Comments";
import moment from "moment";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import app from "../../required";
import axios from "axios";

const DriverCard = ({ lead }) => {
  const db = getFirestore(app);
  const activeId = useLocation().state;
  const [loader, setLoader] = useState(false);
  const profile = JSON.parse(localStorage.getItem('profile'));
  const [tripCounter, setTripCounter] = useState();
  const today = new Date();
  //   Destructure Readable Values from Lead Props
  const {
    FullName,
    Contact,
    Email,
    DepartureCity,
    DestinationName,
    Pax,
    Child,
    Infant,
    Budget,
    Days,
    TravelDate,
    NurtureLeadStatus,
  } = lead;

  const [isOpen, setIsOpen] = useState(false);
  const assigned = lead?.NurtureLeadStatus === "Generated";
  const details = [
    { label: "Name", value: FullName },
    { label: "Contact", value: Contact },
    { label: "Email", value: Email },
    { label: "Destination", value: DestinationName },
    { label: "Status", value: DestinationName },
    { label: "Departure City", value: DepartureCity },
    { label: "Budget", value: Budget },
    { label: "Travel Date", value: TravelDate },
    { label: "Days", value: Days },
    { label: "Pax", value: Pax },
    { label: "Child", value: Child },
    { label: "Infant", value: Infant },
    { label: "Status", value: NurtureLeadStatus },
  ];

  const getTripCounter = async () => {
    const tripRef = doc(db, 'Support', 'tripCount');
    try {
      const supportSnap = await getDoc(tripRef);
      if (supportSnap.exists()) {
        setTripCounter(supportSnap.data().tripCount);
        console.log(supportSnap.data().tripCount)
        GenLeadFromRawLead(supportSnap.data().tripCount)
      }
    } catch (e) {
      console.log(e);
    }
  };

  const updateTripCounter = async (counted) => {
    const tripRef = doc(db, 'Support', 'tripCount');
    await updateDoc(tripRef, { tripCount: counted });
  };
  const GenLeadFromRawLead = (tripCounter) => {
    let countUpdater = tripCounter;
    const contactString = lead.Contact
    const last4 = contactString.replace(/\s+/g, '').slice(-4);
    const tripId = countUpdater + last4;
    // console.log(tripId,lead.FlightBookedFlg,typeof(lead.FlightBookedFlg))

    if (isNaN(countUpdater)) {
      alert('Server Busy :(');
      return;
    }

    countUpdater = parseInt(countUpdater) + 1;

    setDoc(doc(db, 'Trip', tripId), {
      TripId: tripId,
      Lead_Status: 'Hot',
      Campaign_code: 'WbL',
      Date_of_lead: today,
      Traveller_name: lead.FullName,
      FlightBookedFlg: lead.FlightBookedFlg,
      InstaId: 'Website lead',
      Contact_Number: lead.Contact,
      Destination: lead.DestinationName,
      Comment: 'none',
      Potential: '',
      Departure_City: lead.DepartureCity,
      Travel_Date: new Date(lead.TravelDate),
      Travel_Duration: parseInt(lead.Days),
      Budget: parseInt(0),
      Pax: parseInt(lead.NoOfPax),
      Child: parseInt(lead.Child),
      Email: lead.Email,
      Remark: 'none',
      Lead_genrate_date: today,
      uploaded_by: profile.email,
      Quoted_by: null,
      uploaded_date: moment(today).format('YYYY-MM-DD'),
      uploaded_time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`,
      quotation: 0,
      quotation_flg: false,
      month: '',
      Lead_status_change_date: null,
      comments: [],
      Vouchers_flight: [],
      Vouchers_hotels: [],
      Vouchers_others: [],
      vouchers_idproof: [],
      PaymentScreenshots_flight: [],
      PaymentScreenshots_hotels: [],
      PaymentScreenshots_others: [],
      transfer_request: false,
      transfer_request_reason: [],
      assign_to: {
        uid: '',
        name: '',
      },
      assigned_date_time: today,
      updated_last: null,
      assign_flg: false,
      final_package: null,
    });

    updateTripCounter(countUpdater);
    changingLeadStatus()
  };
  const changingLeadStatus = async () => {
    try {
      const response = await axios.put(
        "https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander",
        { LeadStatus: "LeadGenrated",Contact :lead.Contact,LeadId:lead.LeadId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log("Status updated successfully:", response.data);
  
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };
  
  return (
    <>
      <div
        style={{
          ...(assigned && { backgroundColor: "#737D8E" }),
        }}
        className={`driver-voucher-cards ${activeId?.LeadId === lead?.LeadId ? "active-card" : ""
          }`}
      >
        <div className="webLead_followUps">
          <div className="followups_client_details">
            {details.map((item, index) => (
              <p className={index / 2} key={index}>
                <span>{item.label}:</span> {item.value}
              </p>
            ))}

            {!assigned && (
              <div className="button-container">
                <LeadStatusCtrl trip={lead} />
                <button
                  onClick={() => setIsOpen(true)}
                  className="open-modal-button"
                >
                  Comments
                </button>

                {isOpen && (
                  <div
                    className="modal-overlay"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Comments commentData={lead} />
                    </div>
                  </div>
                )}
                <button
                  disabled={loader}
                    onClick={() => getTripCounter()}
                  className="btn generate-lead"
                >
                  {loader ? "Loading" : "         Generate Lead"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverCard;
