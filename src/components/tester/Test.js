import { collection, doc, getDocs, getFirestore, orderBy, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment/moment';
import { default as React, useEffect } from 'react';
import app from '../required';
import './testcss.css';
import { SendNotification } from '../emailer/NotifyByEmail';
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
      var collect = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         add_a_feild(doc.id)
         console.log(doc.id)
      });
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
         FlightBookedFlg: false
      }, { merge: true })
   }
   useEffect(() => {
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
