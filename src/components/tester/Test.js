import { addDoc, collection, doc, getDoc, getDocFromCache, getDocs, getFirestore, onSnapshot, query, updateDoc, where, WriteBatch, writeBatch } from 'firebase/firestore';
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
   const data = []
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


   async function batchUpdateInvoices() {
      try {
         // Step 1: Fetch all documents in the "invoice" collection
         const invoiceCollectionRef = collection(db, "invoice");
         const querySnapshot = await getDocs(invoiceCollectionRef);

         // Step 2: Initialize a Firestore batch for updating
         const batch = writeBatch(db);  // Correct function to initialize batch

         // Step 3: Process each document
         querySnapshot.forEach((docSnapshot) => {
            const invoiceId = docSnapshot.id;
            const invoiceData = docSnapshot.data();

            // Process and update the invoice data with installment details
            const updatedInvoiceData = updateInvoiceWithInstallmentDetails(invoiceData);
            // console.log(invoiceId, updatedInvoiceData)
            // Step 4: Add only the updated fields to the batch
            if (updatedInvoiceData) {
                const docRef = doc(db, "invoice", invoiceId);
                batch.update(docRef, {
                    FinalInstallmentStatus: updatedInvoiceData.FinalInstallmentStatus,
                    NextInstallmentAmount: updatedInvoiceData.NextInstallmentAmount,
                    NextInstallmentDate: updatedInvoiceData.NextInstallmentDate
                });
            }
         });

         // Step 5: Commit the batch update
           await batch.commit();

         console.log("Batch update completed successfully!");
      } catch (error) {
         console.error("Error performing batch update:", error);
         throw error;
      }
   }
   function updateInvoiceWithInstallmentDetails(invoice) {
      let travelEndDate = null;

      // Step 1: Check if travelEndDate is already available
      if (invoice.selected_pdf_data?.travelEndDate) {
         travelEndDate = new Date(invoice.selected_pdf_data.travelEndDate.toDate());
      }

      // Step 2: If travelEndDate is not available, calculate it from Travel_Date and Travel_Duration
      if (!travelEndDate || isNaN(travelEndDate.getTime())) {
         console.log('Calculating travelEndDate...');

         const travelStartDateTimestamp = invoice.selected_pdf_data?.travel_data?.Travel_Date;
         const travelDuration = parseInt(invoice.selected_pdf_data?.travel_data?.Travel_Duration, 10);

         if (travelStartDateTimestamp && travelDuration && !isNaN(travelDuration)) {
            const travelStartDate = travelStartDateTimestamp.toDate(); // Convert Firestore Timestamp to Date

            travelEndDate = new Date(travelStartDate);
            travelEndDate.setDate(travelEndDate.getDate() + travelDuration);

            // Update the invoice with the calculated travelEndDate
            invoice.selected_pdf_data.travelEndDate = travelEndDate;
            console.log('Updated travelEndDate:', travelEndDate.toISOString());
         } else {
            console.warn('Missing Travel_Date or Travel_Duration, unable to calculate travelEndDate.');
            travelEndDate = null;
         }
      }

      const currentDate = new Date();

      // Step 3: Continue existing logic
      if (travelEndDate && travelEndDate < currentDate) {
         return {
            FinalInstallmentStatus: "Received",
            NextInstallmentAmount: null,
            NextInstallmentDate: null
         };
      }

      if (!invoice.installment || invoice.installment.length === 0) {
         return {
            FinalInstallmentStatus: "Pending",
            NextInstallmentAmount: null,
            NextInstallmentDate: null
         };
      }

      // Sort installments by date
      const sortedInstallments = invoice.installment.sort((a, b) => {
         // console.log('Comparing dates:', a.Date, b.Date);
         const dateA = new Date(a.Date);
         const dateB = new Date(b.Date);

         if (isNaN(dateA.getTime())) {
            console.log('Invalid Date in installment:', a.Date);
         }
         if (isNaN(dateB.getTime())) {
            console.log('Invalid Date in installment:', b.Date);
         }

         return dateA - dateB;
      });

      // Check if all installments are marked as "Received"
      const allReceived = sortedInstallments.every(inst => inst.Status === "Received");

      // Set FinalInstallmentStatus based on whether all installments are "Received"
      const FinalInstallmentStatus = allReceived ? "Received" : "Pending";

      // Find the next installment that is not received
      const nextInstallment = sortedInstallments.find(inst => inst.Status !== "Received");

      return {
         FinalInstallmentStatus,
         NextInstallmentAmount: nextInstallment ? nextInstallment.amount : null,
         NextInstallmentDate: nextInstallment ? new Date(nextInstallment.Date) : null
      };
   }


   function updateInvoiceWithInstallmentDetailstest(invoice) {
      // Check if travelEndDate is a valid date
      console.log(invoice.selected_pdf_data?.travel_data.TripId, invoice.selected_pdf_data?.travelEndDate)
      let travelEndDate = new Date(invoice.selected_pdf_data?.travelEndDate.toDate());
      const currentDate = new Date();

      // Validate if travelEndDate is a valid date
      if (isNaN(travelEndDate.getTime())) {
         console.log('Invalid travelEndDate:', invoice.selected_pdf_data?.travel_data.TripId, invoice.selected_pdf_data?.travelEndDate);
         //  console.warn('Invalid travelEndDate:', invoice.selected_pdf_data?.travelEndDate);
         travelEndDate = null; // Handle invalid date
      }

      // If travel end date has passed, mark the installments as completed
      if (travelEndDate && travelEndDate < currentDate) {
         return {
            FinalInstallmentStatus: "Received",
            NextInstallmentAmount: null,
            NextInstallmentDate: null
         };
      }

      // If no installments, set to "Pending"
      if (!invoice.installment || invoice.installment.length === 0) {
         return {
            FinalInstallmentStatus: "Pending", // No installments, status is "Pending"
            NextInstallmentAmount: null,
            NextInstallmentDate: null
         };
      }

      // Sort installments by date
      const sortedInstallments = invoice.installment.sort((a, b) => {
         // Log each Date value for debugging
         console.log('Comparing dates:', a.Date, b.Date);
         const dateA = new Date(a.Date);
         const dateB = new Date(b.Date);

         // Validate if both dates are valid
         if (isNaN(dateA.getTime())) {
            console.Log('Invalid Date in installment:', a.Date);
         }
         if (isNaN(dateB.getTime())) {
            console.log('Invalid Date in installment:', b.Date);
         }

         return dateA - dateB; // Sort by date
      });

      // Check if all installments are marked as "Received"
      const allReceived = sortedInstallments.every(inst => inst.Status === "Received");

      // Set FinalInstallmentStatus based on whether all installments are "Received"
      const FinalInstallmentStatus = allReceived ? "Received" : "Pending";

      // Find the next installment that is not received
      const nextInstallment = sortedInstallments.find(inst => inst.Status !== "Received");

      return {
         FinalInstallmentStatus,
         NextInstallmentAmount: nextInstallment ? nextInstallment.amount : null,
         NextInstallmentDate: nextInstallment ? new Date(nextInstallment.Date) : null
      };
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

   // async function exportPendingInvoicesWithEndedTravelToExcel() {
   //    try {
   //       // Step 1: Fetch all documents in the "invoice" collection
   //       const invoiceCollectionRef = collection(db, "invoice");
   //       const querySnapshot = await getDocs(invoiceCollectionRef);

   //       // Step 2: Filter invoices with Pending status and Travel Date ended (Travel_End_Date < current date)
   //       const currentDate = new Date();
   //       const pendingInvoices = [];

   //       querySnapshot.forEach((docSnapshot) => {
   //          const invoiceData = docSnapshot.data();
   //          let travelEndDate = invoiceData.selected_pdf_data?.travelEndDate;

   //          // If TravelEndDate is not available, calculate it using Travel_Date and Travel_Duration
   //          if (!travelEndDate) {
   //             const travelStartDateTimestamp = invoiceData.selected_pdf_data?.travel_data?.Travel_Date;
   //             const travelDuration = parseInt(invoiceData.selected_pdf_data?.travel_data?.Travel_Duration, 10);

   //             if (travelStartDateTimestamp && travelDuration && !isNaN(travelDuration)) {
   //                const travelStartDate = travelStartDateTimestamp.toDate(); // Convert Firestore Timestamp to Date
   //                travelEndDate = new Date(travelStartDate);
   //                travelEndDate.setDate(travelEndDate.getDate() + travelDuration); // Add duration to start date
   //             }
   //          }

   //          const status = invoiceData.installment?.length > 0 ? invoiceData.installment[0].Status : '';

   //          // Check if Travel_End_Date exists (calculated or provided), and if it's in the past, and the installment status is "Pending"
   //          if (travelEndDate && status === "Pending") {
   //             const travelEndDateObj = new Date(travelEndDate);  // Convert to Date if it's not already
   //             if (travelEndDateObj < currentDate) {
   //                pendingInvoices.push({
   //                   InvoiceId: docSnapshot.id,
   //                   TravelEndDate: travelEndDateObj.toISOString(),
   //                   FinalInstallmentStatus: "Pending",
   //                   NextInstallmentAmount: invoiceData.installment[0]?.amount || "N/A",
   //                   NextInstallmentDate: invoiceData.installment[0]?.Date || "N/A",
   //                });
   //             }
   //          }
   //       });

   //       if (pendingInvoices.length === 0) {
   //          console.log("No pending invoices with ended travel found.");
   //          return;
   //       }

   //       // Step 3: Convert the data to a worksheet
   //       const ws = XLSX.utils.json_to_sheet(pendingInvoices);

   //       // Step 4: Create a new workbook and append the worksheet
   //       const wb = XLSX.utils.book_new();

   //       // Shortened sheet name to 31 characters or less
   //       const sheetName = "Pending Invoices";
   //       XLSX.utils.book_append_sheet(wb, ws, sheetName);

   //       // Step 5: Write the workbook to a binary string and trigger the download
   //       const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

   //       // Create a Blob from the binary string and trigger the download
   //       const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });
   //       const link = document.createElement("a");
   //       link.href = URL.createObjectURL(blob);
   //       link.download = "PendingInvoicesWithEndedTravel.xlsx";
   //       link.click();

   //       console.log("Excel file generated and download started.");
   //    } catch (error) {
   //       console.error("Error exporting invoices to Excel:", error);
   //    }
   // }

   // Helper function to convert a string to an array buffer
   function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
         view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
   }


   // Helper function to convert a string to an array buffer
   function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
         view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
   }

   async function queryInvoicesFor29thNovember() {
      try {
          // Define the start and end of 29th November
          const startDate = new Date(2024, 10, 30, 0, 0, 0, 0); // 29th Nov 2024 00:00:00.000
          const endDate = new Date(2024, 10, 30, 23, 59, 59, 999); // 29th Nov 2024 23:59:59.999
  
          // Firestore collection reference
          const invoiceCollectionRef = collection(db, "invoice");
  
          // Query Firestore for invoices with NextInstallmentDate between startDate and endDate
          const invoiceQuery = query(
              invoiceCollectionRef,
              where("NextInstallmentDate", ">=", startDate),
              where("NextInstallmentDate", "<=", endDate)
          );
  
          const querySnapshot = await getDocs(invoiceQuery);
  
          // Process and display the results
          const invoicesFor29thNovember = [];
          querySnapshot.forEach((docSnapshot) => {
              const invoiceData = docSnapshot.data();
              invoicesFor29thNovember.push({
                  InvoiceId: docSnapshot.id,
                  NextInstallmentAmount: invoiceData.NextInstallmentAmount || "N/A",
                  NextInstallmentDate: new Date(invoiceData.NextInstallmentDate.toDate()).toISOString(),
                  FinalInstallmentStatus: invoiceData.FinalInstallmentStatus || "N/A"
              });
          });
  
          console.log("Invoices with NextInstallmentDate on 29th November:", invoicesFor29thNovember);
          return invoicesFor29thNovember;
  
      } catch (error) {
          console.error("Error querying invoices for 29th November:", error);
      }
  }
   useEffect(() => {
      // queryInvoicesFor29thNovember()
      // getAllConverted()
      // allDoc()
      // getAllUserProfie()
      // getInvoice()
      // getSingleInvoice()
      // addInstallment()
      // batchUpdateInvoices()
      // exportPendingInvoicesWithEndedTravelToExcel()
   }, []);
   return (
      <div>
         {/* <button onClick={() => exportPendingInvoicesWithEndedTravelToExcel()}>click to get things work</button> */}
         {/* <h2>{datalength}</h2> */}
      </div>
   );
}

export default Test;
