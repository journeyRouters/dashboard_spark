import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
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
   async function allDoc() {
      const q = query(collection(db, "Profile"))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         // doc.data() is never undefined for query doc snapshots
         console.log(doc.id, " => ", doc.data());
         // add_a_feild(doc.id)
      });
   }
   function add_a_feild(id) {
      setDoc(doc(db, "Profile",id), {
         user_type: 'show'
      }, { merge: true })
   }
   useEffect(() => {
      //   tester()
      // add_a_feild()
      // allDoc()
   }, []);
   return (
      <div>
         hihii
      </div>
   );
}

export default Test;
