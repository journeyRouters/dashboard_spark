import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import InstallmentsMapper from '../../../Accounts/installmentsMapper';
import EditInvoice from '../../../Accounts/EditInvoice';
import InvoicePdf from '../../../invoice/invoicePdf';
import Profile from '../../../Profile/Profile';
import Maldivespdf from '../../../MaldivesPdf/Maldivespdf';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import app from '../../../required';

function Installmentmapper({ Data }) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const db = getFirestore(app);
    const [invoice, setInvoice] = useState(null);
    const [installment, setInstallment] = useState(null);
    const [details, setDetails] = useState(false);
    const [editInvoiceFlg, setEditInvoiceFlg] = useState(false);
    const [finalPackage, setFinalPackage] = useState(null);
    const [invoiceOpener, setInvoiceOpener] = useState(false);
    const [packageOpener, setPackageOpener] = useState(false);

    async function getInvoice() {
        try {
            const docRef = doc(db, "invoice", Data.TripId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setInvoice(docSnap.data());
                setInstallment(docSnap.data().installment);
                setFinalPackage(docSnap.data().selected_pdf_data);
            } else {
                console.log('No data fetched');
                setInstallment(null);
            }
        } catch (error) {
            console.error('Error fetching invoice:', error);
        }
    }

    function invoiceOpen() {
        setInvoiceOpener(true);
    }

    function closeInvoice() {
        setInvoiceOpener(false);
    }

    function finalPackageOpen() {
        setPackageOpener(true);
    }

    function closePackage() {
        setPackageOpener(false);
    }

    function closeInvoiceModal() {
        setEditInvoiceFlg(false);
    }

    function handleInvoiceEditing() {
        setEditInvoiceFlg(true);
    }

    function handleInstallments(event, index) {
        let data = [...installment];
        data[index][event.target.name] = event.target.value;
        setInstallment(data);
    }

    useEffect(() => {
        if (Data.TripId) {
            getInvoice();
        }
    }, [Data.TripId]);

    return (
        <div>
            <div className='All_buttons'>
                <button className='PaymentsButton_DetailsPage' onClick={finalPackageOpen}>Final Package</button>
                <button className='PaymentsButton_DetailsPage' onClick={invoiceOpen}>Invoice</button>
                <button onClick={handleInvoiceEditing}>Edit Invoice</button>
            </div>
            <Modal open={packageOpener} onClose={closePackage} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", overflowY: 'scroll' }}>
                {
                    finalPackage ? (
                        finalPackage.travel_data.Destination === 'Maldives' ? (
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
                        ) : (
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
                        )
                    ) : (
                        <div style={{ background: 'white', borderRadius: '32px', height: '141px' }}>
                            <h1>There is no any Invoiced Pdf</h1>
                            <h1>Report is updated to Admin</h1>
                        </div>
                    )
                }
            </Modal>
            <Modal open={invoiceOpener} onClose={closeInvoice} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", width: '100%', overflowY: 'scroll' }}>
                {
                    invoice ? (
                        <div>
                            <InvoicePdf
                                installment={invoice.installment}
                                TCS={invoice.TCS}
                                deliverable_item={invoice.deliverable_item}
                                selected_pdf_data={invoice.selected_pdf_data}
                                documents={invoice.documents}
                                hint={false}
                            />
                        </div>
                    ) : (
                        <div style={{ background: 'white', borderRadius: '32px', height: '141px' }}>
                            <h1>There is no any Invoice</h1>
                            <h1>Report is updated to Admin</h1>
                        </div>
                    )
                }
            </Modal>
            {
                installment && (
                    <>
                        <div>
                            
                            {editInvoiceFlg && (
                                <Modal open={editInvoiceFlg} onClose={closeInvoiceModal} style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
                                    <EditInvoice
                                        installments={invoice.installment}
                                        TripId={Data.TripId}
                                        profile={profile}
                                        getUpdatedlead={getInvoice}
                                        closeInvoiceModal={closeInvoiceModal}
                                    />
                                </Modal>
                            )}
                        </div>
                        <div className='paymentsConfirmer'>
                            <InstallmentsMapper
                                data={invoice.installment}
                                Email={invoice.selected_pdf_data.travel_data.Email}
                                setDetails={setDetails}
                                handleInstallments={handleInstallments}
                                TripId={Data.TripId}
                            />
                        </div>
                    </>
                )
            }
        </div>
    );
}

export default Installmentmapper;
