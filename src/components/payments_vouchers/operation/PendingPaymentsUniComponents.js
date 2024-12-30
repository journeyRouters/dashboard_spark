import React, { useState } from 'react';
import './PendingPayments.css'
import moment from 'moment';
import { Modal } from '@material-ui/core';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../../required';
function PendingPaymentsUniComponents({ lead }) {
    const db = getFirestore(app);
    const installment = lead.installment
    const [open, setopen] = useState(false)
    const [CancellationFormOpen, setCancellationFormOpen] = useState(false)
    const [reason, setReason] = useState('')
    const [CancellationType, setCancellationType] = useState('InitialPaymentCancellation')
    const close = () => {
        setopen(false)
    }
    const handleopen = () => {
        setopen(true)
    }
    function closecancellationForm() {
        setCancellationFormOpen(false)
    }
    const handleSubmitCancellation = (e) => {
        e.preventDefault();
        updateTripWithCancellation(lead.selected_pdf_data.travel_data.TripId, reason)
        setReason("");
        closecancellationForm();
    };
    function handleTypeOfCancellation(e) {
        setCancellationType(e.target.value)
        // console.log(e.target.value)
    }
    async function updateInvoiceWithCancellation(invoiceID,cancellationReason) {
        try {
            const invoiceRef = doc(db, "invoice", invoiceID);
            await updateDoc(invoiceRef, {
                FinalInstallmentStatus: "Cancel",
                CancellationReason: cancellationReason,
                CanceldAt: new Date(),
                CancellationType:CancellationType,
            });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }
    
    async function updateTripWithCancellation(tripID, cancellationReason) {
        try {
            const tripRef = doc(db, "Trip", tripID);
            await updateDoc(tripRef, {
                CancellationReason: cancellationReason,
                Lead_Status: "Cancel",
                CanceldAt: new Date(),
                CancellationType:CancellationType,
            });
            updateInvoiceWithCancellation(tripID,cancellationReason)
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    }
    return (<>
        <div className='invoiceDataMapping'>
            <div className='Basic_details'>
                <h3 className='tripId'>{lead.selected_pdf_data.travel_data.TripId}</h3>
                <h3>{lead.selected_pdf_data.travel_data.Traveller_name}</h3>
                <h3>{lead.selected_pdf_data.travel_data.Contact_Number}</h3>
                <h3>{lead.selected_pdf_data.travel_data.Destination}</h3>
            </div>
            <div className='Package_details'>
                <h3 >{lead.selected_pdf_data.travel_data.assign_to.name}</h3>
                <h3>{lead.selected_pdf_data.count_days} Days{lead.selected_pdf_data.count_days - 1} Nights</h3>
                <h3>Final Cost:-{parseInt(lead.TCS) + parseInt(lead.selected_pdf_data.landPackage) + parseInt(lead.selected_pdf_data.visacost)}</h3>
                <h3>Travel Date:- {lead.selected_pdf_data.selected_Travel_date}</h3>
            </div>
            <div className='sales_details'>
                <h3>Installment Amount:- {lead.NextInstallmentAmount}</h3>
                <h3>Due On:- {moment(lead.NextInstallmentDate.toDate()).format('DD-MMMM-YYYY')}</h3>
                <button onClick={handleopen}>All Installments</button>
                <button onClick={() => setCancellationFormOpen(true)}>Initialize Cancellation</button>
            </div>
        </div>
        <Modal open={CancellationFormOpen} onClose={closecancellationForm}>
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Cancellation Form</h2>
                    <form onSubmit={handleSubmitCancellation}>
                        <div className="form-group">
                            <select onChange={(e)=>handleTypeOfCancellation(e)}>
                                <option value={'InitialPaymentCancellation'}>First Payment without Credit Note</option>
                                <option value={'InitialPaymentCancellationWithCredNote'}>First Payment with Credit note</option>
                                <option value={'RefundCancellation'}>Cancel with Refund</option>
                            </select>
                            <label htmlFor="reason">Reason for Cancellation</label>
                            <textarea
                                id="reason"
                                rows="4"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter your reason here..."
                                required
                            />
                        </div>

                        <div className="button-group">
                            <button
                                type="button"
                                onClick={closecancellationForm}
                                className="cancel-btn"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn">
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
        <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={open} onClose={close} >
            <div className='All_installmentsParent'>
                <h2>Installment Details</h2>
                <table className="installment-table">
                    <thead>
                        <tr>
                            <th>Installment Number</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {installment.map((installment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{installment.Date}</td>
                                <td>{installment.amount}</td>
                                <td>{installment.Status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </Modal>
    </>
    );
}

export default PendingPaymentsUniComponents;