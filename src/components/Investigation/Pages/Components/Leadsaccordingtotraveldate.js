import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import app from '../../../required';
import { getConvertedDataForUserProfile } from '../../Components/Querybase';
import Verticlechart from '../../Components/Verticlechart';

const db = getFirestore(app);

function Leadsaccordingtotraveldate(props) {
    const [Leadaccordingtotraveldate, setLadsaccordingtotraveldate] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [destination, setDestination] = useState(null);
    const [leadStatus, setLeadStatus] = useState('');

    function getAllUserProfiles(from, to, Destination) {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));

        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(
                    collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where("Travel_Date", ">=", from),
                    where("Travel_Date", "<", to),
                    ...(Destination ? [where("Destination", "==", Destination)] : []),
                    ...(leadStatus
                        ? [where("Lead_Status", "==", leadStatus)]
                        : [where("Lead_Status", "in", ['Cold', 'Active', 'Hot', 'Paymentawaited'])])
                );
                getConvertedDataForUserProfile(usersProfile, DataQuery, setLadsaccordingtotraveldate);
            });
        });
    }

    function getAllDatawithoutDestion(from, to) {
        const q = query(collection(db, "Profile"),
            where("access_type", "in", ["User", "Team Leader", "freelance"]));

        return onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const usersProfile = doc.data();
                const DataQuery = query(
                    collection(db, "Trip"),
                    where("assign_to.uid", "==", usersProfile.uid),
                    where("Travel_Date", ">=", from),
                    where("Travel_Date", "<", to),
                    ...(leadStatus
                        ? [where("Lead_Status", "==", leadStatus)]
                        : [where("Lead_Status", "in", ['Cold', 'Active', 'Hot', 'Paymentawaited', 'Converted'])])
                );
                getConvertedDataForUserProfile(usersProfile, DataQuery, setLadsaccordingtotraveldate);
            });
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const fromDateObj = new Date(fromDate);
        fromDateObj.setHours(0, 0, 0, 0);
        const toDateObj = new Date(toDate);
        toDateObj.setHours(0, 0, 0, 0);

        if (destination) {
            getAllUserProfiles(fromDateObj, toDateObj, destination);
        } else {
            getAllDatawithoutDestion(fromDateObj, toDateObj);
        }
    };

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
                        <label className="labels" htmlFor="destination">Destination:</label>
                        <select
                            className="SelectFeild"
                            id="destination"
                            name="destination"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        >
                            <option value="">Select a destination</option>
                            <option value={'Dubai'}>Dubai</option>
                            <option value={'Maldives'}>Maldives</option>
                            <option value={'Thailand'}>Thailand</option>
                            <option value={'Singapore'}>Singapore</option>
                            <option value={'Malaysia'}>Malaysia</option>
                            <option value={'Bali'}>Bali</option>
                            <option value={'Himachal'}>Himachal</option>
                            <option value={'Ladakh'}>Ladakh</option>
                            <option value={'Kerala'}>Kerala</option>
                            <option value={'Kashmir'}>Kashmir</option>
                            <option value={'Andaman'}>Andaman</option>
                            <option value={'Goa'}>Goa</option>
                            <option value={'Rajasthan'}>Rajasthan</option>
                            <option value={'Vietnam'}>Vietnam</option>
                            <option value={'Northeast'}>Northeast</option>
                            <option value={'Europe'}>Europe</option>
                            <option value={'Turkey'}>Turkey</option>
                            <option value={'Mauritius'}>Mauritius</option>
                            <option value={'Baku'}>Baku</option>
                            <option value={'Almaty'}>Almaty</option>
                            <option value={'Srilanka'}>Srilanka</option>
                            <option value={'Hongkong'}>Hongkong</option>
                            <option value={'Nepal'}>Nepal</option>
                            <option value={'Georgia'}>Georgia</option>
                        </select>
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

            <Verticlechart Data={Leadaccordingtotraveldate} Comment={`${destination || 'All'} Leads`} />
        </div>
    );
}

export default Leadsaccordingtotraveldate;
