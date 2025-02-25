/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import { useNavigate } from "react-router-dom";
import "./WebLead.css";

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const LeadFilterCtrl = () => {
  const [status, setStatus] = useState("");
  const [showcalender, setShowCalender] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const navigate = useNavigate();

  const handleDateSelect = (ranges) => {
    const updatedRange = {
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: "selection",
    };
    setSelectionRange(updatedRange);
    console.log(updatedRange);
    const params = new URLSearchParams({
      leadStatus: status,
      startDate: formatDate(ranges.selection.startDate),
      endDate: formatDate(ranges.selection.endDate),
    }).toString();

    navigate(`/test1?${params}`);
  };
  const handleResetSelect = () => {
    navigate(
      `?leadStatus=New&startDate=${formatDate(new Date())}&endDate=${formatDate(
        new Date()
      )}`
    );
  };
  const handleLeadTypeSelect = (type) => {
    setStatus(type);

    const params = new URLSearchParams({
      leadType: type,
      startDate: formatDate(selectionRange.startDate),
      endDate: formatDate(selectionRange.endDate),
    });

    navigate(`/test1?${params.toString()}`);
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.has("leadStatus") ||
      params.has("startDate") ||
      params.has("endDate")
    ) {
      navigate(`/test1`, { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div className="filterWrapper">
        <div className="calanderWrapper">
          <button onClick={() => setShowCalender(!showcalender)}>
            Select the Date Range
          </button>
        </div>

        <button onClick={() => handleResetSelect()}>Total Lead</button>
        <button onClick={() => handleLeadTypeSelect("Create")}>
          Lead Create
        </button>
        <button onClick={() => handleLeadTypeSelect("NoResponding")}>
          No Responding
        </button>
        <button onClick={() => handleLeadTypeSelect("NotInterested")}>
          Not Interested
        </button>
      </div>
      {showcalender && (
        <DateRange
          ranges={[selectionRange]}
          onChange={handleDateSelect}
          moveRangeOnFirstSelection={false}
        />
      )}
    </>
  );
};
