import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import DateRangeSelector from "./Components/DateRangeSelector";
import DriverCard from "./Components/DriverCard";

// Utility function for Formating Date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};
// ----------------------------------->

const WebLeadLoader = () => {
  const [date, setDate] = useState({
    currentDate: formatDate(new Date()),
    nextDate: formatDate(new Date()),
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  // `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander?Status=new&from=${date.currentDate}&to=${date.nextDate}`

  useEffect(() => {
    const fetchLead = async () => {
      setLoading(true);
      const res = await axios.get(
        `https://2rltmjilx9.execute-api.ap-south-1.amazonaws.com/DataTransaction/LeadLander?Status=new`
      );
      setLoading(false);
      setData(res.data);
    };
    fetchLead();
  }, [date.currentDate, date.nextDate]);
  if (!data || loading) {
    return <p>loading.....</p>;
  }

  return (
    <>
      <DateRangeSelector dateSetter={setDate} />
      <br />
      {data?.map((lead, id) => (
        <Fragment key={id}>
          <DriverCard lead={lead} date={date} />
          <br />
        </Fragment>
      ))}
    </>
  );
};

export default WebLeadLoader;
