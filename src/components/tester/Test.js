import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { default as React, useEffect } from 'react';
import app from '../required';
import './testcss.css';
import ConversionPrecentage from '../Investigation/ConversionPrecentage';
import ConversionPercentageAgaintLeadSeeded from '../Investigation/ConversionPercentageAgaintLeadSeeded';
import TotalLeadSeeded from '../Investigation/TotalLeadSeeded';
import AvgLeadSeeded from '../Investigation/AvgLeadSeeded';
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
   async function CreditLeaves(id) {
      setDoc(doc(db, "Profile", id), {
         Leave: {
            CasualLeave: 10,
            LeaveWithoutPay: 10,
            MaternityLeave: 182,
            PrivilegedLeave: 12,
            SickLeave: 12
         }
      }, { merge: true })
      console.log(id, 'done')
   }
   async function allDoc() {
      var list = []
      const q = query(collection(db, "Trip"),
         where("month", "==", "December"),
         // where('Lead_Status', '==', 'Converted'),
      )
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         // console.log(doc.data())
         // updateMonthFeild(doc.id)
         list.push(doc.id)
      });
      console.log(list.length)
   }
   async function updateMonthFeild(id) {
      const ref = doc(db, "Trip", id);
      await updateDoc(ref, {
         month: "December-2023"
      });
      // till December-2023  
      console.log('updated', id)
   }
   function add_a_feild(tripid) {
      setDoc(doc(db, "Trip", tripid), {
         x_callerFlg: false
      }, { merge: true })
      console.log(tripid, 'done')
   }
   async function FetchLeaves() {
      const q = query(collection(db, "Leaves"))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         FetchProfile(doc.data(), doc.data().appliedBY.uid)
         console.log(doc.id, 'fetch Leave')
      });
   }
   async function FetchProfile(leavedata, uid) {
      const docRef = doc(db, "Profile", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
         calculateLeaves(docSnap.data(), leavedata, docSnap.id)
         console.log(docSnap.id, 'fetching profile')
      }
   }
   function calculateLeaves(userProfile, data, docid) {
      console.log('calculating....')
      var BalanceLeaves = userProfile.Leave
      var difference = data.From.toDate() - data.To.toDate();
      var Day = Math.floor(difference / 1000 / 60 / 60 / 24);
      if (Day == 0) {
         Day = -1
      }
      switch (data.LeaveType) {
         case 'CasualLeave': {
            BalanceLeaves.CasualLeave = Math.abs(BalanceLeaves['CasualLeave'] + Day)
            updateLeave(docid, BalanceLeaves, userProfile)
            break
         }
         case 'LeaveWithoutPay': {
            BalanceLeaves.LeaveWithoutPay = Math.abs(BalanceLeaves['LeaveWithoutPay'] + Day)
            updateLeave(docid, BalanceLeaves, userProfile)
            break
         }
         case 'MaternityLeave': {
            BalanceLeaves.MaternityLeave = Math.abs(BalanceLeaves['MaternityLeave'] + Day)
            updateLeave(docid, BalanceLeaves, userProfile)
            break
         }
         case 'PrivilegedLeave': {
            BalanceLeaves.PrivilegedLeave = Math.abs(BalanceLeaves['PrivilegedLeave'] + Day)
            updateLeave(docid, BalanceLeaves, userProfile)
            break
         }
         case 'SickLeave': {
            BalanceLeaves.SickLeave = Math.abs(BalanceLeaves['SickLeave'] + Day)
            updateLeave(docid, BalanceLeaves, userProfile)
            break
         }
         default: {
            console.log('some error')
         }
      }

   }
   async function updateLeave(id, BalanceLeaves, userProfile) {
      const ref = doc(db, "Profile", id);
      await updateDoc(ref, {
         Leave: BalanceLeaves
      });
   }
   function notification() {
      const url = "https://northamerica-northeast1-jrspark-adb98.cloudfunctions.net/journeyRoutersNotification?message=hiiii";

      // Making a GET request
      fetch(url)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }

            return response

         })
         .then(data => {
            // console.log("GET Request Response:", data);
         })
         .catch(error => {
            console.error('Error:', error);
         });
   }
   function getAllUserProfie() {
      const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"])
          , where("user_type", "==", "show")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const Profile = [];
          querySnapshot.forEach((doc) => {
              Profile.push(doc.data());
          });
          getTotalLeadData(Profile)
      });
  }
   async function getTotalLeadData(AllUserprofile) {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      console.log(firstDay)
      for (var i = 0; i < AllUserprofile.length; i++) {
          try {
              let list = []
              var q = query(collection(db, "Trip"),
                  where("assign_to.uid", "==", AllUserprofile[i].uid),
                  where("assigned_date_time", ">=", firstDay));
              var querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                  list.push(doc.data())
              });
              console.log(AllUserprofile[i].name)
              console.log(list.length)
              console.log(list)


          }
          catch (erorr) {
              console.log(erorr)
          }
      }
  }
   useEffect(() => {
      // allDoc()
      // getAllUserProfie()
   }, []);
   return (
      <div>
        running.....
      </div>
   );
}

export default Test;
