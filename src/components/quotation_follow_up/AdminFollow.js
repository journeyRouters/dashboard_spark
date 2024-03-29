import { collection, getDocs, getFirestore, onSnapshot, orderBy, Query, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import FollowUp from './Follow_up';

const AdminFollow = ({}) => {
    const profile_ = JSON.parse(localStorage.getItem('profile'));
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [profile, setprofile] = useState(null)
    const [SearchKey, setSearchKey] = useState(0)
    const [input, setInput] = useState('')
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
    async function fetchTheSearch() {
        var q;
        switch (SearchKey) {
            case "Name": {
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where('Traveller_name', '>=', input),
                    where("Traveller_name", '<=', input + '\uf8ff'),
                )
                break;
            }
            case "Trip_id": {
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where("TripId", "==", input),
                    orderBy("Travel_Date")
                )
                break;
            }
            case "Contact_Number": {
                // console.log(typeof (input), parseInt(input), typeof (parseInt(input)))
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where("Contact_Number", "==", parseInt(input)),
                    orderBy("Travel_Date")
                )
                break;
            }
            case "Travel_date": {
                var before = new Date(input);
                before.setDate(before.getDate() - 1);
                // console.log(before)
                q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", "Converted"),
                    where("quotation_flg", "==", true),
                    where("Travel_Date", ">", before),
                    where("Travel_Date", "<=", new Date(input)),
                    orderBy("Travel_Date")
                )
                break;
            }
            default:
                q = null;

        }
        getQueryDatafromDatbase(q)


    }
    async function getQueryDatafromDatbase(q) {
        try {
            var querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length != 0) {
                let list = []
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                setLead_data(list)
                setInput('')
                setflg(true)

            }
        }
        catch (e) {
            console.log(e)
        }
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
    function reset() {
        setLead_data([])
        setflg(false)

    }

    return (
        <div>
            <div className='global_search'>
                <button onClick={() => reset()}>Refresh</button>
                <select name='search_type' id='firestore' className='option_selector' onChange={(e) => setSearchKey(e.target.value)}>
                    <option value={0}>select</option>
                    <option value="Name">Name</option>
                    <option value="Trip_id">TripId</option>
                    <option value="Contact_Number">Contact Number</option>
                    <option value="Travel_date">Travel Month</option>
                </select>
                <input placeholder='search your selection' type={SearchKey == 'Travel_date' ? "date" : String}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <input
                    className='global_search_button'
                    type="button"
                    value="Search "
                    onClick={() => fetchTheSearch()}
                ></input>
            </div>
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
                    <FollowUp auth={auth} profile={profile_} target={currentUser} data={lead_data} adminFlg={true} user={currentUser.uid}/>

                </> : <>
                    <div className='no_data'></div>
                    {/* <FollowUp auth={auth} profile={profile_} target={currentUser} data={lead_data} adminFlg={true} /> */}
                </>
            }
        </div>
    );
}

export default AdminFollow;
