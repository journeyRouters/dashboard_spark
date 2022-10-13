import { Modal } from '@material-ui/core';
import React from 'react';

const Team = ({ open, onclose, data }) => {
    console.log(data)
    return (
        <div>
            <Modal open={open} style={{ marginTop: '2rem', overflowY: 'scroll' }} >
                <div style={{ background: 'white', height: '44rem' }}>
                    <div className='headerTeam'>
                        <button onClick={() => onclose()}>close</button>
                        <select>    
                            <option>Select User</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>

                        </select>
                        <span>Investigation</span>
                        <span>Create quote</span>
                        <span>Follow up</span>
                        <span>Converted</span>
                    </div>

                </div>
            </Modal>
        </div>
    );
}

export default Team;
