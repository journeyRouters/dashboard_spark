import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment/moment';
import { default as React, useEffect } from 'react';
import app from '../required';
import './testcss.css';
import { SendNotification } from '../emailer/NotifyByEmail';
import { act } from '@testing-library/react';
const db = getFirestore(app);

const Test = () => {
   async function tester() {
      // Sep 7, 2022 3:56 PM"
      // const q = query(collection(db, "Trip"), where("leave_avail.2021.cl", "==", 12));
      const q = query(collection(db, "Trip"),
         // where("Lead_Status", "==", "Converted"),
         // where("quotation_flg", "==", true),
         // where("Contact_Number", "==", 8867325760),
         // orderBy("Travel_Date")
      )
      // var collect = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         add_a_feild(doc.id)
         console.log(doc.id)
      });
   }
   async function CreditLeaves(id){
      setDoc(doc(db, "Profile", id), {
        Leave:{
         CasualLeave:10,
         LeaveWithoutPay:10,
         MaternityLeave:182,
         PrivilegedLeave:12,
         SickLeave:12
        }
      }, { merge: true })
      console.log(id,'done')
   }
   async function allDoc() {
      // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const q = query(collection(db, "Quote"), where('value.travel_data.TripId', '==', 'NaN4224'))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         console.log(doc.data())
         // add_a_feild(doc.id)
      });
   }
   function add_a_feild(tripid) {
      setDoc(doc(db, "Trip", tripid), {
         x_callerFlg: false
      }, { merge: true })
      console.log(tripid,'done')
   }
   async function FetchLeaves() {
      const q = query(collection(db, "Leaves"))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         FetchProfile(doc.data())
         console.log(doc.id)
      });
   }
   async function FetchProfile(leavedata) {
      const q = query(collection(db, "Profile",leavedata.appliedBY.uid))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         calculateLeaves(doc.data(),leavedata)
         console.log(doc.id)
      });
   }

  
  
   function calculateLeaves(userProfile,data) {
      var BalanceLeaves = userProfile.Leave
      var difference = data.From.toDate() - data.To.toDate();
      var Day = Math.floor(difference / 1000 / 60 / 60 / 24);
      if (Day == 0) {
          Day = -1
      }
      switch (data.LeaveType) {
          case 'CasualLeave': {
              BalanceLeaves.CasualLeave = Math.abs(BalanceLeaves['CasualLeave'] + Day)
              break
          }
          case 'LeaveWithoutPay': {
              BalanceLeaves.LeaveWithoutPay = Math.abs(BalanceLeaves['LeaveWithoutPay'] + Day)
              break
          }
          case 'MaternityLeave': {
              BalanceLeaves.MaternityLeave = Math.abs(BalanceLeaves['MaternityLeave'] + Day)
              break
          }
          case 'PrivilegedLeave': {
              BalanceLeaves.PrivilegedLeave = Math.abs(BalanceLeaves['PrivilegedLeave'] + Day)
              break
          }
          case 'SickLeave': {
              BalanceLeaves.SickLeave = Math.abs(BalanceLeaves['SickLeave'] + Day)
              break
          }
          default: {
              console.log('some error')
          }
      }

  }
   
   useEffect(() => {
      // FetchProfile()
      // add_a_feild_()
      // SendNotification()
      //   tester()
      // allDoc()
      // add_a_feild()
   }, []);
   return (
      <div>
         setting.........
      </div>
   );
}

export default Test;
