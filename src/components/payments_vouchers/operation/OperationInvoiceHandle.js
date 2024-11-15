import { Modal } from '@material-ui/core';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState, useRef } from 'react';
import '../../Accounts/Accounts.css';
import Maldivespdf from '../../MaldivesPdf/Maldivespdf.js';
import Profile from '../../Profile/Profile.js';
import '../../AdminController/Payment.css';
import PaymentsScreenShotUploader from '../../AdminController/PaymentsScreenShotUploader';
import app from '../../required';
import InvoicePdf from '../../invoice/invoicePdf.js';
import InstallmentsMapper from '../../Accounts/installmentsMapper.js';
import EditInvoice from '../../Accounts/EditInvoice.js';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

const db = getFirestore(app);

const OperationInvoiceHandle = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [invoice, setInvoice] = useState(null);
    const [leadData, setLeadData] = useState(null);
    const [isDataAvailable, setIsDataAvailable] = useState(false);
    const [finalPackage, setFinalPackage] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [isPackageOpen, setIsPackageOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState(false);

    const location = useLocation();
    const queryholder = new URLSearchParams(location.search);
    const tripId = queryholder.get('TripId');

    // Reference to keep track of whether component is mounted
    const isMounted = useRef(true);

    const toggleEditInvoiceModal = () => setIsEditInvoiceOpen(prev => !prev);
    const togglePackageModal = () => setIsPackageOpen(prev => !prev);
    const toggleInvoiceModal = () => setIsInvoiceOpen(prev => !prev);

    const fetchTripData = async (tripID) => {
        try {
            const tripQuery = query(
                collection(db, 'Trip'),
                where('Lead_Status', '==', 'Converted'),
                where('quotation_flg', '==', true),
                where('TripId', '==', tripID),
                orderBy('Travel_Date')
            );
            const querySnapshot = await getDocs(tripQuery);
            if (isMounted.current && !querySnapshot.empty) {
                const tripData = querySnapshot.docs[0].data();
                setLeadData(tripData);
                setIsDataAvailable(true);
            } else {
                setIsDataAvailable(false);
            }
        } catch (error) {
            console.error('Error fetching trip data:', error);
            if (isMounted.current) {
                setIsDataAvailable(false);
            }
        }
    };

    const fetchInvoiceData = async (tripId) => {
        try {
            const docRef = doc(db, 'invoice', tripId);
            const docSnap = await getDoc(docRef);
            if (isMounted.current && docSnap.exists()) {
                const invoiceData = docSnap.data();
                setInvoice(invoiceData);
                setInstallments(invoiceData.installment || []);
                setFinalPackage(invoiceData.selected_pdf_data);
            } else {
                console.warn('No invoice found for this TripId.');
            }
        } catch (error) {
            console.error('Error fetching invoice data:', error);
        }
    };

    const resetLeadStatus = async () => {
        try {
            await updateDoc(doc(db, 'Trip', leadData.TripId), { Lead_Status: 'Cold' });
           alert('Lead status reset successfully.');
        } catch (error) {
            console.error('Error resetting lead status:', error);
        }
    };

    const handleInstallmentChange = (event, index) => {
        const updatedInstallments = [...installments];
        updatedInstallments[index][event.target.name] = event.target.value;
        setInstallments(updatedInstallments);
    };

    useEffect(() => {
        if (tripId) {
            try {
                const parsedTripId = JSON.parse(decodeURIComponent(tripId));
                fetchTripData(parsedTripId);
                fetchInvoiceData(parsedTripId);
            } catch (error) {
                console.error('Failed to parse TripId:', error);
                setIsDataAvailable(false);
            }
        } else {
            setIsDataAvailable(false);
        }

        // Cleanup function to set isMounted to false on unmount
        return () => {
            isMounted.current = false;
        };
    }, [tripId]);

    return (
        <div>
            <Modal open={isPackageOpen} onClose={togglePackageModal} style={{ display: 'grid', justifyContent: 'center', marginTop: '4rem', overflowY: 'scroll' }}>
                {finalPackage ? <div>
                    {
                        finalPackage.travel_data.Destination == 'Maldives' ? <>
                            {/* <h1 className='glow'>wait dev in progress</h1> */}
                            <Maldivespdf
                                data={finalPackage.travel_data}
                                no_rooms={finalPackage.no_rooms}
                                selected_Travel_date={finalPackage.selected_Travel_date}
                                MealPlan={finalPackage.MealPlan}
                                Transfer={finalPackage.Transfer}
                                NightDataFields={finalPackage.NightDataFields}
                                count_days={finalPackage.count_days}
                                flightcost={finalPackage.flightcost}
                                visacost={finalPackage.visacost}
                                landPackage={finalPackage.landPackage}
                                SelectedpackageType={finalPackage.SelectedpackageType}
                                Property={finalPackage.Property}
                                flightsLinkfromstorage={finalPackage.flightImgLinks}
                                inclusionLinkfromstorage={finalPackage.inclusionLinks}
                                flightFlg={finalPackage.flightImgLinks ? true : false}
                                inclusionImgFlg={finalPackage.inclusionLinks ? true : false}
                                Pax={finalPackage.travel_data.Pax}
                                Child={finalPackage.travel_data.Child}
                                inclusion_data={finalPackage.inclusion_data}
                                profile={profile}
                                indicator={false}

                            />
                        </> : <>
                            <Profile
                                indicator={true}
                                inclusion_data={finalPackage.inclusion_data}
                                travel_data={finalPackage.travel_data}
                                count_days={finalPackage.count_days}
                                cabDetailsData={finalPackage.cabDetailsData}
                                flights={finalPackage.flights}
                                SelectedpackageType={finalPackage.SelectedpackageType}
                                itineary={finalPackage.itineary}
                                NightDataFields={finalPackage.NightDataFields}
                                selected_Travel_date={finalPackage.selected_Travel_date}
                                flightcost={finalPackage.flightcost}
                                visacost={finalPackage.visacost}
                                profile={profile}
                                flight={true}
                                flightsLinkfromstorage={finalPackage.flightsImagesLinks}
                                landPackage={finalPackage.landPackage}
                            />
                        </>
                    }
                </div> : (
                    <div style={{ background: 'white', borderRadius: '32px', height: '141px' }}>
                        <h1>No invoiced PDF available</h1>
                        <h1>Report is updated to Admin</h1>
                    </div>
                )}
            </Modal>

            <Modal open={isInvoiceOpen} onClose={toggleInvoiceModal} style={{ display: 'grid', justifyContent: 'center', marginTop: '4rem', overflowY: 'scroll' }}>
                {invoice ? (
                    <InvoicePdf {...invoice} hint={false} />
                ) : (
                    <div style={{ background: 'white', borderRadius: '32px', height: '141px' }}>
                        <h1>No invoice available</h1>
                        <h1>Report is updated to Admin</h1>
                    </div>
                )}
            </Modal>

            {isDataAvailable ? (
                <>
                    <div className='basic_details_PaymentsPage'>
                        <div className='personal_details'>
                            <div className='TripId'>{leadData.TripId}</div>
                            <p>Name: {leadData.Traveller_name}</p>
                            <p>Contact: {leadData.Contact_Number}</p>
                            <p>Email: {leadData.Email}</p>
                            <p>Converted by: {leadData.assign_to.name}</p>
                        </div>
                        <div className='personal_details'>
                            <p>Package: {leadData.Departure_City} ---- {leadData.Destination}</p>
                            <p>Travel Duration: {leadData.Travel_Duration} Night(s)</p>
                            <p>Travel date: {moment(leadData.Travel_Date.toDate()).format('DD-MM-YYYY')}</p>
                            <p>Budget: {leadData.Budget}</p>
                        </div>
                    </div>

                    <PaymentsScreenShotUploader data={leadData} />

                    <div className='PaymentButtonDiv'>
                        <button className='PaymentsButton' onClick={togglePackageModal}>Final Package</button>
                        <button className='PaymentsButton' onClick={toggleInvoiceModal}>Invoice</button>
                        <button className='PaymentsButton' onDoubleClick={resetLeadStatus}>Reset to Edit</button>
                        <button className='PaymentsButton' onClick={toggleEditInvoiceModal}>Invoice Editor</button>
                    </div>

                    {isEditInvoiceOpen && (
                        <Modal open={isEditInvoiceOpen} onClose={toggleEditInvoiceModal} style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                            <EditInvoice installments={installments} TripId={leadData.TripId} profile={profile} closeInvoiceModal={toggleEditInvoiceModal} />
                        </Modal>
                    )}

                    <div className='paymentsConfirmer'>
                        <InstallmentsMapper profile={profile} data={installments} Email={invoice?.selected_pdf_data?.travel_data?.Email} handleInstallments={handleInstallmentChange} TripId={leadData.TripId} />
                    </div>
                </>
            ) : (
                <>Loading.....</>
            )}
        </div>
    );
};

export default OperationInvoiceHandle;
