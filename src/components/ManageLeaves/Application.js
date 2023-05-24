import { Modal } from '@material-ui/core';
import { addDoc, collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import app from '../required';
import makeAnimated from 'react-select/animated';
import './Leave.css'
import moment from 'moment';
const Application = ({profile,auth,getLeaveApplication}) => {
    // console.log(profile) 
    const db = getFirestore(app)
    const animatedComponents = makeAnimated();
    const [approvedBy, setapprovedBy] = useState([])
    const [openForm, setOpenForm] = useState(false)
    const [AllUserprofile, setAllUserprofile] = useState([])
    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const[LeaveType,setLeaveType]=useState('')
    const[reason,setreason]=useState('')
    function hadleClose() {
        setOpenForm(!openForm)
    }
    function TeamMembersHandler(e) {
        setapprovedBy(e)
    }
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["admin", "Super Admin", "Team Leader"]));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                var temp = { label: '', value: '' }
                temp.label = doc.data().name
                temp.value = doc.data().uid
                Profile.push(temp);
                // console.log(doc.data().name)
            });
            setAllUserprofile(Profile)


        });
    }
    async function ApplyLeave() {
        var today = new Date()
        await addDoc(collection(db, "Leaves"), {
            From: from,
            To: to,
            LeaveType: LeaveType,
            Reason: reason,
            LeaveStatus: 'Requested',
            AppliedDate: today,
            Month:moment(today).format('MMMM-YYYY'),
            ApprovalDate: '',
            remarks: '',
            approvedBy:approvedBy,
            appliedBY:{uid:auth.uid,name:profile.name}

        });
        getLeaveApplication()
        hadleClose()

    }
    function HandleDateTime(type, date) {
        switch (type) {
            case 'from': {
                var dateObject = new Date(date)
                setFrom(dateObject)

            }
            case 'to': {
                var dateObject = new Date(date)
                setTo(dateObject)
            }
        }
        // console.log(new Date(date))
    }
    function handleLeaveType(args){
        setLeaveType(args)
    }
    useEffect(() => {
        getAllUserProfie()

    }, []);
    return (
        <div>
            <div style={{ margin: '1rem' }}><button onClick={() => setOpenForm(true)}>Apply For a Leave</button></div>
            <Modal open={openForm} onClose={hadleClose} style={{ display: "grid", justifyContent: "center", marginTop: "0rem", width: '100%', overflowY: 'scroll' }} >
                <div className='ApplicationMainDiv'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '20rem', }}>
                        <div>
                            <label>From</label>
                            <input type={'date'} onChange={(event) => HandleDateTime('from', event.target.value)}></input>
                        </div>
                        <div>
                            <label>to</label>
                            <input type={'date'} onChange={(event) => HandleDateTime('to', event.target.value)}></input>
                        </div>
                    </div>
                    <div>
                        <label> select Type</label><br />
                        <select onChange={(event)=>handleLeaveType(event.target.value)}>
                            <option value={'MaternityLeave'}>Maternity Leave</option>
                            <option value={'CasualLeave'}>Casual Leave</option>
                            <option value={'SickLeave'}>Sick Leave</option>
                            <option value={'LeaveWithoutPay'}>Leave Without Pay</option>
                            <option value={'PrivilegedLeave'}>Privileged Leave</option>
                        </select>
                    </div>
                    <textarea onChange={(e)=>setreason(e.target.value)} className='ApplicationReasonTextArea' placeholder='Comments'></textarea>
                    <div>
                        <label>Get Apporved By</label>
                        <Select
                            components={animatedComponents}
                            options={AllUserprofile}
                            closeMenuOnSelect={true}
                            // isMulti
                            onChange={(e) => TeamMembersHandler(e)}
                        />
                    </div>
                    <button className='ApplicationSubmitButton' onClick={() => ApplyLeave()}>Submit</button>
                </div>
            </Modal>
        </div>
    );
}

export default Application;
