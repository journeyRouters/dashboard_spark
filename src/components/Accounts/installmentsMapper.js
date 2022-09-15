import { doc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import app from '../required';
import './Accounts.css'
const db = getFirestore(app);
const InstallmentsMapper = ({ index, handleInstallments, data, TripId ,setDetails}) => {
    // console.log(data)

    return (
        <>
            {
                data.map((element, index) => (

                    <InstallmentsMapperHelper data={element} installmentjson={data} index={index} TripId={TripId} setDetails={setDetails} />

                ))
            }
        </>

    );
}
const InstallmentsMapperHelper = ({ data, installmentjson, index, TripId ,setDetails }) => {
    const[amountReceived_,setAmountReceived]=useState()
    const[Transactionid,setTransactionId]=useState()
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
        setDetails(false)
    }
    return (
        <div className='uni_installments'>
            <div>{data.Date}</div>
            <div> INR:-{data.amount}/-</div>
            <div>
                <textarea className='showInput'
                 disabled={data.Status == 'Received'} value={data.Status == 'Received'?installmentjson[index].TransactionId:Transactionid}
                  placeholder='Tranction ID' onChange={(e) => TransactionId(e)} />

            </div>
            <div>
                <input className='showInput' type="number" disabled={data.Status == 'Received'} 
                value={data.Status == 'Received'?installmentjson[index].amountRecived:amountReceived_} placeholder='recived Amount' onChange={(e) => amountReceived(e)} />
            </div>
            <div>
                <select className='showInput' value={installmentjson[index].Status} disabled={data.Status == 'Received'} onChange={(response) => statusHandler(response)}>
                    <option value="Received"> Received</option>
                    <option value="Due">Due</option>
                    <option value="Pending">Pending</option>
                    <option value="Not Verified">Not Verified</option>


                </select>
            </div>
            <button disabled={data.Status == 'Received'} onClick={() => updateStatus()}>save</button>

        </div>

    );
}

export default InstallmentsMapper;
