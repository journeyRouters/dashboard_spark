import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import VouchersCompo from '../Vouchers_compo';
import './PendingPayments.css';
import * as XLSX from 'xlsx';

function CanceledTripOperations({profile}) {
    const db = getFirestore(app);
    const [Leads, setLeads] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [convertedIn, setConvertedIn] = useState('');
    const [travelIn, setTravelIn] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const fromDateObj = new Date(fromDate);
        fromDateObj.setHours(0, 0, 0, 0);
        const toDateObj = new Date(toDate);
        toDateObj.setHours(0, 0, 0, 0);
        getDataInDateRange(fromDateObj, toDateObj);
    };

    const TodayOverDuePaymentsController = () => {
        const Today = new Date();
        Today.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);       
        getDataInDateRange(Today, tomorrow);
    };
    async function fetchTripsBytravelMonth(monthYear) {
        setTravelIn(monthYear)
        const db = getFirestore(app);
        const [year, month] = monthYear.split('-').map(Number);
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);
    
        try {
            const tripsRef = collection(db, 'Trip');
            const tripsQuery = query(
                tripsRef,
                where('Travel_Date', '>=', firstDayOfMonth),
                where('Travel_Date', '<=', lastDayOfMonth),
                where('Lead_Status', '==', 'Cancel')
                
            );
    
            const querySnapshot = await getDocs(tripsQuery);
            const list=[];
            querySnapshot.docs.map(doc => {
                list.push(doc.data())
            });
            // console.log(list)
            setLeads(list)
        } catch (error) {
            console.error('Error fetching trips:', error.message);
            return [];
        }
    }

    async function fetchTripsByConvertedMonth(monthYear) {
        setConvertedIn(monthYear)
        const db = getFirestore(app);
        const [year, month] = monthYear.split('-').map(Number);
    
        try {
            const tripsRef = collection(db, 'Trip');
            const tripsQuery = query(
                tripsRef,
                where('month', '==', month),
                where('Lead_Status', '==', 'Cancel')
                
            );
    
            const querySnapshot = await getDocs(tripsQuery);
            const list=[];
            querySnapshot.docs.map(doc => {
                list.push(doc.data())
            });
            // console.log(list)
            setLeads(list)
        } catch (error) {
            console.error('Error fetching trips:', error.message);
            return [];
        }
    }
    async function getDataInDateRange(from, to) {
        try {
            const DataQuery = query(
                collection(db, "Trip"),
                where('Lead_Status', '==', 'Cancel'),
                where('CanceldAt', '>=', from),
                where('CanceldAt', '<=', to)
            );
            onSnapshot(DataQuery, (querySnapshot) => {
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc.data());
                });
                setLeads(list);
            });
        } catch (error) {
            console.error("Error fetching data in date range: ", error);
        }
    }
    
    const exportToExcel = () => {
        try {
          const formattedData = Leads.map(item => ({
            "TripId": item.TripId,
            "Contact_Number": item.Contact_Number,
            "Traveller_name": item.Traveller_name,
            "Assigned_to": item.assign_to?.name,
            "Travel_Date": new Date(item.Travel_Date.seconds * 1000).toLocaleDateString(),
            "Travel_Duration": item.Travel_Duration,
            "CancellationReason": item.CancellationReason,
            "Destination": item.Destination
          }));
      
          const ws = XLSX.utils.json_to_sheet(formattedData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Travel Data");
      
          XLSX.writeFile(wb, "TravelData.xlsx");
        } catch (error) {
          console.error("Error exporting data:", error);
        }
      }

    useEffect(() => {
        TodayOverDuePaymentsController();
    }, []);

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
                    <div className="form-group">
                        <label className='labels' htmlFor="converted-in">Converted In:</label>
                        <input
                            className='inputFeild'
                            type="month"
                            id="converted-in"
                            name="converted-in"
                            value={convertedIn}
                            onChange={(e) => fetchTripsByConvertedMonth(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className='labels' htmlFor="travel-in">Travel In:</label>
                        <input
                            className='inputFeild'
                            type="month"
                            id="travel-in"
                            name="travel-in"
                            value={travelIn}
                            onChange={(e) => fetchTripsBytravelMonth(e.target.value)}
                        />
                    </div>
                </form>
                <button className='buttonSubmit' onClick={() => exportToExcel()}>Export</button>
            </div>

            <div className='DataMappingSection'>
                {
                    Leads.map((lead, index) =>
                    <VouchersCompo key={index} data={lead} datahandle={TodayOverDuePaymentsController} profile={profile}/>
                    )
                }
            </div>
        </div>
    );
}

export default CanceledTripOperations;
