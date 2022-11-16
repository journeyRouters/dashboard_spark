import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment/moment';
import { default as React, useEffect } from 'react';
import app from '../required';
import './testcss.css';
const db = getFirestore(app);

const Test = () => {
   async function tester() {
      // Sep 7, 2022 3:56 PM"
      const q = query(collection(db, "Trip"), where("leave_avail.2021.cl", "==", 12));
      var collect = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         collect.push(doc.data())
      });
      console.log(collect)
   }
   async function allDoc() {
      const q = query(collection(db, "Profile"))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         add_a_feild(doc.id)
      });
   }
   function add_a_feild(id) {
      var month=moment(new Date()).format('MMMM-YYYY')
      // console.log(month)
      setDoc(doc(db, "Profile",id), {
         Leave:{
            CasualLeave:5,
            SickLeave:5,
            LeaveWithoutPay:4,
            PrivilegedLeave:5,
            MaternityLeave:182
         }
      }, { merge: true })
   }
   useEffect(() => {
      //   tester()
      // allDoc()
   }, []);
   return (
      <div>
         hihii
      </div>
   );
}

export default Test;
