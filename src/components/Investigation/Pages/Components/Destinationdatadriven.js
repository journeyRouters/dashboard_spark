import { collection, getFirestore, onSnapshot, query as firestoreQuery, where } from 'firebase/firestore';
import React, { useState } from 'react';
import Select from 'react-select';
import app from '../../../required';
import { getConvertedDataForUserProfile } from '../../Components/Querybase';
import Verticlechart from '../../Components/Verticlechart';

const db = getFirestore(app);

function Destinationdatadriven() {
    const [destinationChartData, setDestinationChartData] = useState({});
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [leadStatus, setLeadStatus] = useState('');

    function getAllUserProfilesByDestinations(from, to, destinations) {
        const q = firestoreQuery(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));

        const chartData = {};

        onSnapshot(q, (querySnapshot) => {
            const users = querySnapshot.docs.map(doc => doc.data());
            destinations.forEach(destination => {
                users.forEach(usersProfile => {
                    const conditions = [
                        where("assign_to.uid", "==", usersProfile.uid),
                        where("Travel_Date", ">=", from),
                        where("Travel_Date", "<", to),
                        where("Destination", "==", destination),
                    ];

                    if (leadStatus) {
                        conditions.push(where("Lead_Status", "==", leadStatus));
                    } else {
                        conditions.push(where("Lead_Status", "in", ['Cold', 'Active', 'Hot', 'Paymentawaited', 'Converted']));
                    }

                    const DataQuery = firestoreQuery(collection(db, "Trip"), ...conditions);

                    getConvertedDataForUserProfile(usersProfile, DataQuery, (convertedData) => {
                        // console.log(convertedData);
                        // chartData[destination] = chartData[destination] || [];
                        // chartData[destination].push(...convertedData);
                        // setDestinationChartData({ ...chartData });
                    });
                });
            });
        });
    }

    function getAllDatawithoutDestion(from, to) {
        const q = firestoreQuery(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));

        const chartData = {};

        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const conditions = [
                    where("assign_to.uid", "==", usersProfile.uid),
                    where("Travel_Date", ">=", from),
                    where("Travel_Date", "<", to),
                ];

                if (leadStatus) {
                    conditions.push(where("Lead_Status", "==", leadStatus));
                } else {
                    conditions.push(where("Lead_Status", "in", ['Cold', 'Active', 'Hot', 'Paymentawaited', 'Converted']));
                }

                const DataQuery = firestoreQuery(collection(db, "Trip"), ...conditions);

                getConvertedDataForUserProfile(usersProfile, DataQuery, (convertedData) => {
                    chartData['All'] = chartData['All'] || [];
                    chartData['All'].push(...convertedData);
                    setDestinationChartData({ ...chartData });
                });
            });
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const fromDateObj = new Date(fromDate);
        fromDateObj.setHours(0, 0, 0, 0);
        const toDateObj = new Date(toDate);
        toDateObj.setHours(0, 0, 0, 0);

        const destinations = selectedDestinations.map(dest => dest.value);

        if (destinations.length > 0) {
            getAllUserProfilesByDestinations(fromDateObj, toDateObj, destinations);
        } else {
            getAllDatawithoutDestion(fromDateObj, toDateObj);
        }
    };

    const destinationOptions = [
        'Dubai', 'Maldives', 'Thailand', 'Singapore', 'Malaysia', 'Bali',
        'Himachal', 'Ladakh', 'Kerala', 'Kashmir', 'Andaman', 'Goa',
        'Rajasthan', 'Vietnam', 'Northeast', 'Europe', 'Turkey',
        'Mauritius', 'Baku', 'Almaty', 'Srilanka', 'Hongkong'
    ].map(dest => ({ value: dest, label: dest }));

    return (
        <div>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="labels" htmlFor="from-date">From Date:</label>
                        <input
                            type="date"
                            id="from-date"
                            name="from-date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="labels" htmlFor="to-date">To Date:</label>
                        <input
                            className="inputFeild"
                            type="date"
                            id="to-date"
                            name="to-date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="labels" htmlFor="destination">Destinations:</label>
                        <Select
                            isMulti
                            name="destinations"
                            options={destinationOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={selectedDestinations}
                            onChange={setSelectedDestinations}
                        />
                    </div>

                    <div className="form-group">
                        <label className="labels" htmlFor="leadStatus">Lead Status:</label>
                        <select
                            className="SelectFeild"
                            id="leadStatus"
                            name="leadStatus"
                            value={leadStatus}
                            onChange={(e) => setLeadStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="Cold">Cold</option>
                            <option value="Active">Active</option>
                            <option value="Hot">Hot</option>
                            <option value="Paymentawaited">Paymentawaited</option>
                            <option value="Converted">Converted</option>
                        </select>
                    </div>

                    <button className="buttonSubmit" type="submit">Submit</button>
                </form>
            </div>

            {Object.entries(destinationChartData).map(([destination, data]) => (
                <div key={destination}>
                    <Verticlechart Data={data} Comment={`${destination} Leads`} />
                </div>
            ))}
        </div>
    );
}

export default Destinationdatadriven;
