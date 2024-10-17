import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AccountsMap from '../Accounts/AccountsMap';
import VouchersCompo from '../payments_vouchers/Vouchers_compo';
import app from '../required';
import '../Accounts/Accounts.css'
import './Payment.css'
import Profile from '../Profile/Profile';
import Maldivespdf from '../MaldivesPdf/Maldivespdf';
import { Modal } from '@material-ui/core';
import InvoicePdf from '../invoice/invoicePdf';
import InstallmentsMapper from '../Accounts/installmentsMapper';
import EditInvoice from '../Accounts/EditInvoice';
import PaymentsScreenShotUploader from './PaymentsScreenShotUploader';
const db = getFirestore(app);

const PaymentMarking = ({  }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [SearchKey, setSearchKey] = useState(0)
    const [input, setInput] = useState('')
    const currentDate = new Date();
    const [invoice, setinvocice] = useState()
    const [lead_data, set_lead_data] = useState([])
    const [dataAvailityFlg, setdataAvailityFlg] = useState(false)
    const [finalPackage, setFinalPackage] = useState(null)
    const [installment, setinstallment] = useState()
    const [packageOpner, setpackageOpener] = useState(false)
    const [invoiceOpener, setinvociceOpener] = useState(false)
    const [EditInvoiceflg, setEditInvoice] = useState(false)
    function handleInvoiceEditing() {
        setEditInvoice(true)
    }
    function closeInvoiceModal() {
        setEditInvoice(false)
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
        getinvoice(input)
        getQueryDatafromDatbase(q)
    }
    async function getQueryDatafromDatbase(q) {
        try {
            var querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length != 0) {
                let list = []
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                })
                set_lead_data(list[0])
                setInput('')
                setdataAvailityFlg(true)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    async function getinvoice(TripId) {
        try {
            const docRef = doc(db, "invoice", TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setinvocice(docSnap.data())
                setinstallment(docSnap.data().installment)
                setFinalPackage(docSnap.data().selected_pdf_data)
            } else {
                console.log("No such document!");
                setinstallment()
                // setinvocice([])

            }
        }
        catch (error) {

        }
    }
    function finalPackageOpen() {
        setpackageOpener(true)
    }
    async function resetToEdit() {
        await updateDoc(doc(db, "Trip", `${lead_data.TripId}`), {
            Lead_Status: "Cold",
        });
        // getUpdatedlead()
    }
    function invoiceOpen() {
        setinvociceOpener(true)
    }
    function closePackage() {
        setpackageOpener(false)
    }
    function closeInvoice() {
        setinvociceOpener(false)
    }
    function handleInstallments(event, index) {
        let data = [...installment];
        data[index][event.target.name] = event.target.value;
        setinstallment(data);

    }
    return (
        <div>
            <Modal open={packageOpner} onClose={closePackage} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", overflowY: 'scroll' }} >
                {
                    finalPackage ? <>
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

                    </> : <>
                        <div style={{ background: 'white', borderRadius: '32px', height: '141px' }}>
                            <h1> there is no any Invoiced Pdf</h1>
                            <h1> Report is updated to Admin</h1>
                        </div>

                    </>
                }


            </Modal>
            <Modal open={invoiceOpener} onClose={closeInvoice} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                {
                    invoice ? <>
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

                    </> : <>
                        <div style={{ background: 'white', borderRadius: '32px', height: '141px' }}>
                            <h1> there is no any Invoice</h1>
                            <h1> Report is updated to Admin</h1>
                        </div>
                    </>
                }

            </Modal>
            <div className='global_search'>
                {/* <button onClick={() => getlead()}>Refresh</button> */}
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
            {
                dataAvailityFlg ? <>
                    {/* basic Details */}
                    <div className='basic_details_PaymentsPage'>

                        <div className='personal_details'>
                            <div className='TripId'>
                                {lead_data.TripId}
                            </div>
                            <p>Name :-
                                {lead_data.Traveller_name}
                            </p>
                            <p>Contact:-
                                {lead_data.Contact_Number}
                            </p>
                            <p>Email:-
                                {lead_data.Email}
                            </p>
                            <p>converted by:-
                                {lead_data.assign_to.name}
                            </p>

                        </div>
                        <div className='personal_details'>
                            <p> Package:-
                                {lead_data.Departure_City} ----
                                {lead_data.Destination}
                            </p>
                            <p>Travel Duration:-
                                {lead_data.Travel_Duration} Night
                            </p>
                            <p>Travel date:-
                                {lead_data.Follow_Up_date}
                            </p>
                            <p>Budget:-
                                {lead_data.Budget}
                            </p>

                        </div>
                    </div>
                    {/* final Package and Invoice */}
                    <PaymentsScreenShotUploader data={lead_data} />

                    <div className='PaymentButtonDiv'>
                        <button className='PaymentsButton' onClick={() => finalPackageOpen()}>Final Package</button>
                        <button className='PaymentsButton' onClick={() => invoiceOpen()}>Invoice</button>
                        <button className='PaymentsButton' onClick={() => resetToEdit()}>Reset to Edit</button>
                        <button className='PaymentsButton' onClick={() => handleInvoiceEditing()} >invoice Editor</button>
                    </div>
                    <div>
                        {
                            EditInvoiceflg ? <>
                                <Modal open={EditInvoiceflg} onClose={closeInvoiceModal} style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }} >
                                    <>
                                        <EditInvoice installments={invoice.installment} TripId={lead_data.TripId} profile={profile} closeInvoiceModal={closeInvoiceModal} />
                                    </>
                                </Modal>

                            </> : <></>
                        }
                    </div>
                    <div className='paymentsConfirmer'>
                        <InstallmentsMapper data={invoice.installment}
                            // setDetails={setDetails}
                            profile={profile}
                            Email={invoice.selected_pdf_data.travel_data.Email}
                            handleInstallments={handleInstallments} TripId={lead_data.TripId} />
                    </div>

                </> : <></>
            }

        </div>
    );
}

export default PaymentMarking;
