import React, { useState } from 'react';
import './PendingPayments.css'
import moment from 'moment';
import { Modal } from '@material-ui/core';
function PendingPaymentsUniComponents({ lead }) {
    const installment=lead.installment
    const [open, setopen] = useState(false)
    const close = () => {
        setopen(false)
    }
    const handleopen =()=>{
        setopen(true)
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
            </div>
        </div>
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