import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import '../../ManageLeaves/Leave.css'
const db = getFirestore(app);


const Leaves = ({ auth }) => {
    const [AllLeaves, setAllLeaves] = useState([])

    async function getLeaveApplication() {
        var localList = []
        const q = query(collection(db, "Leaves"), where("approvedBy.value", "==", auth.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            localList.push(doc)
        });
        setAllLeaves(localList)
    }
    useEffect(() => {
        getLeaveApplication()
    }, [])
    return (
        <div>
            <div style={{ overflowY: 'scroll', height: '44rem' }}>
                <div>
                    {
                        AllLeaves.map((data, index) =>
                            <Component data={data.data()} docid={data.id} key={index} getLeaveApplication={getLeaveApplication} />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

const Component = ({ data, docid, getLeaveApplication }) => {
    const [remarks, setRemarks] = useState()
    const [userProfile, setUserProfile] = useState([])
    function HandleRemarks(args) {
        setRemarks(args)
    }
    async function fetch_profile(args) {
        try {
            const docRef = doc(db, "Profile", args.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserProfile(docSnap.data())
            }
        }
        catch (error) {
            console.log({ error })
        }


    }
    function approved() {
        var Leaves = userProfile.Leave
        var difference = data.From.toDate() - data.To.toDate();
        var Day = Math.floor(difference / 1000 / 60 / 60 / 24);
        if (Day == 0) {
            Day = -1
        }
        switch (data.LeaveType) {
            case 'CasualLeave': {
                Leaves.CasualLeave = Math.abs(Leaves['CasualLeave'] + Day)
                break
            }
            case 'LeaveWithoutPay': {
                Leaves.LeaveWithoutPay = Math.abs(Leaves['LeaveWithoutPay'] + Day)
                break
            }
            case 'MaternityLeave': {
                Leaves.MaternityLeave = Math.abs(Leaves['MaternityLeave'] + Day)
                break
            }
            case 'PrivilegedLeave': {
                Leaves.PrivilegedLeave = Math.abs(Leaves['PrivilegedLeave'] + Day)
                break
            }
            case 'SickLeave': {
                Leaves.SickLeave = Math.abs(Leaves['SickLeave'] + Day)
                break
            }
            default: {
                console.log('some error')
            }
        }
        updateTheLeave()
        updateTheLeaveInProfile(Leaves)

    }
    function updateTheLeave() {
        var today = new Date()
        try{

            setDoc(doc(db, "Leaves", docid), {
                remarks: remarks,
                ApprovalDate: today,
                LeaveStatus: 'Approved'
            }, { merge: true })
        }
        catch(e){
            alert('provide Reason')
        }
    }
    function Rejected() {
        var today = new Date()
        try{
        setDoc(doc(db, "Leaves", docid), {
            remarks: remarks,
            ApprovalDate: today,
            LeaveStatus: 'Rejected'
        }, { merge: true })
        getLeaveApplication()
    }
    catch(e){
        alert('provide Reason')
    }
    }
    function updateTheLeaveInProfile(Leaves) {
        var today = new Date()
        setDoc(doc(db, "Profile", data.appliedBY.uid), {
            Leave: Leaves
        }, { merge: true })
        getLeaveApplication()
    }
    useEffect(() => {
        fetch_profile(data.appliedBY)
    }, []);
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
                <div className='ticket'>
                    <div className='DateApplication'>
                        <span>{moment(data.From.toDate()).format('DD-MMMM-YYYY')}</span>
                        <span>......................................</span>
                        <span>
                            {moment(data.To.toDate()).format('DD-MMMM-YYYY')}
                        </span>
                    </div>
                    <div>
                        <span>{data.LeaveType}</span><br />
                    </div>
                    <div>
                        <span style={{ color: '#641d6b' }}>{data.appliedBY.name}</span>
                        {/* Applied by {data.} */}
                    </div>
                </div>
                {
                    data.LeaveStatus === 'Approved' ?
                        <img className='approverlogo' alt='Approved' src={'/assets/leaveAssets/Approved.png'} /> :
                        <></>
                }
            </div>
            <div className={data.LeaveStatus === 'Approved' ?'blur':'grant'}>
                <textarea style={{ backgroundColor: '#fed638', width: '19rem' }} defaultValue={data.Reason}></textarea>
                <textarea onChange={(e) => HandleRemarks(e.target.value)} value={remarks} style={{ width: '19rem', height: '4rem' }} placeholder='your comments'></textarea>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '12rem' }}>
                    <button onClick={() => approved()}>Grant</button>
                    <button onClick={()=>Rejected()}>Reject</button>
                </div>
            </div>
        </div>
    )
}
export default Leaves;
