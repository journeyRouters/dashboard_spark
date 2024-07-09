import { collection, deleteDoc, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../required';
import './Driver.css';

const DriverComponents = ({ data, profile, index, getLeadByDate, selectedDate }) => {
    const [currentUser, setCurrentuser] = useState(null)
    const [numberOfDays, setNumberOfDays] = useState(data.Travel_Duration)
    const [Status, setStatus] = useState(data.Lead_Status)
    const [flightBooked, setflightBooked] = useState(false)
    const [LeadType, setLeadType] = useState(data.Campaign_code)
    const [Potential, setPotential] = useState(data.Potential?data.Potential:'Normal')
    const db = getFirestore(app);
    var today = new Date()
    var currentdate = moment(today).format('YYYY-MM-DD')
    async function deletelead(tripid) {
        try {
            await deleteDoc(doc(db, "Trip", tripid));
            getLeadByDate()
        }
        catch (e) { console.log(e) }
    }
    async function updatewhatsappCollectionDoc(TripId, uid, name, Status) {
        try {
            const Databaseref = doc(db, "whatsapp", TripId);
            await updateDoc(Databaseref, {
                "assign_to.uid": uid,
                "assign_to.name": name,
                "Status": Status,
            });
            console.log('Document successfully updated!');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }
    async function update_lead_field(uid, name) {
        /**this function is to update the assigned user in lead data for ref and to be identify */
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "assign_to.uid": uid,
            "assign_to.name": name,
            "assign_flg": true,
            "assigned_date_time": today,
            "Lead_Status": Status,
            "Campaign_code": LeadType,
            "Potential":Potential
        });
        updatewhatsappCollectionDoc(uid, name)
        getLeadByDate(selectedDate)
    }
    async function UpdateCampionCode() {
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "Campaign_code": LeadType
        });
        getLeadByDate(selectedDate)
    }
    function OnStatusChange(value) {
        setStatus(value)
    }
    function changeLeadtype(value) {
        setLeadType(value)
    }
    async function updateNumberOfDays(value) {
        setNumberOfDays(value)
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "Travel_Duration": parseInt(value)
        });
        getLeadByDate(selectedDate)
    }
    async function updateDate(value) {
        var date = new Date(value)
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "Travel_Date": date
        });
    }
    async function reassign() {
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "assign_flg": false,
        });
        getLeadByDate(selectedDate)
    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = profile.filter((data) => data.uid === uid)
        setCurrentuser(profile_of_user)

    }
    async function FlightController(e) {
        setflightBooked(!flightBooked)
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "FlightBookedFlg": !flightBooked
        });
        getLeadByDate(selectedDate)
    }

    async function SearchForClientMatch(Contact_Number) {
        let list = []
        var q = query(collection(db, "Trip"),
            where('Contact_Number', '==', Contact_Number),
            where('TripId', '!=', data.TripId)
        );
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            try {
                // console.log(list)
                if (list.length == 0) {
                    return
                }
                else {
                    var IsConverted = CheckForConvertedClient(list)
                    // console.log(IsConverted)
                    if (IsConverted) { setLeadType("Converted") }
                    else { setLeadType("Repeated") }
                    UpdateCampionCode()
                }
            }
            catch (e) { console.log(e) }
        }
        catch (error) {
            console.log(error.message)
        }

    }
    function CheckForConvertedClient(list) {
        return list.some(item => item.Lead_Status === "Converted");
    }
    useEffect(() => {
        if (LeadType === "INSTA01" || LeadType == "FB001") {
            SearchForClientMatch(data.Contact_Number)
        }
    }, [])
    return (
        <div key={index} className={data.assign_flg ? 'Driver_components_' : 'Driver_components1'}>
            <div>
                <span>TripId:-{data.TripId}</span><br />
                <span>Name:-{data.Traveller_name}</span><br />
                <span>Pax:-{data.Pax}</span><br />
                <span>Child:-{data.Child}</span><br />
                <input type='checkbox' checked={flightBooked} onChange={(e) => FlightController(e)} /><span>Flight Is Booked</span>
                <br />
                <span>Client</span>
                <select value={LeadType} onChange={(e) => changeLeadtype(e.target.value)}>
                    <option value='Normal'>Normal</option>
                    <option value='Premium'>Premium</option>
                    <option value='Converted'>Converted</option>
                    <option value='Repeated'>Repeated</option>
                    <option value='Direct'>Direct</option>
                </select>
                <br />
                <span>Lead Potential</span>
                <select value={Potential} onChange={(e) => setPotential(e.target.value)}>
                    <option value='Normal'>Normal</option>
                    <option value='Nurture'>Nurture</option>
                </select>
            </div>
            <div>
                {/* <span> Date:-{moment((data.Travel_Date).toDate()).format('DD-MMM-YYYY')}</span><br /> */}
                <span>Destination:-{data.Destination}</span><br />
                <span>Budget:-{data.Budget}</span><br />Comments:-
                <div className='limitComments'>{data.Comment}</div><br />
                <span style={{ color: 'yellow', background: 'black' }}>Lead Status:- {Status}</span>
            </div>
            <div>
                {
                    data.assign_flg ? <span>assign To:-{data.assign_to.name}</span> : <></>
                }<br />
                <span>
                    <select disabled={data.assign_flg} onChange={(e) => OnStatusChange(e.target.value)}>
                        <option value='Cold'>change Lead Status</option>
                        <option value='Cold'>cold</option>
                        <option value='Active'>Active</option>
                        <option value='Hot'>Hot</option>
                    </select>
                </span><br />
                {/* {
                    testdate.toDate() ? <>
                        <span>Date of travel:-{moment(testdate.toDate()).format('DD-MM-YYYY')}</span><br />
                    </> : <></>
                } */}
                <span>Assign to:-</span>
                <select disabled={data.assign_flg} onChange={(e) => filterDataFromProfile(e.target.value)}>
                    <option value={0}> assign to</option>
                    {
                        profile.map((data, index) => (
                            <option key={index} value={data.uid}>{data.name}</option>))
                    }
                </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input type={"number"} value={numberOfDays} onChange={(e) => updateNumberOfDays(e.target.value)}></input>
                <input type='date' onChange={(e) => updateDate(e.target.value)} ></input>
            </div>
            <input disabled={data.assign_flg} className='driverButton' type='button' value='Save the Changes' onClick={() => update_lead_field(currentUser[0].uid, currentUser[0].name)} ></input>
            <button disabled={data.assign_flg} onClick={() => deletelead(data.TripId)}>delete</button>
            <button onClick={() => reassign()}>Reset</button>
        </div>

    );
}

export default DriverComponents;
