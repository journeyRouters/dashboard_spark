import { Modal } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './Driver.css';
import React from 'react';
import moment from 'moment';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../required';
import DriverComponents from './DriverComponents';
const db = getFirestore(app);


const Driver = () => {
    const [lead_data, setLead_data] = useState([])
    var today = new Date()
    var currentdate = moment(today).format('YYYY-MM-DD')
    const [selectedDate, setSeletctedDate] = useState(null)
    const [profile, setprofile] = useState([])
    // console.log(print)
    const [openlistOfUsers, setopenlistOfUsers] = useState(false)
    function handleListChange() {
        setopenlistOfUsers(!openlistOfUsers)
    }

    async function getLeadByDate(date) {
        var list = []
        var q = query(collection(db, "Trip"), where('uploaded_date', '==', date));
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
                // doc.data() is never undefined for query doc snapshots
            });
            setLead_data(list)
            console.log(list);
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
            console.log(Profile,);
        });
        return () => unsubscribe()

    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
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
                    <input onChange={(e) => setSeletctedDate(e.target.value)} type='date'></input>
                    <button onClick={() => getLeadByDate(selectedDate)}>Search</button>
                </div>
                <span style={{ background: 'yellow' }}>Total uploaded leads= {lead_data.length}</span>
                <button className='userlist_button' onClick={handleListChange}>All listed User</button>
            </div>
            <div>
                {lead_data.map((data, index) => (
                    <DriverComponents profile={profile} data={data} index={index} getLeadByDate={getLeadByDate} />
                ))}
            </div>
        </div>
    );
}

export default Driver;
