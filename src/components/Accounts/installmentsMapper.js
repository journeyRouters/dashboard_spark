import { doc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import app from '../required';
import './Accounts.css'
import { PaymentConfirmation, installmentController } from '../invoice/Globalcontroller';
const db = getFirestore(app);
const InstallmentsMapper = ({ index, handleInstallments, data, TripId, setDetails, Email }) => {
    // console.log(data)

    return (
        <>
            {
                data.map((element, index) => (

                    <InstallmentsMapperHelper data={element} installmentjson={data}
                        index={index} TripId={TripId} setDetails={setDetails} Email={Email} />

                ))
            }
        </>

    );
}
const InstallmentsMapperHelper = ({ data, installmentjson, index, TripId, setDetails, Email }) => {
    // console.log(Email, typeof (Email), Email.length)
    const [amountReceived_, setAmountReceived] = useState()
    const [Transactionid, setTransactionId] = useState()
    function statusHandler(response) {
        installmentjson[index].Status = response.target.value
    }
    function TransactionId(response) {
        installmentjson[index].TransactionId = response.target.value
        setTransactionId(response.target.value)
    }
    function amountReceived(response) {
        installmentjson[index].amountRecived = response.target.value
        setAmountReceived(response.target.value)
        // console.log(installmentjson)
    }
    async function updateStatus() {
        await setDoc(doc(db, "invoice", TripId), {
            installment: installmentjson
        }, { merge: true });
        // setDetails(false)
        handleNotification()
    }
    function handleNotification() {
        if (installmentjson[index].Status === 'Received') {
            if (Email.length > 0) {
                PaymentConfirmation(installmentjson, Email, installmentjson[index].amount, installmentjson[index + 1].amount);
            } else {
                alert('No Email Available');
                // console.log(Email.length);
            }
            if (installmentjson.length - 1 === index) {
                // Handle finalInstallments logic here if needed
            }
        }
        installmentController(installmentjson, TripId);
    }


    return (
        <div className='uni_installments'>
            <div>{data.Date}</div>
            <div> INR:-{data.amount}/-</div>
            <div>
                <textarea className='showInput'
                    disabled={data.Status == 'Received'} value={data.Status == 'Received' ? installmentjson[index].TransactionId : Transactionid}
                    placeholder='Tranction ID' onChange={(e) => TransactionId(e)} />

            </div>
            <div>
                <input className='showInput' type="number" disabled={data.Status == 'Received'}
                    value={data.Status == 'Received' ? installmentjson[index].amountRecived : amountReceived_} placeholder='recived Amount' onChange={(e) => amountReceived(e)} />
            </div>
            <div>
                <select className='showInput' value={installmentjson[index].Status} disabled={data.Status == 'Received'} onChange={(response) => statusHandler(response)}>
                    <option value="Received"> Received</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
            <button disabled={data.Status == 'Received'} onClick={() => updateStatus()}>save</button>

        </div>

    );
}

export default InstallmentsMapper;
