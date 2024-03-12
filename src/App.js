import { AccountBalanceWalletTwoTone, AccountTreeTwoTone, FileCopyOutlined, Fingerprint, GroupAddTwoTone, PersonOutlineOutlined, PublicOutlined, PublicTwoTone, SearchTwoTone, Speed, TrendingUp } from '@material-ui/icons';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import './App.css';
import Account_converted from './components/AdminController/Account_converted';
import PaymentMarking from './components/AdminController/Paymentmarking';
import AttendanceMain from './components/Attendance/AttendanceMain';
import UploadAttendance from './components/Attendance/uploadAttendance';
import Assignerhandler from './components/Calling/Pages/Assignerhandler';
import CreateQuote from './components/Calling/Pages/CreateQuote';
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
import Rapid from './components/Rapid/Rapid';
import AllConvertedFile from './components/quotation_follow_up/AllConvertedFile';
import Flight from './components/quotation_follow_up/Flight';
import { Link, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import TeamLeader from './components/RouteFolder/AccessAbailable/TeamLeader.js';
import SuperAdminDrawer from './components/RouteFolder/AccessAbailable/SuperAdminDrawer.js';
import Operations from './components/RouteFolder/AccessAbailable/Operations.js';
import FlightsBooking from './components/RouteFolder/AccessAbailable/FlightsBooking.js';
import Accounts from './components/RouteFolder/AccessAbailable/Accounts.js';
import SalesPerson from './components/RouteFolder/AccessAbailable/SalesPerson.js';
import Caller from './components/RouteFolder/AccessAbailable/Caller.js';
import Freelancer from './components/RouteFolder/AccessAbailable/Freelancer.js';
import Admin from './components/RouteFolder/AccessAbailable/Admin.js';
import Identity from './components/Identity/Identity.js';
import NotAuthorise from './components/RouteFolder/AccessAbailable/NotAuthorise.js';
import HomePage from './components/Homepage/HomePage.js';
import MainCreatequote from './components/CreateQuote/MainCreatequote.js';


function App() {
  const storage = getStorage();
  const [profile, setData] = React.useState()
  const [open, setopen] = React.useState(false)
  const db = getFirestore(app);
  const [auth, setauth] = useState()
  const [Page, setPage] = React.useState("")
  const oauth = getAuth();
  const ProfileImageLink = JSON.parse(localStorage.getItem('ProfileImageLink'));
  const navigate = useNavigate();
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
        localStorage.setItem('profile', JSON.stringify(docSnap.data()));
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
        navigate('/')
        localStorage.removeItem('auth');
        localStorage.removeItem('profile');
        refreshPage()
      }).catch((error) => {
        // An error happened.
      });
    }
    catch (error) {
      console.log(error)
    }

  }

  async function authListener() {
    oauth.onAuthStateChanged(user => {
      try {
        if (user) {
          setauth(user);
          localStorage.setItem('auth', JSON.stringify(user));
          // navigate('/')
        }
        else {
        }
      }
      catch (error) {
        console.log(error)
      }

    })
  }
//   const getUserProfile = async (userId) => {
//     const db = getFirestore(app);

//     try {
//         const docRef = doc(db, "UserProfile", userId);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//             // if there is data in collection, we will have the data
//             setuserprofileData(docSnap.data())
//             return docSnap.data();
//         } else {

