import { AccountBalanceWalletTwoTone, AccountTreeTwoTone, FileCopyOutlined, Fingerprint, GroupAddTwoTone, PersonOutlineOutlined, PublicOutlined, PublicTwoTone, SearchTwoTone, Speed, TrendingUp } from '@material-ui/icons';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import './App.css';
import Account_converted from './components/AdminController/Account_converted';
import AttendanceMain from './components/Attendance/AttendanceMain';
import UploadAttendance from './components/Attendance/uploadAttendance';
import Assignerhandler from './components/Calling/Pages/Assignerhandler';
import CreateQuote from './components/Calling/Pages/CreateQuote';
import Createquote from './components/CreateQuote/CreateQuote';
import Loginform from './components/CreateQuote/loginForm';
import SuperAdmin from './components/CreateQuote/SuperAdmin/SuperAdmin';
import Dump from './components/DumpLead/Dump';
import AdminInvestigation from './components/Investigation/AdminInvestigation';
import Freelance_Investigation from './components/Investigation/Freelance_Investigation';
import Investigation from './components/Investigation/investigation';
import Driver from './components/leadDriver/Driver';
import Leaves from './components/Leaves/Leaves';
import LeaveMainPage from './components/ManageLeaves/leaveMainPage';
import Duringstay from './components/payments_vouchers/operation/Duringstay';
import OprationConverted from './components/payments_vouchers/operation/oprationConverted';
import Poststay from './components/payments_vouchers/operation/Poststay';
import Vouchers from './components/payments_vouchers/Vouchers';
import AdminFollow from './components/quotation_follow_up/AdminFollow';
import FollowUp from './components/quotation_follow_up/Follow_up';
import app from './components/required';
import Main from './components/Teams/main';
import Adminleavefunnel from './components/Teams/Pages/AdminLeaveFunnel';
import Main_Admin from './components/Teams/support/Main_Admin.js';
import Test from './components/tester/Test';
import Usercontrol from './components/usercontrol/UserControl';
import CallerFollowUp from './components/Calling/Pages/CallerFollowUp';
import LeadFromCallers from './components/leadDriver/LeadFromCallers';
import CallerInvestigation from './components/Investigation/CallerInvestigation';


