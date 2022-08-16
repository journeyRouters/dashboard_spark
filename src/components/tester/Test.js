import React, { useEffect, useState } from 'react';
import { PasteImage } from 'paste-img';
import { Upload } from "@progress/kendo-react-upload";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import { guid } from "@progress/kendo-react-common";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import './testcss.css'
const Test = () => {
   function imgonChange(e) {
      console.log(typeof (e))
   }
   const data = [
      { name: "Create quote", value: 80, fill: 'yellow' },
      { name: "Follow up", value: 75, fill: 'blue' },
      { name: "Converted", value: 120, fill: 'green' },
      { name: "dump", value: 120, fill: 'red' },
      { name: "hot", value: 70 }

   ];
   const [textvalue, setvalue] = useState('')
   const [ScreenShotsurl, setScreenShotsurl] = useState([])
   const [screenshotsObject, setScreenshotsobject] = useState([])
   const [files, setfiles] = useState([])
   function handleChange(event) {
      setvalue(event.target.value)
      // console.log(event)
   }
   useEffect(() => {
      console.log(ScreenShotsurl)
   }, [ScreenShotsurl]);
   function keydown(event) {
      document.addEventListener('Enter', (event) => {
         var keyValue = event.key;
         // var codeValue = event.code;
         console.log("Enter event, keyValue: " + keyValue);
      }, false);
   }
   function handlePaste(e) {
      if (e.clipboardData.files.length) {
         var localHolder = screenshotsObject
         var shots = files
         const fileObject = e.clipboardData.files[0];
         // console.log(fileObject)
         localHolder.push(fileObject)
         setScreenshotsobject(localHolder)
         setfiles(fileObject)
         convertObjectToLink(fileObject)
         // const file = {
         //    getRawFile: () => fileObject,
         //    name: fileObject.name,
         //    size: fileObject.size,
         //    uid: guid(),
         //    status: 2,
         //    progress: 0,
         // };
         // shots.push(file)
         // setfiles(shots)
      }
   }
   async function convertObjectToLink(files) {
      try {
         const file = files
         console.log(file)
         // debugger
         var local_link_list = [...ScreenShotsurl]
         const url = URL.createObjectURL(file)
         local_link_list.push(url)
         console.log(url)

         setScreenShotsurl(local_link_list)
      }
      catch (e) { console.log(e) }

   }
   function onAdd(event) {
      // const fileObject = event.affectedFiles[0];
      console.log(event);
      // setfiles(event.newState)
      // convertObjectToLink(fileObject)

   };
   function onRemove(event) {
      setfiles(event.newState)
   };

   function onProgress(event) {
      setfiles(event.newState)
   };

   function onStatusChange(event) {
      setfiles(event.newState)
   };

   function deletefrom(index) {
      console.log(index, 'done', screenshotsObject.ScreenShotsurl)
      var OperationObjects = [...screenshotsObject]
      var oprationLinks = [...ScreenShotsurl]
      OperationObjects.splice(index, 1)
      setScreenshotsobject(OperationObjects)
      oprationLinks.splice(index, 1)
      setScreenShotsurl(oprationLinks)

   }

   return (
      <div >
         <PieChart width={400} height={400}>
            <Pie
               dataKey="value"
               isAnimationActive={false}
               data={data}
               cx={200}
               cy={200}
               outerRadius={80}
               fill="#8884d8"
               label
            />

            <Tooltip />
         </PieChart>

         <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
               top: 5,
               right: 30,
               left: 20,
               bottom: 5
            }}
            barSize={20}
         >
            <XAxis
               dataKey="name"
               scale="point"
               padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
         </BarChart>
         <div>
            <p> Are You Smart?</p>
            <textarea type="text" value={textvalue} onChange={(e) => handleChange(e)} />
            <small> Press Y for Yes or N for No</small>
         </div>
         <div style={{ width: '20rem', height: '10rem' }}>
            <p >{textvalue.split('\n').map((data, index) => (<><span >{data}</span><br /></>))}</p>

         </div>
         <div className='imgDeleterutton'>
            {
               ScreenShotsurl ? <>
                  {
                     ScreenShotsurl.map((link, index) => (<>
                        <div onClick={() => deletefrom(index)}>
                           <img alt='delete icon' src='/assets/img/deleteIcon.png' />
                        </div>
                        <img width='160px' src={link} /></>))
                  }
               </> : <></>
            }
         </div>
         <div onPaste={(e) => handlePaste(e)}>
            <Upload
               autoUpload={false}
               batch={false}
               multiple={true}
            />
            <div
               style={{
                  marginTop: 5,
                  padding: 10,
                  fontStyle: "italic",
                  color: "red",
                  border: "1px solid red",
                  height: '10rem',
                  width: '10rem'
               }}
            >
               Paste Area
            </div>
         </div>

      </div>
   );
}

export default Test;
