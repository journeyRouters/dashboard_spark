import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment/moment';
import { default as React, useEffect } from 'react';
import app from '../required';
import './testcss.css';
const db = getFirestore(app);

const Test = () => {
   async function tester() {
      // Sep 7, 2022 3:56 PM"
      // const q = query(collection(db, "Trip"), where("leave_avail.2021.cl", "==", 12));
     const q = query(collection(db, "Trip"),
      where("Lead_Status", "==", "Converted"),
      where("quotation_flg", "==", true),
      where("Contact_Number", "==", 9886871492),
      orderBy("Travel_Date")
  )
      var collect = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         collect.push(doc.data())
      });
      console.log(collect)
   }
   // async function allDoc() {
   //    const q = query(collection(db, "Profile"))
   //    const querySnapshot = await getDocs(q);
   //    querySnapshot.forEach((doc) => {
   //       add_a_feild(doc.id)
   //    });
   // }
   // function add_a_feild(id) {
   //    // var month=moment(new Date()).format('MMMM-YYYY')
   //    // console.log(month)
   //    setDoc(doc(db, "Profile",id), {
   //     Leave:{
   //       CasualLeave:10,
   //       LeaveWithoutPay:10,
   //       MaternityLeave:182,
   //       PrivilegedLeave:12,
   //       SickLeave:4
   //     }
   //    }, { merge: true })
   // }
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
