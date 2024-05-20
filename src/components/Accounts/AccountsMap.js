import { Modal } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fromEvent } from 'file-selector';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import InvoicePdf from '../invoice/invoicePdf';
import Maldivespdf from '../MaldivesPdf/Maldivespdf';
import '../payments_vouchers/Payments.css';
import Profile from '../Profile/Profile';
import app from '../required';
import InstallmentsMapper from './installmentsMapper';
import EditInvoice from './EditInvoice'
const AccountsMap = ({ data, profile, datahandle, getUpdatedlead }) => {
    const [latestData, setlatestData] = useState(null)
    const [loading, setloading] = useState(false)
    const [details, setDetails] = useState(false)
    const [target, settarget] = useState(0)
    const storage = getStorage();
    const [EditInvoiceflg, setEditInvoice] = useState(false)
    const [openuploader, setuploader] = useState(false)
    const [finalPackage, setFinalPackage] = useState(null)
    const [invoice, setinvocice] = useState()
    const [packageOpner, setpackageOpener] = useState(false)
    const [invoiceOpener, setinvociceOpener] = useState(false)
    const [installment, setinstallment] = useState()
    const [AccountClearanceFlg, setAccountClearanceFlg] = useState(data.AccountClearance ? data.AccountClearance : false)
    const [OperationsClearanceFlg, setOperationsClearanceFlg] = useState(data.OperationsClearance ? data.OperationsClearance : false)
    function handleInvoiceEditing() {
        setEditInvoice(true)
    }
    function closeInvoiceModal() {
        setEditInvoice(false)
    }
    function finalPackageOpen() {
        setpackageOpener(true)
    }
    function closePackage() {
        setpackageOpener(false)
    }
    function invoiceOpen() {
        setinvociceOpener(true)
    }
    function closeInvoice() {
        setinvociceOpener(false)
    }
    function uploaderpopup() {
        setuploader(!openuploader)
        settarget(0)
    }
    async function getinvoice() {
        try {
            const docRef = doc(db, "invoice", data.TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setinvocice(docSnap.data())
                setinstallment(docSnap.data().installment)
                setFinalPackage(docSnap.data().selected_pdf_data)
            } else {
                setinstallment()
                // setinvocice([])

            }
        }
        catch (error) {

        }

    }
    async function resetToEdit() {
        await updateDoc(doc(db, "Trip", `${data.TripId}`), {
            Lead_Status: "Cold",
        });
        getUpdatedlead()
    }
    function handleCheckBoxChange(name) {
        switch (name) {
            case "AccountClearance": {
                setAccountClearanceFlg(!AccountClearanceFlg)
                markComplete("AccountClearance", !AccountClearanceFlg)
                break
            }
            case "OperationClearnace": {
                setOperationsClearanceFlg(!OperationsClearanceFlg)
                markComplete("OperationsClearance", !OperationsClearanceFlg)
                break
            }
            default: {

            }
        }

    }
    async function markComplete(name, value) {
        const docref = doc(db, "Trip", data.TripId);
        await updateDoc(docref, {
            [name]: value
        });
    }
    function stoploading() {
        setloading(false)
    }
    const [idproof, idproofcontrller] = useState(false)
    const db = getFirestore(app);
    const today = new Date()
    function closeidproof() {
        idproofcontrller(!idproof)
        settarget(0)
    }

    async function getFinalPackage(finalPackageId) {
        try {
            const q = query(collection(db, "Quote"), where("label", "==", finalPackageId));
            var collect = []
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                collect.push(doc.data())
            });
            setFinalPackage(collect[0].value)
        }
        catch (e) {
            console.log(e)
        }
    }
    // async function getinvoice() {
    //     try {
    //         const docRef = doc(db, "invoice", data.TripId);
    //         const docSnap = await getDoc(docRef);

    //         if (docSnap.exists()) {
    //         } else {
    //             // setinvocice({})

    //         }
    //     }
    //     catch (error) {

    //     }

    // }
    async function getdatalatest_for_voucher() {
        const docRef = doc(db, "Trip", data.TripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setlatestData(docSnap.data())
        } else {
            console.log("No such document!");
        }
    }
    async function updateLinkAndPathOfUploadedVouchers(path, link, name) {
        const docref = doc(db, "Trip", data.TripId);
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content);
            await updateDoc(docref, {
                "Vouchers_flight": previousData
            });

        }
        if (target === 'hotels') {
            let previousData = latestData.Vouchers_hotels
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await updateDoc(docref, {
                "Vouchers_hotels": previousData
            });

        }
        if (target === 'others') {
            let previousData = latestData.Vouchers_others
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await updateDoc(docref, {
                "Vouchers_others": previousData
            });

        }
        else {
            let previousData = latestData.vouchers_idproof
            let content = {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await updateDoc(docref, {
                "vouchers_idproof": previousData
            })
        }

    }

    function handleInstallments(event, index) {
        let data = [...installment];
        data[index][event.target.name] = event.target.value;
        setinstallment(data);

    }
    async function handleSubmit() {
        /**this function will upload the file in firebase storage
           vouchers/tripid/flight,hotel,others/filename 
         */
        const handles = await window.showOpenFilePicker({ multiple: false });
        const file = await fromEvent(handles);
        uploaderpopup()
        setloading(true)
        if (!file) return;
        const storageRef = ref(storage, `vouchers/${data.TripId}/${target}/${file[0].name}`);
        const path = `vouchers/${data.TripId}/${target}/${file[0].name}`
        const name = file[0].name
        const uploadTask = uploadBytesResumable(storageRef, file[0]);

        uploadTask.on('state_changed',
            (snapshot) => {
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                    getdatalatest_for_voucher()
                    stoploading()

                });
            }
        );
    }
    useEffect(() => {
        getinvoice()
        getdatalatest_for_voucher()
    }, [details]);
    function ondelete(target, path, index) {

        deleteuploadedvoucher_from_firebase_storage(path)
        delete_vouchers_from_firebase_firestore(target, index)
        getdatalatest_for_voucher()
    }
    async function uploadIdProof() {
        /**this function will upload the file in firebase storage
           vouchers/tripid/flight,hotel,others/filename 
         */
        const handles = await window.showOpenFilePicker({ multiple: false });
        const file = await fromEvent(handles);
        closeidproof()
        setloading(true)
        if (!file) return;
        const storageRef = ref(storage, `vouchers/${data.TripId}/id_proof/${target}/${file[0].name}`);
        const path = `vouchers/${data.TripId}/id_proof/${target}/${file[0].name}`
        const name = file[0].name
        const uploadTask = uploadBytesResumable(storageRef, file[0]);
        uploadTask.on('state_changed',
            (snapshot) => {
                // console.log(snapshot)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                    getdatalatest_for_voucher()
                    stoploading()

                });
            }
        );
    }
    async function delete_vouchers_from_firebase_firestore(target, del_index) {
        const docref = doc(db, "Trip", data.TripId);
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            previousData.splice(del_index, 1);
            await updateDoc(docref, {
                "Vouchers_flight": previousData
            });

        }
        if (target === 'hotels') {
            let previousData = data.Vouchers_hotels
            previousData.splice(del_index, 1)
            await updateDoc(docref, {
                "Vouchers_hotels": previousData
            });

        }
        if (target === 'others') {
            let previousData = data.Vouchers_others
            previousData.splice(del_index, 1)
            await updateDoc(docref, {
                "Vouchers_others": previousData
            });

        }
        if (target == 'id') {
            let previousData = data.vouchers_idproof

            previousData.splice(del_index, 1)

            await updateDoc(docref, {
                "vouchers_idproof": previousData
            });
        }
        datahandle()
    }
    function deleteuploadedvoucher_from_firebase_storage(path) {
        const deleteItem = ref(storage, path)
        deleteObject(deleteItem).then(() => { }).catch((error) => { console.log(error) })
    }
    function detailsFlgactive() {
        var date = new Date()
        setDetails(!details)
    }
    function optionHandler(e) {
        settarget(e.target.value)
    }
    return (
        <div className='details_of_specific_trip' >
            <div className={AccountClearanceFlg ? 'client_detailMarked' : 'client_detail'}>
                <div className='personal-details'>
                    <div className='TripId'>
                        {data.TripId}
                    </div>
                    <p>Name :-
                        {data.Traveller_name}
                    </p>
                    <p>Contact:-
                        {data.Contact_Number}
                    </p>
                    <p>Email:-
                        {data.Email}
                    </p>
                    <p>converted by:-
                        {data.assign_to.name}
                    </p>
                    {
                        details ? <>
                            <button onClick={() => finalPackageOpen()}>Final Package</button>
                            <button onClick={() => invoiceOpen()}>Invoice</button>
                            <button onClick={() => resetToEdit()}>Reset to Edit</button>
                        </> : <></>
                    }


                </div>
                <div className='trip_details'>
                    <button onClick={() => detailsFlgactive()}>
                        <img className={details ? 'expand_details_' : 'expand_details'} src='/assets/img/expand.png' />
                    </button>
                    <p> Package:-
                        {data.Departure_City} ----
                        {data.Destination}
                    </p>
                    <p>Travel Duration:-
                        {data.Travel_Duration}
                    </p>
                    <p>Travel date:-
                        {data.Follow_Up_date}
                    </p>
                    <p>Budget:-
                        {data.Budget}
                    </p>


                </div>

            </div>
            {
                details ? <>
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
                    <div className='AllDetailsOfTripQuoteComments'>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className='allComments' >
                                {
                                    data.comments.slice(0).reverse().map((U_data, index) => (<>
                                        <p key={index} className='comment_'>
                                            <p>
                                                {U_data.comments}
                                            </p>
                                            <p>
                                                {U_data.date}
                                            </p>
                                            <p>
                                                {U_data.time}
                                            </p>
                                        </p>
                                    </>))
                                }
                            </div>
                            <div>
                                <label>
                                    <span>
                                        Accounts
                                    </span>
                                    <input type="checkbox" checked={AccountClearanceFlg} name='AccountClearance' onChange={(e) => handleCheckBoxChange("AccountClearance")}></input>
                                </label>
                                <label><br />
                                    <span>
                                        Operation
                                    </span>
                                    <input type="checkbox" checked={OperationsClearanceFlg} name="OperationClearance" onChange={() => handleCheckBoxChange("OperationClearnace")}></input>
                                </label>
                            </div>
                        </div>

                        <div className='voucher_and_payments'>
                            <div className='vouchers_upload'>
                                <p>ID proof/<span className='upload_proof' onClick={() => closeidproof()}>upload</span></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.vouchers_idproof.length != 0} readOnly>
                                        </input>
                                        <div className='childpopup'>
                                            {
                                                latestData.vouchers_idproof.map((id, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {id.name}
                                                            </p>
                                                            <a href={id.link} download={id.name} target="_blank">download</a>
                                                            <button disabled onClick={() => ondelete('id', id.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='hotel_flight_others'>
                                <h6>hotel</h6>
                                <h6>Flight</h6>
                                <h6>others</h6>
                            </div>
                            <div className='vouchers_upload'>
                                <p>Voucher's/<span className='upload_proof' onClick={() => setuploader(true)}>upload</span></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_hotels.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_hotels.map((hotel, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {hotel.name}
                                                            </p>
                                                            <a href={hotel.link} download={hotel.name} target="_blank">download</a>

                                                            <button onClick={() => ondelete('hotels', hotel.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_flight.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_flight.map((flight, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {flight.name}
                                                            </p>
                                                            <a href={flight.link} download={flight.name} target="_blank">download</a>
                                                            <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_others.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_others.map((others, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {others.name}
                                                            </p>
                                                            <a href={others.link} download={others.name} target="_blank">download</a>
                                                            <button onClick={() => ondelete('others', others.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='vouchers_upload'>
                                <p>Payments's/<span className='upload_proof' onClick={() => setuploader(true)}>upload</span></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.PaymentScreenshots_hotels.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.PaymentScreenshots_hotels.map((hotel, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {hotel.name}
                                                            </p>
                                                            <a href={hotel.link} download={hotel.name} target="_blank">download</a>

                                                            <button onClick={() => ondelete('hotels', hotel.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.PaymentScreenshots_flight.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.PaymentScreenshots_flight.map((flight, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {flight.name}
                                                            </p>
                                                            <a href={flight.link} download={flight.name} target="_blank">download</a>
                                                            <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.PaymentScreenshots_others.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.PaymentScreenshots_others.map((others, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {others.name}
                                                            </p>
                                                            <a href={others.link} download={others.name} target="_blank">download</a>
                                                            <button onClick={() => ondelete('others', others.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div>
                        {
                            installment ? <>
                                <div>
                                    <button onClick={() => handleInvoiceEditing()}>Edit Invoice</button>
                                    {
                                        EditInvoiceflg ? <>
                                            <Modal open={EditInvoiceflg} onClose={closeInvoiceModal} style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }} >
                                                <>
                                                    <EditInvoice installments={invoice.installment} TripId={data.TripId} profile={profile} getUpdatedlead={getUpdatedlead} closeInvoiceModal={closeInvoiceModal} />
                                                </>
                                            </Modal>

                                        </> : <></>
                                    }
                                </div>
                                <div className='paymentsConfirmer'>
                                    <InstallmentsMapper data={invoice.installment}
                                        setDetails={setDetails}
                                        handleInstallments={handleInstallments} TripId={data.TripId} />
                                </div></> : <></>
                        }
                    </div>

                    {/* <button
                            onClick={() => handleSubmit()}>
                            uploaded
                        </button> */}


                </> : <>
                </>
            }
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={openuploader} onClose={uploaderpopup} >
                <div className='uploaderPopUp'>
                    <select className='optionChoose' onChange={(e) => optionHandler(e)}>
                        <option value={0}>choose here</option>
                        <option value='flights'>flights</option>
                        <option value='hotels'>hotel</option>
                        <option value='others' >others</option>
                    </select>
                    <button className='upload_button' disabled={target == 0 ? true : false} onClick={() => handleSubmit()}>upload</button>
                </div>
            </Modal>
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={idproof} onClose={closeidproof} >
                <div className='uploaderPopUp'>
                    <select className='optionChoose' onChange={(e) => optionHandler(e)}>
                        <option value={0}>choose here</option>
                        <option value='Passport'>Passport</option>
                        <option value='Aadhar card'>Aadhar card</option>
                        <option value='pan card' >pan card</option>
                        <option value='others' >others</option>
                    </select>
                    <button className='upload_button' disabled={target == 0 ? true : false} onClick={() => uploadIdProof()}>upload</button>

                </div>
            </Modal>
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "19rem", marginLeft: '20rem' }} open={loading} >
                {/* <img alt='loading' src='public/assets/img/loading.gif' /> */}
                <CircularProgress />
            </Modal>


        </div>
    );

}

export default AccountsMap;
