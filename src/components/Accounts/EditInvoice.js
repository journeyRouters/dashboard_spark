import React from 'react';
import { Modal } from '@material-ui/core';
import { useState } from 'react';
import moment from 'moment';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import app from '../required';



const EditInvoice = ({ installments, TripId, profile, getUpdatedlead, closeInvoiceModal }) => {
    const db = getFirestore(app);
    async function setInvoice() {
        var today = new Date()
        var date = moment(today).format('YYYY-MM-DD')
        var docref = doc(db, "invoice", TripId)
        await updateDoc(docref, {
            installment: installment,
            created_at: today,
            updated_at: today,
            updated_by: profile.email,
            date: date,
        });
    }
    function onClickUpdater() {
        if (installment.length == 0) {
            alert('NO Installment Found')
        }
        else {
            setInvoice()
        }
        getUpdatedlead()
        closeInvoiceModal()
    }
    const [installment, setinstallment] = useState(installments)
    function handleInstallments(event, index) {
        let data = [...installment];
        data[index][event.target.name] = event.target.value;
        setinstallment(data);

    }
    function addMOreInstallments() {
        let newInstallment = { Date: '', amount: 0, Status: 'Pending', TransactionId: '', amountRecived: '', yourname: '' }
        setinstallment([...installment, newInstallment])
    }
    function removeInstallments(index) {
        let data = [...installment];
        data.splice(index, 1)
        setinstallment(data)

    }
    return (
        <div className='editInvoiceDiv'>
            {
                installment.map((data, index) => (
                    <>
                        <div key={index} className=''>
                            <label>INSTALLMENT{index + 1}</label>

                        </div>
                        <div className='installment'>
                            <input type='date' name='Date' value={data.Date} onChange={(event) => handleInstallments(event, index)}></input>
                            <input value={data.amount} name='amount' onChange={(event) => handleInstallments(event, index)}></input>
                            <textarea value={data.TransactionId} ></textarea>
                            <div className='deleteInstallmentButton' onClick={() => removeInstallments(index)}>
                                <img alt='delete icon' src='/assets/img/deleteIcon.png' />
                            </div>
                        </div>
                    </>
                ))
            }
            <button className='addmoreInstallments' onClick={addMOreInstallments}>+</button>
            <button onClick={() => onClickUpdater()}>Update Invoice</button>


        </div>
    );
}

export default EditInvoice;
