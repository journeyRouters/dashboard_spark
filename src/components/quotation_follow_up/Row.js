import { FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfTwoTone';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Box from '../CreateQuote/Box';
import Maldives from '../CreateQuote/Maldives';
import Maldivespdf from '../MaldivesPdf/Maldivespdf';
import Profile from '../Profile/Profile';
import Invoice from '../invoice/InvoiceForm';
import InvoicePdf from '../invoice/invoicePdf';
import app from '../required';
import CommentsUniCompo from './CommentsUniCompo';
import './quote.css';
import { fromEvent } from 'file-selector';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
const db = getFirestore(app);



const Row = (props) => {
    const { row } = props;
    // console.log(row)
    const [invoice, setinvocice] = useState()
    const [Invoice_flg, setInvoice] = useState(false)
    const [Lead_Status, setLead_Status] = useState(row.Lead_Status)
    const [openUpdater, setopenupdater] = useState(false)
    const [comments, setcomments] = useState(null)
    const [latestComment, setLatestComment] = useState([])
    const [pdfHolder, setpdf] = useState([])
    const [update, setUpdate] = useState('')
    const reverse = latestComment.slice(0).reverse();
    const [viewPDF, setPDF] = useState(false)
    const [openPaymentsScreenShotsloader, setopenPaymentsScreenShotsloader] = useState(false)
    const [target, settarget] = useState(0)
    const [data, setdata] = useState()
    const [latestData, setlatestData] = useState(row)
    const [Reqoute_flg, setReqoute_flg] = useState(false)
    const [download, setdownload] = useState(false)
    const [tripData, setTripData] = useState(null)
    var today = new Date();
    const [edit_flg, set_edit] = useState(false)
    const [open, setOpen] = React.useState(false);
    const [limit, setLimit] = useState(false)
    const [loading, setloading] = useState(false)
    const storage = getStorage();
    const [SpecialPermissionFlg, setSpecialPermissionFlg] = useState(false)
    const [monthControlllerModalFlg, setmonthControlllerModalFlg] = useState(false)
    const [openuploader, setuploader] = useState(false)
    const codes = ['Direct', "Repeated", "Converted"]
    function PaymentsScreenShotsloader(value) {
        setopenPaymentsScreenShotsloader(value)
    }
    function stoploading() {
        setloading(false)
    }
    function uploaderpopup() {
        setuploader(!openuploader)
        settarget(0)
    }


    async function getdatalatest_for_voucher() {
        const docRef = doc(db, "Trip", row.TripId);
        const docSnap = await getDoc(docRef);
        PaymentsScreenShotsloader(false)
        if (docSnap.exists()) {
            setlatestData(docSnap.data())
        } else {
            console.log("No such document!");
        }
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
        const storageRef = ref(storage, `vouchers/${row.TripId}/Payments/${target}/${file[0].name}`);
        const path = `vouchers/${row.TripId}/Payments/${target}/${file[0].name}`
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
                    updateLinkAndPathOfUploadedPaymentsScreenShots(path, downloadURL, name)
                    getdatalatest_for_voucher()
                    stoploading()

                });
            }
        );
    }

    async function updateLinkAndPathOfUploadedPaymentsScreenShots(path, link, name) {

        const docref = doc(db, "Trip", row.TripId);
        if (target === 'flights') {
            let previousData = latestData.PaymentScreenshots_flight
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await setDoc(docref, {
                "PaymentScreenshots_flight": previousData
            }, { merge: true });

        }
        if (target === 'hotels') {
            let previousData = latestData.PaymentScreenshots_hotels
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await setDoc(docref, {
                "PaymentScreenshots_hotels": previousData
            }, { merge: true });

        }
        if (target === 'others') {
            let previousData = latestData.PaymentScreenshots_others
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await setDoc(docref, {
                "PaymentScreenshots_others": previousData
            }, { merge: true });

        }

    }

    function handleMonthControllerModal() {
        setmonthControlllerModalFlg(false)
    }
    function setEdit_flg() {
        set_edit(true)
    }
    function closeEdit() {
        set_edit(false)
    }
    function closeDownload() {
        setdownload(false)
    }
    function Controller_reqoute(data) {
        setTripData(data.value)
        setReqoute_flg(true)
    }

    function closePDF() {
        setPDF(false)
    }
    function showPDF(args) {
        setdata(args)
        setPDF(true)

    }
    function invoiceForm() {
        setInvoice(true)
        // console.log(Invoice_flg)
    }
    function closeinvoice() {
        setInvoice(false)
    }
    function handlecomment(e) {
        setcomments(e.target.value)
    }
    function SpecialPermissionActivationController() {
        var date = new Date();
        var LastMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
        var currentMonthSecondDay = new Date(date.getFullYear(), date.getMonth(), 4)
        // var today = new Date();
        // var yesterday = new Date(today);
        // yesterday.setDate(today.getDate() - 1);
        // var tomorrow = new Date(today);
        // tomorrow.setDate(today.getDate() + 1);
        var Today = new Date()
        // console.log(Today > yesterday)
        // if (Today > yesterday && Today < tomorrow) {
        //     setSpecialPermissionFlg(true)
        // }
        if (Today > LastMonthLastDate && Today < currentMonthSecondDay) {
            setSpecialPermissionFlg(true)
        }
    }

    useEffect(() => {
        if (open || !Reqoute_flg) {
            Allquote();
        }
        SpecialPermissionActivationController()
    }, [open, Reqoute_flg]);


    function closeUpdater() {
        setopenupdater(false)
    }

    function closeOnstatusComments() {
        updateStatus()
        props.getLeadOnBoard()
        setopenupdater(false)
    }
    async function latestTripData() {
        const docRef = doc(db, "Trip", `${row.TripId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setLatestComment(docSnap.data().comments)
            setTripData(docSnap.data())
            // console.log(docSnap.data())
        } else {
            console.log("No such document!");
        }

    }

    async function Allquote() {
        let list = []
        const q = query(collection(db, "Quote"), where("value.travel_data.TripId", "==", row.TripId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setpdf(list)
        // console.log('all quote', list)

    }
    async function getinvoice() {
        // console.log(row.TripId)
        try {
            const docRef = doc(db, "invoice", row.TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setinvocice(docSnap.data())
                // console.log(row.TripId)
                // console.log(moment(docSnap.data().created_at.toDate()).format('DD MM YYYY'))
            } else {
                // setinvocice({})

            }
        }
        catch (error) {
            // console.log(row.TripId)
            console.log(error)
        }
    }
    async function updatewhatsappCollectionDoc() {
        const Databaseref = doc(db, "whatsapp", row.TripId);
        await updateDoc(Databaseref, {
            "Status": Lead_Status,
        });
    }
    function Conversion_update_by_special_access(input) {
        let Month = null;
        if (input) {
            Month = moment().format('MMMM');
        } else {
            Month = moment().subtract(1, 'months').format('MMMM');
        }
        if (Month != null) {
            setDoc(doc(db, "Trip", row.TripId), {
                Lead_Status: Lead_Status,
                month: Month,
                Lead_status_change_date: moment(today).format('YYYY-MM-DD'),
                updated_last: today
            }, { merge: true })
                .then(() => {
                    console.log("successfully updated!");
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
            setOpen(!open)
            props.getLeadOnBoard()
            handleMonthControllerModal()
        } else {
            // console.log("Month does not match , no update performed.");
        }
    }
    async function updateStatus() {
        if (props.Caller == 1) {
            /**this props.caller key is coming from dump caller create quote to update the lead status */
            setDoc(doc(db, "Trip", row.TripId), {
                callingStatus: Lead_Status,
                updated_last_By_Caller: today
            }, { merge: true });
            props.updateTableDataAfterUpdate(row.TripId)
            return
        }
        else if (row.Lead_Status === 'Dump') {
            setDoc(doc(db, "Trip", row.TripId), {
                Lead_Status: Lead_Status,
                Lead_status_change_date: moment(today).format('YYYY-MM-DD'),
                month: '',
                updated_last: today
            }, { merge: true });
            updatewhatsappCollectionDoc()
        }
        else if (Lead_Status === 'Paymentawaited') {
            if (SpecialPermissionFlg) {
                closeUpdater()
                setmonthControlllerModalFlg(true)
                return
            }
            if (!row.month) {
                setDoc(doc(db, "Trip", row.TripId), {
                    Lead_Status: Lead_Status,
                    month: moment(today).format('MMMM'),
                    Lead_status_change_date: moment(today).format('YYYY-MM-DD'),
                    updated_last: today
                }, { merge: true });
                updatewhatsappCollectionDoc()
            }
            else {
                setDoc(doc(db, "Trip", row.TripId), {
                    Lead_Status: Lead_Status,
                    Lead_status_change_date: moment(today).format('YYYY-MM-DD'),
                    updated_last: today
                }, { merge: true });
                updatewhatsappCollectionDoc()
            }
        }
        else {
            setDoc(doc(db, "Trip", row.TripId), {
                Lead_Status: Lead_Status,
                Lead_status_change_date: moment(today).format('YYYY-MM-DD'),
                updated_last: today
            }, { merge: true });
            updatewhatsappCollectionDoc()
        }
    }
    async function update_comments() {
        if (comments) {
            let allComments = row.comments
            let comment_holder = {
                comments: comments,
                date: moment(today).format('YYYY-MM-DD'),
                time: moment(today).calendar()
            }
            allComments.push(comment_holder)
            // console.log('allcoments new', allComments, row.trip_doc)
            setDoc(doc(db, "Trip", row.TripId), {
                comments: allComments,
                updated_last: today
            }, { merge: true });

            // latestTripData()
            setLimit(false)
            setLatestComment(allComments)
            setcomments(null)
        }
        else {
            alert('please comment something to save')
        }


    }


    useEffect(() => {
        latestTripData()
        Allquote()
        getinvoice()
        checkForLastUpdate()
    }, []);

    function sethint(hint) {
        setUpdate(hint)
        setopenupdater(true)

    }
    function changeLead_Status(args) {
        setLead_Status(args.target.value)
    }
    function checkForLastUpdate() {
        if (row.updated_last) {
            var commentLimit = new Date(row.updated_last.toDate());
            commentLimit.setDate(commentLimit.getDate() + 3)
            setLimit(commentLimit < today)
        }
    }
    function optionHandler(e) {
        settarget(e.target.value)
    }



    return (
        <>
            <Modal open={monthControlllerModalFlg} onClose={handleMonthControllerModal} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <div className='SpecialAccess'>
                    <button className='SpecialAccessButton' onClick={() => Conversion_update_by_special_access(1)}>current Month</button>
                    <button className='SpecialAccessButton' onClick={() => Conversion_update_by_special_access(0)}>Previous Month</button>
                </div>
            </Modal>

            <Modal open={openUpdater} onClose={closeUpdater} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <div className='popOver'>
                    {
                        update === 'status' ?
                            <div className='status'>
                                <FormControl onChange={(e) => changeLead_Status(e)}>
                                    <FormLabel >Status</FormLabel>
                                    <RadioGroup defaultValue={row.Lead_Status} >
                                        {/* <FormControlLabel value="Converted" control={<Radio />} label="Converted" /> */}
                                        <FormControlLabel value="Paymentawaited" control={<Radio />} label="Payment awaited" />
                                        <FormControlLabel value="Hot" control={<Radio />} label="Hot" />
                                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="Cold" control={<Radio />} label="Cold" />
                                        <FormControlLabel value="Dump" control={<Radio />} label="Dump" />
                                    </RadioGroup>
                                </FormControl>
                                <div>
                                    <button className='button_save' onClick={() => closeOnstatusComments()}>save</button>
                                </div>
                            </div> : <></>

                    }
                    {
                        update === 'destination' ? <div className='destination'>
                            <div className='contains_destination'>
                                <p>current Destination:- {row.Destination}</p>
                                <input placeholder='New Destination'></input>
                                <button className='button_save' onClick={() => closeUpdater()}>save</button>

                            </div>
                        </div> : <></>
                    }
                    {
                        update === 'number' ? <div className='destination'>
                            <div className='contains_destination'>
                                <p>current contact_number:- {row.Contact_Number}</p>
                                <input placeholder='New contact'></input>
                                <button className='button_save' onClick={() => closeUpdater()}>save</button>

                            </div>
                        </div> : <></>
                    }
                </div>
            </Modal>
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

            <React.Fragment >
                <TableRow className={limit ? 'compoLimitCross' : 'compo'} onClick={() => setOpen(!open)}>
                    <TableCell component="th" scope="row">
                        {codes.includes(row.Campaign_code) ?
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>

                                <span>
                                    <span style={{ marginLeft: '-5rem', marginRight: '1rem' }}>{moment(row.assigned_date_time.toDate()).format('DD/MMM/YYYY')}</span>
                                    {row.Campaign_code[0]}-{row.TripId}
                                </span>
                                {
                                    row.FlightBookedFlg ?
                                        <img
                                            src='https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2FPlane1.gif?alt=media'
                                            className='flightbook_' />
                                        : <></>
                                }
                            </div>
                            :
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <span>
                                    <span style={{ marginLeft: '-5rem', marginRight: '1rem' }}>{moment(row.assigned_date_time.toDate()).format('DD/MMM/YYYY')}</span>
                                    {row.TripId}
                                </span>
                                {
                                    row.FlightBookedFlg ?
                                        <img
                                            src='https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2FPlane1.gif?alt=media'
                                            className='flightbook_' />
                                        : <></>
                                }
                            </div>
                        }
                    </TableCell>
                    {/* <TableCell component="th" scope="row">
                        {
                            row.FlightBookedFlg ?
                                <img src='../assets/Notification/plane1.gif' className='flightbook' />
                                : <></>
                        }
                    </TableCell> */}
                    <TableCell align="right">{row.Traveller_name}</TableCell>
                    {
                        limit ? <>
                            <TableCell align='right'><img src='/assets/img/point1.gif' height={'2.3125rem'} /> </TableCell>
                        </> : <>
                            <TableCell align="right">
                                <span className='caps'>
                                    {
                                        props.Caller == 1 ? <>
                                            {row.callingStatus}
                                        </> : <>
                                            {row.Lead_Status}
                                        </>
                                    }
                                </span>
                            </TableCell>
                        </>
                    }
                    <TableCell align="right">{row.Destination}</TableCell>
                    <TableCell align="right">{row.Departure_City}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} >
                            <div className='collaps'>
                                <div className='client_details_'>
                                    <p className='p' onClick={() => sethint('status')}>{row.Lead_Status}</p>
                                    <p className='p1' >{row.Traveller_name}</p>
                                    <p>{row.Email}</p>
                                    <p>{row.Budget}</p>
                                    <p className='p'> {row.Destination}</p>
                                    <p className='p'>
                                        <a href={'tel:' + row.Contact_Number}>{row.Contact_Number}</a>
                                    </p>
                                </div>
                                <div className='follow_up'>
                                    <CommentsUniCompo row={row} />
                                    {
                                        viewPDF ? <>
                                            <Modal open={viewPDF} onClose={closePDF} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                                                {
                                                    data.travel_data.Destination == 'Maldives' ? <>
                                                        <Maldivespdf
                                                            data={data.travel_data}
                                                            no_rooms={data.no_rooms}
                                                            selected_Travel_date={data.selected_Travel_date}
                                                            MealPlan={data.MealPlan}
                                                            Transfer={data.Transfer}
                                                            NightDataFields={data.NightDataFields}
                                                            count_days={data.count_days}
                                                            flightcost={data.flightcost}
                                                            visacost={data.visacost}
                                                            landPackage={data.landPackage}
                                                            SelectedpackageType={data.SelectedpackageType}
                                                            Property={data.Property}
                                                            flightsLinkfromstorage={data.flightImgLinks}
                                                            inclusionLinkfromstorage={data.inclusionLinks}
                                                            flightFlg={data.flightImgLinks ? true : false}
                                                            inclusionImgFlg={data.inclusionLinks ? true : false}
                                                            Pax={data.travel_data.Pax}
                                                            Child={data.travel_data.Child}
                                                            inclusion_data={data.inclusion_data}
                                                            profile={props.profile}
                                                            indicator={false}
                                                            onClosePdf={closePDF}

                                                        />
                                                    </> : <>
                                                        <Profile
                                                            SelectedpackageType={data.SelectedpackageType}
                                                            indicator={true}
                                                            inclusion_data={data.inclusion_data}
                                                            travel_data={tripData}
                                                            count_days={data.count_days}
                                                            cabDetailsData={data.cabDetailsData}
                                                            flights={data.flights}
                                                            itineary={data.itineary}
                                                            NightDataFields={data.NightDataFields}
                                                            selected_Travel_date={data.selected_Travel_date}
                                                            flightcost={data.flightcost}
                                                            visacost={data.visacost}
                                                            landPackage={data.landPackage}
                                                            profile={props.profile}
                                                            flight={true}
                                                            flightsLinkfromstorage={data.flightsImagesLinks}
                                                        />
                                                    </>
                                                }

                                            </Modal>
                                        </> : <></>
                                    }
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className='remark'>
                                            {

                                                pdfHolder.map((data, index) => (
                                                    <div key={index}>
                                                        <div className='pdf_setter'>
                                                            <PictureAsPdfTwoToneIcon style={{ margin: '15px' }} />
                                                            <span style={{ color: 'red' }}>{data.value.travel_data.Destination}</span>
                                                            <p key={index}>
                                                                {
                                                                    typeof (data.value.pdf_name) === 'string' ? <>
                                                                        {data.value.pdf_name}
                                                                    </> : <>
                                                                        {moment(data.value.pdf_name.toDate()).format('lll')}
                                                                    </>
                                                                }
                                                            </p>
                                                            <button onClick={() => showPDF(data.value)} className='download_requote'>
                                                                downloadURL</button>
                                                            <button className='download_requote' onClick={() => Controller_reqoute(data)}>Edit</button>
                                                            {
                                                                Reqoute_flg ? <>
                                                                    {
                                                                        tripData.travel_data.Destination == 'Maldives' ? <>
                                                                            <Maldives
                                                                                Allquote={Allquote}
                                                                                email={props.auth.email}
                                                                                data={tripData.travel_data}
                                                                                inclusion_data_={tripData.inclusion_data}
                                                                                Edit_SelectedpackageType={tripData.SelectedpackageType}
                                                                                // updateTableDataAfterQuote={props.updateTableDataAfterConversion}
                                                                                set_popupopner={setReqoute_flg}
                                                                                profile={props.profile}
                                                                                E_indicator={true}
                                                                                Edit_no_rooms={tripData.no_rooms}
                                                                                Edit_NightDataFields={tripData.NightDataFields}
                                                                                Edit_itineary={tripData.itineary}
                                                                                Edit_selected_Travel_date={tripData.selected_Travel_date}
                                                                                Edit_visacost={tripData.visacost}
                                                                                Edit_flightcost={tripData.flightcost}
                                                                                Edit_landPackage={tripData.landPackage}
                                                                                Edit_count_days={tripData.count_days}
                                                                                Edit_Property={tripData.Property}
                                                                                Edit_MealPlan={tripData.MealPlan}
                                                                                Edit_Transfer={tripData.Transfer}
                                                                                pre_flightImgLinks={tripData.flightImgLinks}
                                                                                pre_inclusionLinks={tripData.inclusionLinks}
                                                                            />
                                                                        </> : <>
                                                                            <Box
                                                                                email={props.auth.email}
                                                                                data={tripData.travel_data}
                                                                                inclusion_data_={tripData.inclusion_data}
                                                                                SelectedpackageTyp={tripData.SelectedpackageType}
                                                                                updateTableDataAfterQuote={props.updateTableDataAfterConversion}
                                                                                set_popupopner={setReqoute_flg}
                                                                                profile={props.profile}
                                                                                indicator={true}
                                                                                Edit_NightDataFields={tripData.NightDataFields}
                                                                                Edit_itineary={tripData.itineary}
                                                                                Edit_selected_Travel_date={tripData.selected_Travel_date}
                                                                                Edit_visacost={tripData.visacost}
                                                                                Edit_flightcost={tripData.flightcost}
                                                                                Edit_landPackage={tripData.landPackage}
                                                                                Edit_count_days={tripData.count_days}
                                                                                Allquote={Allquote}

                                                                            />
                                                                        </>
                                                                    }


                                                                </> : <></>
                                                            }
                                                        </div>

                                                    </div>
                                                ))
                                            }

                                        </div>
                                        <div className='invoicing' >
                                            {
                                                invoice ?
                                                    <>
                                                        <p className='invoice_id'>{moment(invoice.created_at.toDate()).format('YYYY-MM-DD')}</p>
                                                        <GetAppIcon onClick={() => setdownload(!download)} />
                                                        <EditIcon onClick={() => setEdit_flg()} />
                                                    </> :
                                                    <>
                                                    </>
                                            }
                                            {
                                                edit_flg ? <>
                                                    <Invoice
                                                        auth={props.auth}
                                                        Invoice_flg={edit_flg}
                                                        profile={props.profile}
                                                        closeinvoice={closeEdit}
                                                        pdfHolder={pdfHolder}
                                                        installment={invoice.installment}
                                                        deliverable_item={invoice.deliverable_item}
                                                        selected_pdf_data={invoice.selected_pdf_data}

                                                    />
                                                </> : <></>
                                            }
                                            {
                                                download ? <>
                                                    <Modal open={download} onClose={closeDownload} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                                                        <div>
                                                            <InvoicePdf
                                                                installment={invoice.installment}
                                                                deliverable_item={invoice.deliverable_item}
                                                                selected_pdf_data={invoice.selected_pdf_data}
                                                                TCS={invoice.TCS ? invoice.TCS : 0}
                                                                documents={invoice.documents}
                                                                auth={props.auth}
                                                                profile={props.profile}
                                                                hint={false}
                                                            />
                                                        </div>
                                                    </Modal>
                                                </> : <></>
                                            }
                                            {
                                                row.Lead_Status === 'Paymentawaited' ?
                                                    <button className='download_requote' onClick={() => invoiceForm()}>Create invoice</button> : <></>
                                            }

                                            {
                                                Invoice_flg ?
                                                    <Invoice
                                                        auth={props.auth}
                                                        Invoice_flg={Invoice_flg}
                                                        profile={props.profile}
                                                        closeinvoice={closeinvoice}
                                                        pdfHolder={pdfHolder}
                                                        getinvoice={getinvoice}
                                                    /> : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='remark_set'>
                                    {/* <div className='comments_box'>
                                        <input className='Autocomplete'
                                            list='Comments'
                                            value={comments == null ? '' : comments}
                                            onChange={(e) => handlecomment(e)}
                                        ></input>
                                        <datalist id="Comments">
                                            <option value="Traveler not Reachable">Traveler not Reachable</option>
                                            <option value="Won't book with me">Won't book with me</option>
                                            <option value="Talk in progress with traveler">Talk in progress with traveler</option>
                                            <option value="Traveler will Finalize and it's my hot">Traveler will Finalize and it's my hot</option>
                                            <option value="Call not connecting">Call not connecting</option>
                                            <option value="Travler change their mind">Travler change their mind</option>
                                            <option value="Quote shared on whatsapp">Quote shared on what's app</option>
                                            <option value="Traveler not responding">Travel not responding</option>
                                            <option value="Booking form somewhere else">Booking form somewhere else</option>
                                            <option value="will let know after few days/time">will let know after few days/time</option>
                                            <option value="Converting/ Booking amount received">Converting /Booking amount received</option>
                                        </datalist>

                                        <button className='button_save_comments' onClick={() => update_comments()}>save</button>
                                    </div> */}



                                </div >
                                {
                                    row.Lead_Status === 'Paymentawaited' ? <>
                                        <div className='vouchers_upload'>
                                            <p>Payment's/<span className='upload_proof' onClick={() => PaymentsScreenShotsloader(true)} >upload</span ></p>
                                            <div className='upload_radio_button'>
                                                <div className='parent'>
                                                    <input type='radio' checked={row.PaymentScreenshots_flight.length != 0} readOnly></input>
                                                    <div className='childpopup'>
                                                        {
                                                            row.PaymentScreenshots_flight.map((flight, index) => (
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
                                                            row.PaymentScreenshots_hotels.map((flight, index) => (

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
                                                            row.PaymentScreenshots_others.map((flight, index) => (

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
                                    </> : <></>

                                }
                            </div>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        </>
    );
}

export default Row;
