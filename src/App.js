import { BackupOutlined, FileCopyOutlined, Fingerprint, Speed, PersonOutlineOutlined } from '@material-ui/icons';
import { fromEvent } from "file-selector";
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, uploadString } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import readXlsxFile from 'read-excel-file';
import './App.css';
import FollowUp from './components/quotation_follow_up/Follow_up';
import Rapid from './components/Rapid/Rapid';
import app from './components/required';
import Test from './components/tester/Test';
import Usercontrol from './components/usercontrol/UserControl';
import Createquote from './components/CreateQuote/CreateQuote';
import Loginform from './components/CreateQuote/loginForm';
import Vouchers from './components/payments_vouchers/Vouchers'
import TestTable from './components/tester/TestTable';


function App() {
  const storage = getStorage();
  const currentdate = new Date();
  const [profile, setData] = React.useState()
  const [open, setopen] = React.useState(false)
  const db = getFirestore(app);
  const [auth, setauth] = useState()
  const [Page, setPage] = React.useState("")
  const oauth = getAuth();
  // const [inProgress,setInProgress]=React.useState(false)
  // const unsub = onSnapshot(doc(db, "cities", "LA"), (doc) => {
  //   // console.log("Current data: ", doc.data());
  //   // setData(doc.data())

  // });

  function setAuthFirebase(args) {
    console.log("setting auth")
    setauth(args)
    console.log("auth set")
  }
  function openPopUp() {
    setopen(true)
  }
  async function UploadFile() {
    if (auth) {
      console.log(auth)
      const handles = await window.showOpenFilePicker({ multiple: false });
      const files = await fromEvent(handles);
      const path = files[0].path
      // setInProgress(true)
      readXlsxFile(files[0]).then((rows) => {
        for (let i = 1; i <= rows.length - 1; i++) {
          let Row = rows[i]
          let id = `trp00${i}`
          setDoc(doc(db, "Trip", `trp00${i}`), {
            TripId: "TRP" + Math.random(),
            trip_doc: id,
            Lead_Status: Row[0],
            Campaign_code: Row[1],
            Date_of_lead: Row[2],
            Traveller_name: Row[3],
            Extra_Info: Row[4],
            Contact_Number: Row[5],
            Destination: Row[6],
            Comment: Row[7],
            Departure_City: Row[8],
            Travel_Date: Row[9],
            Travel_Duration: Row[10],
            Budget: Row[11],
            Pax: Row[12],
            Child: Row[13],
            Email: Row[14],
            Remark: Row[15],
            Follow_Up_date: Row[16],
            uploaded_by: auth.email,
            Quoted_by: null,
            uploaded_date: `${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()}`,
            uploaded_time: `${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}:${currentdate.getMilliseconds()}`,
            quotation: 0,
            quotation_flg: false,
            month: '',
            comments: []

          });
        }
        // console.log(rows[1][0])
        uploadFileOnStorage(path,'dingdong')
      })
    }
    else {
      setopen(true)
    }
  }
  function uploadFileOnStorage(Filepath, folderName) {
    var storageFolderName = folderName ? folderName : 'Vouchers'
    const storageRef = ref(storage, `${storageFolderName}/${Filepath}`);
    const uploadTask = uploadBytes(storageRef, Filepath[0]);
    uploadTask.on('state_changed',
      (snapshot) => {
        console.log(snapshot)
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );

  }

  async function fetch_profile(args) {
    console.log(args)
    try {
      const docRef = doc(db, "Profile", args.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data())
        // console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
    catch (error) {
      console.log({ error })
    }


  }

  function logOut() {
    try {
      signOut(oauth).then(() => {
        setauth()
        setData()
        refreshPage()
      }).catch((error) => {
        // An error happened.
      });
    }
    catch (error) {
      console.log(error)
    }

  }
  function page(args) {
    setPage(args)
  }

  async function authListener() {
    oauth.onAuthStateChanged(user => {
      try {
        if (user) {
          setauth(user);
          // console.log(user)
        }
        else {
        }
      }
      catch (error) {
        console.log(error)
      }

    })
  }

  useEffect(() => {
    authListener()
  }, [auth])

  useEffect(() => {
    if (profile) {
    }
    else {
      fetch_profile(auth)
    }
  }, [auth]);

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <>

      {
        open ? <Loginform open={open} setopen={setopen} setauth={setAuthFirebase} setData={setData} refreshPage={refreshPage} /> : <></>
      }

      <div className='header'>
        <p className='headLine'>Journey Router</p>
        {
          auth ? <>
            <div>
              <button className='button' onClick={() => logOut()} >logout</button>
            </div>
          </> : <>
            <div className='button' onClick={() => openPopUp()}>
              <Fingerprint
                style={{ height: "5rem", width: "2rem" }}
              />
            </div>
          </>
        }

      </div>
      <div className='assembler'>
        <div className='sidebars'>
          <div className='sidebarCard' onClick={(() => page("rapid_fire"))}>
            <div className='sidebarCardContaint'>
              <Speed style={{ marginRight: "1rem" }} />
              <p>Rapid Fire</p>
            </div>
          </div>


          <div className='sidebarCard' onClick={() => page("create_quote")}>
            <div className='sidebarCardContaint'>
              <FileCopyOutlined style={{ marginRight: "1rem" }} />
              <p>Create Quote</p>
            </div>
          </div>
          <div className='sidebarCard' onClick={() => page("Quotation_Followup")}>
            <div className='sidebarCardContaint'>
              <FileCopyOutlined style={{ marginRight: "1rem" }} />
              <p>Quotation Followup</p>
            </div>
          </div>
          <div className='sidebarCard' onClick={(() => page("voucher"))}>
            <div className='sidebarCardContaint'>
              <PersonOutlineOutlined style={{ marginRight: "1rem" }} />
              <p>voucher & payments</p>
            </div>
          </div>
          <div className='sidebarCard' onClick={(() => page("profile"))}>
            <div className='sidebarCardContaint'>
              <PersonOutlineOutlined style={{ marginRight: "1rem" }} />
              <p>Profile</p>
            </div>
          </div>

          {
            profile ?
              <>
                {
                  profile.access_type === "admin" ?
                    <>
                      <div className='sidebarCard' onClick={() => page("User_Controller")}>
                        <div className='sidebarCardContaint'>
                          <FileCopyOutlined style={{ marginRight: "1rem" }} />
                          <p>User Controller</p>
                        </div>
                      </div>
                      <div className='sidebarCard' onClick={() => UploadFile()}>
                        <div className='sidebarCardContaint'>
                          <BackupOutlined style={{ marginRight: "1rem" }} />
                          <p>Feed The Lead</p>
                        </div>
                      </div>
                    </>
                    :
                    <></>
                }
              </> : <></>
          }
        </div>
        <div className='mainContaint'>
          {
            Page === "create_quote" ?
              <>{
                auth &&
                <Createquote auth={auth} userProfile={profile} />
              }
              </> : <></>
          }
          {
            Page === "rapid_fire" ?
              <Rapid />
              : <></>
          }
          {
            Page === "User_Controller" ?
              <Usercontrol auth={auth} data={profile} />
              : <></>
          }
          {
            Page === "Quotation_Followup" ?
              <>
                {
                  auth &&
                  <FollowUp auth={auth} profile={profile} />
                }
              </>
              : <></>
          }
          {Page === "voucher" ?
            <>
              {
                auth &&
                <Vouchers auth={auth} />
              }
            </>
            : <></>
          }
          {
            Page === "profile" ?
              <>
                {/* <Test /> */}
              </>
              : <></>
          }
        </div>
      </div>
      {/* <button className='top'>Top</button> */}
    </>

  );
}

export default App;
