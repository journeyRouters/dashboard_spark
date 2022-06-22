import { Details } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import './Payments.css'
import { Modal } from '@material-ui/core';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { fromEvent } from 'file-selector';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../required';
import CircularProgress from '@material-ui/core/CircularProgress';


const VouchersCompo = ({ data }) => {
    const [latestData, setlatestData] = useState(null)
    const [loading, setloading] = useState(false)
    // console.log("from vouchers", data)
    const [details, setDetails] = useState(false)
    const [target, settarget] = useState(0)
    const storage = getStorage();
    const [openuploader, setuploader] = useState(false)
    function uploaderpopup() {
        setuploader(!openuploader)
        settarget(0)
    }
    function stoploading() {
        setloading(false)
    }
    const [idproof, idproofcontrller] = useState(false)
    const db = getFirestore(app);
    const today = new Date()
    function closeidproof() {
        idproofcontrller(false)
        settarget(0)
    }
    async function getdatalatest() {
        const docRef = doc(db, "Trip", data.TripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setlatestData(docSnap.data())
            console.log("Document data:", docSnap.data());
        } else {
            console.log("No such document!");
        }
    }
    async function updateLinkAndPathOfUploadedVouchers(path, link, name) {
        const docref = doc(db, "Trip", data.TripId);
        console.log(target)
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            console.log(data.Vouchers_flight)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            // console.log("list to set", content, previousData)
            await updateDoc(docref, {
                "Vouchers_flight": previousData
            });

        }
        if (target === 'hotels') {
            let previousData = latestData.Vouchers_hotels
            console.log(data.Vouchers_hotels)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            console.log("list to set", content, previousData)
            await updateDoc(docref, {
                "Vouchers_hotels": previousData
            });

        }
        if (target === 'others') {
            let previousData = latestData.Vouchers_others
            console.log(data.Vouchers_others)
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            console.log("list to set", content, previousData)
            await updateDoc(docref, {
                "Vouchers_others": previousData
            });

        }
        else {
            let previousData = latestData.vouchers_idproof
            let content = {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await updateDoc(docref, {
                "vouchers_idproof": previousData
            })
        }

    }

    async function handleSubmit() {
        /**this function will upload the file in firebase storage
           vouchers/tripid/flight,hotel,others/filename 
         */
        const handles = await window.showOpenFilePicker({ multiple: false });
        const file = await fromEvent(handles);
        uploaderpopup()
        setloading(true)
        if (!file) return;
        const storageRef = ref(storage, `vouchers/${data.TripId}/${target}/${file[0].name}`);
        const path = `vouchers/${data.TripId}/${target}/${file[0].name}`
        const name = file[0].name
        const uploadTask = uploadBytesResumable(storageRef, file[0]);

        uploadTask.on('state_changed',
            (snapshot) => {
                // console.log(snapshot)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                    getdatalatest()
                    stoploading()

                });
            }
        );
    }
    useEffect(() => {
        getdatalatest()
    }, [details]);
    function ondelete(target, path, index) {
        deleteuploadedvoucher_from_firebase_storage(path)
        delete_vouchers_from_firebase_firestore(target, index)
        getdatalatest()
    }
    async function uploadIdProof() {
        /**this function will upload the file in firebase storage
           vouchers/tripid/flight,hotel,others/filename 
         */
        const handles = await window.showOpenFilePicker({ multiple: false });
        const file = await fromEvent(handles);
        uploaderpopup()
        setloading(true)
        if (!file) return;
        const storageRef = ref(storage, `vouchers/${data.TripId}/id_proof/${target}/${file[0].name}`);
        const path = `vouchers/${data.TripId}/id_proof/${target}/${file[0].name}`
        const name = file[0].name
        const uploadTask = uploadBytesResumable(storageRef, file[0]);
        uploadTask.on('state_changed',
            (snapshot) => {
                // console.log(snapshot)
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        break;
                    case 'storage/unknown':
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                    getdatalatest()
                    stoploading()

                });
            }
        );
    }
    async function delete_vouchers_from_firebase_firestore(target, del_index) {
        const docref = doc(db, "Trip", data.TripId);
        console.log(target)
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            previousData.splice(del_index, 1);
            console.log(previousData)
            // console.log("list to set", content, previousData)
            await updateDoc(docref, {
                "Vouchers_flight": previousData
            });

        }
        if (target === 'hotels') {
            let previousData = data.Vouchers_hotels
            previousData.splice(del_index, 1)
            await updateDoc(docref, {
                "Vouchers_hotels": previousData
            });

        }
        if (target === 'others') {
            let previousData = data.Vouchers_others
            previousData.splice(del_index, 1)
            await updateDoc(docref, {
                "Vouchers_others": previousData
            });

        }
        else{
            let previousData = data.vouchers_idproof
            previousData.splice(del_index, 1)
            await updateDoc(docref, {
                "vouchers_idproof": previousData
            });
        }
    }
    function deleteuploadedvoucher_from_firebase_storage(path) {
        const deleteItem = ref(storage, path)
        deleteObject(deleteItem).then(() => { }).catch((error) => { console.log(error) })
    }
    function detailsFlgactive() {
        setDetails(!details)
    }
    function optionHandler(e) {
        settarget(e.target.value)
    }
    return (
        <div className='details_of_specific_trip'>
            <div className='client_detail'>
                <div className='personal-details'>
                    <div className='TripId'>
                        {data.TripId}
                    </div>
                    <p>Name :-
                        {data.Traveller_name}
                    </p>
                    <p>Contact:-
                        {data.Contact_Number}
                    </p>
                    <p>Email:-
                        {data.Email}
                    </p>
                </div>
                <div className='trip_details'>
                    <p> Package:-
                        {data.Departure_City} ----
                        {data.Destination}
                    </p>
                    <p>Travel Duration:-
                        {data.Travel_Duration}
                    </p>
                    <p>Follow Up date:-
                        {data.Follow_Up_date}
                    </p>
                    <p>Budget:-
                        {data.Budget}
                    </p>
                    <button
                        onClick={() => detailsFlgactive()}>
                        Show More
                    </button>

                </div>

            </div>
            {
                details ? <>
                    <div className='AllDetailsOfTripQuoteComments'>
                        <div className='allComments'>
                            {
                                data.comments.slice(0).reverse().map((U_data, index) => (<>
                                    <p key={index} className='comment_'>
                                        <p>
                                            {U_data.comments}
                                        </p>
                                        <p>
                                            {U_data.date}
                                        </p>
                                        <p>
                                            {U_data.time}
                                        </p>
                                    </p>
                                </>))
                            }
                        </div>
                        <div className='voucher_and_payments'>
                            <div className='vouchers_upload'>
                                <p>ID proof/<span className='upload_proof' onClick={() => idproofcontrller(true)}>upload</span></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.vouchers_idproof.length != 0} readOnly>
                                        </input>
                                        <div className='childpopup'>
                                            {
                                                latestData.vouchers_idproof.map((id, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {id.name}
                                                            </p>
                                                            <a href={id.link} download={id.name}  target="_blank">download</a>
                                                            <button onClick={() => ondelete('id', id.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className='hotel_flight_others'>
                                <h6>hotel</h6>
                                <h6>Flight</h6>
                                <h6>others</h6>
                            </div>
                            <div className='vouchers_upload'>
                                <p>Voucher's/<span className='upload_proof' onClick={() => setuploader(true)}>upload</span></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_hotels.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_hotels.map((hotel, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {hotel.name}
                                                            </p>
                                                            <a href={hotel.link} download={hotel.name}  target="_blank">download</a>

                                                            <button onClick={() => ondelete('hotels', hotel.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_flight.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_flight.map((flight, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {flight.name}
                                                            </p>
                                                            <a href={flight.link} download={flight.name}  target="_blank">download</a>
                                                            <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio' checked={latestData.Vouchers_others.length != 0} readOnly></input>
                                        <div className='childpopup'>
                                            {
                                                latestData.Vouchers_others.map((others, index) => (
                                                    <>
                                                        <div key={index} className='hover_popup_main_div'>
                                                            <p>
                                                                {others.name}
                                                            </p>
                                                            <a href={others.link} download={others.name}  target="_blank">download</a>
                                                            <button onClick={() => ondelete('others', others.path, index)} className='delete_button'>Delete</button>
                                                        </div>
                                                    </>
                                                ))}
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div className='vouchers_upload'>
                                <p>Payment's/<span className='upload_proof' >upload</span ></p>
                                <div className='upload_radio_button'>
                                    <div className='parent'>
                                        <input type='radio'></input>
                                        <div className='childpopup'></div>

                                    </div>
                                    <div className='parent'>
                                        <input type='radio'></input>
                                        <div className='childpopup'></div>
                                    </div>
                                    <div className='parent'>
                                        <input type='radio'></input>
                                        <div className='childpopup'>

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        {/* <button
                            onClick={() => handleSubmit()}>
                            uploaded
                        </button> */}
                    </div>

                </> : <>
                </>
            }
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={openuploader} onClose={uploaderpopup} >
                <div className='uploaderPopUp'>
                    <select className='optionChoose' onChange={(e) => optionHandler(e)}>
                        <option value={0}>choose here</option>
                        <option value='flights'>flights</option>
                        <option value='hotels'>hotel</option>
                        <option value='others' >others</option>
                    </select>
                    <button className='upload_button' disabled={target == 0 ? true : false} onClick={() => handleSubmit()}>upload</button>
                </div>
            </Modal>
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={idproof} onClose={closeidproof} >
                <div className='uploaderPopUp'>
                    <select className='optionChoose' onChange={(e) => optionHandler(e)}>
                        <option value={0}>choose here</option>
                        <option value='Passport'>Passport</option>
                        <option value='Aadhar card'>Aadhar card</option>
                        <option value='pan card' >pan card</option>
                        <option value='others' >others</option>
                    </select>
                    <button className='upload_button' disabled={target == 0 ? true : false} onClick={() => uploadIdProof()}>upload</button>

                </div>
            </Modal>
            <Modal style={{ display: "flex", justifyContent: "center", marginTop: "19rem", marginLeft: '20rem' }} open={loading} >
                {/* <img alt='loading' src='public/assets/img/loading.gif' /> */}
                <CircularProgress />
            </Modal>

        </div>
    );
}

export default VouchersCompo;
