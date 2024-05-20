import { fromEvent } from 'file-selector';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { React, useEffect, useState } from 'react';
import app from '../required';
import '../payments_vouchers/Payments.css';
import { Modal } from '@material-ui/core';
const PaymentsScreenShotUploader = ({ data }) => {
    const db = getFirestore(app);
    const today = new Date()
    const [loading, setloading] = useState(false)
    const storage = getStorage();
    const [openuploader, setuploader] = useState(false)
    const [target, settarget] = useState(0)
    const [openPaymentsScreenShotsloader, setopenPaymentsScreenShotsloader] = useState(false)
    const [latestData, setlatestData] = useState(data)
    function PaymentsScreenShotsloader(value) {
        setopenPaymentsScreenShotsloader(value)
    } function optionHandler(e) {
        settarget(e.target.value)
    }
    function stoploading() {
        setloading(false)
    }
    function uploaderpopup() {
        setuploader(!openuploader)
        settarget(0)
    }
    async function updateLinkAndPathOfUploadedPaymentsScreenShots(path, link, name) {
        const docref = doc(db, "Trip", data.TripId);
        if (target === 'flights') {
            let previousData = latestData.PaymentScreenshots_flight
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await setDoc(docref, {
                "PaymentScreenshots_flight": previousData
            }, { merge: true });

        }
        if (target === 'hotels') {
            let previousData = latestData.PaymentScreenshots_hotels
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await setDoc(docref, {
                "PaymentScreenshots_hotels": previousData
            }, { merge: true });

        }
        if (target === 'others') {
            let previousData = latestData.PaymentScreenshots_others
            let content =
            {
                path: path,
                link: link,
                created_at: today,
                name: name
            }
            previousData.push(content)
            await setDoc(docref, {
                "PaymentScreenshots_others": previousData
            }, { merge: true });

        }

    }
    async function PaymentsScreenShotshandleSubmit() {
        /**this function will upload the file in firebase storage
           vouchers/tripid/flight,hotel,others/filename 
         */
        const handles = await window.showOpenFilePicker({ multiple: false });
        const file = await fromEvent(handles);
        uploaderpopup()
        setloading(true)
        if (!file) return;
        const storageRef = ref(storage, `vouchers/${data.TripId}/Payments/${target}/${file[0].name}`);
        const path = `vouchers/${data.TripId}/Payments/${target}/${file[0].name}`
        const name = file[0].name
        const uploadTask = uploadBytesResumable(storageRef, file[0]);

        uploadTask.on('state_changed',
            (snapshot) => {
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
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
                    updateLinkAndPathOfUploadedPaymentsScreenShots(path, downloadURL, name)
                    getdatalatest_for_voucher()
                    stoploading()

                });
            }
        );
    }
    async function getdatalatest_for_voucher() {
        const docRef = doc(db, "Trip", data.TripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setlatestData(docSnap.data())
        } else {
            console.log("No such document!");
        }
    }
    function deleteuploadedvoucher_from_firebase_storage(path) {
        const deleteItem = ref(storage, path)
        deleteObject(deleteItem).then(() => { }).catch((error) => { console.log(error) })
    }
    async function delete_vouchers_from_firebase_firestore(target, del_index) {
        const docref = doc(db, "Trip", data.TripId);
        if (target === 'flights') {
            let previousData = latestData.Vouchers_flight
            previousData.splice(del_index, 1);
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
        if (target == 'id') {
            let previousData = data.vouchers_idproof

            previousData.splice(del_index, 1)

            await updateDoc(docref, {
                "vouchers_idproof": previousData
            });
        }
    }

    function ondelete(target, path, index) {

        deleteuploadedvoucher_from_firebase_storage(path)
        delete_vouchers_from_firebase_firestore(target, index)
        getdatalatest_for_voucher()
    }
    useEffect(() => {
        getdatalatest_for_voucher()
    }, []);
    return (
        <div>
            <div className='vouchers_upload'>
                <p>Payment's/<span className='upload_proof' onClick={() => PaymentsScreenShotsloader(true)} >upload</span ></p>
                <div className='upload_radio_button'>
                    <div className='parent'>
                        <input type='radio' checked={latestData.PaymentScreenshots_flight.length != 0}></input>
                        <div className='childpopup'>
                            {
                                latestData.PaymentScreenshots_flight.map((flight, index) => (
                                    <div key={index} className='hover_popup_main_div'>
                                        <p>
                                            {flight.name}
                                        </p>
                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                        <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                    </div>

                                ))}
                        </div>

                    </div>
                    <div className='parent'>
                        <input type='radio'></input>
                        <div className='childpopup'>
                            {
                                latestData.PaymentScreenshots_hotels.map((flight, index) => (

                                    <div key={index} className='hover_popup_main_div'>
                                        <p>
                                            {flight.name}
                                        </p>
                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                        <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                    </div>

                                ))}
                        </div>
                    </div>
                    <div className='parent'>
                        <input type='radio'></input>
                        <div className='childpopup'>
                            {
                                latestData.PaymentScreenshots_others.map((flight, index) => (

                                    <div key={index} className='hover_popup_main_div'>
                                        <p>
                                            {flight.name}
                                        </p>
                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                        <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                    </div>

                                ))}
                        </div>
                    </div>
                </div>
                <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem", }} open={openPaymentsScreenShotsloader} onClose={() => PaymentsScreenShotsloader(false)} >
                    <div className='uploaderPopUp'>
                        <select className='optionChoose' onChange={(e) => optionHandler(e)}>
                            <option value={0}>choose here</option>
                            <option value='flights'>flights</option>
                            <option value='hotels'>hotel</option>
                            <option value='others' >others</option>
                        </select>
                        <button className='upload_button' disabled={target == 0 ? true : false} onClick={() => PaymentsScreenShotshandleSubmit()}>upload</button>
                    </div>
                </Modal>

            </div>
            <div className='vouchers_upload'>
                <p>Voucher's/<span className='upload_proof' onClick={() => setuploader(true)}>upload</span></p>
                <div className='upload_radio_button'>
                    <div className='parent'>
                        <input type='radio' checked={latestData.Vouchers_hotels.length != 0} readOnly></input>
                        <div className='childpopup'>
                            {
                                latestData.Vouchers_hotels.map((hotel, index) => (

                                    <div key={index} className='hover_popup_main_div'>
                                        <p>
                                            {hotel.name}
                                        </p>
                                        <a href={hotel.link} download={hotel.name} target="_blank">download</a>

                                        <button onClick={() => ondelete('hotels', hotel.path, index)} className='delete_button'>Delete</button>
                                    </div>

                                ))}
                        </div>
                    </div>
                    <div className='parent'>
                        <input type='radio' checked={latestData.Vouchers_flight.length != 0} readOnly></input>
                        <div className='childpopup'>
                            {
                                latestData.Vouchers_flight.map((flight, index) => (

                                    <div key={index} className='hover_popup_main_div'>
                                        <p>
                                            {flight.name}
                                        </p>
                                        <a href={flight.link} download={flight.name} target="_blank">download</a>
                                        <button onClick={() => ondelete('flights', flight.path, index)} className='delete_button'>Delete</button>
                                    </div>

                                ))}
                        </div>
                    </div>
                    <div className='parent'>
                        <input type='radio' checked={latestData.Vouchers_others.length != 0} readOnly></input>
                        <div className='childpopup'>
                            {
                                latestData.Vouchers_others.map((others, index) => (

                                    <div key={index} className='hover_popup_main_div'>
                                        <p>
                                            {others.name}
                                        </p>
                                        <a href={others.link} download={others.name} target="_blank">download</a>
                                        <button onClick={() => ondelete('others', others.path, index)} className='delete_button'>Delete</button>
                                    </div>

                                ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>

    );
}

export default PaymentsScreenShotUploader;
