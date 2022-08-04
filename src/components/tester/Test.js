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
//     sapn: "A4",
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
//           type="sapn"
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

import { PDFExport } from "@progress/kendo-react-pdf";
import { useEffect, useRef, useState } from 'react';
import '../Profile/profile.css';
import '../Profile/pdfcss.css';
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import app from "../required";
import moment from "moment";
const db = getFirestore(app);
const currentdate = new Date();


const Test = () => {
    const [inclusionlist, setinclusion] = useState([])
    const [exclusionlist, setexclusion] = useState([])
    const pdfExportComponent = useRef(null);
    const [layoutSelection, setLayoutSelection] = useState({
        sapn: "A4",
        value: "size-a4"
    });
    const [input, setinput] = useState('')
    const [key, setkey] = useState(0)
    function keychanges(e) {
        if (e.keyCode === 13) {
            setkey(13)
        }

    }
    function handleExportWithComponent() {
        pdfExportComponent.current.save();

    };
    const inclusion = {
        breakfast: true,
        lunch: false,
        lunch_comments: null,
        dinner: true,
        dinner_comments: null,
        airport_arival: true,
        airport_departure: true,
        cab_SIC: false,
        cab_Private: true,
        cab_Private_comments: null,
        Gst: true,
        airfair: true,
        siteseeing: false,
        siteseeing_comments: "hhiih",
        Visa: true,
        Visa_comments: null,
        Entrance_fee: true,
        Entrance_comments: null,
        other_Inclusion: null,
        other_Exclusion: null
    }

    function fiterInclusion() {
        var keys = Object.keys(inclusion).filter(function (k) { return inclusion[k] == true && typeof (inclusion[k]) !== "string" && inclusion[k] !== null });
        console.log(keys)
        setinclusion(keys)
    }
    function filterExclusion() {
        var keys = Object.keys(inclusion).filter(function (k) { return inclusion[k] == false && typeof (inclusion[k]) !== "string" && inclusion[k] !== null });
        console.log(keys)
        setexclusion(keys)
    }
    useEffect(() => {
        fiterInclusion()
        filterExclusion()

    }, []);
    function handleChange(e) {
        setinput(e.target.value)
        if (key === 13) {
            var temp = input
            var newInput = temp + "\n*" + e.target.value
            setinput(newInput)
            // document.getElementById("txtArea").value = document.getElementById("txtArea").value + "\n*";
            return false;
        }

    }
    async function sanp() {
        const q = query(collection(db, "Trip"), where("Lead_Status", "==", "Converted"), where("Lead_status_change_date", "==", moment(currentdate).format('YYYY-MM-DD')));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cities = [];
            querySnapshot.forEach((doc) => {
                cities.push(doc.data().TripId);
            });
            console.log("Current cities in CA: ", cities.join(","));
        });
    }
    function testcall() {
        const q = query(collection(db, "Trip"), where("Lead_Status", "==", "Converted"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log(snapshot.docChanges())
            snapshot.docChanges().forEach((change) => {
                switch (change.type) {
                    case 'added':
                        console.log("New : ", change.doc.data());
                        break;
                    case 'modified':
                        console.log("modified : ", change.doc.data());
                        break;
                    case 'removed':
                        console.log("removed : ", change.doc.data());
                        break;



                }
                // if (change.type === "added") {
                //     console.log("New : ", change.doc.data());
                //     return
                // }
                // else if (change.type === "modified") {
                //     console.log("Modified : ", change.doc.data());
                //     return
                // }
                // else if (change.type === "removed") {
                //     console.log("Removed : ", change.doc.data());
                //     return
                // }
            });
        });
    }
    useEffect(() => {
        fetch('https://script.googleusercontent.com/macros/echo?user_content_key=Z0iyrtrz0VZHHFkftxnI5gGiR9XrFpQSe-eXai7HUMZw3pQWTM-obCcz4Qo6sicG6VaMxB2aKVbWxS6KWMIwgt8-U0rWVv8om5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnCq7BfKwHVNWJIhF5IZUPJJ-AlPu-rXOzG9usvx7BdjDmJezhmnQeuaPp0y2MizrbujCBPFjnRjf87_1pQit6GstLfBuYq4ZSw&lib=M38TL66tBKta-3qCGUuIlJdi165N2UV80')
        .then((response) => response.json())
        .then((data) => console.log(data));
    }, []);
    var name = "BALI.png"
    var link = `/assets/destination/${name}`
    return (
        <></>
        // <>
        //     <PDFExport
        //         ref={pdfExportComponent}
        //         fileName={`${'Traveller_name'}`}
        //         forcePageBreak=".page-break"
        //     >
        //         <div className={`pre ${layoutSelection.value}`}>
        //             <div className={'page1'}
        //                 style={{
        //                     backgroundImage: `url(${link})`,
        //                     backgroundPosition: "top",
        //                     backgroundRepeat: "no-repeat",
        //                     backgroundSize: "cover",
        //                     // color:"white"
        //                 }}
        //             >
        //                 <div>
        //                     <a href={"https://wa.me/919304247331"} target="_blank">
        //                         <img className='page1whatsApp' src='/assets/pdfDefaultImage/whatApp.png' />
        //                     </a>
        //                 </div>
        //                 <div className="footer">
        //                     <a className="href" href="tel:9304247331">
        //                         <div className="footer_img_with_text">

        //                             <img src="/assets/pdfDefaultImage/callinglogo.png" height='63px' />

        //                             <div className="footer_call_for_more_info">
        //                                 <span>Call for More Information</span>
        //                                 <span>
        //                                     +91-9304247331
        //                                 </span>
        //                             </div>
        //                         </div>
        //                     </a>

        //                     <div className="DividerLine"></div>
        //                     <div className="footer_web_info">
        //                         <a className="href" href="https://www.journeyrouters.com/" target="_blank">
        //                             <div>
        //                                 <img src="/assets/pdfDefaultImage/weblogo.png" height='63px' />
        //                             </div>
        //                             <div className="web_info_text">
        //                                 <span>Visit Us  At</span><br />
        //                                 <span>
        //                                     www.journeyrouters.com
        //                                 </span>

        //                             </div>
        //                         </a>

        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="page-break">
        //                 <div className="page2" style={{
        //                     backgroundImage: "url(/assets/pdfDefaultImage/package.png)",
        //                     backgroundPosition: "top",
        //                     backgroundRepeat: "no-repeat",
        //                     backgroundSize: "cover",
        //                     // color:"white"
        //                 }}>

        //                     <div className="package_details">
        //                         <div>
        //                             <span>Destination</span><br />
        //                             <span>Date</span><br />
        //                             <span>Duration</span><br />
        //                             <span>Traveler</span>
        //                         </div>
        //                         <div >
        //                             <span>- BALI</span><br />
        //                             <span>- 24 Apri 2022</span><br />
        //                             <span>- 6 Day 5 Nights</span><br />
        //                             <span>- 2 Adult</span><br />
        //                         </div>

        //                     </div>
        //                     <div className="yellow_details">
        //                         <p className="dayDetails">6 Days 5 Nights</p>
        //                         <p className="setPara">at just</p>
        //                         <h4 className="seth4">INR 3,00,000/-</h4>
        //                         <p className="setPara_">Per Person</p>
        //                     </div>
        //                     <div >
        //                         <div className="bottom_media_details">Follow Us At
        //                             <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
        //                             </a>
        //                             <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
        //                             </a>
        //                             <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
        //                             </a>
        //                             <a href="https://twitter.com/JourneyRouters" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
        //                             </a>
        //                             @journeyrouters
        //                             <a href={"https://wa.me/919304247331"} target="_blank">
        //                                 <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
        //                             </a>
        //                         </div>
        //                     </div>
        //                 </div>

        //             </div>
        //             <div className="page-break">
        //                 <div className="inclusion"
        //                     style={{
        //                         backgroundImage: "url(/assets/pdfDefaultImage/blank_border-bottom.png)",
        //                         backgroundPosition: "top",
        //                         backgroundRepeat: "no-repeat",
        //                         backgroundSize: "cover",
        //                     }}
        //                 >
        //                     <div>
        //                         <img className="inclusionPage_img" src="/assets/pdfDefaultImage/Singapre Header.png" />
        //                     </div>
        //                     <div className="inclusionPage_blocks" >
        //                         <span> Inclusion</span>
        //                         <span>Exclusion</span>
        //                     </div>
        //                     <div className="inclusionExclusionDetails">
        //                         <div>
        //                             {
        //                                 inclusionlist.map((data, index) => (
        //                                     <div className="aliner_">
        //                                         <span key={index}>
        //                                             <img src="/assets/pdfDefaultImage/correct.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />
        //                                             {data}</span>
        //                                     </div>
        //                                 ))
        //                             }
        //                         </div>
        //                         <div className="sepratorLineForInclusionExclusion"></div>
        //                         <div>
        //                             {
        //                                 exclusionlist.map((data, index) => (
        //                                     <div className="aliner_">
        //                                         <span key={index}>
        //                                             <img src="/assets/pdfDefaultImage/cross.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />

        //                                             {data}</span>
        //                                     </div>
        //                                 ))
        //                             }
        //                         </div>
        //                     </div>
        //                     {/* <div>
        //                         <a href={"https://wa.me/919304247331"} target="_blank">
        //                             <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
        //                         </a>
        //                     </div> */}

        //                 </div>
        //             </div>


        //             <div className="page-break">
        //                 <div className="page2"
        //                     style={{
        //                         backgroundImage: "url(/assets/pdfDefaultImage/jrgoogleReview.png)",
        //                         backgroundPosition: "top",
        //                         backgroundRepeat: "no-repeat",
        //                         backgroundSize: "cover"
        //                     }}
        //                 >
        //                     <div></div>
        //                     <div className="google_review_bottom">
        //                         <div className="reiew_c1">
        //                             <a href="https://g.co/kgs/VwbmYT" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/Aashishsingh.PNG" className="review_img5" />
        //                             </a>
        //                             <a href="https://g.co/kgs/ZK68wZ" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/Amit singh.PNG" className="review_img1" />
        //                             </a>
        //                             <a href="https://g.co/kgs/qM1e2f" target="_blank">

        //                                 <img src="/assets/pdfDefaultImage/google_reviews/imran.PNG" className="review_img2" />
        //                             </a>

        //                         </div>
        //                         <div className="reiew_c2">
        //                             <a
        //                                 href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x390ce1d4b9237199:0x7b102f107dc6a192?source=g.page.m._"
        //                                 target='_blank' className="link">
        //                                 <img src="/assets/pdfDefaultImage/google.png" className="googleImg_" />
        //                                 <img src="/assets/pdfDefaultImage/4.8ratting.png" className="ratting" />
        //                                 <span> 400 & Counting Google Review</span>
        //                             </a>
        //                             <a href="https://g.co/kgs/ReZyXo" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/Tanmay.PNG" className="review_img" />
        //                             </a>
        //                             <a href="https://g.co/kgs/ByT5hQ" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/Stephen Raj.PNG" className="review_img" />
        //                             </a>


        //                         </div>
        //                         <div className="reiew_c3">
        //                             <a href="https://g.co/kgs/iD3DvX" target="_blank">
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/Kajal.PNG" className="review_img" />
        //                             </a>
        //                             <a href="https://g.co/kgs/iD3DvX" target="_blank" >
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/manoj.PNG" className="review_img3" />
        //                             </a>
        //                             <a href="https://g.co/kgs/kXdzCU" target="_blank" >
        //                                 <img src="/assets/pdfDefaultImage/google_reviews/Naveen.PNG" className="review_img4" />
        //                             </a>

        //                         </div>
        //                     </div>
        //                     <div className="bottom_media_details">Follow Us At
        //                         <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
        //                             <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
        //                         </a>
        //                         <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
        //                             <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
        //                         </a>
        //                         <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
        //                             <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
        //                         </a>
        //                         <a href="https://twitter.com/JourneyRouters" target="_blank">
        //                             <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
        //                         </a>
        //                         @journeyrouters
        //                         <a href={"https://wa.me/919304247331"} target="_blank">
        //                             <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
        //                         </a>
        //                     </div>



        //                 </div>
        //             </div>
        //             <div className="page-break">
        //                 <div className="page2"
        //                     style={{
        //                         backgroundImage: "url(/assets/pdfDefaultImage/paymentspage.png)",
        //                         backgroundPosition: "top",
        //                         backgroundRepeat: "no-repeat",
        //                         backgroundSize: "cover"
        //                     }}
        //                 >
        //                     <div>
        //                         <a href={"https://wa.me/919304247331"} target="_blank">
        //                             <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
        //                         </a>
        //                     </div>

        //                 </div>
        //             </div>
        //             <div className="page-break">
        //                 <div className="page2"
        //                     style={{
        //                         backgroundImage: "url(/assets/pdfDefaultImage/journeyRouters_about.png)",
        //                         backgroundPosition: "top",
        //                         backgroundRepeat: "no-repeat",
        //                         backgroundSize: "cover"
        //                     }}
        //                 >
        //                     <div>
        //                         <a href={"https://wa.me/919304247331"} target="_blank">
        //                             <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
        //                         </a>
        //                     </div>

        //                 </div>
        //             </div>
        //             <div className="page-break">
        //                 <div className="page2"
        //                     style={{
        //                         backgroundImage: "url(/assets/pdfDefaultImage/FAQ.png)",
        //                         backgroundPosition: "top",
        //                         backgroundRepeat: "no-repeat",
        //                         backgroundSize: "cover"
        //                     }}
        //                 >
        //                     <div>
        //                         <a href={"https://wa.me/919304247331"} target="_blank">
        //                             <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
        //                         </a>
        //                     </div>

        //                 </div>
        //             </div>

        //         </div>
        //     </PDFExport>

        //     <button className='download_button' onClick={() => handleExportWithComponent()}>downloadURL</button>
        //     {/* <button className='download_button' onClick={() => pdfgenrator()}>save Quote</button> */}



        // </>
    );
}

export default Test;
