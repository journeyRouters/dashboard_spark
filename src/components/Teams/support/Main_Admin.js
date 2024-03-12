import { collection, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import Team from '../support/Team';
import '../Teams.css';
import Createteamform from './Createteamform';
import GraphHandler from './graphHandler';

const Main_Admin = ({ }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const auth = JSON.parse(localStorage.getItem('auth'));
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
            querySnapshot.forEach((doc) => {
                Team.push(doc.data());
            });
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
                        <div onClick={() => handleTeam(data)} className='teamdiv' key={index}>
                            <div>
                                <img alt='sales team img' src='/assets/img/sales-icon-12.png' width='170px' height='120px' />
                                <h2 style={{ marginLeft: '1rem', marginTop: '-0.5rem' }}>
                                    {data.TeamName}
                                </h2>
                            </div>
                            <div>
                                <span style={{ fontSize: '15px', fontWeight: '600' }}> Leader:-{data.createdBy.name}</span>
                                <div style={{ marginTop: '2rem', marginLeft: '0.5rem', overflowY: 'hidden', height: '6rem' }}>
                                    {
                                        data.TeamMembers.map((data, index) => <>
                                            <ul key={index} style={{ fontSize: '10px', fontWeight: '600', }}>
                                                <li>{data.label}</li>
                                            </ul>
                                        </>)
                                    }
                                </div>
                            </div>
                            <GraphHandler TeamData={data} />
                            <button style={{ height: '2rem' }}>Allowed</button>
                        </div>
                    </>))
                }
                {
                    TeamUnit ? <>
                        <Team open={TeamUnit} onclose={TeamUnitClose} data={TeamData} profile={profile} auth={auth} />
                    </> : <></>
                }
            </div>



        </div>
    );
}

export default Main_Admin;
