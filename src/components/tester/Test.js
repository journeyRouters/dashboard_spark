import React, { useState } from 'react';
import { PasteImage } from 'paste-img';
const Test = () => {
   function imgonChange(e) {
      console.log(typeof (e))
   }
   const [textvalue, setvalue] = useState('')
   const[clonedata,setClone]=useState('')
   function handleChange(event) {
      setvalue(event.target.value)
      // console.log(event)
}
   function keydown(event) {
      document.addEventListener('Enter', (event) => {
         var keyValue = event.key;
         // var codeValue = event.code;
         console.log("Enter event, keyValue: " + keyValue);
      }, false);
   }
  

   return (
      <div >
         <div>
            <p> Are You Smart?</p>
            <textarea type="text" value={textvalue}  onChange={(e)=>handleChange(e)} />
            <small> Press Y for Yes or N for No</small>
         </div>
         <div style={{width:'20rem',height:'10rem'}}>
         <p >{textvalue.split('\n').map((data, index) => (<><span >{data}</span><br /></>))}</p>
           
         </div>
      </div>
   );
}

export default Test;
