import { Modal } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Converted from '../Pages/Converted';
import CreateQuote from '../Pages/CreateQuote';
import FollowUp from '../Pages/FollowUp';
import Investigation from '../Pages/Investigation';
import TeamEdit from '../Pages/TeamEdit';
import TeamGraph from '../Pages/TeamGraph';

const Team = ({ open, onclose, data }) => {
    const [page, setpage] = useState('Team Graph')
    const [seleteduser, setUser] = useState('')
    function screenController(args) {
        setpage(args)
    }
    function updateUser(user){
        setUser(user)
    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = data.TeamMembers.filter((data) => data.uid === uid)
        setUser(profile_of_user)

    }
    // console.log(data)
    return (
        <div>
            <Modal open={open} style={{ marginTop: '2rem', overflowY: 'scroll' }} >
                <div style={{ background: 'white', height: '44rem', }}>
                    <div className='headerTeam'>
                        <button onClick={() => onclose()}>close</button>
                        <select onChange={(e) => updateUser(e.target.value)} >
                            <option value={0}>Select User</option>
                            {
                                data.TeamMembers.map((member, index) =>
                                    <option key={index} value={member.value}>{member.label}</option>
                                )
                            }
                        </select>
                        <span className='ButtonEffect' onClick={() => screenController('Team Graph')}>Team Graph</span>
                        <span className='ButtonEffect' onClick={() => screenController('Investigation')}>Investigation</span>
                        <span className='ButtonEffect' onClick={() => screenController('Create quote')}>Create quote</span>
                        <span className='ButtonEffect' onClick={() => screenController('Follow up')}>Follow up</span>
                        <span className='ButtonEffect' onClick={() => screenController('Converted')}>Converted</span>
                        <span className='ButtonEffect' onClick={() => screenController('Edit Team')}>Edit Team</span>
                    </div>
                    <div>
                        {
                            page === 'Team Graph' ? <><TeamGraph /></> : <></>
                        }{
                            page === 'Investigation' ? <><Investigation /></> : <></>
                        }{
                            page === 'Create quote' ? <><CreateQuote uid={seleteduser} /></> : <></>
                        }{
                            page === 'Follow up' ? <><FollowUp /></> : <></>
                        }{
                            page === 'Converted' ? <><Converted /></> : <></>
                        }{
                            page === 'Edit Team' ? <><TeamEdit /></> : <></>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Team;
