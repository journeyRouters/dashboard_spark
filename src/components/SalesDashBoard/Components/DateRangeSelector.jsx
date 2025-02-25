/* eslint-disable react/prop-types */
import { useState } from "react";
import "./DateRangeSelector.css";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
const DateRangeSelector = ({ dateSetter }) => {
  const [selectedRange, setSelectedRange] = useState({ from: null, to: null });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = () => {
    if (selectedRange.from && selectedRange.to) {
      const formattedFrom = formatDate(selectedRange.from);
      const formattedTo = formatDate(selectedRange.to);
      dateSetter({
        currentDate: formattedFrom,
        nextDate: formattedTo,
      });
      setShowCalendar(!showCalendar);
    }
  };

  return (
    <div style={{ marginTop: "12px" }} className="date-range-container">
      <h3
        style={{
          cursor: "pointer",
          width: "100%",
          margin: "0px",
          textAlign: "left",
        }}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {" "}
        Search by date{" "}
      </h3>
      {showCalendar && (
        <div
          style={{
            position: "absolute",
            background: "white",
            transform: "scale(0.7)",
            padding: "2rem",
            borderRadius: "15px",
            top: "1rem",
          }}
        >
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={setSelectedRange}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <button className="submit-buttons" onClick={handleDateChange}>
              Apply
            </button>{" "}
            <div
              className="submit-buttons"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              Cancel
            </div>
          </div>
        </div>
      )}

      <button className="submit-buttons" onClick={handleDateChange}>
        Apply
      </button>
    </div>
  );
};

export default DateRangeSelector;
