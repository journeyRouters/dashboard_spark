import { Modal } from '@material-ui/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import '../../App.css';
import moment from 'moment';
import app from '../required';
import { isAdmin } from '@firebase/util';


const Loginform = (props) => {
    var currentdate = new Date();
    const [userName, setUserName] = useState("")
    const [userWhatsApp_number, setUserWhatsApp_number] = useState("")
    const [contact, setContact] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [userName_flg, setUserName_flg] = useState(false)
    const [userWhatsApp_number_flg, setUserWhatsApp_number_flg] = useState(false)
    const [contact_flg, setContact_flg] = useState(false)
    const [email_flg, setEmail_flg] = useState(false)
    const [password_flg, setpassword_flg] = useState(false)
    const [hasaccount, sethasaccount] = useState(true)
    // const[error_flg,set_error_flg]=useState(false)
    const db = getFirestore(app);
    function userNameOnChange(e) {
        setUserName(e.target.value)
        setUserName_flg(false)
    }
    function userWhatsAppNumberOnChange(e) {
        setUserWhatsApp_number(e.target.value)
        setUserWhatsApp_number_flg(false)
    }
    function userContactOnChange(e) {
        setContact(e.target.value)
        setContact_flg(false)
    }
    function emailOnChange(e) {
        setemail(e.target.value)
        setEmail_flg(false)
    }
    async function fetch_profile(args) {
        // console.log("fetch profile from login page")
        const docRef = doc(db, "Profile", args.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            props.setData(docSnap.data())
            // console.log("Document data:", docSnap.data());
        } else {
        }

    }
    function set_profile(args) {
        // console.log("called", args)
        try {
            setDoc(doc(db, "Profile", args.uid), {
                name: userName,
                account_created_date: moment(currentdate).format('YYYY-MM-DD'),
                account_create_time: moment(currentdate).format('h:mm:ss'),
                account_updated_date: moment(currentdate).format('YYYY-MM-DD'),
                account_updated_time: moment(currentdate).format('h:mm:ss'),
                WhatsApp_number: userWhatsApp_number,
                contact_number: contact,
                access_type: "Block",
                email: args.email,
                following_lead: [],
                uid: args.uid,
                Lead_Current: [],
                Lead_followUp: [],
                Lead_Vouchers: [],
                Lead_Dump: [],
                Lead_converted: [],
                user_type: "show",
                Target: {},
                Leave: {
                    CasualLeave: 10,
                    LeaveWithoutPay: 10,
                    MaternityLeave: 182,
                    PrivilegedLeave: 12,
                    SickLeave: 4
                },
                AttendanceId: ''
            });
        }
        catch (error) {
            console.log(error)
        }
        // SetCustomUserClaims(args.uid)
    }
    function newAccount() {
        sethasaccount(!hasaccount)
    }
    function submit() {
        // console.log(email.slice(-10))

        if (email.length === 0) {
            setEmail_flg(true)

        }
        else if (password.length === 0) {
            setpassword_flg(true)
        }
        else {
            login()

        }


    }
    function signUp() {
        // console.log(email.slice(-10))

        if (email.length === 0) {
            setEmail_flg(true)

        }
        else if (password.length === 0) {
            setpassword_flg(true)
        }
        else if (userName.length === 0) {
            setUserName_flg(true)
        }
        else if (userWhatsApp_number.length === 0) {
            setUserWhatsApp_number_flg(true)
        }
        else if (contact.length === 0) {
            setContact_flg(true)
        }
        else {
            create_id()

        }


    }


    function passwordOnChange(e) {
        setpassword(e.target.value)
        setpassword_flg(false)

    }
    function handelClose() {
        // props.refreshPage()
        props.setopen(false)
    }
    const auth = getAuth();
    //   function SetCustomUserClaims(uid){
    //     admin.auth.setCustomUserClaims(uid, { admin: true }).then(()=>{})
    //   }
    async function create_id() {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                props.setauth(user)
                set_profile(user)
                fetch_profile(user)
                // console.log(user)
                handelClose()

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // console.log(errorCode)
                setEmail_flg(true)
                setpassword_flg(true)
                // debugger
            });
    }
    function login() {
        try {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    fetch_profile(user)
                    handelClose()
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setEmail_flg(true)
                    setpassword_flg(true)
                });
        }
        catch (errorSignIn) {
            console.log(errorSignIn)
        }

    }
    return (
        <Modal style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }} open={props.open} onClose={handelClose} >
            <>
                <div className={hasaccount ? 'popUp' : 'popUp_'}>
                    {
                        hasaccount ? <>
                        </> :
                            <>
                                <input type="sapn" className={userName_flg ? 'inputEmailerror' : 'inputEmail'} placeholder='Name' value={userName} onChange={(e) => userNameOnChange(e)}></input>
                                <input type="tel" className={userWhatsApp_number_flg ? 'inputEmailerror' : 'inputEmail'} placeholder="What's App" value={userWhatsApp_number} onChange={(e) => userWhatsAppNumberOnChange(e)}></input>
                                <input type="tel" className={contact_flg ? 'inputEmailerror' : 'inputEmail'} placeholder='Contact' value={contact} onChange={(e) => userContactOnChange(e)}></input>
                            </>
                    }

                    <input type="email" className={email_flg ? 'inputEmailerror' : 'inputEmail'} placeholder='Email' value={email} onChange={(e) => emailOnChange(e)}></input>
                    <input type="password" className={password_flg ? 'inputPassworderror' : 'inputPassword'} placeholder='Password' value={password} onChange={(e) => passwordOnChange(e)}></input>
                    <button className='signInWithGoogle'
                    // onClick={() => signIn()}
                    >
                        <img alt="google img" src="/assets/img/Icon.svg" width="25px" height="25px" />
                        <p className='signInWithGoogleText'>
                            sign up with Google
                        </p>
                    </button>
                    <button className='signInWithGoogle'>
                        <img alt="google img" src="/assets/img/facebook.svg" width="25px" height="25px" />
                        <p className='signInWithGoogleText'>
                            sign up with facebook
                        </p>
                    </button>
                    {
                        hasaccount ?
                            <button className='signIn' onClick={() => submit()}>sign In</button>
                            :
                            <button className='signIn' onClick={() => signUp()}>sign Up</button>
                    }
                    {
                        hasaccount ?
                            <p className='create_new_account' onClick={() => newAccount()}>create new account !</p>
                            :
                            <p className='create_new_account' onClick={() => newAccount()}>sign In</p>
                    }


                </div>
            </>
        </Modal>
    );
}

export default Loginform;
