import { Modal, } from '@material-ui/core';
import Select from 'react-select';
import React, { useEffect, useState } from 'react';
import './invoice.css'
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import InvoicePdf from './invoicePdf';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../required';
import makeAnimated from 'react-select/animated';
import moment from 'moment';



const Invoice = ({ Invoice_flg, closeinvoice, auth, pdfHolder, profile, getinvoice }) => {
    // console.log(pdfHolder)
    const today = new Date()
    const [currentdate, setcurrentday] = useState(moment(today).format('YYYY-MM-DD'))
    const animatedComponents = makeAnimated();
    const [installment, setinstallment] = useState([
        { Date: '', amount: 0, Status: 'Pending', TransactionId: '', amountRecived: '', yourname: '' },])
    const [BillingAddress, setBillingAddress] = useState('')
    const [BillingName, setBillingName] = useState('')
    const [flight_cost, setFlight_cost] = useState(0)
    const [visa_cost, set_visa_cost] = useState(0)
    const [land_package, setlandpackage] = useState(0)
    const [deliverable_item, setdeliverableItem] = useState([])
    const [documents, setdocuments] = useState([])
    const [invoice, setInvoice] = useState(false)
    const [selected_pdf_data, setpdf] = useState([])
    const [pdfseletcted_flg, setpdf_flg] = useState(false)
    const [TCS, setTCS] = useState(0)
    const [email, setemail] = useState('')

//  Controlling invoce date and limiting date in invoice
    function getMinDateForNextInstallment() {
    const validDates = installment
        .map(inst => inst.Date)
        .filter(date => date)
        .map(date => new Date(date));

    if (validDates.length === 0) {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    const latestDate = new Date(Math.max(...validDates));
    latestDate.setDate(latestDate.getDate() + 1);  // adding 1 day
    return latestDate.toISOString().split('T')[0];
}
// filtering datetime stamp from firestore as YYYY-MM-DD
    function convertFirestoreTimestampToDateString(firestoreTimestamp) {
    if (!firestoreTimestamp || !firestoreTimestamp.seconds) {
        return '';
    }
    return moment.unix(firestoreTimestamp.seconds).format('YYYY-MM-DD');
}


    // console.log(selected_pdf_data)
    function checkbalanceEquality() {
        var total = 0
        installment.forEach((item, index) => {
            total = total + parseInt(item.amount)
            // console.log(item.amount)
        })
        var packageCost = parseFloat(flight_cost) + parseFloat(visa_cost) + parseFloat(land_package) + parseFloat(TCS)
        // console.log(total, packageCost)
        if (total == packageCost) {
            return true
        }
        return false
    }
    function TCShandler(e) {
        if (e.target.value <= 0) {
            setTCS(parseInt(0))
        }
        else {
            setTCS(parseInt(e.target.value))
        }
    }
    function controllDate(e) {
        setcurrentday(e.target.value)
    }
    function showinvoice() {        
        if (!email || email.trim() === "") {
            alert('Email is required');
            return;
        }
    
        if (checkbalanceEquality()) {
            if (selected_pdf_data.length !== 0) {
                selected_pdf_data.travel_data.Email=email
                setpdf_flg(false);
                setInvoice(true);
            } else {
                setpdf_flg(true);
                setInvoice(false);
            }
        } else {
            alert('Amount mismatch');
        }
    }
    
    function closeinvoice_() {
        setInvoice(false)
    }
    function handleDeliverable(e) {
        let tempList = [...deliverable_item]
        if (e.target.checked) {
            tempList.push(e.target.name)
        }
        else {
            tempList = tempList.filter(element => element !== e.target.name);
        }
        // console.log(tempList)

        setdeliverableItem(tempList)
    }
    function handleDocuments(e) {
        console.log(e)
        let tempList = [...documents]
        if (e.target.checked) {
            tempList.push(e.target.name)
        }
        else {
            tempList = tempList.filter(element => element !== e.target.name);
        }
        setdocuments(tempList)
    }
    function handleBillingaddress(addressEvent) {
        setBillingAddress(addressEvent.target.value)
    }
    function handleBillingName(addressEvent) {
        setBillingName(addressEvent.target.value)
        selected_pdf_data.travel_data.Traveller_name = addressEvent.target.value
    }
    function handleFlightCost(FlightEvent) {
        setFlight_cost(FlightEvent.target.value)
    } function handlevisaCost(VisaEvent) {
        set_visa_cost(VisaEvent.target.value)
    } function handlelandPAckage(landEvent) {
        setlandpackage(landEvent.target.value)
    }
    function handleInstallments(event, index) {
        let data = [...installment];
        // console.log(data)
        data[index][event.target.name] = event.target.value;
        setinstallment(data);

    }
    function addMOreInstallments() {
        let newInstallment = { Date: '', amount: 0, Status: 'Pending', TransactionId: '', amountRecived: '', yourname: '' }
        setinstallment([...installment, newInstallment])
        // console.log(documents)
    }
    function removeInstallments(index) {
        let data = [...installment];
        data.splice(index, 1)
        setinstallment(data)

    }
    function handleselectedPdf(data) {
        setpdf_flg(false)
        setpdf(data)
        setBillingName(data.travel_data.Traveller_name)
        setFlight_cost(data.flightcost)
        set_visa_cost(data.visacost)
        setlandpackage(data.landPackage)

    }
    function getTotalamount() {

        if (isNaN(flight_cost)) {
            setFlight_cost(0)

        }
        if (isNaN(visa_cost)) {
            set_visa_cost(0)
        }
        if (isNaN(land_package)) {
            setlandpackage(0)
        }
        return parseFloat(flight_cost) + parseFloat(visa_cost) + parseFloat(land_package)
    }

    return (
        <div>
            <Modal open={Invoice_flg} onClose={closeinvoice} style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }} >
                <div className='mainModalDivSetter'>
                    <div >
                        <div>
                            {/* <label>CURRENCY</label>
                            <select className='selectOptions'>
                                <option value="INR">INR</option>
                                <option value="CND">CND</option>

                            </select> */}

                            <div>
                                <label> select qoute to gen invoice</label>
                                <Select
                                    className={pdfseletcted_flg ? 'slectingpdf_' : 'slectingpdf'}
                                    // closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    // isMulti
                                    options={pdfHolder}
                                    onChange={(e) => handleselectedPdf(e.value)}
                                />
                            </div>
                        </div>
                        {
                            installment.map((data, index) => (
                                <>
                                    <div key={index} className=''>
                                        <label>INSTALLMENT{index + 1}</label>

                                    </div>
                                    <div className='installments'>
                                        <input type='date' min={getMinDateForNextInstallment()}  name='Date' value={data.Date} onChange={(event) => handleInstallments(event, index)}></input>
                                        <input value={data.amount} name='amount' onChange={(event) => handleInstallments(event, index)}></input>
                                        <div className='deleteInstallmentButton' onClick={() => removeInstallments(index)}>
                                            <img alt='delete icon' src='/assets/img/deleteIcon.png' />
                                        </div>
                                    </div>
                                </>
                            ))
                        }
                        <button className='addmoreInstallments' onClick={addMOreInstallments}>+</button>

                    </div>

                    <div>

                        <div className='BillingAddress'>
                            <label>Billing Address</label>
                            <input className='txtArea' type='sapn' name='Billing_Address' value={BillingAddress} onChange={(event) => handleBillingaddress(event)} >
                            </input>
                        </div>
                        <div className='BillingAddress'>
                            <label>Billing Name</label>
                            <input className='txtArea' type='sapn' name='Billing_Name' value={BillingName} onChange={(event) => handleBillingName(event)} >
                            </input>
                        </div>
                        <div className='BillingAddress'>
                            <label>Email</label>
                            <input className='txtArea' type='sapn' name='Billing_Name' value={email} onChange={(event) => setemail(event.target.value)} >
                            </input>
                        </div>
                        <div className='BillingAddress'>
                            <label>Flight Cost </label>
                            <input className='txtArea' name='Flight_cost' defaultValue={0} value={flight_cost}
                            // onChange={(event) => handleFlightCost(event)} 
                            >
                            </input>
                        </div>
                        <div className='BillingAddress'>
                            <label>VISA Cost</label>
                            <input className='txtArea' name='visa_cost' defaultValue={0} value={visa_cost}
                            // onChange={(event) => handlevisaCost(event)} 
                            >
                            </input>
                        </div>
                        <div className='BillingAddress'>
                            <label>Land Package</label>
                            <input className='txtArea' name="Land_package" defaultValue={0} value={land_package}
                            // onChange={(event) => handlelandPAckage(event)} 
                            >
                            </input>
                        </div>
                        <div className='BillingAddress'>
                            <label>TCS (5%) = {parseInt((5 / 100) * (parseInt(flight_cost) + parseInt(visa_cost) + parseInt(land_package)))}</label>
                            <input className='textArea' value={TCS} onChange={(e) => TCShandler(e)}></input>
                        </div>
                        <div className='BillingAddress'>
                            <label>Total Cost</label>
                            <input className='textArea' value={parseFloat(flight_cost) + parseFloat(visa_cost) + parseFloat(land_package) + parseFloat(TCS)}  >
                            </input>
                        </div>
                    </div>
                    <div>
                        <label>Pick a invoicing Date (default today)</label>
                        <input type={'date'} value={currentdate} onChange={(e) => controllDate(e)}></input>
                        <button onClick={() => showinvoice()} disabled={pdfseletcted_flg}>Invoice</button>
                        <button style={{ marginLeft: '16px' }} onClick={closeinvoice}>Cancel</button>
                    </div>
                    <Modal open={invoice} onClose={closeinvoice_} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                        <div>
                            <InvoicePdf
                                installment={installment}
                                TCS={TCS}
                                deliverable_item={deliverable_item}
                                selected_pdf_data={selected_pdf_data}
                                documents={documents}
                                auth={auth}
                                date={currentdate}
                                profile={profile}
                                hint={true}
                                getinvoice={getinvoice}
                                BillingAddress={BillingAddress}
                            />
                        </div>
                    </Modal>
                </div>
            </Modal>
        </div>
    );
}

export default Invoice;
