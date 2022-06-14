import { FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup } from'@material-ui/core';
import { PersonOutlined } from'@material-ui/icons';
import { doc, getFirestore, updateDoc } from'firebase/firestore';
import React, { useState } from'react';
import Select from'react-select';
import makeAnimated from'react-select/animated';
import app from'../required';
import'./usercontrol.css';

const Userunitcomponent = (props) => {
    const db = getFirestore(app);
    // console.log(props.user)
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState(props.data.name)
    const [email, setEmail] = useState(props.data.email)
    const [contact, setContact] = useState(props.data.contact_number)
    const [access_type, setAccessType] = useState(props.data.access_type)
    const [WhatsApp_number, setWhatsApp_number] = useState(props.data.WhatsApp_number)
    const animatedComponents = makeAnimated();
    const [lead_list,setLead_list]=useState([])
    const Destinations = [
        { value:'Thailand', label:'Thailand', color:'#00B8D9' },
        { value:'Bali', label:'Bali', color:'#0052CC' },
        { value:'Dubai', label:'Dubai', color:'#5243AA'},
        { value:'Europe', label:'Europe', color:'#FF5630', },
        { value:'Sri Lanka', label:'Sri Lanka', color:'#FF8B00'},
        { value:'Mauritius', label:'Mauritius', color:'#FFC400'},
        { value:'Seychelles', label:'Seychelles', color:'#36B37E'},
        { value:'Vietnmam', label:'Vietnmam', color:'#00875A' },
        { value:'Malaysia', label:'Malaysia', color:'#253858' },
        { value:'Singapore', label:'Singapore', color:'#666666' },
        { value:'Australia', label:'Australia', color:'#666666' },
        { value:'New Zealand', label:'New Zealand', color:'#666666' },
        { value:'Kashmir', label:'Kashmir', color:'#666666' },
        { value:'Himachal', label:'Himachal', color:'#666666' },
        { value:'Rajasthan', label:'Rajasthan', color:'#666666' },
        { value:'Uttrakhand', label:'Uttrakhand', color:'#666666' },
        { value:'Goa', label:'Goa', color:'#666666' },
        { value:'Kerala', label:'Kerala', color:'#666666' },
        { value:'Andaman', label:'Andaman', color:'#666666' },
        { value:'Sikkim', label:'Sikkim', color:'#666666' },
        { value:'Karnataka', label:'Karnataka', color:'#666666' },
    ];
    var currentdate = new Date();
    function leadHandler(e){
        const list=[]
        for(let len=0;len<=e.length-1; len++){
            list.push(e[len].value)
            // console.log(e[len].value)
        }
        // console.log(list)
        setLead_list(list)
    }
    function changeAcessType(args){
        setAccessType(args.target.value)
    }
    function onChangeName(e) {
        setName(e.target.value)
    }
    function onChangeEmail(e) {
        setEmail(e.target.value)
    }
    function onChangeContact(e) {
        setContact(e.target.value)
    }
    function onChangeWhatsAppNumber(e) {
        setWhatsApp_number(e.target.value)
    }

    function handelClose() {
        setEdit(false)
    }
    function editmode() {
        setEdit(true)
    }
    async function updateUserDetails() {
        try{
            console.log({name ,access_type,WhatsApp_number,contact})
            console.log(props.data)
            const user = doc(db, "Profile", props.data.uid);
            await updateDoc(user,{
                name: name,
                account_updated_date: `${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()}`,
                account_updated_time: `${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}:${currentdate.getMilliseconds()}`,
                WhatsApp_number: WhatsApp_number,
                contact_number: contact,
                access_type: access_type,
                email: props.data.email,
                following_lead: lead_list
            });
            console.log("pp")
            props.datahandle()
            handelClose()
        }
        catch (error){
            console.log(error)
        }
        
    }
    return (
        <>
            <div className="main">
                <div className='logo'>
                    <PersonOutlined
                        color='primary'
                        fontSize='large'
                    />
                </div>
                <div className='user_details'>
                    <p>E-mail:-{props.data.email}</p>
                    <p>Name:-{props.data.name}</p>
                    <p>access_type:-{props.data.access_type}</p>
                    <p>following_lead:-{props.data.following_lead}</p>
                    <p>contact_number:-{props.data.contact_number}</p>
                </div>
                <div >
                    <button className='access_control' onClick={() => editmode()}>Edit</button>
                </div>
            </div>
            {
                edit ?
                    <Modal style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }} open={edit} onClose={handelClose} >
                        <div className='edit_main'>
                            <PersonOutlined
                                color='primary'
                                fontSize='large'
                            />
                            <div className='input_slot'>
                                <label>name</label>
                                <input className='input' type="text" placeholder='Name' value={name} onChange={(e) => onChangeName(e)}></input>
                            </div>
                            <div className='input_slot'>
                                <label>email</label>
                                <input className='input' type="email" placeholder='E-mail' value={email} onChange={(e) => onChangeEmail(e)}></input>
                            </div>
                            <div className='input_slot'>
                                <label>contact</label>
                                <input className='input' type="tel" placeholder='Contact' value={contact} onChange={(e) => onChangeContact(e)}></input>
                            </div>
                            <div className='input_slot'>
                                <label>what's app</label>
                                <input className='input' type="tel" placeholder="What's app" value={WhatsApp_number} onChange={(e) => onChangeWhatsAppNumber(e)}></input>
                            </div>
                            <div className='access_setter'>
                                <div>
                                    <FormControl onChange={(e) => changeAcessType(e)}>
                                        <FormLabel >Access</FormLabel>
                                        <RadioGroup value={access_type} >
                                            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                                            <FormControlLabel value="User" control={<Radio />} label="User" />
                                            <FormControlLabel value="Unauthorise" control={<Radio />} label="Unauthorise" />
                                            <FormControlLabel value="Block" control={<Radio />} label="Block" />
                                        </RadioGroup>
                                    </FormControl>
                                </div>
                                <div>
                                    <Select
                                        
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={Destinations}
                                        onChange={(e)=>leadHandler(e)}
                                    />
                                </div>
                            </div>
                            <button className='userupdateButton' onClick={()=>updateUserDetails()}>update</button>
                        </div>
                    </Modal>
                    : <></>
            }
        </>
    );
}

export default Userunitcomponent;
