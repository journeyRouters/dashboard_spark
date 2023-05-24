import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
const db = getFirestore(app);

const IndividuaInvestigation = () => {
    const [AllUserprofile, setAllUserprofile] = useState([])
    const[Currentcaller,setCurrentcaller]=useState()

    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader"]), where('user_type', '==', 'show'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data().name)
            });
            setAllUserprofile(Profile)


        });
    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = AllUserprofile.filter((data) => data.uid === uid)
        setCurrentcaller(profile_of_user)
        // console.log(profile_of_user)

    }
    useEffect(() => {
        getAllUserProfie()
        return () => {
            
        };
    }, []);
    return (
        <div>
            <select onChange={(e) => filterDataFromProfile(e.target.value)} >
                <option value={0}> Select The user</option>
                {
                    AllUserprofile.map((data, index) => (
                        <option key={index} value={data.uid}>{data.name}</option>
                    ))
                }
            </select>
            <input type='month' ></input>
            <input type='month' ></input>

        </div>
    );
}

export default IndividuaInvestigation;
