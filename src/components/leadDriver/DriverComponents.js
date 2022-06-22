import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import app from '../required';
import './Driver.css';


const DriverComponents = ({ data, profile, index, getLeadByDate, selectedDate }) => {
    const [currentUser, setCurrentuser] = useState(null)
    const db = getFirestore(app);
    var today = new Date()
    var currentdate = moment(today).format('YYYY-MM-DD')
    function handlebackendProfileAndtrip(tripid, uid, Name) {
        update_lead_field(uid, Name)
        assignTask(tripid)
        if (selectedDate !== null) {
            getLeadByDate(selectedDate)
        }
        else {

            getLeadByDate(currentdate)
        }

    }
    async function assignTask(tripid) {
        /**this function will update the lead_current feild in profile with new trip id */
        console.log(currentUser)
        const Databaseref = doc(db, "Profile", currentUser[0].uid);
        var Lead_Current = currentUser[0].Lead_Current
        // console.log(Lead_Current)
        Lead_Current.push(tripid)
        // console.log(Lead_Current)
        await updateDoc(Databaseref, {
            "Lead_Current": Lead_Current
        });

    }
    async function update_lead_field(uid, name) {
        /**this function is to update the assigned user in lead data foe ref and to be identify */
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "assign_to.uid": uid,
            "assign_to.name": name,
            "assign_flg": true
        });
    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = profile.filter((data) => data.uid === uid)
        setCurrentuser(profile_of_user)

    }
    return (
        <div key={index} className={data.assign_flg ? 'Driver_components_' : 'Driver_components'}>
            <div>
                <span>TripId:-{data.TripId}</span><br />
                <span>Name:-{data.Traveller_name}</span><br />
                <span>Pax:-{data.Pax}</span><br />
                <span>Child:-{data.Child}</span><br />
            </div>
            <div>
                <span>Destination:-{data.Destination}</span><br />
                <span>Budget:-{data.Budget}</span><br />Comments:-
                <div className='limitComments'>{data.Comment}</div><br />
            </div>
            <div>
                {
                    data.assign_flg ? <span>assign To:-{data.assign_to.name}</span> : <></>
                }<br />
                <span>
                    <select disabled={data.assign_flg}>
                        <option value='cold'>change Lead Status</option>
                        <option value='cold'>cold</option>
                        <option value='Active'>Active</option>
                        <option value='Hot'>Hot</option>

                    </select>
                </span><br />
                <span>Date of travel:-{data.Travel_Date}</span><br />
                <span>Assign to:-</span>

                <select disabled={data.assign_flg} onChange={(e) => filterDataFromProfile(e.target.value)}>
                    <option value={0}> assign to</option>
                    {
                        profile.map((data, index) => (<>
                            {/* {console.log(data.Lead_Current)} */}
                            <option key={index} value={data.uid}>{data.name}</option>

                        </>))
                    }
                </select>
            </div>
            <input disabled={data.assign_flg || currentUser == null} className='driverButton' type='button' value='Save the Changes' onClick={() => handlebackendProfileAndtrip(data.TripId, currentUser[0].uid, currentUser[0].name)} ></input>
        </div>

    );
}

export default DriverComponents;
