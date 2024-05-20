import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { default as React, useEffect, useState } from 'react';
import app from '../required';
import './testcss.css';
import * as XLSX from 'xlsx';
const db = getFirestore(app);

const Test = () => {
   const[datalength,setlength]=useState(0)
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
         console.log(doc.id)
      });
   }
   function exportJSONToExcel(jsonData, fileName) {
      // Create a new workbook (this is required for the library)
      const workbook = XLSX.utils.book_new();

      // Convert the JSON array to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(jsonData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Write the workbook to a file
      // You can change the type to 'binary' if you need to handle binary data
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
   }

   async function allDoc() {
      // we completed the marking till December-2023
      var list = []
      const q = query(collection(db, "Trip"),
         where("month", "==", "August-2022"),
         // where('Lead_Status', '==', 'Converted'),
      )
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         list.push(doc.data())
      });
      console.log(list)
      console.log(list.length)
      setlength(list.length)
      exportJSONToExcel(list,'August-2022_Client_data')
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
         //  getTotalLeadData(Profile)
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
         {/* <button onClick={()=>allDoc()}>click to get things work</button> */}
         <h2>{datalength}</h2>
      </div>
   );
}

export default Test;
