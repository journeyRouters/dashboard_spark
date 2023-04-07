import React from 'react';
import '../../leadDriver/Driver.css'
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../../required';
import { useState } from 'react';
import { useEffect } from 'react';
const db = getFirestore(app);


const Createleadcomponent = ({ data, TeamProfile, getLeadOnBoard, index, overide, getLeadAfterEffect }) => {
    const [currentUser, setCurrentuser] = useState(null)
    var today = new Date()

    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = TeamProfile.filter((data) => data.value === uid)
        setCurrentuser(profile_of_user)

    }
    async function deletelead(tripid) {
        try {
            await deleteDoc(doc(db, "Trip", tripid));
            getLeadOnBoard()
        }
        catch (e) { console.log(e) }
    }
    async function reassign() {
        if (overide) {
            const Databaseref = doc(db, "Trip", data.TripId);
            await updateDoc(Databaseref, {
                "assign_flg": false,
            });
            getLeadAfterEffect(data.TripId)
        }
        else {

            const Databaseref = doc(db, "Trip", data.TripId);
            await updateDoc(Databaseref, {
                "assign_flg": false,
            });
            getLeadOnBoard()
        }
    }
    async function update_lead_field(uid, name) {
        /**this function is to update the assigned user in lead data for ref and to be identify */
        if (overide) {

            const Databaseref = doc(db, "Trip", data.TripId);
            await updateDoc(Databaseref, {
                "assign_to.uid": uid,
                "assign_to.name": name,
                "assign_flg": true,
                "assigned_date_time": today
            });
            getLeadAfterEffect(data.TripId)
        }
        else {
            const Databaseref = doc(db, "Trip", data.TripId);
            await updateDoc(Databaseref, {
                "assign_to.uid": uid,
                "assign_to.name": name,
                "assign_flg": true,
                "assigned_date_time": today
            });
            getLeadOnBoard()
        }
    }

    return (
        <div key={index} className={data.assign_flg ? 'Driver_components_' : 'Driver_components1'}>
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
                <span style={{ color: 'yellow', background: 'black' }}>Lead Status:- {data.Lead_Status}</span>
            </div>
            <div>
                {
                    data.assign_flg ? <span>assign To:-{data.assign_to.name}</span> : <></>
                }
                <br />
                <span>
                    <select disabled={data.assign_flg}>
                        <option value='cold'>change Lead Status</option>
                        <option value='cold'>cold</option>
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
                        TeamProfile.map((data, index) => (<>
                            {/* {console.log(data.Lead_Current)} */}
                            <option key={index} value={data.value}>{data.label}</option>

                        </>))
                    }
                </select>
            </div>
            <input disabled={data.assign_flg || currentUser == null} className='driverButton' type='button' value='Save the Changes' onClick={() => update_lead_field(currentUser[0].value, currentUser[0].label)} ></input>
            <button disabled={data.assign_flg} onClick={() => deletelead(data.TripId)}>delete</button>
            <button onClick={() => reassign()}>Reset</button>
        </div>

    );
}

export default Createleadcomponent;
