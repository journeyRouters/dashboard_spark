import React, { useEffect, useState } from 'react';
import { CircularProgress, Modal } from '@material-ui/core';
import './TripComponent.css';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import app from '../required';
import objectHash from 'object-hash';
import moment from 'moment';
const SelfLeadgenrator = ({ open, setAddLead, userProfile, getLeadOnBoard }) => {
    const db = getFirestore(app);
    var today = new Date()
    const [AllUserprofile, setAllUserprofile] = useState([])
    const [TripCounter, setTripCount] = useState()
    const [Hash, setHash] = useState()
    const [currentUser, setCurrentuser] = useState(undefined)
    var leadData = {
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
    const animatedComponents = makeAnimated();
    const Destinations = [
        { value: 'Thailand', label: 'Thailand', color: '#00B8D9' },
        { value: 'Bali', label: 'Bali', color: '#0052CC' },
        { value: 'Dubai', label: 'Dubai', color: '#5243AA' },
        { value: 'Kashmir', label: 'Kashmir', color: '#666666' },
        { value: 'Himachal', label: 'Himachal', color: '#666666' },
        { value: 'Kerala', label: 'Kerala', color: '#666666' },
        { value: "Andaman", label: "Andaman", color: '666666' },
        { value: 'Maldives', label: 'Maldives', color: '666666' }
    ];
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "==", "User"));
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
        // console.log(leadData.Checker())
        // console.log(leadData)
    }
    useEffect(() => {
        getAllUserProfie()
        getTripCounter()
        getHashTable()
    }, []);
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        if(uid==0){
            alert('Select any user/assign to self')
        }
        else{
        var profile_of_user = AllUserprofile.filter((data) => data.uid === uid)
        setCurrentuser(profile_of_user[0])
        // console.log(profile_of_user[0])
        }
    }
    async function getHashTable() {
        const TripRef = doc(db, "Support", "Hash");
        let SupportSnap;
        try {
            SupportSnap = await getDoc(TripRef);
        }
        catch (e) { console.log(e) }
        if (SupportSnap.exists()) {
            setHash(SupportSnap.data().hash)
            // console.log(SupportSnap.data().hash,Object.keys(SupportSnap.data().hash).length)


        }
    }
    async function updateTripCounter(counted) {
        const TripRef = doc(db, "Support", "tripCount");
        await updateDoc(TripRef, {
            tripCount: counted
        });

    }
    async function updateHash(json) {
        // console.log(json)
        const TripRef = doc(db, "Support", "Hash");
        // console.log(Object.keys(json).length)
        await updateDoc(TripRef, {
            hash: json
        }, { merge: true });

    }
    function uploadLeadBySpokes(assigned_uid, assigned_name) {
        let countUpdater = TripCounter
        let TripHash = objectHash({ foo: leadData.name + leadData.Contact_Number + today })
        let contactString = leadData.Contact_Number + ''
        let last4 = contactString.slice(contactString.length - 4)
        let tripid = countUpdater + '' + last4
        countUpdater = countUpdater + 1
        let HashTable = Hash
        // console.log(TripHash)
        try {
            HashTable[`${tripid}`] = TripHash
        }
        catch (e) { console.log(e) }
        setDoc(doc(db, "Trip", tripid), {
            TripId: tripid,
            Lead_Status: 'Hot',
            Campaign_code: 'Direct',
            Date_of_lead: today,
            Traveller_name: leadData.name,
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
            transfer_request: false,
            transfer_request_reason: [],
            assign_to: {
                uid: assigned_uid,
                name: assigned_name
            },
            updated_last: null,
            assign_flg: true,
            final_package: null
        });
        updateTripCounter(countUpdater)
        updateHash(HashTable)
    }
    function saveForSelf() {
        if (leadData.Checker()) {
            alert('please add sufficient data')
            // console.log(leadData)
        }
        else {
            uploadLeadBySpokes(userProfile.uid, userProfile.name)
            getLeadOnBoard()
            onclose()
        }
    }
    function saveToOthers(){
        if (typeof currentUser === 'undefined'||leadData.Checker()){
            alert('select spokes/ insufficient data')
        }
        else{
            uploadLeadBySpokes(currentUser.uid, currentUser.name)
            getLeadOnBoard()
            onclose()
        }
    }
    return (
        <Modal open={open} onClose={onclose} style={{ display: "grid", justifyContent: "center", marginTop: "2rem", overflowY: 'scroll' }}>

            <div className='SelfLeadDiv'>
                <h3 style={{marginLeft:'10rem'}}>SELF LEAD</h3>
                <div className='SelfLeadGenParentDiv'>
                    <div className='SelfLeadGenleftDiv'>
                        <p>Name </p>
                        <p>Contact </p>
                        <p>Email</p>
                        <p>Destination </p>
                        <p>Departure_City </p>
                        <p>Duration </p>
                        <p>Travel_Date </p>
                        <p>Pax </p>
                        <p>Child </p>
                        <p>Budget </p>
                    </div>
                    <div className='SelfLeadGenleftDiv'>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                        <p>:-</p>
                    </div>
                    <div className='SelfLeadGenRightDiv'>
                        <input className='required' onChange={(e) => leadData.Assigner('name', e.target.value)}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Contact_Number', e.target.value)} ></input>
                        <input onChange={(e) => leadData.Assigner('Email', e.target.value)}></input>
                        <Select
                            placeholder='Destination'
                            className='required'
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={Destinations}
                            onChange={(e) => leadData.Assigner('Destination', e.value)}
                        />
                        <input onChange={(e) => leadData.Assigner('Departure_City', e.target.value)}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Travel_Duration', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Travel_date', e.target.value)} type={'date'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Pax', e.target.value)} type={'number'}></input>
                        <input onChange={(e) => leadData.Assigner('Child', e.target.value)} type={'number'}></input>
                        <input onChange={(e) => leadData.Assigner('Budget', e.target.value)} type={'number'}></input>
                    </div>
                </div>
                <div className='SelfLeadButtonDiv'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                        <span>Assign to
                        </span>
                        <select onChange={(e)=>filterDataFromProfile(e.target.value)}>
                            <option value={0}>Select Spokes</option>
                            {
                                AllUserprofile.map((data, index) => (
                                    <option key={index} value={data.uid} >{data.name}</option>
                                ))
                            }
                        </select>
                        <button onClick={()=>saveToOthers()}>save</button>
                    </div>
                    <div>
                        <button onClick={()=>saveForSelf()}>save for Self</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default SelfLeadgenrator;