import { Modal } from '@material-ui/core';
import { collection, doc, getDoc, getFirestore, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import app from '../required';
import './TripComponent.css';
const SelfLeadgenrator = ({ open, setAddLead, userProfile, getLeadOnBoard }) => {
    const db = getFirestore(app);
    const animatedComponents = makeAnimated();
    var today = new Date()
    const [AllUserprofile, setAllUserprofile] = useState([])
    const [TripCounter, setTripCount] = useState()
    const [ClientType, setClientType] = useState('Direct')
    // const [Hash, setHash] = useState()
    const [currentUser, setCurrentuser] = useState(undefined)
    const leadData = {
        name: null,
        Contact_Number: null,
        Destination: null,
        Departure_City: null,
        Travel_Duration: null,
        Travel_date: null,
        Budget: null,
        pax: null,
        Child: null,
        Email: null,
        Assigner: function (key, value) {
            switch (key) {
                case 'name':
                    this.name = value
                    break
                case 'Contact_Number':
                    this.Contact_Number = value
                    break
                case 'Destination':
                    this.Destination = value
                    break
                case 'Departure_City':
                    this.Departure_City = value
                    break
                case 'Travel_Duration':
                    this.Travel_Duration = value
                    break
                case 'Budget':
                    this.Budget = value
                    break
                case 'Pax':
                    this.pax = value
                    break
                case 'Child':
                    this.Child = value
                    break
                case 'Travel_date':
                    this.Travel_date = value
                    break
                case 'Email':
                    this.Email = value
                    break
                default:
                    console.log('no match')
            }

        },
        Checker: function () {
            if (this.name == null ||
                this.Destination == null ||
                this.Travel_Duration == null ||
                this.Contact_Number == null ||
                this.pax == null ||
                this.Travel_date == null
            ) { return true }
            return false
        }
    }
    async function getTripCounter() {
        const TripRef = doc(db, "Support", "tripCount");
        let SupportSnap;
        try {
            SupportSnap = await getDoc(TripRef);
        }
        catch (e) { console.log(e) }
        if (SupportSnap.exists()) {
            setTripCount(SupportSnap.data().tripCount)

            // console.log(SupportSnap.data().tripCount)

        }
    }

    const Destinations = [
        { value: 'Thailand', label: 'Thailand', color: '#00B8D9' },
        { value: 'Bali', label: 'Bali', color: '#0052CC' },
        { value: 'Dubai', label: 'Dubai', color: '#5243AA' },
        { value: 'Kashmir', label: 'Kashmir', color: '#666666' },
        { value: 'Himachal', label: 'Himachal', color: '#666666' },
        { value: 'Kerala', label: 'Kerala', color: '#666666' },
        { value: "Andaman", label: "Andaman", color: '#666666' },
        { value: 'Maldives', label: 'Maldives', color: '#666666' },
        { value: 'Goa', label: 'Goa', color: '#666666' },
        { value: 'Rajasthan', label: 'Rajasthan', color: '#666666' },
        { value: 'Singapore', label: 'Singapore', color: '#666666' },
        { value: 'Veitnam', label: 'Veitnam', color: '#5243AA' },
        { value: 'Europe', label: 'Europe', color: '#5243AA' },
        { value: 'Northeast', label: 'Northeast', color: '#5243AA' },
        { value: 'Ladakh', label: 'Ladakh', color: '#666666' },
        { value: 'Turkey', label: 'Turkey', color: '#666666' },

    ];
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"),
            // where("access_type", "==", "User")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data().name)
            });
            setAllUserprofile(Profile)
            // console.log(Profile,);


        });
    }
    function onclose() {
        setAddLead(false)
    }
    useEffect(() => {
        getAllUserProfie()
        getTripCounter()
    }, [open]);
    function saveToOthers(currentUser) {
        if (typeof currentUser === 'undefined' || leadData.Checker()) {
            alert('select spokes/ insufficient data')
        }
        else {
            uploadLeadBySpokes(currentUser.uid, currentUser.name)
            getLeadOnBoard()
            onclose()
        }
    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        if (uid == 0) {
            alert('Select any user/assign to self')
        }
        else {
            var profile_of_user = AllUserprofile.filter((data) => data.uid === uid)
            // console.log(leadData)
            // setCurrentuser(profile_of_user[0])
            saveToOthers(profile_of_user[0])
            // console.log(leadData)
        }
    }

    async function updateTripCounter(counted) {
        // console.log(counted)

        const TripRef = doc(db, "Support", "tripCount");
        await updateDoc(TripRef, {
            tripCount: counted
        });

    }
    function uploadLeadBySpokes(assigned_uid, assigned_name) {
        let countUpdater = TripCounter
        let contactString = leadData.Contact_Number + ''
        let last4 = contactString.slice(contactString.length - 4)
        let tripid = countUpdater + '' + last4
        // console.log(countUpdater + tripid)        
        if (countUpdater == 'Nan') {
            alert('server Busy :(')
            return
        }
        else {

            countUpdater = parseInt(countUpdater) + 1
            setDoc(doc(db, "Trip", tripid), {
                TripId: tripid,
                Lead_Status: 'Hot',
                Campaign_code: ClientType,
                Date_of_lead: today,
                Traveller_name: leadData.name,
                FlightBookedFlg: false,
                InstaId: 'Direct lead',
                Contact_Number: leadData.Contact_Number,
                Destination: leadData.Destination,
                Comment: 'none',
                Departure_City: leadData.Departure_City,
                Travel_Date: new Date(leadData.Travel_date),
                Travel_Duration: parseInt(leadData.Travel_Duration),
                Budget: parseInt(leadData.Budget),
                Pax: parseInt(leadData.pax),
                Child: parseInt(leadData.Child),
                Email: leadData.Email,
                Remark: 'none',
                Lead_genrate_date: today,
                uploaded_by: userProfile.email,
                Quoted_by: null,
                uploaded_date: moment(today).format('YYYY-MM-DD'),
                uploaded_time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`,
                quotation: 0,
                quotation_flg: false,
                month: '',
                Lead_status_change_date: null,
                comments: [],
                Vouchers_flight: [],
                Vouchers_hotels: [],
                Vouchers_others: [],
                vouchers_idproof: [],
                PaymentScreenshots_flight: [],
                PaymentScreenshots_hotels: [],
                PaymentScreenshots_others: [],
                transfer_request: false,
                transfer_request_reason: [],
                assign_to: {
                    uid: assigned_uid,
                    name: assigned_name
                },
                assigned_date_time: today,
                updated_last: null,
                assign_flg: true,
                final_package: null
            });
            updateTripCounter(countUpdater)
        }

    }
    function ClientTypeController(value) {
        setClientType(value)
    }
    function saveForSelf() {
        if (leadData.Checker()) {
            alert('please add sufficient data')
        }
        else {
            uploadLeadBySpokes(userProfile.uid, userProfile.name)
            getLeadOnBoard()
            onclose()
        }
    }

    return (
        <Modal open={open} onClose={onclose} style={{ display: "grid", justifyContent: "center", marginTop: "2rem", overflowY: 'scroll' }}>

            <div className='SelfLeadDiv'>
                <h3 style={{ marginLeft: '10rem' }}>SELF LEAD</h3>
                <div className='SelfLeadGenParentDiv'>
                    <div className='SelfLeadGenleftDiv'>
                        <p>Name </p>
                        <p>Contact </p>
                        <p>Email</p>
                        <p>Destination </p>
                        <p>Client Type</p>
                        <p>Departure_City </p>
                        <p>Duration </p>
                        <p>Travel_Date </p>
                        <p>Pax </p>
                        <p>Child </p>
                        <p>Budget </p>
                    </div>
                    <div className='SelfLeadGenleftDiv'>
                        {
                            [0, 1, 2, 3, 4, 5, 7, 8, 9, 10,11].map((data, index) => <p key={index}>:-</p>)
                        }

                    </div>
                    <div className='SelfLeadGenRightDiv'>
                        <input className='required' onChange={(e) => leadData.Assigner('name', e.target.value)}></input>
                        <input className='required' type='number' onChange={(e) => leadData.Assigner('Contact_Number', e.target.value)} ></input>
                        <input type='email' onChange={(e) => leadData.Assigner('Email', e.target.value)}></input>
                        <Select
                            placeholder='Destination'
                            className='required'
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={Destinations}
                            onChange={(e) => leadData.Assigner('Destination', e.value)}
                        />
                        <select value={ClientType} onChange={(e) => ClientTypeController(e.target.value)}>
                            <option value='Premium'>Premium</option>
                            <option value='Converted'>Converted</option>
                            <option value='Repeated'>Repeated</option>
                            <option value='Direct'>Direct</option>
                        </select>
                        <input onChange={(e) => leadData.Assigner('Departure_City', e.target.value)}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Travel_Duration', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Travel_date', e.target.value)} type={'date'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Pax', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Child', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Budget', e.target.value)} type={'number'}></input>
                    </div>
                </div>
                <div className='SelfLeadButtonDiv'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                        <span>Assign to
                        </span>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)}>
                            <option value={0}>Select Spokes</option>
                            {
                                AllUserprofile.map((data, index) => (
                                    <option key={index} value={data.uid} >{data.name}</option>
                                ))
                            }
                        </select>
                        {/* <button onClick={()=>saveToOthers()}>save</button> */}
                    </div>
                    <div>
                        <button onClick={() => saveForSelf()}>save for Self</button>
                    </div>
                </div>
            </div>
        </Modal>
    );

}


export default SelfLeadgenrator;
