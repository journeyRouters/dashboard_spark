import { Modal } from '@material-ui/core';
import { collection, doc, getDoc, getFirestore, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import app from '../../required';


const Createteamform = ({ open, onclose, profile }) => {
    var today = new Date()
    const db = getFirestore(app)
    const [TeamName, setTeamName] = useState(null)
    const [TeamTarget, setTeamTarget] = useState(0)
    const [TeamMembers, setTeamMembers] = useState([])
    const animatedComponents = makeAnimated();
    const [similarName, setSimilarname] = useState(null)
    const [AllUserprofile, setAllUserprofile] = useState([])
    function TeamNameHandler(e) {
        setTeamName(e.target.value)
    }
    function TeamTargethandler(e) {
        setTeamTarget(e.target.value)
    }
    function TeamMembersHandler(e) {
        setTeamMembers(e)
    }
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "==", "User"), where('user_type', '==', 'show'));
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

    async function CheckAvailablityForName(TeamName) {        var ref = doc(db, 'Team', TeamName)
        // var q=query(ref,where("Member.Name","==","kishor"))
        var firequery = await getDoc(ref)
        if (firequery.exists()) {
            return true
            // setSimilarname(true)
            // console.log(true)
        }
        else {
            // setSimilarname(false)
            // console.log(false)
            return false
        }
    }
    useEffect(() => {
        getAllUserProfie()
        // CheckAvailablityForName().then((value)=>console.log(value))
        //    console.log(CheckAvailablityForName().then(value))
    }, []);

    async function setTeamData() {
        await setDoc(doc(db, "Team", TeamName), {
            TeamName: TeamName,
            TeamMembers: TeamMembers,
            TeamTarget: TeamTarget,
            createdDate: today,
            createdBy: { name: profile.name, uid: profile.uid },
            updatedDate: today,
            updatedBy: { name: profile.name, uid: profile.uid },
            PermissionStatus:'Hold',


        });
    }
    async function uploadDetailsOfTeam() {
        CheckAvailablityForName(TeamName).then((value) => {
            if (value) {
                setSimilarname(true)
            }
            else {
                setSimilarname(false)   
                setTeamData()
                onclose()
            }
        }
        )
    }

    return (
        <div>
            {/* <Modal open={open} onClose={onclose} style={{ display: "flex", justifyContent: "center", background: 'gray' }} >
                <>hihihi</>
            </Modal> */}
            <Modal open={open} onClose={onclose} style={{ display: "grid", justifyContent: "center", marginTop: "2rem", overflowY: 'scroll', background: 'whitegray' }}>
                <div className='form-feild'>
                    <div>
                        <label className='label'>Team Name</label><br />
                        {similarName ? <>
                            <label style={{ fontSize: '9px', color: '#d21ea0' }}>Try diffrenet Name, this is assigned</label><br /></> :
                            <></>
                        }
                        <input className={similarName ? 'setInput1' : 'setInput'} placeholder='Choose a unique Name' onChange={(e) => TeamNameHandler(e)}></input>
                    </div>
                    <div>
                        <label className='label'>Team Target</label><br />
                        <input className='setInput' type={'number'} onChange={(e) => TeamTargethandler(e)} placeholder='performance wil be calculated on this target'></input>
                    </div>
                    <div>
                        <label className='label'>Team Members</label><br />
                        <Select
                            components={animatedComponents}
                            options={AllUserprofile}
                            closeMenuOnSelect={false}
                            isMulti
                            onChange={(e) => TeamMembersHandler(e)}
                        />
                    </div>
                    <div className='Button_save'>
                        <button className='SaveTeam' onClick={() => uploadDetailsOfTeam()}>Create Team</button>
                    </div>
                </div>
            </Modal>

        </div>
    );
}

export default Createteamform;
