import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { default as React, useEffect } from 'react';
import app from '../required';
import './testcss.css';
const db = getFirestore(app);

const Test = () => {
   async function tester() {
      // Sep 7, 2022 3:56 PM"
      const q = query(collection(db, "Quote"), where("label", "==", 'Sep 7, 2022 3:56 PM'));
      var collect = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         collect.push(doc.data())
         console.log(doc.id)
      });
   }
   async function trip() {
      const docRef = doc(db, "Trip", "12913510");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
         console.log("Document data:", docSnap.data());
      } else {
         // doc.data() will be undefined in this case
         console.log("No such document!");
      }
   }
   useEffect(() => {
      //   tester()
      trip()
   }, []);
   return (
      <div>
         hihii
      </div>
   );
}

export default Test;
