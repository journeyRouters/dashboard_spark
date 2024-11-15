import { addDoc, collection, doc, getDoc, getDocFromCache, getDocs, getFirestore, onSnapshot, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { default as React, useEffect, useState } from 'react';
import app from '../required';
import './testcss.css';
import * as XLSX from 'xlsx';
import moment from 'moment/moment';
const db = getFirestore(app);

const Test = () => {
   const [datalength, setlength] = useState(0)
   const [totaltimebyallleads, settotaltimebyallleads] = useState(0)
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
         // console.log(doc.id)
      });
   }
   const data=[]
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
         where("month", "==", "September-2022"),
         // where('Lead_Status', '==', 'Converted'),
      )
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         list.push(doc.data())
      });
      setlength(list.length)
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
   async function getAllTripData() {
      const tripList = [];  // List to store all trip data
   
      try {
         // Reference to the Trip collection
         const querySnapshot = await getDocs(collection(db, "Trip"));
         
         // Loop through each document in the snapshot and push the data to the tripList array
         querySnapshot.forEach((doc) => {
            tripList.push(doc.data());
         });
   
         // Process the tripList array as needed

         console.log(tripList);  // You can replace this with your processing logic
         exportToExcel(tripList)
         return tripList;  // Return the list containing all trip data
         
      } catch (error) {
         console.error("Error fetching documents: ", error);
         return [];  // Return an empty list in case of an error
      }
   }
   function exportToExcel(data) {
      console.log(data)
      var sheetname = moment(new Date()).format('DD-MMM-YYYY')
      const worksheetData = data.map(item => ({
         TripID: item.TripId,
         Destination: item.Destination,
         ClientName: item.Traveller_name,
         Number: item.Contact_Number,
      }));

      // Create a new worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Append the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${sheetname}.xlsx`);
   }
   async function calculateResponseTime(TripId) {
      var TripData;
      const docRef = doc(db, "Trip", TripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
         TripData = docSnap.data()
      } else {
         console.log("document not found!");
      }
      var difference = TripData.dateTimeStampList[0].toDate() - TripData.assigned_date_time.toDate();
      var MinutesDifference = Math.floor(difference / 1000 / 60);
      if (MinutesDifference > 0) {
         settotaltimebyallleads((prev) => Number(prev) + MinutesDifference)
      }


   }
   async function getAllConverted() {
      let totalsumTime = 0
      var q = query(collection(db, "Trip"), where('Lead_Status', '==', 'Converted'), where('month', '==', 'May'))
      var querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         let TripData = doc.data()
         let diff = TripData.dateTimeStampList.pop().toDate() - TripData.assigned_date_time.toDate();
         if (diff >= 0) {
            totalsumTime += diff
         }
      })
   }
   async function getTotalLeadData(AllUserprofile) {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      // console.log(firstDay)
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



         }
         catch (erorr) {
            console.log(erorr)
         }
      }
   }
   // async function getInvoice() {
   //    try {
   //      var q = query(collection(db, "invoice"), where("installment", "array-contains", { Status: "Pending" }));
   //      var querySnapshot = await getDocs(q);
   //      querySnapshot.forEach((doc) => {
   //        console.log(doc.data());
   //      });
   //      console.log('done')
   //    } catch (error) {
   //      console.error("Error getting documents: ", error);
   //    }
   //  }
   async function getSingleInvoice() {
      const docRef = doc(db, "invoice", "100719549");
      try {
         const doc = await getDoc(docRef);
         console.log("Cached document data:", doc.data());
      } catch (e) {
         console.log("Error getting cached document:", e);
      }
   }
   async function getInvoice() {
      const installmentObject = {
         TransactionId: "",
         Date: "2023-05-31",
         amountRecived: "",
         amount: "1000",
         Status: "Pending",
         yourname: ""
      };
      try {
         // Create a query against the collection.
         const q = query(
            collection(db, "invoice"),
            where("installment", "array-contains", installmentObject)
         );

         // Log the query object to ensure it's created correctly
         console.log("Query:", q);

         // Execute the query.
         const querySnapshot = await getDocs(q);

         // Check if any documents were found
         if (querySnapshot.empty) {
            console.log("No matching documents found.");
            return;
         }

         // Process the query results.
         querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
         });
      } catch (error) {
         // Handle any errors that occur.
         console.error("Error getting documents: ", error);
      }
   }
   async function addInstallment(userID, invoiceID) {
      const installmentsRef = collection(db, 'testcollection', 'doc002', 'Installments',);
      const installmentData = {
         dueDate: new Date(),
         amount: 1000.00,
         status: 'Pending',
         paymentDate: null,
      };
      const installmentRef = await addDoc(installmentsRef, installmentData);
      console.log('Installment added with ID: ', installmentRef.id);
   }
   // Call the function to execute the query.
   async function addNewKeyToAllDocuments(collectionName, newKey, newValue) {
      try {
         const collectionRef = collection(db, collectionName);
         const querySnapshot = await getDocs(collectionRef);
         const start = new Date()
         querySnapshot.forEach(async (document) => {
            const docRef = doc(db, collectionName, document.id);
            const newData = {};
            newData[newKey] = newValue;
            await updateDoc(docRef, newData, { merge: true });

            console.log(`Successfully added new key "${newKey}" to document "${document.id}".`);
         });
         const end = new Date()
         console.log(end - start)
         console.log(`Successfully added new key "${newKey}" to all documents in collection "${collectionName}".`);
      } catch (error) {
         console.error("Error adding new key to documents:", error);
      }
   }

   async function fetchAndUpdateDocsBatch() {
    const list = [];
    const q = query(collection(db, "Trip"), where("month", "==", "August"));
    
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
 
    querySnapshot.docs.forEach((docSnapshot) => {
       list.push(docSnapshot.data());
       setlength(list.length)
       const docRef = doc(db, "Trip", docSnapshot.id);
       batch.update(docRef, { month: "August-2024" });
    });
 
    await batch.commit();
    console.log("Fetched documents with month 'August':");
    console.log("All documents have been updated to month 'August-2024'");
    
    // return list;
 }
   useEffect(() => {
      // getAllConverted()
      // allDoc()
      // getAllUserProfie()
      // getInvoice()
      // getSingleInvoice()
      // addInstallment()
   }, []);
   return (
      <div>
         {/* <button onClick={() => allDoc()}>click to get things work</button> */}
         {/* <h2>{datalength}</h2> */}
      </div>
   );
}

export default Test;
