import React, { useState, useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup } from '@material-ui/core';
import { PersonOutlined } from '@material-ui/icons';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import app from '../required';
import './usercontrol.css';

const Userunitcomponent = (props) => {
    const db = getFirestore(app);
    const animatedComponents = makeAnimated();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [access_type, setAccessType] = useState('');
    const [WhatsApp_number, setWhatsApp_number] = useState('');
    const [userType, setUserType] = useState({ value: '', label: '' });
    const [lead_list, setLead_list] = useState([]);

    const Access = [
        { value: 'Hide', label: 'Hide' },
        { value: 'show', label: 'show' },
        { value: 'other', label: 'other' }
    ];

    var currentdate = new Date();

    useEffect(() => {
        setName(props.data.name);
        setEmail(props.data.email);
        setContact(props.data.contact_number);
        setAccessType(props.data.access_type);
        setWhatsApp_number(props.data.WhatsApp_number);
        setUserType({ value: props.data.user_type, label: props.data.user_type });
        setLead_list(props.data.following_lead || []);
    }, [props.data]);

    function handleUserType(args) {
        setUserType({ value: args.value, label: args.value });
    }

    function leadHandler(e) {
        const list = e.map(item => item.value);
        setLead_list(list);
    }

    function changeAcessType(args) {
        setAccessType(args.target.value);
    }

    async function updateUserDetails() {
        try {
            const user = doc(db, "Profile", props.data.uid);
            await updateDoc(user, {
                name,
                account_updated_date: `${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()}`,
                account_updated_time: `${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}`,
                WhatsApp_number,
                contact_number: contact,
                access_type,
                email,
                user_type: userType.value,
                following_lead: lead_list
            });
            props.datahandle();
            props.closeModal(); // Close modal after updating
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="main">
                <div className='logo'>
                    <PersonOutlined color='primary' fontSize='large' />
                </div>
                <div className='user_details'>
                    <p><strong>E-mail:</strong> {props.data.email}</p>
                    <p><strong>Name:</strong> {props.data.name}</p>
                    <p><strong>Access Type:</strong> {props.data.access_type}</p>
                    <p><strong>Contact Number:</strong> {props.data.contact_number}</p>
                </div>
                <div>
                    <button className='access_control' onClick={props.onEdit}>Edit</button>
                </div>
            </div>

            {props.isEditMode && (
                <Modal style={{ display: "flex", justifyContent: "center", alignItems: "center" }} open={true} onClose={props.closeModal}>
                    <div className='edit_main'>
                        <PersonOutlined color='primary' fontSize='large' />
                        <div className='input_slot'>
                            <label>Name</label>
                            <input className='input' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='input_slot'>
                            <label>Email</label>
                            <input className='input' type="email" value={email} disabled />
                        </div>
                        <div className='input_slot'>
                            <label>Contact</label>
                            <input className='input' type="tel" value={contact} onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <div className='input_slot'>
                            <label>WhatsApp Number</label>
                            <input className='input' type="tel" value={WhatsApp_number} onChange={(e) => setWhatsApp_number(e.target.value)} />
                        </div>
                        <div className='access_setter'>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Access</FormLabel>
                                <RadioGroup value={access_type} onChange={changeAcessType}>
                                    <FormControlLabel value="User" control={<Radio />} label="User" />
                                    <FormControlLabel value="Caller" control={<Radio />} label="Caller" />
                                    <FormControlLabel value="Flight" control={<Radio />} label="Flight" />
                                    <FormControlLabel value="freelance" control={<Radio />} label="freelance" />
                                    <FormControlLabel value="Unauthorise" control={<Radio />} label="Unauthorise" />
                                    <FormControlLabel value="Block" control={<Radio />} label="Block" />
                                    <FormControlLabel value="Team Leader" control={<Radio />} label="Team Leader" />
                                    <FormControlLabel value="Operation" control={<Radio />} label="Operation" />
                                    <FormControlLabel value="Accounts" control={<Radio />} label="Accounts" />
                                    <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                    <FormControlLabel value="Super Admin" control={<Radio />} label="Super Admin" />
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className='input_slot'>
                            <label>User Type</label>
                            <Select options={Access} components={animatedComponents} onChange={handleUserType} value={userType} />
                        </div>
                        <button className='access_control' onClick={updateUserDetails}>Submit</button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default Userunitcomponent;
