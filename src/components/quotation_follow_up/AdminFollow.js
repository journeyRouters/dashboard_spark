import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import FollowUp from './Follow_up';

const AdminFollow = ({ auth, profile: profile_ }) => {
    const [profile, setprofile] = useState(null)
    const [currentUser, setCurrentuser] = useState(null)
    const db = getFirestore(app);
    const [flg, setflg] = useState(true)

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
        var profile_of_user = profile.filter((data) => data.uid === uid)
        console.log(profile_of_user)
        setCurrentuser(profile_of_user[0])

    }
    function updateCurrentUser() {
        setflg(!flg)
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
                flg ?
                    <FollowUp auth={auth} profile={profile_} target={currentUser} />
                    :
                    <FollowUp auth={auth} profile={profile_} target={currentUser} />

            }
        </div>
    );
}

export default AdminFollow;
