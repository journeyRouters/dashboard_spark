import { Modal, Select } from '@material-ui/core';
import { collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import './Page.css';
import StreamData from '../StreamCount/StreamData';
const Assignerhandler = () => {
    const [profile, setprofile] = useState([])
    const [currentcaller, setCurrentcaller] = useState(null)
    const [SelectedDate, setSelectedDate] = useState(null)
    const [AllSalePerson, setAllSalePerson] = useState([])
    const [salesPerson, setsalesPerson] = useState(null)
    const [startDate, setstartDate] = useState(null)
    const [endDate, setendDate] = useState(null)
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const [Status, setStatus] = useState(null)

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
        setCurrentcaller(profile_of_user)
        // console.log(profile_of_user)

    }
    function salesWhichLeadIsTOBeAssign(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = AllSalePerson.filter((data) => data.uid === uid)
        setsalesPerson(profile_of_user)
        // console.log(profile_of_user)

    }
    function handleRangeDate(args, flg) {
        if (flg == 'start') {
            setstartDate(args)
        }
        if (flg == 'end') {
            setendDate(args)
        }

    }
    function handleSelectedDate(date) {
        setSelectedDate(date)
    }
    async function allTripUnderDateSelection() {
        if (SelectedDate == null) {
            alert('No Date is Selected')
        }
        else {
            try {
                var DayBefore = new Date(SelectedDate);
                DayBefore.setDate(DayBefore.getDate() - 1);
                var DayAfter = new Date(SelectedDate)
                DayAfter.setDate(DayAfter.getDate() + 1);
                // console.log(DayAfter, DayBefore)
                // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", Status),
                    where("updated_last", ">", DayBefore),
                    where("updated_last", "<", DayAfter),
                )
                const querySnapshot = await getDocs(q);
                if (querySnapshot.docs.length == 0) {
                    alert('no data found')
                    setdataAvailablityFlg(false)

                }
                else {
                    querySnapshot.forEach((doc) => {
                        // console.log(doc.data())
                        AssignLeadToCaller(doc.id)
                        setdataAvailablityFlg(false)
                    });
                }
            }
            catch (error) {
                setdataAvailablityFlg(false)
                console.log(error)
                alert('no lead is found/assign  on this selection')
            }
        }
    }
    async function allTripWithinDateRange() {
        if (startDate == null || endDate == null) {
            alert('Selecte Date Range')
        }
        else {
            try {
                // console.log(DayAfter, DayBefore)
                // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const q = query(collection(db, "Trip"),
                    where("Lead_Status", "==", Status),
                    where("updated_last", ">", new Date(startDate)),
                    where("updated_last", "<", new Date(endDate)),
                )
                const querySnapshot = await getDocs(q);
                if (querySnapshot.docs.length == 0) {
                    alert('no data found')
                    setdataAvailablityFlg(false)

                }
                else {
                    querySnapshot.forEach((doc) => {
                        // console.log(doc.data())                        
                        AssignLeadToCaller(doc.id)
                        setdataAvailablityFlg(false)

                    });
                }
            }
            catch (error) {
                setdataAvailablityFlg(false)
                console.log(error)
                alert('no lead is found/assign  on this selection')


            }
        }
    }
    async function allTripWithinDateRangeWithSpecificSalesPerson() {
        if (startDate == null || endDate == null || salesPerson == null) {
            alert('Selecte Date Range/ sales Person')
        }
        else {
            try {
                // console.log(DayAfter, DayBefore)
                // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                const q = query(collection(db, "Trip"),
                    where('assign_to.uid', '==', salesPerson[0].uid),
                    where("Lead_Status", "==", Status),
                    where("updated_last", ">", new Date(startDate)),
                    where("updated_last", "<", new Date(endDate)),
                )
                const querySnapshot = await getDocs(q);
                if (querySnapshot.docs.length == 0) {
                    alert('no data found')
                    setdataAvailablityFlg(false)

                }
                else {
                    querySnapshot.forEach((doc) => {
                        // console.log(doc.data())
                        AssignLeadToCaller(doc.id)
                        setdataAvailablityFlg(false)

                    });
                }
            }
            catch (error) {
                setdataAvailablityFlg(false)
                console.log(error)
                alert('no lead is found/assign  on this selection')
            }

        }
    }

    async function AssignLeadToCaller(id) {
        // console.log(id)
        setDoc(doc(db, "Trip", id), {
            callingLastUpdate: new Date(),
            caller: {
                name: currentcaller[0].name,
                uid: currentcaller[0].uid
            },
            callingStatus: ''
        }, { merge: true })
    }
    function ControllApplyer(clickControl) {
        setdataAvailablityFlg(true)

        if (currentcaller == null) {
            alert('No Caller Is selected')
            setdataAvailablityFlg(false)
        }
        else if (clickControl == 1) {
            allTripUnderDateSelection()
        }
        else if (clickControl == 2) {
            allTripWithinDateRange()
        }
        else if (clickControl == 3) {
            allTripWithinDateRangeWithSpecificSalesPerson()
        }
    }
    function handldeStatusController(value) {
        // console.log(value.target.value)
        setStatus(value.target.value)
    }
    useEffect(() => {
        const q = query(collection(db, "Profile"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
            });
            setAllSalePerson(Profile)
            // console.log(Profile,);
        });
        return () => unsubscribe()

    }, []);

    return (<>
        <div className='container'>
            <StreamData />
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
            <div className='assignerBox'>
                <span>Assign By Date</span>
                <select onChange={(e) => handldeStatusController(e)}>
                    <option value={null}>Choose Status</option>
                    <option value={'Dump'}>Dump</option>
                    <option value={'Cold'}>Cold</option>
                </select>
                <input type={"date"} onChange={(event) => handleSelectedDate(event.target.value)}></input>
                <button onClick={() => ControllApplyer(1)}>Apply</button>
            </div>
            <div className='assignerBox'>
                <span>Assign By Date range</span>
                <select onChange={(e) => handldeStatusController(e)}>
                    <option value={null}>Choose Status</option>
                    <option value={'Dump'}>Dump</option>
                    <option value={'Cold'}>Cold</option>
                </select>
                <label>
                    FROM
                    <input type={"date"} onChange={(event) => handleRangeDate(event.target.value, 'start')}></input>
                </label>
                <label>
                    TO
                    <input type={"date"} onChange={(event) => handleRangeDate(event.target.value, 'end')}></input>
                </label>
                <button onClick={() => ControllApplyer(2)}>Apply</button>
            </div>
            <div className='assignerBox'>
                <span>Assign By Date range and sales  </span>
                <select onChange={(e) => handldeStatusController(e)}>
                    <option value={null}>Choose Status</option>
                    <option value={'Dump'}>Dump</option>
                    <option value={'Cold'}>Cold</option>
                </select>
                <select onChange={(e) => salesWhichLeadIsTOBeAssign(e.target.value)}>
                    <option value={0}> Dumped By</option>
                    {
                        AllSalePerson.map((data, index) => (<>
                            {/* {console.log(data.Lead_Current)} */}
                            <option key={index} value={data.uid}>{data.name}</option>

                        </>))
                    }
                </select>
                <label>
                    FROM
                    <input type={"date"} onChange={(event) => handleRangeDate(event.target.value, 'start')}></input>
                </label>
                <label>
                    TO
                    <input type={"date"} onChange={(event) => handleRangeDate(event.target.value, 'end')}></input>
                </label>
                <button onClick={() => ControllApplyer(3)}>Apply</button>
            </div>
        </div>
        <Modal open={dataAvailablityFlg} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
            <>
                <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
            </>
        </Modal>
    </>
    );
}

export default Assignerhandler;
