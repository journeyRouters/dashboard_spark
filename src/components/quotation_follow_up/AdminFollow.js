import { collection, getDocs, getFirestore, onSnapshot, orderBy, Query, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import FollowUp from './Follow_up';

const AdminFollow = ({ auth, profile: profile_ }) => {
    const [profile, setprofile] = useState(null)
    const [currentUser, setCurrentuser] = useState(null)
    const db = getFirestore(app);
    const [flg, setflg] = useState(false)
    const [lead_data, setLead_data] = useState([])

    useEffect(() => {
        const q = query(collection(db, "Profile"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data())
            });
            setprofile(Profile)
            // console.log(Profile,);
        });
        return () => unsubscribe()

    }, []);
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        setflg(false)
        var profile_of_user = profile.filter((data) => data.uid === uid)
        // console.log(profile_of_user[0].uid)
        setCurrentuser(profile_of_user[0])

    }
    function updateCurrentUser() {
        getLeadOnBoard()
    }
    async function getLeadOnBoard() {
        // console.log(props.target.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", currentUser.uid),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true), orderBy("Lead_Status")
                , orderBy("Lead_status_change_date"));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                // setopen(false)
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                // console.log(list);
                // setopen(false)
                setflg(true)
            }
        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
        }

    }

    return (
        <div>
            <div>
                {
                    profile ? <>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)}>
                            <option value={0}> assign to</option>
                            {
                                profile.map((data, index) => (<>
                                    {/* {console.log(data.Lead_Current)} */}
                                    <option key={index} value={data.uid}>{data.name}</option>

                                </>))
                            }
                        </select>
                        <button onClick={() => updateCurrentUser()}>Search</button>
                    </> : <></>
                }
            </div>
            {
                flg ? <>
                    <FollowUp auth={auth} profile={profile_} target={currentUser} data={lead_data} adminFlg={true} />

                </> : <>
                <div className='no_data'></div>
                    {/* <FollowUp auth={auth} profile={profile_} target={currentUser} data={lead_data} adminFlg={true} /> */}
                </>
            }
        </div>
    );
}

export default AdminFollow;
