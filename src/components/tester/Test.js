// import * as React from "react";
// import { useRef, useState, useEffect } from "react";
// // import "@progress/kendo-theme-material/dist/all.css";

// import {
//   Chart,
//   ChartLegend,
//   ChartSeries,
//   ChartSeriesItem,
//   ChartSeriesLabels,
//   ChartCategoryAxis,
//   ChartCategoryAxisItem
// } from "@progress/kendo-react-charts";
// // import "hammerjs";

// // import { DropDownList } from "@progress/kendo-react-dropdowns";
// // import { Button } from "@progress/kendo-react-buttons";
// import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

// import sampleData from "./invoice-data.json";
// // import "./style.css";
// // import KendokaLogo from "./kendoka-logo.svg";

// function Test() {

//   const [layoutSelection, setLayoutSelection] = useState({
//     text: "A4",
//     value: "size-a4"
//   });



//   const pdfExportComponent = useRef(null);

//   const handleExportWithComponent = event => {
//     pdfExportComponent.current.save();
//   };

//   return (
//     <div id="example">
//       <div className="box wide hidden-on-narrow">
//         <div className="box-col">
//           <h4>Select a Page Size</h4>
          
//         </div>
//         <div className="box-col">
//           <h4>Export PDF</h4>
//           <button primary={true} onClick={handleExportWithComponent}>
//             Export
//           </button>
//         </div>
//       </div>
//       <div className="page-container hidden-on-narrow">
//         <PDFExport ref={pdfExportComponent}>
//           <div className={`pdf-page ${layoutSelection.value}`}>
//             <div className="inner-page">
//               <div className="pdf-header">
//                 <span className="company-logo">
//                   {/* <img src={KendokaLogo} alt="Kendoka Company Logo" /> Blauer */}
//                   See Delikatessen
//                 </span>
//                 <span className="invoice-number">Invoice #23543</span>
//               </div>
//               <div className="pdf-footer">
//                 <p>
//                   Blauer See Delikatessen
//                   <br />
//                   Lützowplatz 456
//                   <br />
//                   Berlin, Germany, 10785
//                 </p>
//               </div>
//               <div className="addresses">
//                 <div className="for">
//                   <h3>Invoice For</h3>
//                   <p>
//                     Antonio Moreno
//                     <br />
//                     Naucalpan de Juárez
//                     <br />
//                     México D.F., Mexico, 53500
//                   </p>
//                 </div>

//                 <div className="from">
//                   <h3>From</h3>
//                   <p>
//                     Hanna Moos <br />
//                     Lützowplatz 456
//                     <br />
//                     Berlin, Germany, 10785
//                   </p>
//                   <p>
//                     Invoice ID: 23543
//                     <br />
//                     Invoice Date: 12.03.2014
//                     <br />
//                     Due Date: 27.03.2014
//                   </p>
//                 </div>
//               </div>
//               <div className="pdf-chart">
//                 <Chart style={{ height: 280 }}>
//                   <ChartSeries>
//                     <ChartSeriesItem
//                       type="donut"
//                       data={sampleData}
//                       categoryField="product"
//                       field="share"
//                     >
//                       <ChartSeriesLabels color="#fff" background="none" />
//                     </ChartSeriesItem>
//                   </ChartSeries>
//                 </Chart>
//               </div>
//               <div className="pdf-chart">
//                 <Chart style={{ height: 280 }}>
//                   <ChartSeries>
//                     <ChartSeriesItem
//                       type="donut"
//                       data={sampleData}
//                       categoryField="product"
//                       field="share"
//                     >
//                       <ChartSeriesLabels color="#fff" background="none" />
//                     </ChartSeriesItem>
//                   </ChartSeries>
//                 </Chart>
//               </div>
//               <div className="pdf-chart">
//                 <Chart style={{ height: 280 }}>
//                   <ChartSeries>
//                     <ChartSeriesItem
//                       type="donut"
//                       data={sampleData}
//                       categoryField="product"
//                       field="share"
//                     >
//                       <ChartSeriesLabels color="#fff" background="none" />
//                     </ChartSeriesItem>
//                   </ChartSeries>
//                 </Chart>
//               </div>
//               <div className="pdf-body">
//                 <div id="grid" />
//                 <p className="signature">
//                   Signature: __________________ <br />
//                   <br />
//                   Date: 12.03.2014
//                 </p>
//               </div>
//             </div>
//           </div>
//         </PDFExport>
//       </div>
//     </div>
//   );
// }

