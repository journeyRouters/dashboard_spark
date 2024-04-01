import { fromEvent } from "file-selector";
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import moment from 'moment';
import objectHash from 'object-hash';
import React, { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import app from '../required';
import './Driver.css';
import DriverComponents from './DriverComponents';
const db = getFirestore(app);



const Driver = (props) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [lead_data, setLead_data] = useState([])
    var today = new Date()
    var currentdate = moment(today).format('YYYY-MM-DD')
    const [selectedDate, setSeletctedDate] = useState(currentdate)
    const [profile, setprofile] = useState([])
    const [openlistOfUsers, setopenlistOfUsers] = useState(false)
    const [TripCounter, setTripCount] = useState()
    const [Hash, setHash] = useState()
    function handleListChange() {
        setopenlistOfUsers(!openlistOfUsers)
    }
    async function UploadFile() {
        if (auth) {
            //   console.log(auth)
            const handles = await window.showOpenFilePicker({ multiple: false });
            const files = await fromEvent(handles);
            // const path = files[0].path
            // setInProgress(true)
            readXlsxFile(files[0]).then((rows) => {
                let countUpdater = TripCounter
                let HashTable = Hash
                for (let i = 1; i <= rows.length - 1; i++) {
                    let Row = rows[i]
                    // console.log(Row)
                    let TripHash = objectHash({ foo: Row[3] + Row[5] + today })
                    let contactString = Row[5] + ''
                    let last4 = contactString.slice(contactString.length - 4)
                    let tripid = countUpdater + '' + last4
                    countUpdater = countUpdater + 1
                    // console.log(TripHash)
                    try {
                        HashTable[`${tripid}`] = TripHash
                    }
                    catch (e) { console.log(e) }
                    setDoc(doc(db, "Trip", tripid), {
                        TripId: tripid,
                        Lead_Status: Row[0],
                        Campaign_code: Row[1],
                        Date_of_lead: Row[2],
                        Traveller_name: Row[3],
                        InstaId: Row[4],
                        Contact_Number: parseInt(Row[5]),
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
                        uploaded_by: auth.email,
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
                        PaymentScreenshots_flight:[],
                        PaymentScreenshots_hotels:[],
                        PaymentScreenshots_others:[],
                        transfer_request: false,
                        transfer_request_reason: [],
                        FlightBookedFlg:false,
                        assign_to: {
                            uid: null,
                            name: null
                        },
                        updated_last: null,
                        assign_flg: false,
                        final_package: null,
                        callingStatus: '',
                        callingLastUpdate: new Date(),
                        caller: {
                            name: '',
                            uid: ''
                        },
                        FlightStatus:false,
                        FlightComments:[],
                        FlightBookedDate:null,
                        Flight_LastUpdate:null
                    });
                }
                updateTripCounter(countUpdater)
                // updateHash(HashTable)
                getLeadByDate(selectedDate)
                window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
                // console.log(rows[1][0])
                // uploadFileOnStorage(path,'dingdong')
            })
        }
        else {
            //   setopen(true)
        }
    }
    async function getLeadByDate(selectedDate) {
        let list = []
        // console.log(selectedDate)
        var q = query(collection(db, "Trip"), where('uploaded_date', '==', selectedDate));
        // console.log(date)
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
                // console.log(doc.data())
            });
            try {
                // console.log(list)
                setLead_data(list)
            }
            catch (e) { console.log(e) }
            // console.log(list);
        }
        catch (error) {
            console.log(error.message)
        }

    }
    useEffect(() => {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"]));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
            });
            setprofile(Profile)
        });
        return () => unsubscribe()

    }, []);
 
    useEffect(() => {
        window.scrollTo(0, 0);
        getTripCounter()
        getLeadByDate(currentdate)
    },[]);
    async function getTripCounter() {
        const TripRef = doc(db, "Support", "tripCount");
        let SupportSnap;
        try {
            SupportSnap = await getDoc(TripRef);
        }
        catch (e) { console.log(e) }
        if (SupportSnap.exists()) {
            setTripCount(SupportSnap.data().tripCount)
            // console.log(SupportSnap.data().tripCount)

        }
    }
    async function getHashTable() {
        const TripRef = doc(db, "Support", "Hash");
        let SupportSnap;
        try {
            SupportSnap = await getDoc(TripRef);
        }
        catch (e) { console.log(e) }
        if (SupportSnap.exists()) {
            setHash(SupportSnap.data().hash)
            // console.log(SupportSnap.data().hash,Object.keys(SupportSnap.data().hash).length)


        }
    }
    async function updateTripCounter(counted) {
        const TripRef = doc(db, "Support", "tripCount");
        await updateDoc(TripRef, {
            tripCount: counted
        });

    }
    async function updateHash(json) {
        const TripRef = doc(db, "Support", "Hash");
        // console.log(Object.keys(json).length)
        await updateDoc(TripRef, {
            hash: json
        }, { merge: true });

    }
    return (
        <div>
            <div className='Driver_header'>
                <div>
                    <input onChange={(e) => setSeletctedDate(e.target.value)} type='date' value={selectedDate}></input>
                    <button onClick={() => getLeadByDate(selectedDate)}>Search</button>
                </div>
                <span style={{ background: 'yellow' }}>Total uploaded leads= {lead_data.length}</span>
                <button className='userlist_button' onClick={handleListChange}>All listed User</button>
                <button onClick={() => UploadFile()}>upload the Leads</button>
            </div>
            <div style={{ background: 'cyan' }}>
                {lead_data.map((data, index) => (
                    <DriverComponents key={index} profile={profile} data={data} index={index} getLeadByDate={getLeadByDate} selectedDate={selectedDate} />
                ))}
            </div>
        </div>
    );
}

export default Driver;
