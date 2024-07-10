import React, { useState } from 'react';
import './PendingPayments.css'
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../../required';
import moment from 'moment';
import PendingPaymentsUniComponents from './PendingPaymentsUniComponents';
function PendingPayments(props) {
    const db = getFirestore(app);
    const [Leads, setLeads] = useState([])
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        const fromDateObj = new Date(fromDate);
        fromDateObj.setHours(0, 0, 0, 0);
        const toDateObj = new Date(toDate);
        toDateObj.setHours(0, 0, 0, 0);
        getDataInDateRange(fromDateObj, toDateObj)
    };
    async function getDataInDateRange(from, to) {
        const DataQuery = query(collection(db, "invoice"),
            where('NextInstallmentDate', '>=', from),
            where('NextInstallmentDate', '<', to));
        const unsubscribe = onSnapshot(DataQuery, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
            setLeads(list)
            // console.log(list)
        });

    }
    return (
        <div>
            <div className='Filterparents'>
                <form className='FilterMain' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className='labels' htmlFor="from-date">From Date:</label>
                        <input
                            className='inputFeild'
                            type="date"
                            id="from-date"
                            name="from-date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className='labels' htmlFor="to-date">To Date:</label>
                        <input
                            className='inputFeild'
                            type="date"
                            id="to-date"
                            name="to-date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            required
                        />
                    </div>
                    <button className='buttonSubmit' type="submit">Submit</button>
                </form>
                <button className='buttonSubmit' type="submit">export Data</button>
            </div>

            <div className='DataMappingSection'>
                {
                    Leads.map((lead, index) =>
                        <PendingPaymentsUniComponents lead={lead} key={index} />
                    )
                }

            </div>
        </div>
    );
}

export default PendingPayments;