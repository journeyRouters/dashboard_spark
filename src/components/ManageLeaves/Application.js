import { Modal } from '@material-ui/core';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import app from '../required';
import makeAnimated from 'react-select/animated';
import './Leave.css'
const Application = () => {
    const db = getFirestore(app)
    const animatedComponents = makeAnimated();
    const [TeamMembers, setTeamMembers] = useState([])
    const [openForm, setOpenForm] = useState(false)
    const [AllUserprofile, setAllUserprofile] = useState([])
    function hadleClose() {
        setOpenForm(!openForm)
    }
    function TeamMembersHandler(e) {
        setTeamMembers(e)
    }
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["admin", "Super Admin", "Team Leader"]), where('user_type', '==', 'show'));
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
                            <input type={'date'}></input>
                        </div>
                        <div>
                            <label>to</label>
                            <input type={'date'}></input>
                        </div>
                    </div>
                    <div>
                        <label> select Type</label><br />
                        <select>
                            <option>Maternity Leave</option>
                            <option>Casual Leave</option>
                            <option>Sick Leave</option>
                            <option>Leave Without Pay</option>
                            <option>Privileged Leave</option>
                        </select>
                    </div>
                    <textarea className='ApplicationReasonTextArea' placeholder='Comments'></textarea>
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
                    <button className='ApplicationSubmitButton' onClick={()=>alert('this function is under repair')}>Submit</button>
                </div>
            </Modal>
        </div>
    );
}

export default Application;
