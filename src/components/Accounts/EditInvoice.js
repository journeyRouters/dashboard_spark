import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import { installmentController } from '../invoice/Globalcontroller';
import app from '../required';

const EditInvoice = ({ installments,invoice, TripId, profile, getUpdatedlead, closeInvoiceModal, finalPackage }) => {
    const db = getFirestore(app);
    const [installment, setInstallment] = useState(installments);
    const totalFinalPackageCost = ['visacost', 'flightcost', 'landPackage']
        .reduce((sum, key) => sum + parseFloat(finalPackage[key] || 0), 0);
    const totalInstallments = installment.reduce((sum, { amount }) => sum + parseFloat(amount || 0), 0);
    const setInvoice = async () => {
        try {
            const today = new Date();
            const formattedDate = moment(today).format('YYYY-MM-DD');
            const docRef = doc(db, 'invoice', TripId);

            await updateDoc(docRef, {
                installment: installment,
                created_at: today,
                updated_at: today,
                updated_by: profile.email,
                date: formattedDate,
            });

            getUpdatedlead();
            closeInvoiceModal();
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert('Failed to update the invoice. Please try again.');
        }
    };
    function validatePackage() {
        // console.log(totalFinalPackageCost+invoice.TCS,totalInstallments)
        return totalFinalPackageCost+parseFloat(invoice.TCS) === totalInstallments
    }
    const handleUpdateClick = () => {
        if (installment.length === 0) {
            alert('No Installment Found');
        }
        else if (validatePackage()) {
            setInvoice()
            installmentController(installment,TripId)
        }
        else {
            alert(`Incorrect Installments , total Amount should be ${totalFinalPackageCost} and  your's = ${totalInstallments}`);
        }
    };

    const handleInstallmentChange = (event, index) => {
        const { name, value } = event.target;
        const updatedInstallments = [...installment];
        updatedInstallments[index][name] = value;
        setInstallment(updatedInstallments);
    };

    const addMoreInstallments = () => {
        const newInstallment = { Date: '', amount: 0, Status: 'Pending', TransactionId: '', amountReceived: '', yourName: '' };
        setInstallment([...installment, newInstallment]);
    };

    const removeInstallment = (index) => {
        const updatedInstallments = [...installment];
        updatedInstallments.splice(index, 1);
        setInstallment(updatedInstallments);
    };

    return (
        <div className="editInvoiceDiv">
            {installment.map((data, index) => (
                <div key={index} className="installmentContainer">
                    <div className="installmentHeader">
                        <label>Installment {index + 1}</label>
                        {
                            data.TransactionId == '' ?
                                <div className="deleteInstallmentButton" onClick={() => removeInstallment(index)}>
                                    <img alt="Delete Icon" src="/assets/img/deleteIcon.png" />
                                </div>
                                : <></>
                        }
                    </div>
                    <div className="installment">
                        <input
                            type="date"
                            name="Date"
                            value={data.Date || ''}
                            onChange={(event) => handleInstallmentChange(event, index)}
                            disabled={data.TransactionId !== ''}
                        />
                        <input
                            type="number"
                            name="amount"
                            value={data.amount || ''}
                            placeholder="Amount"
                            onChange={(event) => handleInstallmentChange(event, index)}
                            disabled={data.TransactionId !== ''}
                        />
                        {
                            profile.access_type !== 'Accounts' ?
                                <input
                                    type="text"
                                    name="TransactionId"
                                    value={data.TransactionId || ''}
                                    placeholder="Transaction ID"
                                    disabled={true}
                                    onChange={(event) => handleInstallmentChange(event, index)}
                                /> :
                                <></>
                        }
                        {/* <input
                            type="text"
                            name="yourName"
                            value={data.yourName || ''}
                            placeholder="Your Name"
                            onChange={(event) => handleInstallmentChange(event, index)}
                            disabled={data.TransactionId !== ''}
                        /> */}
                    </div>
                </div>
            ))}
            <button className="addMoreInstallments" onClick={addMoreInstallments}>
                + Add More Installments
            </button>
            <button className="updateInvoiceButton" onClick={handleUpdateClick}>
                Update Invoice
            </button>
        </div>
    );
};

export default EditInvoice;
