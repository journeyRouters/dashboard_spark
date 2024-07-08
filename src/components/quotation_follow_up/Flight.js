import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import app from "../required";
import Flightmappingcomponent from "./Flightmappingcomponent";
const db = getFirestore(app);



const Flight = () => {
    const [lead_data, setLead_data] = useState([])
    var today = new Date()
    var currentdate = moment(today).format('YYYY-MM-DD')
    const [selectedDate, setSeletctedDate] = useState(currentdate)
    const [profile, setprofile] = useState([])
    // const [currentMonth, setmonth] = useState(moment(new Date()).format('MMMM'))
    const [input, setInput] = useState()

    async function getLeadByDate(selectedDate) {
        // console.log('hit',selectedDate)
        const month=moment(selectedDate).format('MMMM')
        console.log(month)
        var Currentdate = new Date(selectedDate)
        Currentdate.setHours(0, 0, 0, 0)
        var tommorowDate = new Date(selectedDate)
        tommorowDate.setDate(tommorowDate.getDate() + 1);
        tommorowDate.setHours(0, 0, 0, 0);
        // console.log(Currentdate,tommorowDate)
        let list = []
        var q = query(collection(db, "Trip"),
            where('updated_last', '>=', Currentdate),
            where('updated_last', '<', tommorowDate),
            where('Lead_Status', '==', 'Converted'),
            where("month", "==", month)
        );
        // console.log(date)
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
                // console.log(doc.data().updated_last.toDate())
            });
            try {
                // console.log(list)
                setLead_data(list)
            }
            catch (e) { console.log(e) }
            // console.log(list);
        }
        catch (error) {
            console.log(error.message)
        }

    }
    async function fetchTheSearch() {
        var q;
        q = query(collection(db, "Trip"),
            where("TripId", "==", input))

        getQueryDatafromDatbase(q)
    }
    async function getQueryDatafromDatbase(q) {
        try {
            var querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length != 0) {
                let list = []
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                setLead_data(list)
                setInput('')

            }
        }
        catch (e) {
            console.log(e)
        }
    }
    function exportToExcel(data) {
        var sheetname = moment(new Date()).format('DD-MMM-YYYY')
        const worksheetData = data.map(item => ({
            TripID: item.TripId,
            Destination: item.Destination,
            ClientName: item.Traveller_name,
            Number: item.Contact_Number,
            TravelDate: item.Travel_Date.toDate(),
            SalesPerson: item.assign_to.name,
            ConvertedMonth: item.month
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
    function reset() {
        setInput('')
        getLeadByDate(currentdate)

    }
    useEffect(() => {
        window.scrollTo(0, 0);
        getLeadByDate(currentdate)
    }, []);



    return (
        <div>
            <div className='global_search_adminpage'>
                <button onClick={() => reset()}>Refresh</button>
                <label>Trip Id</label>
                <input placeholder='search your selection' onChange={(e) => setInput(e.target.value)}
                ></input>
                <input
                    className='global_search_button'
                    type="button"
                    value="Search "
                    onClick={() => fetchTheSearch()}
                ></input>
            </div>
            <div className='Driver_header'>
                <div>
                    <input onChange={(e) => setSeletctedDate(e.target.value)} type='date' value={selectedDate}></input>
                    <button onClick={() => getLeadByDate(selectedDate)}>Search</button>
                    <button onClick={() => exportToExcel(lead_data)}>Export Data</button>
                </div>

                <span style={{ background: 'yellow' }}>Total uploaded leads= {lead_data.length}</span>
            </div>
            <div style={{ background: 'cyan' }}>
                {lead_data.map((data, index) => (
                    <Flightmappingcomponent key={index} profile={profile} data={data} index={index} getLeadByDate={getLeadByDate} selectedDate={selectedDate} />
                ))}
            </div>
        </div>
    );
}

export default Flight;
