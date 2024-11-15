import { doc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { PaymentConfirmation, installmentController } from '../invoice/Globalcontroller';
import app from '../required';
import './Accounts.css';

const db = getFirestore(app);

const InstallmentsMapper = ({ profile, index, handleInstallments, data, TripId, setDetails, Email }) => {
    return (
        <div>
            {data.map((element, index) => (
                <InstallmentsMapperHelper
                    data={element}
                    installmentjson={data}
                    key={index}
                    profile={profile}
                    index={index}
                    TripId={TripId}
                    setDetails={setDetails}
                    Email={Email}
                />
            ))}
        </div>
    );
}

const InstallmentsMapperHelper = ({ data, installmentjson, index, TripId, setDetails, Email, profile }) => {
    const [amountReceived_, setAmountReceived] = useState();
    const [Transactionid, setTransactionId] = useState();
    const [Status, setStatus] = useState(installmentjson[index].Status);
    const [emailSent, setEmailSent] = useState(false);

    function statusHandler() {
        installmentjson[index].Status = Status;
    }

    function TransactionId(response) {
        installmentjson[index].TransactionId = response.target.value;
        setTransactionId(response.target.value);
    }

    function amountReceived(response) {
        installmentjson[index].amountRecived = response.target.value;
        setAmountReceived(response.target.value);
    }

    async function updateStatus() {
        statusHandler();
        await setDoc(doc(db, 'invoice', TripId), {
            installment: installmentjson,
        }, { merge: true });
        handleNotification();
    }

    function handleNotification() {
        // Only send email if the status is 'Received' and email hasn't been sent yet
        if (installmentjson[index].Status === 'Received' && !emailSent) {
            if (Email) {
                PaymentConfirmation(installmentjson, Email, installmentjson[index].amount, installmentjson[index + 1]?.amount, TripId);
                setEmailSent(true); 
            } else {
                alert('No Email Available');
            }
        }
        installmentController(installmentjson, TripId);
    }

    const isDisabled = data.Status === 'Received' || profile.access_type !== 'Accounts';

    return (
        <div className='uni_installments'>
            <div>{data.Date}</div>
            <div> INR: {data.amount} /-</div>
            <div>
                <textarea
                    className='showInput'
                    disabled={isDisabled}
                    value={data.Status === 'Received' ? installmentjson[index].TransactionId : Transactionid}
                    placeholder='Transaction ID'
                    onChange={(e) => TransactionId(e)}
                />
            </div>
            <div>
                <input
                    className='showInput'
                    type="number"
                    disabled={isDisabled}
                    value={data.Status === 'Received' ? installmentjson[index].amountRecived : amountReceived_}
                    placeholder='Received Amount'
                    onChange={(e) => amountReceived(e)}
                />
            </div>
            <div>
                <select
                    className='showInput'
                    value={Status}
                    disabled={isDisabled}
                    onChange={(response) => setStatus(response.target.value)}
                >
                    <option value="Received">Received</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>
            <button disabled={isDisabled} onClick={() => updateStatus()}>Save</button>
        </div>
    );
}

export default InstallmentsMapper;
