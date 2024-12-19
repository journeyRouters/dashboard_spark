import React, { useEffect, useState } from 'react';
import './PendingPayments.css'
import * as XLSX from 'xlsx';
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
    const OverDuePaymentsController = () => {
        const Today = new Date();
        Today.setHours(0, 0, 0, 0);
        OverDuePayments(Today)
    };
    const TodayOverDuePaymentsController = () => {
        const Today = new Date();
        Today.setHours(0, 0, 0, 0);
        const tommorow = new Date();
        tommorow.setDate(tommorow.getDate() + 1)
        tommorow.setHours(0, 0, 0, 0)
        getDataInDateRange(Today, tommorow)
    };
    async function OverDuePayments(today) {
        const DataQuery = query(collection(db, "invoice"),
            where('FinalInstallmentStatus', '==', 'Pending'),
            where('NextInstallmentDate', '<', today));
        const unsubscribe = onSnapshot(DataQuery, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            });
            setLeads(list)
            // console.log(list)
        });
    }
    async function getDataInDateRange(from, to) {
        const DataQuery = query(collection(db, "invoice"),
            where('FinalInstallmentStatus', '==', 'Pending'),
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
    function exportToExcel(data) {
        var sheetname = moment(new Date()).format('DD-MMM-YYYY')
        const worksheetData = data.map(lead => ({
            TripID: lead.selected_pdf_data.travel_data.TripId,
            Destination: lead.selected_pdf_data.travel_data.Destination,
            ClientName: lead.selected_pdf_data.travel_data.Traveller_name,
            Number: lead.selected_pdf_data.travel_data.Contact_Number,
            travel_date: lead.selected_pdf_data.selected_Travel_date,
            SalesPerson: lead.selected_pdf_data.travel_data.assign_to.name,
            PaymentsToReceive: lead.NextInstallmentAmount,
            DueOn: lead.NextInstallmentDate.toDate(),
        }));

        // Create a new worksheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, `${sheetname}.xlsx`);
    }
    useEffect(()=>{
        TodayOverDuePaymentsController()
    },[])
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
                <button className='buttonSubmit' onClick={() => OverDuePaymentsController()}>Over Due</button>
                <button className='buttonSubmit' onClick={() => exportToExcel(Leads)}>export Data</button>
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