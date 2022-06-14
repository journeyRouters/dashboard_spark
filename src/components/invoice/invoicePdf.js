import { PDFExport } from "@progress/kendo-react-pdf";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react';
import app from "../required";

const InvoicePdf = ({ selected_pdf_data, installment, auth, deliverable_item, documents, profile ,hint}) => {
    const pdfExportComponent = useRef(null);
    console.log(selected_pdf_data)
    const db = getFirestore(app);
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    var today=new Date();
    const [comment_inclusion, set_comment_inclusion] = useState([])
    const [Comment_Exclusion, set_Comment_Exclusion] = useState([])
    function handleExportWithComponent() {
        pdfExportComponent.current.save();
        if(hint){
            setInvoice()
        }
        // pdfgenrator
    };
    const inclusion_data = selected_pdf_data.inclusion_data
    
    async function setInvoice() {
        await setDoc(doc(db, "invoice", `${selected_pdf_data.travel_data.TripId}`), {
            installment:installment,
            NightDataFields:selected_pdf_data.NightDataFields,
            documents:documents,
            deliverable_item:deliverable_item,
            created_at:today,
            updated_at:today,
            updated_by:profile.email,
            selected_pdf_data:selected_pdf_data
        });
    }
    useEffect(() => {
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

    return (
        <>
            <PDFExport
                ref={pdfExportComponent}
                fileName={`${selected_pdf_data.travel_data.Traveller_name}`}
            >
                <div className={`invoic_main_div ${layoutSelection.value}`}>
                    <div className='header_jr_invoice'>
                        <img alt='star_img' src="/assets/img/Journey_Routers_Logo.png" width="208px" height="38px" />
                        <div className='addressOfJr'>
                            <p >
                                2nd Floor, 258, Kuldeep
                                House, Lane 3,, Champagali,
                                Saket, New Delhi - 110030
                            </p>
                        </div>
                    </div>
                    <div className='invoice_jr_explanation_body'>
                        <p className='Booking_details_invoice'>
                            <span>Booking Date <br />{selected_pdf_data.followUpDate}</span>
                            <span>Booking ID<br />{selected_pdf_data.travel_data.TripId}</span>
                        </p>
                        <div className='agent_details_jr_invoice'>
                            <h4>Travel Agent Details
                            </h4><br />
                            <span> {profile.name} | {profile.contact_number} | {auth.email} </span>

                        </div>
                        <div className='installments_details_jr_invoice'>
                            <h4>Payment Details</h4>
                            <div className='installment_data_header_jr_invoice'>
                                <h5>Due Date</h5>
                                <h5 style={{ marginLeft: '80px' }}>Status</h5>
                                <h5>installment Amount</h5>
                            </div>

                            {
                                installment.length != 0 ? <>
                                    {
                                        installment.map((installment, index) => (
                                            <p className='dataMapper_jr_invoice'>
                                                <span>{installment.Date}</span>
                                                <span>Pending</span>
                                                <span>{installment.amount}</span>
                                            </p>
                                        ))
                                    }
                                </> : <></>

                            }

                        </div>
                        <div className='Grand_total_installments_jr_invoice'>
                            <span className='total_amount_jr_invoice'>
                                <h5>Grand Total</h5>
                                <h3>total</h3>
                            </span>
                            <div className='batches_controller_jr_invoice'>
                                <img className='batches' alt='batches' src='/assets/img/batches.svg' />
                                <span>Best Price Guaranteed
                                </span>

                            </div>
                            <p style={{ fontSize: 'x-small' }}>
                                (Cash payments are not accepted by Journey Routers.
                                Journey Routers never promotes direct to agent
                                payments.)

                            </p>

                        </div>
                        <div className='Booking_summary_jr_invoice'>
                            <h5>Booking Summary
                            </h5>
                            <div className='client_details_jr_invoice'>
                                <div>
                                    <h5>Name</h5>
                                    <p className='font_jr_invoice'></p>
                                </div>
                                <div>
                                    <h5>Destination</h5>
                                    <p className='font_jr_invoice'></p>
                                </div>
                                <div>
                                    <h5>Travel Date</h5>
                                    <p className='font_jr_invoice'></p>
                                </div>
                                <div>
                                    <h5>Traveler</h5>
                                    <p className='font_jr_invoice'>Adults</p>
                                </div>
                                <div>
                                    <h5>Duration</h5>
                                    <p className='font_jr_invoice'> days, Nights</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5>Hotel Details</h5>
                            {
                                selected_pdf_data.NightDataFields.map((data, index) => (
                                    <div className='hotel_desc_jr_invoice'>
                                        <span>*{data.City}({data.Night})</span><br />
                                        <span>{data.HotelName}</span><br />
                                        <span>{data.HotelType}({data.Category})</span><br />
                                        <span></span><br />
                                    </div>
                                ))
                            }

                        </div>
                        <div className='inclusion_exclusion_jr_invoice'>
                            <div className='details1'>
                                {inclusion_data ? <>
                                    <span className='comments_'>{inclusion_data.breakfast}</span><br />
                                    <span className='comments_'>{inclusion_data.lunch}</span>
                                    <p className='comments_details'>{inclusion_data.lunch_comments}</p>
                                    <span className='comments_'>{inclusion_data.dinner}</span>
                                    <p className='comments_details'>{inclusion_data.dinner_comments}</p>
                                    <span className='comments_'>{inclusion_data.airport_arival}</span><br /><br />
                                    <span className='comments_'>{inclusion_data.airport_departure}</span><br /><br />
                                    <span className='comments_'>{inclusion_data.cab_SIC}</span><br /><br />
                                    <span className='comments_'>{inclusion_data.cab_Private}</span>
                                    <p className='comments_details'>{inclusion_data.cab_Private_comments}</p>
                                    <span className='comments_'>{inclusion_data.Gst}</span><br /><br />
                                    <span className='comments_'>{inclusion_data.airfair}</span><br /><br />
                                    <span className='comments_'> {inclusion_data.siteseeing}</span>
                                    <p className='comments_details'>{inclusion_data.siteseeing_comments}</p>
                                    <span className='comments_'>{inclusion_data.Visa}</span>
                                    <p className='comments_details'>{inclusion_data.Visa_comments}</p>
                                    <span className='comments_'>{inclusion_data.Entrance_fee}</span>
                                    <p className='comments_details'>{inclusion_data.Entrance_comments}</p>
                                    <span className='comments_'>other_Inclusion</span>
                                    <p className='comments_details'>
                                        {
                                            comment_inclusion.map((comment, index) => (
                                                <p>
                                                    * {`${comment.toString()}`}
                                                </p>
                                            ))
                                        }
                                    </p>
                                    <span className='comments_'>other_Exclusion</span>
                                    <p className='comments_details'>
                                        {
                                            Comment_Exclusion.map((comment, index) => (
                                                <p>
                                                    *{comment}
                                                </p>
                                            ))
                                        }
                                    </p>
                                </> : <></>
                                }
                            </div>
                        </div>

                        <div className='deliverable_documents_jr_invoice'>
                            <div>

                                <h4>Deliverables</h4>
                                <span>From Agent (within 3 Days of Payment)</span><br />
                                {
                                    deliverable_item.map((item, index) => (<>
                                        <span>*{item}</span><br />
                                    </>))
                                }
                            </div>
                            <div>
                                <h4>Document(s) required from you</h4>
                                {
                                    documents.map((data, index) => (<>
                                        <span>*{data}</span><br />
                                    </>))
                                }
                            </div>
                        </div>

                        <div className='terms_and_condition'>
                            <ul>
                                <h5>T&C of Travel Agent</h5>
                                <li>Flight and Hotels are Subject to Availability</li>
                                <h5>Cancellation Policy</h5>
                                <li>Flight – As Per Airline Policy</li>
                                <li>Hotel – As Per Hotel Policy</li>
                                <li>Land Part – 25% Before 25 Days of Travel</li>
                                <li>Land Part - within 20 days of Travel No Refund</li>
                                <li>Any TCS, Taxes, Remittance charges paid will be Non refundable</li>
                                <li>Journey Routers Cancellation Charges- INR 3000 Per Pax.</li>
                            </ul>

                        </div>
                        <div className='acc_details'>
                            <h5>Accounts Details</h5>
                            <span>Name:Journey Routers </span>
                            <span> Account:113605000773</span>
                            <span> Branch:Malviya Nagar</span>
                            <span> IFSCode:ICIC0001136</span>
                            <span> Account-Type:Current Account</span>
                        </div>
                        <div className='cutomerservice'>
                            <img src='/assets/img/customercare.png' width='90px' height='80px' />
                            <div className="customer_care_details_jr_invoice">
                                <p>
                                    <a href={'mailto:' + profile.email} target="_blank">
                                        {profile.email}
                                    </a>
                                </p>
                                <p>contact:
                                    <a href={'tel:' + profile.contact_number}>

                                        {profile.contact_number}
                                    </a>
                                </p>
                                <a href={"https://wa.me/91" + profile.whatsapp_number + "?text= Hi " + profile.name + " i want to plan a vaction, can you help me"} target="_blank">
                                    <img alt="what's app" src="/assets/img/whatsapp-social-media-svgrepo-com.svg" width='32px' />
                                </a>
                            </div>

                        </div>


                    </div>
                </div>
            </PDFExport>
            <button className="invoiceDownload_jr_invoice" onClick={handleExportWithComponent}>downloadURL</button>
        </>
    );
}

export default InvoicePdf;
