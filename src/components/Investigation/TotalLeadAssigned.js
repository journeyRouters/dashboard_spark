import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../required';
import './investigation.css';
import { DynamicBarChart } from 'react-dynamic-charts';

const db = getFirestore(app);

function TotalLeadAssigned({ Total_Lead_Analysed: passed_Total_Lead_Analysed, AllUserprofile }) {
  const [StartDate, setStartDate] = useState(null);
  const [Total_Lead_Analysed, set_Total_Lead_Analysed] = useState(passed_Total_Lead_Analysed);
  const [endDate, setendDate] = useState(null);
  const [flg_data_updated, setflg_data_updated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function rangeController(trigger, e) {
    console.log(trigger)
    if (trigger == 'from') {
        var date = new Date(e.target.value)
        setStartDate(date)
    }
    else if (trigger == 'till') {
        var date = new Date(e.target.value)
        setendDate(date)
    }
}

  async function getTotalLeadAssignedInRange(StartDate, endDate) {
    setLoading(true);
    setError(null);

    try {
        var holdAlluserAnalytics = []
        var StartDate = new Date(StartDate);
        var endDate = new Date(endDate)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where("assigned_date_time", ">=", StartDate),
                    where("assigned_date_time", "<=", endDate)
                );
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
                console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }

        set_Total_Lead_Analysed([
            {
                name: 'Total lead Assigned',
                values: holdAlluserAnalytics
            }
        ])
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    set_Total_Lead_Analysed(Total_Lead_Analysed);
  }, [Total_Lead_Analysed]);

  return (
    <div style={{ width: '100%' }}>
      <div className='custom-dateselector'>
        <input type='date' onChange={(e) => rangeController('from', e)} />
        <input type='date' onChange={(e) => rangeController('till', e)} />
        <button onClick={() => getTotalLeadAssignedInRange(StartDate, endDate)}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <DynamicBarChart
          data={Total_Lead_Analysed}
          iterationTimeout={1200}
          startRunningTimeout={2500}
          barHeight={20}
          iterationTitleStyles={{ fontSize: 18 }}
        />
      )}
    </div>
  );
}

export default TotalLeadAssigned;
