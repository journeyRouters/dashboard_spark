import { FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import GetAppIcon from '@material-ui/icons/GetApp';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfTwoTone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Box from '../CreateQuote/Box';
import Invoice from '../invoice/InvoiceForm';
import InvoicePdf from '../invoice/invoicePdf';
import Profile from '../Profile/Profile';
import app from '../required';
import './quote.css';
const db = getFirestore(app);



const Row = (props) => {
    const { row } = props;
    // console.log(row)
    const [invoice, setinvocice] = useState()
    const [Invoice_flg, setInvoice] = useState(false)
    const [Lead_Status, setLead_Status] = useState(row.Lead_Status)
    const [openUpdater, setopenupdater] = useState(false)
    const [comments, setcomments] = useState([])
    const [latestComment, setLatestComment] = useState([])
    const [pdfHolder, setpdf] = useState([])
    const [update, setUpdate] = useState('')
    const [change, setChange] = useState(true)
    const reverse = latestComment.slice(0).reverse();
    const [viewPDF, setPDF] = useState(false)
    const [data, setdata] = useState()
    const [Reqoute_flg, setReqoute_flg] = useState(false)
    const [download, setdownload] = useState(false)
    const [tripData, setTripData] = useState(null)
    var today = new Date();
    const [edit_flg, set_edit] = useState(false)
    function setEdit_flg() {
        set_edit(true)
    }
    function closeEdit() {
        set_edit(false)
    }
    function closeDownload() {
        setdownload(false)
    }
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // var date= today.getDate()+":"+(today.getMonth()+1)+":"+today.getFullYear();
    function Controller_reqoute(data) {
        console.log(data)
        setTripData(data.value)
        setReqoute_flg(true)
    }
    function closeReqoute_flg() {
        setReqoute_flg(false)
    }
    function closePDF() {
        setPDF(false)
    }
    function showPDF(args) {
        console.log("args", args)
        setdata(args)
        setPDF(true)

    }
    function invoiceForm() {
        setInvoice(true)
        console.log(Invoice_flg)
    }
    function closeinvoice() {
        setInvoice(false)
    }
    // const useRowStyles = makeStyles({
    //     root: {
    //         '& > *': {
    //             borderBottom: 'unset',
    //         },
    //     },
    // });
    function dochange() {
        setChange(!change)
    }

    function handlecomment(e) {
        setcomments(e.target.value)
        console.log(e.target.value)
    }
   
    const [open, setOpen] = React.useState(false);
    // function changeStatus(Status) {
    //     setLead_Status(Status)
    // }
    function closeUpdater() {
        setopenupdater(false)
    }

    function closeOnstatusComments() {
        if (Lead_Status == "Dump","Converted") {
            updateStatus()
            props.updateTableDataAfterConversion(row.TripId)
        }
        else{
            updateStatus()
            props.getLeadOnBoard()
        }

        setopenupdater(false)
    }
    async function latestTripData() {
        const docRef = doc(db, "Trip", `${row.TripId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setLatestComment(docSnap.data().comments)
            setTripData(docSnap.data())
            // console.log(docSnap.id)
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
        console.log('all quote', list)

    }
    async function getinvoice() {
        try {
            const docRef = doc(db, "invoice", row.TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setinvocice(docSnap.data())
                // console.log(moment(docSnap.data().created_at.toDate()).format('DD MM YYYY'))
            } else {
                console.log("No such document!");
                // setinvocice({})

            }
        }
        catch (error) {

        }

    }
    async function updateStatus() {
        setDoc(doc(db, "Trip", row.TripId), {
            Lead_Status: Lead_Status,
            Lead_status_change_date: moment(today).format('YYYY-MM-DD')
        }, { merge: true });
    }
    async function update_comments() {
        if (comments) {
            let allComments = row.comments
            let comment_holder = {
                comments: comments,
                date: moment(today).format('YYYY-MM-DD'),
                time: moment(today).format('h:mm:ss')
            }
            allComments.push(comment_holder)
            // console.log('allcoments new', allComments, row.trip_doc)
            setDoc(doc(db, "Trip", row.TripId), {
                comments: allComments,
                Lead_Status: Lead_Status,
                Lead_status_change_date: moment(today).format('YYYY-MM-DD')

            }, { merge: true });

            latestTripData()
            dochange()
            setcomments('')
            // props.getProfile(props.auth)
        }


    }

    useEffect(() => {
        latestTripData()
        Allquote()
        getinvoice()

    }, []);
    // function OpenUpdater() {
    //     setopenupdater(true)
    // }
    function sethint(hint) {
        setUpdate(hint)
        setopenupdater(true)

    }
    function changeLead_Status(args) {
        setLead_Status(args.target.value)
    }

    return (
        <>
            <Modal open={openUpdater} onClose={closeUpdater} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <div className='popOver'>
                    {
                        update === 'status' ?
                            <div className='status'>
                                <FormControl onChange={(e) => changeLead_Status(e)}>
                                    <FormLabel >Status</FormLabel>
                                    <RadioGroup value={Lead_Status} >
                                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="Cold" control={<Radio />} label="Cold" />
                                        <FormControlLabel value="Hot" control={<Radio />} label="Hot" />
                                        <FormControlLabel value="Dump" control={<Radio />} label="Dump" />
                                        <FormControlLabel value="Converted" control={<Radio />} label="Converted" />
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
            <React.Fragment >
                <TableRow className='compo' onClick={() => setOpen(!open)}>
                    <TableCell component="th" scope="row">{row.TripId}</TableCell>
                    <TableCell align="right">{row.Traveller_name}</TableCell>
                    <TableCell align="right">{row.Lead_Status}</TableCell>
                    <TableCell align="right">{row.Destination}</TableCell>
                    <TableCell align="right">{row.Departure_City}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} >
                            <div className='collaps'>
                                <div className='client_details_'>
                                    <p className='p' onClick={() => sethint('status')}>{Lead_Status}</p>
                                    <p className='p1' >{row.Traveller_name}</p>
                                    <p>{row.Email}</p>
                                    <p>{row.Budget}</p>
                                    <p className='p'> {row.Destination}</p>
                                    <p className='p'>
                                        <a href={'tel:91' + row.Contact_Number}>{row.Contact_Number}</a>
                                    </p>
                                </div>
                                <div className='follow_up'>
                                    <div className='remark' >
                                        {
                                            reverse.map((text, index) => (
                                                <div key={index} className='comments_maping'>
                                                    {/* {console.log("comments data",text)} */}
                                                    <p>
                                                        {text.comments}
                                                    </p>
                                                    <div className='time_date'>
                                                        <p>{text.time}</p>
                                                        <p>{text.date}</p>

                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {row.Remark}

                                    </div>



                                    {
                                        viewPDF ? <>
                                            <Modal open={viewPDF} onClose={closePDF} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >

                                                <Profile
                                                    SelectedpackageType={data.SelectedpackageType.SelectedpackageType}
                                                    indicator={true}
                                                    inclusion_data={data.inclusion_data}
                                                    travel_data={data.travel_data}
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
                                            </Modal>
                                        </> : <></>
                                    }
                                    <div className='remark'>
                                        {

                                            pdfHolder.map((data, index) => (
                                                <>
                                                    <div key={index} className='pdf_setter'>
                                                        <PictureAsPdfTwoToneIcon style={{ margin: '15px' }} />
                                                        <p key={index}>{data.value.pdf_name}</p>
                                                        <button onClick={() => showPDF(data.value)} className='download_requote'>
                                                            downloadURL</button>
                                                        <button className='download_requote' onClick={() => Controller_reqoute(data)}>Edit</button>
                                                        {
                                                            Reqoute_flg ? <>
                                                                <Box
                                                                    email={props.auth.email}
                                                                    data={tripData.travel_data}
                                                                    inclusion_data_={data.value.inclusion_data}
                                                                    SelectedpackageTyp={data.value.SelectedpackageType}
                                                                    updateTableDataAfterQuote={props.updateTableDataAfterConversion}
                                                                    set_popupopner={setReqoute_flg}
                                                                    profile={props.profile}
                                                                    indicator={true}
                                                                    Edit_NightDataFields={data.value.NightDataFields}
                                                                    Edit_itineary={data.value.itineary}
                                                                    Edit_selected_Travel_date={data.value.selected_Travel_date}
                                                                    Edit_visacost={data.value.visacost}
                                                                    Edit_flightcost={data.value.flightcost}
                                                                    Edit_landPackage={data.value.landPackage}
                                                                    Edit_count_days={data.value.count_days}
                                                                    Allquote={Allquote}

                                                                />

                                                            </> : <></>
                                                        }
                                                    </div>

                                                </>
                                            ))
                                        }
                                    </div>

                                </div>
                                <div className='remark_set'>
                                    <div className='comments_box'>
                                        <input className='Autocomplete'
                                        list='Comments'
                                        value={comments}
                                            onChange={(e) => handlecomment(e)}
                                        ></input>
                                        <datalist id="Comments">
                                                        <option value="Traveler not Reachable">Traveler not Reachable</option>
                                                        <option value="Won't book with me">Won't book with me</option>
                                                        <option value="Talk in progress with traveler">Talk in progress with traveler</option>
                                                        <option value="Traveler will Finalize and it's my hot">Traveler will Finalize and it's my hot</option>
                                                        <option value="Call not connecting">Call not connecting</option>
                                                        <option value="Travler change their mind">Travler change their mind</option>

                                                    </datalist>
                                        {/* <Autocomplete
                                            key={change}
                                            className='Autocomplete'
                                            freeSolo={true}
                                            onChange={(e) => handlecomment(e)}
                                            options={reasons.map((option) => option.title)}
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder='Comments' margin="normal" variant="outlined" />
                                            )}
                                        /> */}
                                        <button className='button_save_comments' onClick={() => update_comments()}>save</button>
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
                                                            documents={invoice.documents}
                                                            auth={props.auth}
                                                            profile={props.profile}
                                                            hint={false}
                                                        />
                                                    </div>
                                                </Modal>
                                            </> : <></>
                                        }

                                        <button className='download_requote' onClick={() => invoiceForm()}>Create invoice</button>
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


                                </div >
                            </div>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        </>
    );
}

export default Row;