function App() {
  const storage = getStorage();
  const [profile, setData] = React.useState()
  const [open, setopen] = React.useState(false)
  const db = getFirestore(app);
  const [auth, setauth] = useState()
  const [Page, setPage] = React.useState("")
  const oauth = getAuth();

  function setAuthFirebase(args) {
    // console.log("setting auth")
    setauth(args)
    // console.log("auth set")
  }
  function openPopUp() {
    setopen(true)
  }

  function uploadFileOnStorage(Filepath, folderName) {
    var storageFolderName = folderName ? folderName : 'Vouchers'
    const storageRef = ref(storage, `${storageFolderName}/${Filepath}`);
    const uploadTask = uploadBytes(storageRef, Filepath[0]);
    uploadTask.on('state_changed',
      (snapshot) => {
        // console.log(snapshot)
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
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
          // console.log('File available at', downloadURL);
        });
      }
    );
  }
  async function fetch_profile(args) {
    // console.log(args)
    try {
      const docRef = doc(db, "Profile", args.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data())
        // console.log("Document data:", docSnap.data());
      } else {
        // console.log("No such document!");
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
    // console.log(args)
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
    if (profile) {
    }
    else {
      fetch_profile(auth)
    }

  }, [auth])

  useEffect(() => {


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
        <p className='headLine'>
          <img width={'276px'} style={{ marginLeft: '-4rem' }} src='/assets/pdfDefaultImage/JrLOGO_.png' />
        </p>
        {
          auth ? <>
            <div style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
              {
                profile ?
                  <span>Hello  {profile ? profile.name : ''}</span> : ''
              }
              <img width={'85px'} onClick={() => logOut()} src='https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2FLogout3.png?alt=media' >
              </img>
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
          {
            profile ?
              <>
                {
                  profile.access_type === "freelance" ? <>
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
                        <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                        <p>Vouchers & payments</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Freelance_Investigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>

                  </> : <></>
                }
                {
                  profile.access_type === "Team Leader" ? <>
                    <div className='sidebarCard' onClick={(() => page("rapid_fire"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Rapid Fire</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Attendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Attendance</p>
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
                        <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                        <p>Vouchers & payments</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("AdminInvestigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Team")}>
                      <div className='sidebarCardContaint'>
                        <GroupAddTwoTone style={{ marginRight: "1rem" }} />
                        <p>Team</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("leave policy")}>
                      <div className='sidebarCardContaint'>
                        <PublicOutlined style={{ marginRight: "1rem" }} />
                        <p>leave policy
                        </p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Manage Leave")}>
                      <div className='sidebarCardContaint'>
                        <PublicOutlined style={{ marginRight: "1rem" }} />
                        <p>Manage Leave
                        </p>
                      </div>
                    </div>
                  </> : <></>
                }
                {
                  profile.access_type === "User" ? <>
                    <div className='sidebarCard' onClick={(() => page("rapid_fire"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Rapid Fire</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Attendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Attendance</p>
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
                        <AccountBalanceWalletTwoTone style={{ marginRight: "1rem" }} />
                        <p>Vouchers & payments</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Investigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("leave policy")}>
                      <div className='sidebarCardContaint'>
                        <PublicTwoTone style={{ marginRight: "1rem" }} />
                        <p>leave policy
                        </p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Manage Leave")}>
                      <div className='sidebarCardContaint'>
                        <PublicOutlined style={{ marginRight: "1rem" }} />
                        <p>Manage Leave
                        </p>
                      </div>
                    </div>
                  </> : <></>
                }
                {
                  profile.access_type === "Caller" ? <>
                    <div className='sidebarCard' onClick={(() => page("rapid_fire"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Rapid Fire</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Attendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Attendance</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("CallerLeads")}>
                      <div className='sidebarCardContaint'>
                        <FileCopyOutlined style={{ marginRight: "1rem" }} />
                        <p>LEADS</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Calling_Followup")}>
                      <div className='sidebarCardContaint'>
                        <FileCopyOutlined style={{ marginRight: "1rem" }} />
                        <p>Quotation Followup</p>
                      </div>
                    </div>

                    <div className='sidebarCard' onClick={() => page("Investigation caller")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("leave policy")}>
                      <div className='sidebarCardContaint'>
                        <PublicTwoTone style={{ marginRight: "1rem" }} />
                        <p>leave policy
                        </p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Manage Leave")}>
                      <div className='sidebarCardContaint'>
                        <PublicOutlined style={{ marginRight: "1rem" }} />
                        <p>Manage Leave
                        </p>
                      </div>
                    </div>
                  </> : <></>
                }

                {
                  profile.access_type === "Accounts" ? <>
                    <div className='sidebarCard' onClick={(() => page("rapid_fire"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Rapid Fire </p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Attendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Attendance</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Account_Converted")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Converted</p>
                      </div>
                    </div>

                    <div className='sidebarCard' onClick={() => page("Payments")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Payments</p>
                      </div>
                    </div>

                    <div className='sidebarCard' onClick={() => page("Investigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>

                  </> : <></>
                }
                {
                  profile.access_type === "Operation" ? <>
                    <div className='sidebarCard' onClick={() => page("Operation_converted")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>converted</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Attendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Attendance</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Duringstay"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>During Stay</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Poststay"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Post Stay</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Investigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>
                  </> : <></>
                }
                {
                  profile.access_type === "admin" ? <>
                    <div className='sidebarCard' onClick={(() => page("User_Controller"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>User Controller</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("LeadFromCallers"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Lead From Callers</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Caller_Lead_Assigning"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Caller's lead</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Attendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Attendance</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("UploadAttendance"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>UploadAttendance</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("AdminInvestigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>

                    <div className='sidebarCard' onClick={() => page("create_quote")}>
                      <div className='sidebarCardContaint'>
                        <FileCopyOutlined style={{ marginRight: "1rem" }} />
                        <p>Create Quote</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Driver"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Driver</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("transfer_request"))}>
                      <div className='sidebarCardContaint'>
                        <TrendingUp style={{ marginRight: "1rem" }} />
                        <p>Transfer Requests</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("profile"))}>
                      <div className='sidebarCardContaint'>
                        <PersonOutlineOutlined style={{ marginRight: "1rem" }} />
                        <p>Profile</p>
                      </div>
                    </div>
                  </> : <></>
                }
                {
                  profile.access_type === "Super Admin" ? <>

                    <div className='sidebarCard' onClick={(() => page("Driver"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Driver</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("AdminLeaveFunnel")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Leaves</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Team_")}>
                      <div className='sidebarCardContaint'>
                        <PublicTwoTone style={{ marginRight: "1rem" }} />
                        <p>Teams
                        </p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Investigate Current Lead")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Current Lead</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("Admin_Follow_up")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Followed Lead</p>
                      </div>
                    </div>

                    <div className='sidebarCard' onClick={() => page("Account_Converted")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Converted</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("AdminInvestigation")}>
                      <div className='sidebarCardContaint'>
                        <SearchTwoTone style={{ marginRight: "1rem" }} />
                        <p>Investigation</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("rapid_fire"))}>
                      <div className='sidebarCardContaint'>
                        <Speed style={{ marginRight: "1rem" }} />
                        <p>Rapid Fire</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("During_Stay"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>During Stay</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Poststay"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Post Stay</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={() => page("leave policy")}>
                      <div className='sidebarCardContaint'>
                        <PublicOutlined style={{ marginRight: "1rem" }} />
                        <p>leave policy
                        </p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("User_Controller"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>User Controller</p>
                      </div>
                    </div>
                    <div className='sidebarCard' onClick={(() => page("Caller_Lead_Assigning"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Caller's lead</p>
                      </div>
                    </div>
                    {/* <div className='sidebarCard' onClick={(() => page("Switch_user"))}>
                      <div className='sidebarCardContaint'>
                        <AccountTreeTwoTone style={{ marginRight: "1rem" }} />
                        <p>Switch user</p>
                      </div>
                    </div> */}

                  </> : <></>
                }
              </>
              : <></>
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
            Page === 'Caller_Lead_Assigning' ? <>
              <Assignerhandler Auth={auth} profile={profile} />
            </> : <></>
          }
          {
            Page === 'CallerLeads' ? <>
              <CreateQuote Auth={auth} profile={profile} />
            </> : <></>
          }
          {
            Page === 'Attendance' ? <>
              <AttendanceMain profile={profile} />
            </> : <></>
          }
          {
            Page === "AdminLeaveFunnel" ?
              <Adminleavefunnel auth={auth} />
              : <></>
          }
          {
            Page === "Investigation caller" ?
              <CallerInvestigation auth={auth} profile={profile} />
              : <></>
          }

          {
            Page == "AdminInvestigation" ?
              <AdminInvestigation profile={profile} /> : <></>
          }
          {
            Page === "rapid_fire" ?
              // <Test />
              <div></div>
              : <></>
          }
          {
            Page === "LeadFromCallers" ?
              <LeadFromCallers />
              : <></>
          }
          {/* LeadFromCallers */}

          {
            Page === "Dump" ?
              <Dump profile={profile} auth={auth} />

              : <></>
          }
          {
            Page === "UploadAttendance" ?
              <UploadAttendance />
              : <></>
          }
          {/* UploadAttendance */}
          {
            Page === "Manage Leave" ?
              <LeaveMainPage profile={profile} auth={auth} />
              : <></>
          }
          {
            Page === "Team" ?
              <Main profile={profile} auth={auth} />
              // <div></div>
              : <></>
          }
          {
            Page === "Team_" ?
              <Main_Admin profile={profile} auth={auth} />
              // <div></div>
              : <></>
          }
          {
            Page === "Investigation" ?
              <Investigation profile={profile} />
              : <></>
          }
          {
            Page === "Freelance_Investigation" ?
              <Freelance_Investigation profile={profile} />
              : <></>
          }
          {
            Page === "User_Controller" ?
              <Usercontrol auth={auth} data={profile} />
              : <></>
          }
          {
            Page === "leave policy" ?
              <Leaves auth={auth} data={profile} />
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
          {
            Page === "Calling_Followup" ?
              <>
                {
                  auth &&
                  <CallerFollowUp auth={auth} profile={profile} />
                }
              </>
              : <></>

          }
          {
            Page === "Admin_Follow_up" ?
              <>
                {
                  auth &&
                  <AdminFollow auth={auth} profile={profile} />
                }
              </>
              : <></>
          }

          {Page === "voucher" ?
            <>
              {
                auth &&
                <Vouchers auth={auth} profile={profile} />
              }
            </>
            : <></>
          }
          {
            Page === "profile" ?
              <>
                <Test />
              </>
              : <></>
          }
          {
            Page === "Driver" ?
              <>
                <Driver auth={auth} />
              </>
              : <></>
          }
          {/* Investigate Current Lead */}
          {
            Page === "Account_Converted" ? <>
              <Account_converted auth={auth} profile={profile} />
            </> : <></>
          }
          {
            Page === "Investigate Current Lead" ? <>
              <SuperAdmin auth={auth} profile={profile} />
            </> : <></>
          }
          {
            Page === 'Operation_converted' ? <>
              <OprationConverted profile={profile} />
            </> : <></>
          }
          {
            Page === 'Poststay' ? <>
              <Poststay profile={profile} />
            </> : <></>
          }
          {
            // Duringstay
            Page === 'Duringstay' ? <>
              <Duringstay profile={profile} />
            </> : <></>
          }

        </div>
      </div>
      {/* <button className='top'>Top</button> */}
    </>

  );
}

export default App;
