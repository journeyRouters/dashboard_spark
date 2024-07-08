import { Modal } from '@material-ui/core';
import { collection, doc, getDoc, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import app from '../required';
import './TripComponent.css';

const SelfLeadgenrator = ({ open, setAddLead, userProfile, getLeadOnBoard }) => {
    const db = getFirestore(app);
    const animatedComponents = makeAnimated();
    const today = new Date();

    const [allUserProfile, setAllUserProfile] = useState([]);
    const [tripCounter, setTripCounter] = useState();
    const [clientType, setClientType] = useState('Direct');
    const [leadData, setLeadData] = useState({
        name: '',
        Contact_Number: '',
        Destination: '',
        Departure_City: '',
        Travel_Duration: '',
        Travel_date: '',
        Budget: '',
        pax: '',
        Child: '',
        Email: '',
    });
    const destinations = [
        { value: 'Thailand', label: 'Thailand' },
        { value: 'Bali', label: 'Bali' },
        { value: 'Dubai', label: 'Dubai' },
        { value: 'Kashmir', label: 'Kashmir' },
        { value: 'Himachal', label: 'Himachal' },
        { value: 'Kerala', label: 'Kerala' },
        { value: 'Andaman', label: 'Andaman' },
        { value: 'Maldives', label: 'Maldives' },
        { value: 'Goa', label: 'Goa' },
        { value: 'Rajasthan', label: 'Rajasthan' },
        { value: 'Singapore', label: 'Singapore' },
        { value: 'Vietnam', label: 'Vietnam' },
        { value: 'Europe', label: 'Europe' },
        { value: 'Northeast', label: 'Northeast' },
        { value: 'Ladakh', label: 'Ladakh' },
        { value: 'Turkey', label: 'Turkey' },
        { value: 'Baku', label: 'Baku' },
        { value: 'Almaty', label: 'Almaty' },
    ];
    const handleInputChange = (key, value) => {
        setLeadData((prev) => ({ ...prev, [key]: value }));
    };

    const isDataValid = () => {
        const { name, Contact_Number, Destination, Departure_City, Travel_Duration, Travel_date, Budget, pax, Child } = leadData;
        return (
            name && Contact_Number && Destination && Departure_City && Travel_Duration && Travel_date && Budget && pax && Child
        );
    };

    const getTripCounter = async () => {
        const tripRef = doc(db, 'Support', 'tripCount');
        try {
            const supportSnap = await getDoc(tripRef);
            if (supportSnap.exists()) {
                setTripCounter(supportSnap.data().tripCount);
            }
        } catch (e) {
            console.log(e);
        }
    };

   

    const getAllUserProfile = () => {
        const q = query(
            collection(db, 'Profile'),
            where('access_type', 'in', ['User', 'Team Leader', 'freelance']),
            where('user_type', '==', 'show')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const profiles = [];
            querySnapshot.forEach((doc) => {
                profiles.push(doc.data());
            });
            setAllUserProfile(profiles);
        });

        return () => unsubscribe();
    };

    const handleClose = () => {
        setAddLead(false);
    };

    useEffect(() => {
        if (open) {
            getAllUserProfile();
            getTripCounter();
        }
    }, [open]);

    const saveToOthers = (selectedUser) => {
        if (!selectedUser || !isDataValid()) {
            alert('Select a user and provide all required data');
            return;
        }
        uploadLeadBySpokes(selectedUser.uid, selectedUser.name);
        getLeadOnBoard();
        handleClose();
    };

    const filterDataFromProfile = (uid) => {
        if (uid === '0') {
            alert('Select any user or assign to self');
            return;
        }
        const profileOfUser = allUserProfile.find((data) => data.uid === uid);
        if (profileOfUser) {
            saveToOthers(profileOfUser);
        }
    };

    const updateTripCounter = async (counted) => {
        const tripRef = doc(db, 'Support', 'tripCount');
        await updateDoc(tripRef, { tripCount: counted });
    };

    const uploadLeadBySpokes = (assignedUid, assignedName) => {
        let countUpdater = tripCounter;
        const contactString = leadData.Contact_Number.toString();
        const last4 = contactString.slice(-4);
        const tripId = countUpdater + last4;

        if (isNaN(countUpdater)) {
            alert('Server Busy :(');
            return;
        }

        countUpdater = parseInt(countUpdater, 10) + 1;

        setDoc(doc(db, 'Trip', tripId), {
            TripId: tripId,
            Lead_Status: 'Hot',
            Campaign_code: clientType,
            Date_of_lead: today,
            Traveller_name: leadData.name,
            FlightBookedFlg: false,
            InstaId: 'Direct lead',
            Contact_Number: leadData.Contact_Number,
            Destination: leadData.Destination,
            Comment: 'none',
            Departure_City: leadData.Departure_City,
            Travel_Date: new Date(leadData.Travel_date),
            Travel_Duration: parseInt(leadData.Travel_Duration, 10),
            Budget: parseInt(leadData.Budget, 10),
            Pax: parseInt(leadData.pax, 10),
            Child: parseInt(leadData.Child, 10),
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
                uid: assignedUid,
                name: assignedName,
            },
            assigned_date_time: today,
            updated_last: null,
            assign_flg: true,
            final_package: null,
        });

        updateTripCounter(countUpdater);
    };

    const saveForSelf = () => {
        if (isDataValid()) {
            uploadLeadBySpokes(userProfile.uid, userProfile.name);
            getLeadOnBoard();
            handleClose();
        } else {
            alert('Please add sufficient data');
        }
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'grid', justifyContent: 'center', marginTop: '2rem', overflowY: 'scroll' }}>
            <div className='SelfLeadDiv'>
                <h3 style={{ marginLeft: '10rem' }}>SELF LEAD</h3>
                <div className='SelfLeadGenParentDiv'>
                    <div className='SelfLeadGenleftDiv'>
                        <p>Name </p>
                        <p>Contact </p>
                        <p>Email</p>
                        <p>Destination </p>
                        <p>Client Type</p>
                        <p>Departure City </p>
                        <p>Duration </p>
                        <p>Travel Date </p>
                        <p>Pax </p>
                        <p>Child </p>
                        <p>Budget </p>
                    </div>
                    <div className='SelfLeadGenleftDiv'>
                        {[0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map((data, index) => <p key={index}>:-</p>)}
                    </div>
                    <div className='SelfLeadGenRightDiv'>
                        <input className='required' onChange={(e) => handleInputChange('name', e.target.value)}></input>
                        <input className='required' type='number' onChange={(e) => handleInputChange('Contact_Number', e.target.value)}></input>
                        <input type='email' onChange={(e) => handleInputChange('Email', e.target.value)}></input>
                        <Select
                            placeholder='Destination'
                            className='required'
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={destinations}
                            onChange={(e) => handleInputChange('Destination', e.value)}
                        />
                        <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                            <option value='Premium'>Premium</option>
                            <option value='Converted'>Converted</option>
                            <option value='Repeated'>Repeated</option>
                            <option value='Direct'>Direct</option>
                        </select>
                        <input onChange={(e) => handleInputChange('Departure_City', e.target.value)}></input>
                        <input className='required' type='number' onChange={(e) => handleInputChange('Travel_Duration', e.target.value)}></input>
                        <input className='required' type='date' onChange={(e) => handleInputChange('Travel_date', e.target.value)}></input>
                        <input className='required' type='number' onChange={(e) => handleInputChange('pax', e.target.value)}></input>
                        <input className='required' type='number' onChange={(e) => handleInputChange('Child', e.target.value)}></input>
                        <input className='required' type='number' onChange={(e) => handleInputChange('Budget', e.target.value)}></input>
                    </div>
                </div>
                <div className='SelfLeadButtonDiv'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                        <span>Assign to</span>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)}>
                            <option value={0}>Select Spokes</option>
                            {allUserProfile.map((data, index) => (
                                <option key={index} value={data.uid}>{data.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button onClick={saveForSelf}>Save for Self</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SelfLeadgenrator;
