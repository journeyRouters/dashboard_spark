import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../required';
import './Driver.css';


const DriverComponents = ({ data, profile, index, getLeadByDate, selectedDate }) => {
    const [currentUser, setCurrentuser] = useState(null)
    const db = getFirestore(app);
    var today = new Date()
    const[testdate,setvtestdate]=useState(data.Travel_Date?data.Travel_Date:false)
    // const testdate = data.Travel_Date

    console.log(moment(testdate.toDate()).format('DD-MM-YYYY'))
    var currentdate = moment(today).format('YYYY-MM-DD')
  
    async function deletelead(tripid) {
        try {
            await deleteDoc(doc(db, "Trip", tripid));
            getLeadByDate()
        }
        catch (e) { console.log(e) }
    }
    async function update_lead_field(uid, name) {
        /**this function is to update the assigned user in lead data for ref and to be identify */
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "assign_to.uid": uid,
            "assign_to.name": name,
            "assign_flg": true,
            "assigned_date_time": today
        });
        getLeadByDate(currentdate)
    }
    async function reassign() {
        const Databaseref = doc(db, "Trip", data.TripId);
        await updateDoc(Databaseref, {
            "assign_flg": false,
        });
        getLeadByDate(currentdate)
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
                {
                    testdate.toDate() ? <>
                        <span>Date of travel:-{moment(testdate.toDate()).format('DD-MM-YYYY')}</span><br />
                    </> : <></>
                }
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
            <input disabled={data.assign_flg || currentUser == null} className='driverButton' type='button' value='Save the Changes' onClick={() => update_lead_field(currentUser[0].uid, currentUser[0].name)} ></input>
            <button disabled={data.assign_flg} onClick={() => deletelead(data.TripId)}>delete</button>
            <button onClick={()=>reassign()}>Reset</button>
        </div>

    );
}

export default DriverComponents;
