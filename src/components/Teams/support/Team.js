import { Modal } from '@material-ui/core';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Converted from '../Pages/Converted';
import CreateQuote from '../Pages/CreateQuote';
import Empty from '../Pages/empty';
import FollowUp from '../Pages/FollowUp';
import Investigation from '../Pages/Investigation';
import TeamEdit from '../Pages/TeamEdit';

const Team = ({ open, onclose, data,profile,auth }) => {
    const [page, setpage] = useState('Investigation')
    const [seleteduser, setUser] = useState('')
    const[count,setcount]=useState(0)
    const[countConverted,setcountConverted]=useState(0)
    function screenController(args) {
        setcount(0)
        setcountConverted(0)
        setpage(args)

    }
    function updateUser(user){
        setUser(user)
        setpage('Empty')
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
                <div style={{ background: 'white' }}>
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
                        <span className='ButtonEffect' onClick={() => screenController('Investigation')}>Investigation</span>
                        <span className='ButtonEffect' onClick={() => screenController('Create quote')}>Create quote</span>
                        <span className='ButtonEffect' onClick={() => screenController('Follow up')}>Follow up({count})</span>
                        <span className='ButtonEffect' onClick={() => screenController('Converted')}>Converted ({countConverted})</span>
                        <span className='ButtonEffect' onClick={() => screenController('Edit Team')}>Team</span>
                    </div>
                    <div>
                        {
                            page === 'Investigation' ? <><Investigation uid={seleteduser} TeamProfile={data.TeamMembers} /></> : <></>
                        }{
                            page === 'Create quote' ? <><CreateQuote  setcount={setcount} uid={seleteduser} profile={profile} TeamProfile={data.TeamMembers}/></> : <></>
                        }{
                            page === 'Follow up' ? <><FollowUp setcount={setcount} uid={seleteduser} auth={auth} profile={profile} /></> : <></>
                        }{
                            page === 'Converted' ? <><Converted   setcount={setcountConverted} uid={seleteduser} auth={auth} profile={profile} /></> : <></>
                        }{
                            page === 'Edit Team' ? <><TeamEdit  profile={profile} TeamProfile={data.TeamMembers}/></> : <></>
                        }
                        {
                            page === 'Empty' ? <><Empty/></> : <></>
                        }
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Team;