// // export default Test;
// import "./styles.css";
// import { useState, useEffect, useMemo } from "react";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// export default function Test() {
//   const [data, setData] = useState([]);
//   const [filter, setFilter] = useState({ key: "", value: 0 });
//   const [query, setQuery] = useState("");

//   const sortedData = useMemo(() => {
//     // if (!filter.value) return data;
//     let dataCloned = [...data];
//     if (query) {
//       dataCloned = dataCloned.filter((item) =>
//         Object.values(item).join(" ").includes(query)
//       );
//     }
//     return dataCloned.sort(
//       (a, b) =>
//         a?.[filter?.key]?.localeCompare(b?.[filter?.key]) * filter?.value || 0
//     );
//   }, [filter, data, query]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const raw = await fetch("https://randomuser.me/api/?results=29");
//         const jsonData = await raw.json();
//         setData(
//           jsonData.results.map((item) => ({
//             name: `${item.name.first} ${item.name.last}`,
//             gender: item.gender,
//             email: item.email,
//             phone: item.phone,
//             city: item.location.city,
//             state: item.location.state
//           }))
//         );
//       } catch (e) {
//         console.log(e);
//       }
//     };
//     fetchData();
//   }, []);

//   const onSortColumn = (col) => {
//     if (filter.key !== col || !filter.value) {
//       setFilter({
//         key: col,
//         value: -1
//       });
//     } else if (filter.value === -1) {
//       setFilter({
//         ...filter,
//         value: 1
//       });
//     } else {
//       setFilter({
//         ...filter,
//         value: 0
//       });
//     }
//   };
//   const renderHeader = () => {
//     const columns = [
//       {
//         key: "name",
//         title: "Name"
//       },
//       {
//         key: "gender",
//         title: "Gender"
//       },
//       {
//         key: "email",
//         title: "Email"
//       },
//       {
//         key: "phone",
//         title: "Phone"
//       },
//       {
//         key: "city",
//         title: "City"
//       },
//       {
//         key: "state",
//         title: "State"
//       }
//     ];
//     const sortIcon = filter.value === 1 ? 1 : 0;
//     return (
//       <thead>
//         <tr >
//           {columns.map(({ key, title }) => (
//             <th
//               className="tbl__header"
//               onClick={() => onSortColumn(key)}
//               key={key}
//             >
//               <div className="tbl__header__title">
//                 {title}
//                 {filter.key === key && !!filter.value && (
//                  <>hihihi</>
//                 )}
//               </div>
//             </th>
//           ))}
//         </tr>
//       </thead>
//     );
//   };

//   const onSearch = (event) => {
//     const value = event.target.value;
//     setQuery(value);
//   };

//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <div className="query">
//         <label for="query-input" className="query__label">
//           Search
//         </label>
//         <input
//           id="query-input"
//           className="query__input"
//           type="text"
//           onChange={onSearch}
//           value={query}
//         />
//       </div>
//       <table>
//         {renderHeader()}
//         <tbody className="test">
//           {sortedData.map((item, index) => (
//             <>
//             <div className="test2"> {item.name}</div>

//             <tr  key={`${item.name}_${index}`}>
//               <td>{item.name}</td>
//               <td>{item.gender}</td>
//               <td>{item.email}</td>
//               <td>{item.phone}</td>
//               <td>{item.city}</td>
//               <td>{item.state}</td>
//             </tr>
//          </> ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useState } from 'react';

const Test = () => {
    const[input,setinput]=useState('')
    const[key,setkey]=useState(0)
    function keychanges(e){
        if(e.keyCode===13){
            setkey(13)
        }

    }
   function handleChange(e){
    setinput(e.target.value)
    if (key === 13) {
        var temp=input
        var newInput=temp+"\n*"+e.target.value
        setinput(newInput)
        // document.getElementById("txtArea").value = document.getElementById("txtArea").value + "\n*";
        return false;
    }

   }
    return (
        <div>
            <textarea onChange={(e)=>handleChange(e)} onKeyDown={(e)=>keychanges(e)}></textarea>
            <div>
               {input}
                </div>
        </div>
    );
}

export default Test;
