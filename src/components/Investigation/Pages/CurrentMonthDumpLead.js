import React, { useEffect, useState } from 'react';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../../required';
import { getConvertedDataForUserProfile } from '../Components/Querybase';
import Verticlechart from '../Components/Verticlechart';

const db = getFirestore(app);

function DumpLeadsByDate() {
  const [DumpLeads, setDumpLeads] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const from = new Date(startDate);
    const to = new Date(endDate);
    to.setHours(23, 59, 59, 999); // end of the day

    const q = query(
      collection(db, 'Profile'),
      where('access_type', 'in', ['User', 'Team Leader', 'freelance'])
    );

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const usersProfile = doc.data();
        const DataQuery = query(
          collection(db, 'Trip'),
          where('assign_to.uid', '==', usersProfile.uid),
          where('Lead_Status', '==', 'Dump'),
          where('quotation_flg', '==', true),
          where('assigned_date_time', '>=', from),
          where('assigned_date_time', '<=', to)
        );
        getConvertedDataForUserProfile(usersProfile, DataQuery, setDumpLeads);
      });
    });

    return () => unsub();
  }, [startDate, endDate]);

  return (
    <div>
      <label>
        Start Date:{' '}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label style={{ marginLeft: '1rem' }}>
        End Date:{' '}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <Verticlechart Data={DumpLeads} Comment="Dump Leads by Date Range" />
    </div>
  );
}

export default DumpLeadsByDate;
