import React from 'react';
import { PasteImage } from 'paste-img';
const Test = () => {
   function imgonChange(e){
    console.log(typeof(e)   )
   }

    return (
       <div style={{width:'20rem',height:'10rem', border:'1px solid'}}>
        <PasteImage
          onChang={(e)=>imgonChange(e)} />
       </div>
    );
}

export default Test;
