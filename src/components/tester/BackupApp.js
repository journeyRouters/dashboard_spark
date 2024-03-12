import React from 'react';

function BackupApp(props) {
    return (
        <div style={{ marginTop: "7rem" }}>

        {
          Page === "create_quote" ?
            // Done
            <>{
              auth &&
              <Createquote auth={auth} userProfile={profile} />
            }
            </> : <></>
        }
        {
          // done
          Page == 'Payments' ? <PaymentMarking Auth={auth} profile={profile} /> : <></>
        }

        {
          // done
          Page === 'Caller_Lead_Assigning' ? <>
            <Assignerhandler Auth={auth} profile={profile} />
          </> : <></>
        }
        {
          // done
          Page === 'CallerLeads' ? <>
            <CreateQuote Auth={auth} profile={profile} />
          </> : <></>
        }
        {
          // to be removed from dashboard
          Page === 'Attendance' ? <>
            <AttendanceMain profile={profile} />
          </> : <></>
        }
        {
          // done
          Page === "AdminLeaveFunnel" ?
            <Adminleavefunnel auth={auth} />
            : <></>
        }
        {
          // done
          Page === "Investigation caller" ?
            <CallerInvestigation auth={auth} profile={profile} />
            : <></>
        }

        {
          // done
          Page == "AdminInvestigation" ?
            <AdminInvestigation profile={profile} /> : <></>
        }
        {
          // done
          Page === "rapid_fire" ?
            // <Test />
            <Rapid auth={auth} profile={profile} />
            : <></>
        }
        {
          // done
          Page === "LeadFromCallers" ?
            <LeadFromCallers />
            : <></>
        }

        {
          // waiting
          Page === "Dump" ?
            <Dump profile={profile} auth={auth} />

            : <></>
        }
        {
          // to be removed from dashboard
          Page === "UploadAttendance" ?
            <UploadAttendance />
            : <></>
        }
        {/* UploadAttendance */}
        {
          // done
          Page === "Manage Leave" ?
            <LeaveMainPage profile={profile} auth={auth} />
            : <></>
        }
        {
          // done
          Page === "Team" ?
            <Main profile={profile} auth={auth} />
            // <div></div>
            : <></>
        }
        {
          // done
          Page === "Team_" ?
            <Main_Admin profile={profile} auth={auth} />
            // <div></div>
            : <></>
        }
        {
          // done
          Page === "Investigation" ?
            <Investigation profile={profile} />
            : <></>
        }
        {
          // done
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
          // done
          Page === "leave policy" ?
            <Leaves auth={auth} data={profile} />
            : <></>
        }
        {
          // done
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
          // done
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
          // done
          Page === "Admin_Follow_up" ?
            <>
              {
                auth &&
                <AdminFollow auth={auth} profile={profile} />
              }
            </>
            : <></>
        }

        {
          // done
          Page === "voucher" ?
            <>
              {
                auth &&
                <Vouchers auth={auth} profile={profile} />
              }
            </>
            : <></>
        }
        {
          // done
          Page === "Flight" ?
            <>
              {
                auth &&
                <Flight auth={auth} profile={profile} />
              }
            </>
            : <></>
        }
        {/* {Page === "ConvertedFiles" ?
          <>
            {
              auth &&
              <AllConvertedFile auth={auth} profile={profile} />
            }
          </>
          : <></>
        } */}
        {
          Page === "profile" ?
            <>
              <Test />
            </>
            : <></>
        }
        {
          // done
          Page === "Driver" ?
            <>
              <Driver auth={auth} />
            </>
            : <></>
        }
        {/* Investigate Current Lead */}
        {
          // done
          Page === "Account_Converted" ? <>
            <Account_converted auth={auth} profile={profile} />
          </> : <></>
        }
        {
          // done
          Page === "Investigate Current Lead" ? <>
            <SuperAdmin auth={auth} profile={profile} />
          </> : <></>
        }
        {
          // done
          Page === 'Operation_converted' ? <>
            <OprationConverted profile={profile} />
          </> : <></>
        }
        {
          // done
          Page === 'Poststay' ? <>
            <Poststay profile={profile} />
          </> : <></>
        }
        {
          // done
          // Duringstay
          Page === 'Duringstay' ? <>
            <Duringstay profile={profile} />
          </> : <></>
        }

      </div>
    );
}

export default BackupApp;