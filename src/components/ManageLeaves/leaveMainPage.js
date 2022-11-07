import React from 'react';
import Application from './Application';
import LeaveHeader from './LeaveHeader';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import app from '../required';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment';
import './Leave.css'
const db = getFirestore(app);

const LeaveMainPage = ({ profile, auth }) => {
    const [AllLeaves, setAllLeaves] = useState([])
    async function getLeaveApplication() {
        var localList = []
        const q = query(collection(db, "Leaves"), where("appliedBY.uid", "==", auth.uid))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            localList.push(doc.data())
        });
        setAllLeaves(localList)
    }
    useEffect(() => {
        getLeaveApplication()
    }, []);
    return (
        <div>
            <LeaveHeader profile={profile} />
            <Application profile={profile} auth={auth} getLeaveApplication={getLeaveApplication} />
            <div>
                {
                    AllLeaves.map((data, index) => <>
                        <div key={index} style={{ display: 'flex' }} >
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
                                    <span style={{ color: '#641d6b' }}>{data.approvedBy.label}</span>
                                    {/* Applied by {data.} */}
                                </div>
                            </div>
                            {
                                data.LeaveStatus === 'Approved' ?
                                    <img className='approverlogo' alt='Approved' src={'/assets/leaveAssets/Approved.png'} /> :
                                    <></>
                            }
                        </div>

                    </>)
                }
            </div>
        </div>
    );
}

export default LeaveMainPage;
