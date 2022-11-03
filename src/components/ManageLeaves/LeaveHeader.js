import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import './Leave.css'
import app from '../required';
const db = getFirestore(app);


const LeaveHeader = ({profile:userProfile,}) => {
    const[profile,setProfile]=useState(null)
    async function fetch_profile(uid) {
        // console.log(args)
        try {
          const docRef = doc(db, "Profile", uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data())
          }
        }
        catch (error) {
          console.log({ error })
        }
      }
      useEffect(() => {
       fetch_profile(userProfile.uid)
      }, []);
    return (
        <div className='Leave_header' >
            <div className='unitDivCL'>
                <span>Casual Leave</span>
                <img alt='casual Leave'src='/assets/leaveAssets/casual.png' className='logoCL'/>
                <span>{profile?profile.Leave.CasualLeave:''} Days</span>

            </div>
            <div className='unitDivCL'>
            <span>Leave Without Pay</span>
                <img alt='Leave Without Pay'src='/assets/leaveAssets/lwp.jpg' className='logoCL'/>
                <span>{profile?profile.Leave.LeaveWithoutPay:''} Days</span>
            </div>
            <div className='unitDivCL'>
            <span>Privileged Leave</span>
                <img alt='Privileged Leave'src='/assets/leaveAssets/relax.jpg' className='logoCL'/>
                <span>{profile?profile.Leave.PrivilegedLeave:''} Days</span>
            </div>
            <div className='unitDivCL'>
            <span>Sick Leave</span>
                <img alt='Sick Leave'src='/assets/leaveAssets/sick.jpg' className='logoCL'/>
                <span>{profile?profile.Leave.SickLeave:''} Days</span>
            </div>
            <div className='unitDivCL'>
            <span>Maternity Leave</span>
                <img alt='maternity Leave'src='/assets/leaveAssets/maternity.jpg' className='logoCL'/>
                <span>{profile?(profile.Leave.MaternityLeave)/7:''} weeks</span>

            </div>

        </div>
    );
}

export default LeaveHeader;
