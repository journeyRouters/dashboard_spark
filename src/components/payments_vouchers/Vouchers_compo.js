import { Modal } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fromEvent } from 'file-selector';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { NotifyByEmail, SendNotification } from '../emailer/NotifyByEmail';
import InvoicePdf from '../invoice/invoicePdf';
import Maldivespdf from '../MaldivesPdf/Maldivespdf';
import Profile from '../Profile/Profile';
import app from '../required';
import './Payments.css';


const VouchersCompo = ({ data, profile, datahandle }) => {
    const [latestData, setlatestData] = useState(data)
    const codes=['Direct',"Repeated","Converted"]
    const [loading, setloading] = useState(false)
    const [openPaymentsScreenShotsloader, setopenPaymentsScreenShotsloader] = useState(false)
    const [details, setDetails] = useState(false)
    const [target, settarget] = useState(0)
    const storage = getStorage();
    const [openuploader, setuploader] = useState(false)
    const [finalPackage, setFinalPackage] = useState(null)
    const [invoice, setinvocice] = useState()
    const [packageOpner, setpackageOpener] = useState(false)
    const [invoiceOpener, setinvociceOpener] = useState(false)
    const [idproof, idproofcontrller] = useState(false)
    const db = getFirestore(app);
    const today = new Date()
    function finalPackageOpen() {
        // console.log(finalPackage)
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
    function PaymentsScreenShotsloader(value) {
        setopenPaymentsScreenShotsloader(value)
    }
    async function getinvoice() {
        try {
            const docRef = doc(db, "invoice", data.TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setinvocice(docSnap.data())
                setFinalPackage(docSnap.data().selected_pdf_data)
                // getFinalPackage(`${docSnap.data().finalPackageId}/${data.TripId}`)
            } else {
                console.log("No such document!");
                // setinvocice({})

            }
        }
        catch (error) {

        }

    }
    function stoploading() {
        setloading(false)
    }

    function closeidproof() {
        idproofcontrller(!idproof)
        settarget(0)
    }

    async function getFinalPackage(finalPackageId) {
        try {
            // console.log(finalPackageId)
            // Sep 7, 2022 3:56 PM"
            const q = query(collection(db, "Quote"), where("label", "==", finalPackageId));
            var collect = []
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                collect.push(doc.data())
                // console.log(doc.id)
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
    //             console.log(docSnap.data())
    //             // console.log(moment(docSnap.data().created_at.toDate()).format('DD MM YYYY'))
    //         } else {
    //             console.log("No such document!");
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
            // console.log("Document data:", docSnap.data());
        } else {
            console.log("No such document!");
        }
    }
    async function updateLinkAndPathOfUploadedVouchers(path, link, name) {
        const docref = doc(db, "Trip", data.TripId);
        // console.log(target)
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            // console.log(data.Vouchers_flight)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
            await updateDoc(docref, {
                "Vouchers_flight": previousData
            });

        }
        if (target === 'hotels') {
            let previousData = latestData.Vouchers_hotels
            // console.log(data.Vouchers_hotels)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
            await updateDoc(docref, {
                "Vouchers_hotels": previousData
            });

        }
        if (target === 'others') {
            let previousData = latestData.Vouchers_others
            // console.log(data.Vouchers_others)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
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

    async function updateLinkAndPathOfUploadedPaymentsScreenShots(path, link, name) {
        // var param = {
        //     "email": "991221nandkishor@gmail.com", "message": "Auto triggered mail", "emailTitle": "Payment ScreenShots Uplaoded",
        //     "ClientData": {
        //         "tripId": data.TripId, "ClientName": data.Traveller_name,
        //         "Contact": data.Contact_Number, "Destination": data.Destination,
        //         "DepartureCity": data.Departure_City, "Pax": data.Pax,
        //         "Nights": data.Travel_Duration - 1, "TravelDate": moment(data.Travel_Date).format('DD-MMMM-YYYY')
        //     }
        // }
        const docref = doc(db, "Trip", data.TripId);
        // console.log(target)
        if (target === 'flights') {
            let previousData = latestData.PaymentScreenshots_flight
            // console.log(data.Vouchers_flight)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
            await setDoc(docref, {
                "PaymentScreenshots_flight": previousData
            }, { merge: true });
            // SendNotification(param)

        }
        if (target === 'hotels') {
            let previousData = latestData.PaymentScreenshots_hotels
            // console.log(data.Vouchers_hotels)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
            await setDoc(docref, {
                "PaymentScreenshots_hotels": previousData
            }, { merge: true });

        }
        if (target === 'others') {
            let previousData = latestData.PaymentScreenshots_others
            // console.log(data.Vouchers_others)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
            await setDoc(docref, {
                "PaymentScreenshots_others": previousData
            }, { merge: true });

        }

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
                // console.log(snapshot)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
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
                    // console.log('File available at', downloadURL);
                    updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                    getdatalatest_for_voucher()
                    stoploading()

                });
            }
        );
    }
    async function PaymentsScreenShotshandleSubmit() {
        /**this function will upload the file in firebase storage
           vouchers/tripid/flight,hotel,others/filename 
         */
        const handles = await window.showOpenFilePicker({ multiple: false });
        const file = await fromEvent(handles);
        uploaderpopup()
        setloading(true)
        if (!file) return;
        const storageRef = ref(storage, `vouchers/${data.TripId}/Payments/${target}/${file[0].name}`);
        const path = `vouchers/${data.TripId}/Payments/${target}/${file[0].name}`
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
                        // console.log('Upload is running');
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
                    // console.log('File available at', downloadURL);
                    updateLinkAndPathOfUploadedPaymentsScreenShots(path, downloadURL, name)
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
        // console.log(target, path, index)

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
                        // console.log('Upload is running');
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
                    // console.log('File available at', downloadURL);
                    updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                    getdatalatest_for_voucher()
                    stoploading()

                });
            }
        );
    }
    async function delete_vouchers_from_firebase_firestore(target, del_index) {
        const docref = doc(db, "Trip", data.TripId);
        // console.log(target, del_index)
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            previousData.splice(del_index, 1);
            // console.log(previousData)
            // console.log("list to set", content, previousData)
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
            // console.log(previousData)

            await updateDoc(docref, {
                "vouchers_idproof": previousData
            });
        }
    }
    function deleteuploadedvoucher_from_firebase_storage(path) {
        const deleteItem = ref(storage, path)
        deleteObject(deleteItem).then(() => { }).catch((error) => { console.log(error) })
    }
    function detailsFlgactive() {
        var date = new Date()
        // console.log(moment(date).format('DDMMYYYY'))
        setDetails(!details)
        // console.log(details)
    }
    function optionHandler(e) {
        settarget(e.target.value)
    }
    return (
        <div className='details_of_specific_trip' >
            <div className='client_detail'>
                <div className='personal-details'>
                    <div className='TripId'>
                        {codes.includes(data.Campaign_code) ?
                            <span>
                                {data.Campaign_code[0]}--{data.TripId}
                            </span>
                            :
                            <span>

                                {data.TripId}
                            </span>
                        }
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
                    <p>Lead Source:-
                        {data.Campaign_code}
                    </p>
                    {
                        details ? <>
                            <button onClick={() => finalPackageOpen()}>Final Package</button>
                            <button onClick={() => invoiceOpen()}>Invoice</button>
                        </> : <></>
                    }


                </div>
                <div className='trip_details'>
                    <button style={{ marginTop: '0.5rem' }} onClick={() => detailsFlgactive()}>
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
                                        deliverable_item={invoice.deliverable_item}
                                        selected_pdf_data={invoice.selected_pdf_data}
                                        documents={invoice.documents}
                                        TCS={invoice.TCS}
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
                                                    <div key={index} className='hover_popup_main_div'>
                                                        <p>
                                                            {id.name}
                                                        </p>
                                                        <a href={id.link} download={id.name} target="_blank">download</a>
                                                        <button disabled onClick={() => ondelete('id', id.path, index)} className='delete_button'>Delete</button>
                                                    </div>
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

                                                    <div key={index} className='hover_popup_main_div'>
                                                        <p>
                                                            {hotel.name}
                                                        </p>
                                                        <a href={hotel.link} download={hotel.name} target="_blank">download</a>

                                                        <button onClick={() => ondelete('hotels', hotel.path, index)} className='delete_button'>Delete</button>
                                                    </div>

                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_flight.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_flight.map((flight, index) => (

                                                    <div key={index} className='hover_popup_main_div'>
                                                        <p>
                                                            {flight.name}
                                                        </p>
                                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                                        <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                                    </div>

                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_others.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_others.map((others, index) => (
                                                    
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {others.name}
                                                            </p>
                                                            <a href={others.link} download={others.name} target="_blank">download</a>
                                                            <button onClick={() => ondelete('others', others.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                   
                                                ))}
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='vouchers_upload'>
                                <p>Payment's/<span className='upload_proof' onClick={() => PaymentsScreenShotsloader(true)} >upload</span ></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.PaymentScreenshots_flight.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.PaymentScreenshots_flight.map((flight, index) => (
                                                    <div key={index} className='hover_popup_main_div'>
                                                        <p>
                                                            {flight.name}
                                                        </p>
                                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                                        {/* <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button> */}
                                                    </div>

                                                ))}
                                        </div>

                                    </div>
                                    <div className='parent'>
                                        <input type='radio'></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.PaymentScreenshots_hotels.map((flight, index) => (

                                                    <div key={index} className='hover_popup_main_div'>
                                                        <p>
                                                            {flight.name}
                                                        </p>
                                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                                        {/* <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button> */}
                                                    </div>

                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio'></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.PaymentScreenshots_others.map((flight, index) => (

                                                    <div key={index} className='hover_popup_main_div'>
                                                        <p>
                                                            {flight.name}
                                                        </p>
                                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                                        {/* <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button> */}
                                                    </div>

                                                ))}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        {/* <button
                            onClick={() => handleSubmit()}>
                            uploaded
                        </button> */}
                    </div>

                </> : <>
                </>
            }
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={openPaymentsScreenShotsloader} onClose={() => PaymentsScreenShotsloader(false)} >
                <div className='uploaderPopUp'>
                    <select className='optionChoose' onChange={(e) => optionHandler(e)}>
                        <option value={0}>choose here</option>
                        <option value='flights'>flights</option>
                        <option value='hotels'>hotel</option>
                        <option value='others' >others</option>
                    </select>
                    <button className='upload_button' disabled={target == 0 ? true : false} onClick={() => PaymentsScreenShotshandleSubmit()}>upload</button>
                </div>
            </Modal>
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

export default VouchersCompo;
