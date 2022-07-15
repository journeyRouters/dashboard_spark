import { Modal } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './Driver.css';
import React from 'react';
import moment from 'moment';
import { collection, doc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import app from '../required';
import DriverComponents from './DriverComponents';
import readXlsxFile from 'read-excel-file';
import { fromEvent } from "file-selector";
const db = getFirestore(app);



const Driver = (props) => {
    const [lead_data, setLead_data] = useState([])
    var today = new Date()
    today = today.setDate(today.getDate() + 2)
    var currentdate = moment(today).format('YYYY-MM-DD')
    const [selectedDate, setSeletctedDate] = useState(currentdate)
    const [profile, setprofile] = useState([])
    // console.log(print)
    const [openlistOfUsers, setopenlistOfUsers] = useState(false)
    function handleListChange() {
        setopenlistOfUsers(!openlistOfUsers)
    }
    async function UploadFile() {
        if (props.auth) {
            //   console.log(auth)
            const handles = await window.showOpenFilePicker({ multiple: false });
            const files = await fromEvent(handles);
            const path = files[0].path
            // setInProgress(true)
            readXlsxFile(files[0]).then((rows) => {
                for (let i = 1; i <= rows.length - 1; i++) {
                    let Row = rows[i]
                    console.log(Row)
                    let any = Math.random()
                    let tripid = `TRP${any}`
                    setDoc(doc(db, "Trip", tripid), {
                        TripId: tripid,
                        Lead_Status: Row[0],
                        Campaign_code: Row[1],
                        Date_of_lead: Row[2],
                        Traveller_name: Row[3],
                        Extra_Info: Row[4],
                        Contact_Number: Row[5],
                        Destination: Row[6],
                        Comment: Row[7],
                        Departure_City: Row[8],
                        Travel_Date: Row[9],
                        Travel_Duration: Row[10],
                        Budget: Row[11],
                        Pax: Row[12],
                        Child: Row[13],
                        Email: Row[14],
                        Remark: Row[15],
                        Lead_genrate_date: Row[16],
                        uploaded_by: props.auth.email,
                        Quoted_by: null,
                        uploaded_date: moment(currentdate).format('YYYY-MM-DD'),
                        uploaded_time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`,
                        quotation: 0,
                        quotation_flg: false,
                        month: '',
                        Lead_status_change_date: null,
                        comments: [],
                        Vouchers_flight: [],
                        Vouchers_hotels: [],
                        Vouchers_others: [],
                        vouchers_idproof: [],
                        transfer_request: false,
                        transfer_request_reason: [],
                        assign_to: {
                            uid: null,
                            name: null
                        },
                        updated_last: null,
                        assign_flg: false,
                        final_package: null
                    });
                }
                getLeadByDate()
                // console.log(rows[1][0])
                // uploadFileOnStorage(path,'dingdong')
            })
        }
        else {
            //   setopen(true)
        }
    }
    async function getLeadByDate() {
        var list = []
        var q = query(collection(db, "Trip"), where('uploaded_date', '==', selectedDate));
        // console.log(date)
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
                // doc.data() is never undefined for query doc snapshots
            });
            setLead_data(list)
            // console.log(list);
        }
        catch (error) {
            console.log(error)
        }

    }
    useEffect(() => {
        const q = query(collection(db, "Profile"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
            });
            setprofile(Profile)
            // console.log(Profile,);
        });
        return () => unsubscribe()

    }, []);
    function test(days) {
        let date = new Date();
        date.setDate(date.getDate() + days);
        moment(date).format('DD MMMM YYYY')
        return date;
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        // var check = moment(today,'DD MMMM YYYY').add(5, 'days').calendar()
        console.log(moment(test(3)).format('DD MMMM YYYY'))
        // console.log(selectedDate)
        getLeadByDate(currentdate)
    }, []);

    return (
        <div>
            <Modal open={openlistOfUsers} onClose={handleListChange} >
                <>
                    <div className='listofuser'>

                        <table style={{ width: "100%" }}>
                            <tr>
                                <th>name</th>
                                <th>Lead Current</th>
                                <th>Lead Dump</th>
                                <th>Lead Vouchers</th>
                                <th>Lead converted</th>
                                <th>Lead followUp</th>

                            </tr>
                            {
                                profile.map((data, index) => (<>
                                    <tr key={index}>
                                        <td>{data.name}</td>
                                        <td>{(data.Lead_Current).length}</td>
                                        <td>{data.Lead_Dump.length}</td>
                                        <td>{data.Lead_Vouchers.length}</td>
                                        <td>{data.Lead_converted.length}</td>
                                        <td>{data.Lead_followUp.length}</td>
                                    </tr>
                                </>))
                            }

                        </table>
                    </div>
                </>
            </Modal>
            <div className='Driver_header'>
                <div>
                    <input onChange={(e) => setSeletctedDate(e.target.value)} type='date' value={selectedDate}></input>
                    <button onClick={() => getLeadByDate(selectedDate)}>Search</button>
                </div>
                <span style={{ background: 'yellow' }}>Total uploaded leads= {lead_data.length}</span>
                <button className='userlist_button' onClick={handleListChange}>All listed User</button>
                <button onClick={() => UploadFile()}>upload the Leads</button>
            </div>
            <div>
                {lead_data.map((data, index) => (
                    <DriverComponents key={index} profile={profile} data={data} index={index} getLeadByDate={getLeadByDate} selectedDate={selectedDate} />
                ))}
            </div>
        </div>
    );
}

export default Driver;
