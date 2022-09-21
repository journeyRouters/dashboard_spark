import { PDFExport } from "@progress/kendo-react-pdf";
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react';
import app from "../required";
import { Modal } from '@material-ui/core';
const db = getFirestore(app);


const InvoicePdf = ({ date, TCS, selected_pdf_data, installment, auth, deliverable_item, BillingAddress, documents, profile, hint, getinvoice: invoiceOnPrepage }) => {
    const pdfExportComponent = useRef(null);
    const [Invoicedata, setInvoiceData] = useState()
    const [layoutSelection, setLayoutSelection] = useState({
        sapn: "A4",
        value: "size-a4"
    });
    var today = new Date();
    const [comment_inclusion, set_comment_inclusion] = useState([])
    const [Comment_Exclusion, set_Comment_Exclusion] = useState([])
    const [invoicedDate, setInvoiceDate] = useState(date ? date : selected_pdf_data.date)
    const [EditinvoicedDate, setEditinvoicedDate] = useState()
    const [editaddress, setEditaddress] = useState()
    const[wait,setWait]=useState(false)
    const [address, setaddress] = useState(BillingAddress ? BillingAddress : selected_pdf_data.BillingAddress)
    function handleExportWithComponent() {
        setWait(true)
        pdfExportComponent.current.save();
        if (hint) {
            setInvoice()
            invoiceOnPrepage()

        }
        else {

        }
        setWait(false)
        // pdfgenrator
    };
    const inclusion_data = selected_pdf_data.inclusion_data
    async function getinvoice() {
        try {
            const docRef = doc(db, "invoice", selected_pdf_data.travel_data.TripId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setInvoiceData(docSnap.data())
                // console.log((docSnap.data()))
                setEditinvoicedDate(docSnap.data().date)
                setEditaddress(docSnap.data().BillingAddress)
            } else {
                console.log("No such document!");
                // setinvocice({})

            }
        }
        catch (error) {

        }

    }
    async function setInvoice() {
        await setDoc(doc(db, "invoice", `${selected_pdf_data.travel_data.TripId}`), {
            installment: installment,
            NightDataFields: selected_pdf_data.NightDataFields,
            documents: documents,
            deliverable_item: deliverable_item,
            created_at: today,
            updated_at: today,
            updated_by: profile.email,
            selected_pdf_data: selected_pdf_data,
            finalPackageId: selected_pdf_data.pdf_name+'/'+selected_pdf_data.travel_data.TripId,
            BillingAddress: BillingAddress,
            date: date,
            TCS: parseInt(TCS)
        });
    }
    // async function updateTrip() {
    //     const database = doc(db, "Trip", selected_pdf_data.travel_data.TripId);
    //     await updateDoc(database, {
    //         final_package:selected_pdf_data.docId
    //     });
    // }
    useEffect(() => {
        if (!hint) {
            getinvoice()
        }
        // console.log(props.inclusion_data.other_Inclusion, props.inclusion_data.other_Exclusion)
        try {

            set_comment_inclusion(selected_pdf_data.inclusion_data.other_Inclusion.split("."))
        }
        catch {
            set_comment_inclusion([])
        }
        try {

            set_Comment_Exclusion(selected_pdf_data.inclusion_data.other_Exclusion.split("."))
        }
        catch {
            set_Comment_Exclusion([])
        }

    }, []);
    // let val = (2500000).toLocaleString('en');
    var formatter = new Intl.NumberFormat('en-US', {})
    let flight_cost = parseInt(selected_pdf_data.flightcost)
    let land_package = parseInt(selected_pdf_data.landPackage)
    let visa_cost = parseInt(selected_pdf_data.visacost)
    var total = flight_cost + land_package + visa_cost+TCS
    return (
        <>
            <PDFExport
                ref={pdfExportComponent}
                forcePageBreak=".page-break"
                fileName={`${selected_pdf_data.travel_data.Traveller_name} Invoice`}
            >
                <div className={`pre ${layoutSelection.value}`}>
                    <div>
                        <div className="page"
                            style={{
                                background: "#FFFFFF"
                            }}
                        >
                            <div className="setHeaderOfInvoice"></div>
                            <div className="Details">
                                <div className="ClientDetails">
                                    <div className="Title">
                                        <p>Guest Name</p>
                                        <p>Date</p>
                                        <p>Booking Id</p>
                                        <p>Address</p>
                                    </div>
                                    <div className="TitleValue">
                                        <p>:- {selected_pdf_data.travel_data.Traveller_name}</p>
                                        <p>:- {hint ? invoicedDate : EditinvoicedDate}</p>
                                        <p>:- {selected_pdf_data.travel_data.TripId}</p>
                                        <p>:- {hint ? address : editaddress}</p>

                                    </div>
                                </div>
                                <div className="line"></div>
                                <div>
                                    <div className="officeDetails">
                                        <p>GST:-  07BQSPK6324C1ZS</p>
                                        <p>2nd Floor, 258 Kuldeep House</p>
                                        <p>Lane 3, Westend Marg,</p>
                                        <p>Saket, Delh110031</p>
                                    </div>
                                </div>

                            </div>
                            <div className="paymentsSchedual"></div>
                            <div className="mappingArea">
                                <div className="reducer">
                                    <div className="Date">
                                        <span>DATE</span>
                                    </div>
                                    {
                                        installment.length != 0 ? <>
                                            {
                                                installment.map((data, index) => (<>
                                                    <div className="DateValue">
                                                        <span>{data.Date}</span>

                                                    </div>

                                                </>))
                                            }

                                        </> : <></>

                                    }
                                </div>
                                <div className="reducer">
                                    <div className="Date">
                                        <span>INSTALLMENTS</span>
                                    </div>
                                    {
                                        installment.length != 0 ? <>
                                            {
                                                installment.map((data, index) => (<>
                                                    <div className="DateValue">
                                                        <p>{formatter.format(data.amount)}</p>

                                                    </div>

                                                </>))
                                            }

                                        </> : <></>

                                    }
                                </div>
                                <div>
                                    <div className="Date">
                                        <span>STATUS</span>
                                    </div>
                                    {
                                        installment.length != 0 ? <>
                                            {
                                                installment.map((data, index) => (<>
                                                    <div className="DateValue   ">
                                                        {/* <span>
                                                            <img src="/assets/InvoiceAssets/TestingLogo.png" width='35px'/>
                                                            PENDING</span> */}
                                                        <p>{data.Status}</p>
                                                    </div>
                                                </>))
                                            }

                                        </> : <></>

                                    }
                                </div>


                            </div>
                            <div className="grandtotal">
                                <div className={TCS>0?"total":"total2"}>
                                    {
                                        TCS > 0 ? <>
                                            <div className="grandTotal_Tcs">
                                                <span> Grand Total</span>
                                                <span>+</span>
                                                <span>TCS (5%)</span>
                                            </div>
                                            <h1>
                                                :- INR  &nbsp;
                                                {formatter.format(total)}/-
                                            </h1>

                                        </> : <>
                                            <h1>
                                                Grand Total
                                                :- INR  &nbsp;
                                                {formatter.format(total)}/-</h1>
                                        </>
                                    }
                                </div>
                                {
                                    TCS > 0 ? <>
                                        <div className="tcsNotice">
                                            <span>TCS 5% on invoiced value. you can Claim the same while filling ITR</span>
                                        </div>
                                    </> : <></>
                                }


                            </div>
                            <img src="/assets/InvoiceAssets/footer.png" width='880px' />
                        </div>
                    </div>
                    <div className="page-break">
                        <div className="secondpage"></div>

                    </div>
                </div>

            </PDFExport>
            <Modal open={wait} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <>
                    <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
                </>
            </Modal>
            <button className="invoiceDownload_jr_invoice" onClick={handleExportWithComponent}>downloadURL</button>
        </>
    );
}

export default InvoicePdf;
