/* eslint-disable react/prop-types */
import "./DriverCard.css";
import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const DriverCard = ({ lead }) => {
  const activeId = useLocation().state;
  const [loader, setLoader] = useState(false);
  const rawjson = {
    LeadId: lead?.LeadId,
    AccountsComments: [
      {
        comments: null,
        DateTimeStamp: null,
        Name: null,
        Role: null,
      },
    ],
    AccountsLeadStatus: "",
    AccountsUserEmail: "",
    AccountsUserName: "",
    AccountsUserUid: "",
    AccountsStatusHistory: [
      {
        DateTimeStamp: null,
        Status: null,
        UpdatedBy: null,
        Role: null,
      },
    ],
    AdminComments: [
      {
        comments: null,
        DateTimeStamp: null,
        Name: null,
        Role: null,
      },
    ],
    AssignDate: "",
    ClientLeadDetails: {
      Budget: null,
      Child: null,
      Contact: lead?.Contact,
      Days: null,
      DepartureCity: lead?.DepartureCity,
      DestinationName: lead?.DestinationName,
      Email: lead?.Email,
      FullName: lead?.FullName,
      Infant: null,
      Pax: lead?.NoOfPax,
      TravelDate: lead?.DateTime,
    },
    FlightBookedFlag: "",
    FlightsComments: [
      {
        comments: null,
        DateTimeStamp: null,
        Name: null,
        Role: null,
      },
    ],
    FlightPassengers: [],
    FlightsLeadStatus: "",
    FlightsUserEmail: "",
    FlightsUserName: "",
    FlightsUserUid: "",
    FlightsStatusHistory: [
      {
        DateTimeStamp: null,
        Status: null,
        UpdatedBy: null,
        Role: null,
      },
    ],
    IfFlightBooked: {
      Airline: "",
      AllStops: [
        {
          Duration: "",
          LayoverTime: "",
          StopCity: "",
        },
      ],
      LeadGeneratedTimeStamp: "",
      ArrivalDate: "",
      ArrivingTo: "",
      DepartingFrom: "",
      DepartureDate: "",
      TotalStop: "",
    },
    LeadPotential: "",
    LeadRating: "",
    LeadFlowHistory: [
      {
        Date: "",
        LeadStatus: "",
        AssignTo: "",
        AssignedBy: "",
      },
    ],
    OperationsComments: [
      {
        comments: "",
        DateTimeStamp: "",
        Name: "",
        Role: "",
      },
    ],
    OperationsLeadStatus: "",
    OperationsUserEmail: "",
    OperationsUserName: "",
    OperationsUserUid: "",
    OperationsStatusHistory: [
      {
        DateTimeStamp: "",
        Status: "",
        UpdatedBy: "",
        Role: "",
      },
    ],
    SalesPersonComments: [
      {
        comments: "",
        DateTimeStamp: "",
        Name: "",
        Role: "",
      },
    ],
    SalesLeadStatus: "",
    SalesUserEmail: "",
    SalesUserName: "",
    SalesUserUid: "",
    SalesStatusHistory: [
      {
        DateTimeStamp: "",
        Status: "",
        UpdatedBy: "",
        Role: "",
      },
    ],
    UserEmail: "",
    UserName: "",
    UserUid: "",
    QuotationFlg: false,
    QuotationIDSets: [],
    Reminders: [],
    NurtureLeadStatus: "",
    NurtureComments: [
      {
        comments: "",
        DateTimeStamp: "",
        Name: "",
        Role: "",
      },
    ],
    NurtureUserEmail: "",
    NurtureUserName: "",
    NurtureUserUid: "",
    NurtureStatusHistory: [
      {
        DateTimeStamp: "",
        Role: "",
        Status: "",
        UpdatedBy: "",
      },
    ],
    TravelEndDate: "",
    SalesIncentiveStatus: false,
    FlightsIncentiveStatus: false,
    OperationIncentiveStatus: false,
    SalesIncentiveRequest: false,
    FlightsIncentiveRequest: false,
    OperationIncentiveRequest: false,
    IncentiveRequestChecker: 0,
    IncentiveRequest: false,
    LastUpdated: "",
  };

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
  } = lead;
  // --------------->

  const handleGenerateLead = async (payload) => {
    setLoader(true);
    const { PackageId, DateTime, LeadStatus } = payload;
    const testjson = {
      ...rawjson,
      NurtureLeadStatus: LeadStatus,
      DateTime,
      PackageId,
    };

    try {
      await axios.post(
        "https://dttpwtwmg0.execute-api.ap-south-1.amazonaws.com/salesboard/getleads",
        testjson
      );

      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  //   Checking Assigned Status
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
  ];
  return (
    <>
      <div
        style={{
          ...(assigned && { backgroundColor: "#737D8E" }),
        }}
        className={`driver-voucher-cards ${
          activeId?.LeadId === lead?.LeadId ? "active-card" : ""
        }`}
      >
        <div className="webLead_followUps">
          <div
            onClick={(e) => {
              if (
                e.target.tagName !== "INPUT" &&
                e.target.tagName !== "BUTTON"
              ) {
                // navigate(`/leads/leadId?LeadId=${lead?.LeadId}`);
              }
            }}
            className="followups_client_details"
          >
            {details.map((item, index) => (
              <p key={index}>
                <span>{item.label}:</span> {item.value}
              </p>
            ))}
            {!assigned && (
              <div className="button-container">
                <button
                  disabled={loader}
                  //   onClick={() => handleGenerateLead(lead)}
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