//             return null;
//         }
//     } catch (error) {
//         console.error("Error getting document:", error);
//         return null;
//     }
// };

  useEffect(() => {
    authListener()
    if (profile) {
    }
    else {
      fetch_profile(auth)
      // getUserProfile(auth.uid)
      
    }

  }, [auth])

  function refreshPage() {
    window.location.reload(false);
  }
  const ProtectedRoute = ({ user, allowedAccessTypes }) => {
    // Check if user's access_type is in the list of allowedAccessTypes
    const isAllowed = user && allowedAccessTypes.includes(user.access_type);

    return isAllowed ? <Outlet /> : <Navigate to="/NotAuthorise" replace />;
  };
  return (
    <>

      {
        open ? <Loginform open={open} setopen={setopen} setauth={setAuthFirebase} setData={setData} refreshPage={refreshPage} /> : <></>
      }


      <div className='assembler'>
        <div className='sidebars'>
          {
            profile ?
              <>
                {
                  profile.access_type === "freelance" ? <Freelancer /> : <></>
                }
                {
                  profile.access_type === "Team Leader" ? <TeamLeader /> : <></>
                }
                {
                  profile.access_type === "User" ? <SalesPerson /> : <></>
                }
                {
                  profile.access_type === "Caller" ? <Caller /> : <></>
                }
                {
                  profile.access_type === "Flight" ? <FlightsBooking /> : <></>
                }
                {
                  profile.access_type === "Accounts" ? <Accounts /> : <></>
                }
                {
                  profile.access_type === "Operation" ? <Operations /> : <></>
                }
                {
                  profile.access_type === "admin" ? <Admin /> : <></>
                }
                {
                  profile.access_type === "Super Admin" ? <SuperAdminDrawer /> : <></>
                }
              </>
              :
              <></>
          }
        </div>
        <div className='mainContaint'>
          <div className='header'>
            <div className='headerfirstpart'>
              {
                auth ? <>{

                  profile ? <>
                    <Link to='/Identity'>
                      {
                        ProfileImageLink == null ?
                        <img width={'30px'} src='./assets/img/user.png' />:
                        <img className='User_imageAt_Header' src={ProfileImageLink} />
                      }
                    
                    </Link>
                    <span style={{ fontFamily: 'Poppins', fontSize: '13px' }}>Hello, {profile ? profile.name : ''}</span> </> : ''
                }
                </> : <></>
              }
            </div>
            {/* <p className='headLine'>
              <img width={'276px'} style={{ marginLeft: '-4rem' }} src='/assets/pdfDefaultImage/JrLOGO_.png' />
            </p> */}
            {
              auth ? <>
                <div style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>

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
          <div className='rended_routes_main_components'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/RapidFire' element={<Rapid auth={auth} profile={profile} />} />
              <Route path='/CreateQuotes' element={<MainCreatequote auth={auth} profile={profile} />} />
              <Route path='/FollowUp' element={<FollowUp auth={auth} profile={profile} />} />
              <Route path='/VouchersAndPayments' element={<Vouchers auth={auth} profile={profile} />} />
              <Route path='/SalesPersonInvestigation' element={<Investigation profile={profile} />} />
              <Route path='/FreeLancerInvestigation' element={<Freelance_Investigation profile={profile} />} />
              <Route path='/CallerInvestigation' element={<CallerInvestigation auth={auth} profile={profile} />} />
              <Route path='/LeavePolicy' element={<Leaves auth={auth} data={profile} />} />
              <Route path='/ManageLeaves' element={<LeaveMainPage profile={profile} auth={auth} />} />
            
              <Route element={<ProtectedRoute user={profile} allowedAccessTypes={["Super Admin","Team Leader"]} />}>
                <Route path='/AdminInvestigation' element={<AdminInvestigation profile={profile} />} />
                <Route path='/AdminLeaveManagement' element={<Adminleavefunnel auth={auth} />} />
                <Route path='AdminFollowUpManagement' element={<AdminFollow auth={auth} profile={profile} />} />
                <Route path='/SeekCreateQuote' element={<SuperAdmin auth={auth} profile={profile} />} />
                <Route path='/ManageAllTeam' element={<Main_Admin profile={profile} auth={auth} />} />
              </Route>
              
              <Route element={<ProtectedRoute user={profile} allowedAccessTypes={["Accounts"]} />}>
                <Route path='/ConvertedFiles' element={<Account_converted auth={auth} profile={profile} />} />
                <Route path='/PaymentMarking' element={<PaymentMarking Auth={auth} profile={profile} />} />
              </Route>
              <Route element={<ProtectedRoute user={profile} allowedAccessTypes={["admin"]} />}>
                <Route path='ControleUsers' element={<Usercontrol auth={auth} data={profile} />} />
                <Route path='/CallerLeadAssinger' element={<Assignerhandler Auth={auth} profile={profile} />} />
                <Route path='/ControleLeads' element={<Driver auth={auth} />} />
              </Route>
              <Route element={<ProtectedRoute user={profile} allowedAccessTypes={["Operations"]} />}>
                <Route path='/OperationsFiles' element={<OprationConverted profile={profile} />} />
                <Route path='/DuringStayFiles' element={<Duringstay profile={profile} />} />
                <Route path='/PostStayFiles' element={<Poststay profile={profile} />} />
              </Route>
              <Route path='/Team' element={<Main profile={profile} auth={auth} />} />
              <Route path='/CallerCreateQuote' element={<CreateQuote Auth={auth} profile={profile} />} />
              <Route path='/CallerLead' element={<LeadFromCallers Auth={auth} profile={profile} />} />
              <Route path='/CallerFollowUp' element={<CallerFollowUp auth={auth} profile={profile} />} />
              <Route path='/Flights' element={<Flight auth={auth} profile={profile} />} />
              {/* <Route path='/FlightCreateQuote' element={<Flight auth={auth} profile={profile} />} /> */}
              <Route path='/Identity' element={<Identity auth={auth} profile={profile} />} />
              <Route path='/NotAuthorise' element={<NotAuthorise />} />
            </Routes>
          </div>

        </div>
      </div>
    </>

  );
}

export default App;
