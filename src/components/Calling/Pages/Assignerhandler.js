import { collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import './Page.css'
const Assignerhandler = () => {
    const [profile, setprofile] = useState([])
    const [currentUser, setCurrentuser] = useState(null)
    const [SelectedDate, setSelectedDate] = useState(null)
    const db = getFirestore(app);
    useEffect(() => {
        GetCallerProfile()
    }, []);
    function GetCallerProfile() {
        const q = query(collection(db, "Profile"), where("access_type", "==", "Caller"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
            });
            setprofile(Profile)
        });
    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = profile.filter((data) => data.uid === uid)
        setCurrentuser(profile_of_user)
        console.log(profile_of_user)

    }
    function handleSelectedDate(date) {
        setSelectedDate(date)
    }
    async function allTripUnderDateSelection() {
        try {
            var DayBefore = new Date(SelectedDate);
            DayBefore.setDate(DayBefore.getDate() - 1);
            var DayAfter = new Date(SelectedDate)
            DayAfter.setDate(DayAfter.getDate() + 1);
            // console.log(DayAfter, DayBefore)
            // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const q = query(collection(db, "Trip"),
                where("Lead_Status", "==", "Dump"),
                where("updated_last", ">", DayBefore),
                where("updated_last", "<", DayAfter),
            )
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                AssignLeadToCaller(doc.id)
            });
        }
        catch (error) { console.log(error) }
    }

    async function AssignLeadToCaller(id) {
        console.log(id)
        setDoc(doc(db, "Trip", id), {
            callingLastUpdate: new Date(),
            caller: {
                name: currentUser[0].name,
                uid: currentUser[0].uid
            }
        }, { merge: true })
    }

    return (
        <div className='container'>
            <div>
                <span>Assign to:-</span>
                <select onChange={(e) => filterDataFromProfile(e.target.value)}>
                    <option value={0}> assign to</option>
                    {
                        profile.map((data, index) => (<>
                            <option key={index} value={data.uid}>{data.name}</option>
                        </>))
                    }
                </select>
            </div>
            <div>
                <input type={"date"} onChange={(event) => handleSelectedDate(event.target.value)}></input>
                <button onClick={() => allTripUnderDateSelection()}>Apply</button>
            </div>
        </div>
    );
}

export default Assignerhandler;
