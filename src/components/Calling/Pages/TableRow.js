import { Modal } from '@material-ui/core';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import app from '../../required';

const TableRow = ({ data, updateTableDataAfterConversion, index, }) => {
    const db = getFirestore(app);
    const [comments, setcomments] = useState(null)
    const [detailsPopUp, setdetailsPopUp] = useState(false);
    const [Destination, setDestination] = useState(data.Destination)
    const [Name, setName] = useState(data.Traveller_name)
    const [TravelDate, setTravelDate] = useState(null)
    const [newBudget, setnewBudget] = useState(data.Budget)
    const [Contact, setContact] = useState(data.Contact_Number)
    const [Departure_City, setDeparture_City] = useState(data.Departure_City)

    function ChangeBudget(e) {
        setnewBudget(e.target.value)
    }
    async function updateStatus(status) {
        setDoc(doc(db, "Trip", data.TripId), {
            callingStatus: status,
            updated_last_By_Caller: new Date()
        }, { merge: true });
        if (status == 'Dump') {
            updateTableDataAfterConversion(data.TripId)
        }
    }

    async function ReadyToTalk() {
        if (TravelDate == null) {
            alert('Please select The Travel date')
        }
        else {
            var today = new Date()
            var date_Travel = new Date(TravelDate)
            var currentdate = moment(today).format('YYYY-MM-DD')
            updateTableDataAfterConversion(data.TripId)
            setDoc(doc(db, "Trip", data.TripId), {
                BUdget: newBudget,
                Traveller_name: Name,
                Lead_Status: 'Hot',
                callingStatus: 'Converted',
                x_callerFlg: true,
                x_Caller: data.assign_to.name,
                Contact_Number: Contact,
                callingStatusChangeDate: currentdate,
                Follow_Up_date: '',
                Departure_City: Departure_City,
                Lead_status_change_date: '',
                Travel_Date: date_Travel,
                assign_to: {
                    name: '',
                    uid: ''
                },
                Pax: data.Pax,
                Destination: Destination,
                quotation_flg: false,
                travelEndDate: "",
                assign_flg: false,
                updated_last_By_Caller: new Date(),
                CallingConversionMonth: moment(new Date()).format('MMMM-YYYY')
            }, { merge: true });
            onClose()
        }
    }
    function HandleName(e) {
        setName(e.target.value)
    }
    function HandleDepartureCity(e) {
        setDeparture_City(e.target.value)
    }
    function onClose() {
        setdetailsPopUp(false)
    }
    function handlecomment(e) {
        setcomments(e.target.value)
    }
    async function update_comments() {
        if (comments) {
            let allComments = data.comments
            let comment_holder = {
                comments: comments,
                date: moment(new Date()).format('YYYY-MM-DD'),
                time: moment(new Date()).calendar()
            }
            allComments.push(comment_holder)
            setDoc(doc(db, "Trip", data.TripId), {
                comments: allComments,
                updated_last_By_Caller: new Date()
            }, { merge: true });
            setcomments(null)
        }
        else {
            alert('please comment something to save')
        }
    }
    function changingDestination(Destination) {
        setDestination(Destination.target.value)
    }
    return (
        <>
            <tr className={data.callingStatus == 'Active' ? 'row2-' : data.callingStatus == 'Hot' ? 'row3-' : 'row-'} >
                <td className='r-'>{index}</td>
                <td className='r-' onClick={() => setdetailsPopUp(true)}>{data.TripId}</td>
                <td className='r-'>{data.Traveller_name}</td>
                <td className='r-'>{data.Destination}</td>
                <td className='r-'>{data.Departure_City}</td>
                <td className='r-'>{data.Pax}</td>
                <td className='r-'>{data.assign_to.name}</td>
                <td className='r-'>{data.Contact_Number}</td>
                {/* <td><button onClick={() => ReadyToTalk()}>Ready to talk</button></td> */}
                <td><button onClick={() => updateStatus('Dump')}>Dump</button></td>
            </tr>
            <Modal open={detailsPopUp} onClose={onClose} style={{ width: '50%', margin: "5%", marginLeft: '15%', overflowY: 'scroll' }} >
                <div style={{ backgroundColor: "white" }}>
                    <div className='remark1'>
                        {
                            (data.comments.slice(0).reverse()).map((sapn, index) => (
                                <div key={index} className='comments_maping'>
                                    <p style={{ fontSize: '10px', borderRight: '1px solid' }}>
                                        {sapn.comments}
                                    </p>
                                    <div className='time_date'>
                                        <p>{moment(sapn.date).format('DD-MMM-YYYY')}</p>
                                        <p>{sapn.time}</p>

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='comments_box'>
                        <input className='Autocomplete'
                            list='Comments'
                            value={comments == null ? '' : comments}
                            onChange={(e) => handlecomment(e)}
                        ></input>
                        <datalist id="Comments">
                            <option value="Traveler not Reachable">Traveler not Reachable</option>
                            <option value="Won't book with me">Won't book with me</option>
                            <option value="Talk in progress with traveler">Talk in progress with traveler</option>
                            <option value="Traveler will Finalize and it's my hot">Traveler will Finalize and it's my hot</option>
                            <option value="Call not connecting">Call not connecting</option>
                            <option value="Travler change their mind">Travler change their mind</option>
                            <option value="Quote shared on whatsapp">Quote shared on what's app</option>
                            <option value="Traveler not responding">Travel not responding</option>
                            <option value="Booking form somewhere else">Booking form somewhere else</option>
                            <option value="will let know after few days/time">will let know after few days/time</option>
                            <option value="Converting/ Booking amount received">Converting /Booking amount received</option>
                        </datalist>

                        <button className='button_save_comments' onClick={() => update_comments()}>save</button>
                    </div>
                    <h4>
                        <span>STATUS:- </span>
                        <span style={{ border: "2px solid green" }}>{data.callingStatus}</span>
                        <select onChange={(event) => updateStatus(event.target.value)}>
                            <option value={0}>STATUS</option>
                            <option value={'Active'}>Active</option>
                            <option value={'Hot'}>Hot</option>
                            <option value={'Cold'}>Cold</option>
                            <option value={'Converted'}>Converted</option>

                        </select>
                    </h4>
                    <div className='DetailsEditor'>
                        <div className='TravellerDetails' >
                            <h4>TRIP ID:- {data.TripId}</h4>
                            <h4>Traveller name :-{data.Traveller_name}</h4>
                            <h4>Destination :-{data.Destination}</h4>
                            <h4>Departure City :-{data.Departure_City}</h4>
                            <h4>Pax :-{data.Pax}</h4>
                            <h4>Prev. spokes :-{data.assign_to.name}</h4>
                            <h4>Contact_Number :-{data.Contact_Number}</h4>
                            <h4>Budget :-{data.Budget}</h4>
                            <h4> Pre Travel date :-{moment(data.Travel_Date.toDate()).format('DD-MMM-YYYY')}</h4>
                        </div>
                        <div className='line'></div>
                        <div className='TravellerDetails1'>
                            <h4>TRIP ID:- {data.TripId}</h4>
                            <h4>
                                <label>Traveller name :-
                                    <input onChange={(e) => HandleName(e)} value={Name} placeholder={data.Traveller_name}></input>
                                </label>
                            </h4>
                            <h4>
                                <span>Destination:- </span>
                                <span style={{ border: "2px solid green" }}>{Destination}</span>
                                <select onChange={(destination) => changingDestination(destination)}>
                                    <option value={'change Destination'}>change Destination</option>
                                    <option value={'Dubai'}>Dubai</option>
                                    <option value={'Maldives'}>Maldives</option>
                                    <option value={'Thailand'}>Thailand</option>
                                    <option value={'Singapore'}>Singapore</option>
                                    <option value={'Malaysia'}>Malaysia</option>
                                    <option value={'Bali'}>Bali</option>
                                    <option value={'Himachal'}>Himachal</option>
                                    <option value={'Ladakh'}>Ladakh</option>
                                    <option value={'Kerala'}>Kerala</option>
                                    <option value={'Kashmir'}>Kashmir</option>
                                    <option value={'Andaman'}>Andaman</option>
                                    <option value={'Goa'}>Goa</option>
                                    <option value={'Europe'}>Europe</option>
                                    <option value={'Singapore'}>Singapore</option>
                                    <option value={'Rajasthan'}>Rajasthan</option>
                                    <option value={'Vietnam'}>Vietnam</option>
                                    <option value={'Baku'}>Baku</option>
                                    <option value={'Srilanka'}>Srilanka</option>
                                    <option value={'Hongkong'}>Hongkong</option>
                                    <option value={'Nepal'}>Nepal</option>

                                </select>
                            </h4>
                            {/* <h4>Destination :-{data.Destination}</h4> */}
                            <h4>
                                <label>Departure City :-
                                    <input onChange={(e) => HandleDepartureCity(e)} value={Departure_City} placeholder={data.Departure_City}></input>
                                </label>
                            </h4>
                            <h4>
                                <label> PAX:-
                                    <input onChange={(e) => { data.Pax = e.target.value }} type='number' placeholder={data.Pax}></input>
                                </label>
                            </h4>
                            <h4>Prev. spokes :-{data.assign_to.name}</h4>
                            <h4>
                                <label>Contact_Number:-
                                    <input onChange={(e) => setContact(e.target.value)} type='number' placeholder={data.Contact_Number}></input>
                                </label>
                            </h4>
                            <h4>
                                <label>Travel Date:-
                                    <input onChange={(e) => setTravelDate(e.target.value)} type='date' ></input>
                                </label>
                            </h4>
                            <h4>
                                <label>New Budget:-
                                    <input onChange={(e) => ChangeBudget(e)} type='number' ></input>
                                </label>
                            </h4>
                        </div>
                    </div>
                    <div>
                        <button onClick={() => ReadyToTalk()} className='updatemodalButton'>UPDATE</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default TableRow;
