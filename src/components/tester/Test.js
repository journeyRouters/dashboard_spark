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
   async function allDoc() {
      // var date = new Date("01/12/2022");
      // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const q = query(collection(db, "Trip"))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         add_a_feild(doc.id)
      });
   }
   function add_a_feild() {
      // var month=moment(new Date()).format('MMMM-YYYY')
      // console.log(month)
      setDoc(doc(db, "Trip", '57880525'), {
         PaymentScreenshots_flight:[],
         PaymentScreenshots_hotels:[],
         PaymentScreenshots_others:[]
      }, { merge: true })
   }
   useEffect(() => {
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
