import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import app from '../../required';
import Createteamform from './Createteamform';
import Team from '../support/Team';
import '../Teams.css'
import PieRechartComponent from './PieRechartComponent';

const Main_Admin = ({ profile ,auth }) => {
    console.log(profile)
    const db = getFirestore(app)
    const [open, setopen] = useState(false)
    const [Teams, setTeams] = useState([])
    const [TeamUnit, setTeamUnit] = useState(false)
    const [TeamData, setTeamData] = useState([])
    function TeamUnitClose() {
        setTeamUnit(false)
    }
    function handleTeam(data) {
        setTeamData(data)
        setTeamUnit(true)
    }
    function createTeamFormHandler() {
        setopen(true)
    }
    function onclose() {
        setopen(false)
    }
    useEffect(() => {
        const q = query(collection(db, "Team"),
            where("PermissionStatus", "==", 'Hold'), orderBy('createdDate')
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Team = [];
            // console.log(times)
            querySnapshot.forEach((doc) => {
                Team.push(doc.data());
            });
            // console.log(Team)
            setTeams(Team)
        });
        // arrange()
    }, []);
    return (
        <div>
            <div className='createLeadButton'>
                <button onClick={() => createTeamFormHandler()}>Create Team</button>
            </div>
            {
                open ?
                    <Createteamform open={open} onclose={onclose} profile={profile} /> :
                    <></>
            }
            <div>
                {
                    (Teams.slice(0).reverse()).map((data, index) => (<>
                        <div onClick={() => handleTeam(data)} className='teamdiv'>
                            <div>
                                <img alt='sales team img' src='/assets/img/sales-icon-12.png' width='170px' height='120px' />
                                <h1 style={{ marginLeft: '1rem', marginTop: '-0.5rem' }}>
                                    {data.TeamName}
                                </h1>
                            </div>
                            <div>
                                <span style={{ fontSize: '15px', fontWeight: '600' }}> Leaded BY:-{data.createdBy.name}</span>
                                <div style={{ marginTop: '2rem', marginLeft: '0.5rem' }}>
                                    {
                                        data.TeamMembers.map((data, index) => <>
                                            <ul style={{ fontSize: '10px', fontWeight: '600' }}>
                                                <li>{data.label}</li>
                                            </ul>
                                        </>)
                                    }
                                </div>
                            </div>
                            <div style={{ width: '12rem' }} >
                                <span style={{marginLeft:'3rem',fontSize:'1.1rem',fontWeight:'700'}}>Lead Seeded</span><br />
                                <PieRechartComponent />
                            </div>
                            <div style={{ width: '12rem' }}>
                            <span style={{marginLeft:'3rem',fontSize:'1.1rem',fontWeight:'700'}}>Lead Converted</span><br />

                                <PieRechartComponent />

                            </div>
                            <div style={{ width: '12rem' }}>
                            <span style={{marginLeft:'3rem',fontSize:'1.1rem',fontWeight:'700'}}>Lead Dump</span><br />

                                <PieRechartComponent />

                            </div>
                            <button style={{ height: '2rem' }}>Allowed</button>
                        </div>
                    </>))
                }
                {
                    TeamUnit ? <>
                        <Team open={TeamUnit} onclose={TeamUnitClose} data={TeamData}  profile={profile} auth={auth} />
                    </> : <></>
                }
            </div>



        </div>
    );
}

export default Main_Admin;
