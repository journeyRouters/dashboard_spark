import { Modal } from '@material-ui/core';
import { collection, doc, getDoc, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import app from '../required';
import './TripComponent.css';

const SelfLeadgenrator = ({ open, onClose, userProfile, getLeadOnBoard }) => {
    const db = getFirestore(app);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        destination: '',
        clientType: 'Direct',
        departureCity: '',
        duration: '',
        travelDate: '',
        pax: '',
        child: '',
        budget: ''
    });
    const today = new Date();
    const [tripCounter, setTripCounter] = useState();
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
    const handleClose = () => {
        onClose(false);
    };
    useEffect(() => {
        if (open) {
            getTripCounter();
        }
    }, [open]);


    const updateTripCounter = async (counted) => {
        const tripRef = doc(db, 'Support', 'tripCount');
        await updateDoc(tripRef, { tripCount: counted });
    };

    const uploadLeadBySpokes = (assignedUid, assignedName) => {
        let countUpdater = tripCounter;
        const contactString = formData.contact
        const last4 = contactString.replace(/\s+/g, '').slice(-4);
        const tripId = countUpdater + last4;

        if (isNaN(countUpdater)) {
            alert('Server Busy :(');
            return;
        }

        countUpdater = parseInt(countUpdater) + 1;

        setDoc(doc(db, 'Trip', tripId), {
            TripId: tripId,
            Lead_Status: 'Hot',
            Campaign_code: formData.clientType,
            Date_of_lead: today,
            Traveller_name: formData.name,
            FlightBookedFlg: false,
            InstaId: 'Direct lead',
            Contact_Number: formData.contact,
            Destination: formData.destination,
            Comment: 'none',
            Potential: '',
            Departure_City: formData.departureCity,
            Travel_Date: new Date(formData.travelDate),
            Travel_Duration: parseInt(formData.duration),
            Budget: parseInt(formData.budget),
            Pax: parseInt(formData.pax),
            Child: parseInt(formData.child),
            Email: formData.email,
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
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(formData);
        saveForSelf()
    };
    const saveForSelf = () => {
        uploadLeadBySpokes(userProfile.uid, userProfile.name);
        getLeadOnBoard();
        handleClose();

    };

    return (
        <Modal open={open} onClose={handleClose} style={{ display: 'grid', justifyContent: 'center', marginTop: '2rem', overflowY: 'scroll' }}>
            <div className='SelfLeadDiv'>
                <form onSubmit={handleSubmit} className="selfLead-form-container">
                    <div>
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Contact:</label>
                        <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}  />
                    </div>
                    <div>
                        <label>Destination:</label>
                        <select name="destination" value={formData.destination} onChange={handleChange} required>
                            <option value="">Select Destination</option>
                            <option value={'Dubai'}>Dubai</option>
                            <option value={'Maldives'}>Maldives</option>
                            <option value={'Thailand'}>Thailand</option>
                            <option value={'Singapore'}>Singapore</option>
                            <option value={'Malaysia'}>Malaysia</option>
                            <option value={'Bali'}>Bali</option>
                            <option value={'Himachal'}>Himachal</option>
                            <option value={'Ladakh'}>Ladakh</option>
                            <option value={'Kerala'}>Kerala</option>
                            <option value={'Kashmir'}>Kashmir</option>
                            <option value={'Andaman'}>Andaman</option>
                            <option value={'Goa'}>Goa</option>
                            <option value={'Singapore'}>Singapore</option>
                            <option value={'Rajasthan'}>Rajasthan</option>
                            <option value={'Vietnam'}>Vietnam</option>
                            <option value={'Northeast'}>Northeast</option>
                            <option value={'Europe'}>Europe</option>
                            <option value={'Turkey'}>Turkey</option>
                            <option value={'Mauritius'}>Mauritius</option>
                            <option value={'Baku'}>Baku</option>
                            <option value={'Almaty'}>Almaty</option>
                            <option value={'Srilanka'}>Srilanka</option>
                        </select>
                    </div>
                    <div>
                        <label>Client Type:</label>
                        <select name="clientType" value={formData.clientType} onChange={handleChange} required>
                            <option value="">Select Client Type</option>
                            <option value='Premium'>Premium</option>
                            <option value='Converted'>Converted</option>
                            <option value='Repeated'>Repeated</option>
                            <option value='Direct'>Direct</option>
                        </select>
                    </div>
                    <div>
                        <label>Departure City:</label>
                        <input type="text" name="departureCity" value={formData.departureCity} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Duration (in days):</label>
                        <input type="number" name="duration" value={formData.duration} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Travel Date:</label>
                        <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Pax:</label>
                        <input type="number" name="pax" value={formData.pax} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Child:</label>
                        <input type="number" name="child" value={formData.child} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Budget:</label>
                        <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </Modal>
    );
};

export default SelfLeadgenrator;
