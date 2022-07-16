import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import React, { useRef, useState, useEffect } from 'react';
import app from '../required';
import './pdfcss.css';
import './profile.css';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import moment from 'moment';
import { Image } from '@material-ui/icons';
import Footer, { GoogleReviews } from './footer';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import NightsController from './subcomponents/NightsController';
import { Modal } from '@material-ui/core';
import { wait } from '@testing-library/user-event/dist/utils';
const db = getFirestore(app);
const storage = getStorage();


const Profile = (
    {
        count_days,
        SelectedpackageType,
        email,
        indicator,
        inclusion_data,
        travel_data,
        cabDetailsData,
        flightsObject,
        closePDF,
        closeHandler,
        itineary,
        NightDataFields,
        selected_Travel_date,
        flightcost,
        visacost,
        landPackage,
        Allquote,
        updateTableDataAfterQuote,
        profile,
        flightsLinkfromstorage,
        flight
    }
) => {
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    const Data = travel_data
    // console.log(NightDataFields)
    const [callback, setcallback] = useState(false)
    const [inclusionlist, setinclusion] = useState([])
    const [exclusionlist, setexclusion] = useState([''])
    const pdfExportComponent = useRef(null);
    const currentdate = new Date();
    const TripId = Data.TripId
    const month = currentdate.toLocaleString('default', { month: 'long' })
    const [flightsLocalUrl, setflightsLocalUrl] = useState(null)
    const [checkIn, setcheckIn] = useState(selected_Travel_date)
    const [wait, setwait] = useState(false)
    const [allUploadFlights, setlinkforFlights] = useState([])

    function controlsetCheckIn(value) {
        setcheckIn(value)
    }
    function fiterInclusion() {
        var keys = Object.keys(inclusion_data).filter(function (k) { return inclusion_data[k] == true && typeof (inclusion_data[k]) !== "string" && inclusion_data[k] !== null });
        // console.log(keys)
        setinclusion(keys)
    }
    function filterExclusion() {
        var keys = Object.keys(inclusion_data).filter(function (k) { return inclusion_data[k] == false && typeof (inclusion_data[k]) !== "string" && inclusion_data[k] !== null });
        // console.log(keys)
        setexclusion(keys)
    }
    async function convertObjectToLink() {
        try {
            const file = flightsObject
            // console.log(file)
            // debugger
            var local_link_list = []
            for (var start = 0; start < flightsObject.length; start++) {
                var temp = { Link: '', path: '' }
                const url = URL.createObjectURL(file[start])
                temp.Link = url
                local_link_list.push(temp)
                // console.log('url', url)
            }
            setflightsLocalUrl(local_link_list)
        }
        catch (e) { console.log(e) }

    }
    useEffect(() => {
        if (!flightsLinkfromstorage) {
            convertObjectToLink()
        }
        fiterInclusion()
        filterExclusion()

    }, []);


    async function setQuotationData() {
        if (indicator) {
            closePDF()
        }
        else {
            uploadFlightsScreenShots(flightsObject, Data.TripId)
            await addDoc(collection(db, "Quote"), {
                label: `${currentdate.getDate()}:${currentdate.getMonth() + 1}:${(currentdate.getFullYear())}:${currentdate.getHours()}:${currentdate.getMinutes()}`,
                value: {
                    travel_data: Data,
                    count_days: count_days,
                    flightcost: flightcost,
                    visacost: visacost,
                    landPackage: landPackage,
                    itineary: itineary,
                    selected_Travel_date: String(selected_Travel_date),
                    NightDataFields: NightDataFields,
                    pdf_name: `${currentdate.getDate()}:${currentdate.getMonth() + 1}:${(currentdate.getFullYear())}:${currentdate.getHours()}:${currentdate.getMinutes()}`,
                    cabDetailsData: cabDetailsData,
                    // flights: flights,
                    inclusion_data: inclusion_data,
                    SelectedpackageType: SelectedpackageType,
                    flightsImagesLinks: allUploadFlights
                }
            });

        }
    }

    async function update_quotation_flg() {
        // debugger
        let quotation_new = parseInt(travel_data.quotation) + 1
        await updateDoc(doc(db, "Trip", `${travel_data.TripId}`), {
            quotation: quotation_new,
            quotation_flg: true,
            month: month,
            Follow_Up_date: String(selected_Travel_date),
            Quoted_by: email,
            Travel_Duration: count_days
        });
    }


    function uploadFlightsScreenShots(files, TripId) {
        var localList = []
        var tempMemo = { Link: '', path: '' }
        for (var loadIndex = 0; loadIndex < files.length; loadIndex++) {
            const storageRef = ref(storage, `vouchers/${TripId}/flightsScreenShots/${files[loadIndex].name}`);
            const path = `vouchers/${TripId}/flightsScreenShots/${files[loadIndex].name}`
            const uploadTask = uploadBytesResumable(storageRef, files[loadIndex]);
            uploadTask.on('state_changed',
                (snapshot) => {
                    // console.log(snapshot)
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            break;
                        case 'storage/canceled':
                            break;
                        case 'storage/unknown':
                            break;
                    }
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        tempMemo.Link = downloadURL
                        tempMemo.path = path
                        console.log(tempMemo, downloadURL)
                        // updateLinkAndPathOfUploadedVouchers(path, downloadURL, name)
                        // getdatalatest_for_voucher()
                        // stoploading()

                    });
                }
            );
            localList.push(tempMemo)
        }
        console.log(localList)
        setlinkforFlights(localList)
    }
    useEffect(() => {
        console.log(allUploadFlights)
    }, [allUploadFlights]);
    function closeFormAndPdf() {
        setwait(false)
        closePDF()
        updateTableDataAfterQuote(TripId)
        closeHandler()

    }
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function handleExportWithComponent() {
        setwait(true)
        pdfExportComponent.current.save();
        await delay(10000);
        closeFormAndPdf()

    };
    function pdfgenrator() {
        handleExportWithComponent()
        try {
            update_quotation_flg()
        }
        catch (e) {
            console.log(e)
        }
       
        try {

            setQuotationData()
        }
        catch (e) {
            console.log(e)
        }
        try {
            Allquote()
        }
        catch (error) {
            console.log(error)
        }

    }
    var name = (travel_data.Destination).toUpperCase()

    return (
        <>
            <Modal open={wait} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <>
                    <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
                </>
            </Modal>
            <PDFExport
                ref={pdfExportComponent}
                fileName={`${travel_data.Traveller_name}`}
                forcePageBreak=".page-break"
            >
                <div className={`pre ${layoutSelection.value}`}>
                    {/* this is the first page for introduction to the destination */}
                    <div className={'page1'}
                        style={{
                            backgroundImage: `url(/assets/destination/${name}/Header.png)`,
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            // color:"white"
                        }}
                    >
                        <div>
                            <a href={"https://wa.me/919304247331"} target="_blank">
                                <img className='page1whatsApp' src='/assets/pdfDefaultImage/whatApp.png' />
                                {/* <img className='page1whatsApp' src={flightsLocalUrl} /> */}

                            </a>
                        </div>
                        <div className="footer">
                            <a className="href" href="tel:9304247331">
                                <div className="footer_img_with_text">

                                    <img src="/assets/pdfDefaultImage/callinglogo.png" height='63px' />

                                    <div className="footer_call_for_more_info">
                                        <span>Call for More Information</span>
                                        <span>
                                            +91-{travel_data.Contact_Number}
                                        </span>
                                    </div>
                                </div>
                            </a>

                            <div className="DividerLine"></div>
                            <div className="footer_web_info">
                                <a className="href" href="https://www.journeyrouters.com/" target="_blank">
                                    <div>
                                        <img src="/assets/pdfDefaultImage/weblogo.png" height='63px' />
                                    </div>
                                    <div className="web_info_text">
                                        <span>Visit Us  At</span><br />
                                        <span>
                                            www.journeyrouters.com
                                        </span>

                                    </div>
                                </a>

                            </div>
                        </div>
                    </div>
                    {/* end of 1st page(introduction page)*/}

                    {/* page2 start (Package Details)*/}
                    <div className="page-break">
                        <div className="page2" style={{
                            backgroundImage: `url(/assets/destination/${name}/PackageDetails.png)`,
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}>

                            <div className="package_details">
                                <div>
                                    <span>Destination</span><br />
                                    <span>Date</span><br />
                                    <span>Duration</span><br />
                                    <span>Traveler</span>
                                </div>
                                <div >
                                    <span>- {travel_data.Destination}</span><br />
                                    <span>- {selected_Travel_date}</span><br />
                                    <span>- {count_days} Days, {count_days - 1} Nights</span><br />
                                    <span>- {travel_data.Pax} Adults , {travel_data.Child ? travel_data.Child : 0} Child</span><br />
                                </div>

                            </div>
                            <div className="yellow_details">
                                <p className="dayDetails">{count_days} Days {count_days - 1} Nights</p>
                                <p className="setPara">at just</p>
                                <h4 className="seth4">INR {parseInt(landPackage) + parseInt(flightcost) + parseInt(visacost)}/-</h4>
                                <p className="setPara_">{SelectedpackageType}</p>
                            </div>
                            <div >
                                <Footer />
                            </div>
                        </div>

                    </div>
                    {/* end of 2st page(Package Details page)*/}

                    {/* 3rd page start (inclusionAndExclusion page))*/}
                    <div className="page-break">
                        <div className="inclusion"
                            style={{
                                backgroundImage: "url(/assets/pdfDefaultImage/blank_border-bottom.png)",
                                backgroundPosition: "top",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src={`/assets/destination/${name}/InclusionExclusion.png`} />
                            </div>
                            <div className="inclusionPage_blocks" >
                                <span> Inclusion</span>
                                <span>Exclusion</span>
                            </div>
                            <div className="inclusionExclusionDetails">
                                <div>
                                    {
                                        inclusionlist.map((data, index) => (
                                            <div className="aliner_">
                                                <span key={index}>
                                                    <img src="/assets/pdfDefaultImage/correct.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />
                                                    {data}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="sepratorLineForInclusionExclusion"></div>
                                <div>
                                    {
                                        exclusionlist.map((data, index) => (
                                            <div className="aliner_">
                                                <span key={index}>
                                                    <img src="/assets/pdfDefaultImage/cross.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />

                                                    {data}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                                <img className='setInsta' src='/assets/pdfDefaultImage/insta2.png' />
                            </a>
                            <div style={{ marginTop: '3.9rem' }} >
                                <Footer />
                            </div>

                        </div>
                    </div>
                    {/* end of 3rd page(inclusion Exclusion page)*/}


                    {/* 4th page started(google review page )*/}
                    <div className="page-break">
                        <div className="page2"
                            style={{
                                backgroundImage: "url(/assets/pdfDefaultImage/jrgoogleReview.png)",
                                backgroundPosition: "top",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}
                        >
                            <div></div>
                            <GoogleReviews />
                            <Footer />
                        </div>
                    </div>
                    {/* end of 4th page(Google Review page)*/}

                    {/* start of 5th page DayWise Itineary*/}
                    <div className="page-break">
                        <div className="itinearypage"
                            style={{
                                background: 'black'
                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src={`/assets/destination/${name}/DayWiseItineary.png`} />

                                <span className='headLineDaywiseItineary'> Day wise Itineary</span>
                                <div className='itinearyDiv'>
                                    {itineary &&
                                        itineary.map((data, index) => (
                                            <div className='mapitineary'>
                                                <span style={{ width: '5rem' }}><span> Day </span> {index + 1} -</span>
                                                <p style={{ width: '91%' }}>{data.Day}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div
                                    style={{
                                        backgroundImage: "url(/assets/pdfDefaultImage/seprateFooter1.jpg)",
                                        backgroundPosition: "top",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        height: '5.5rem',
                                        display: 'flex',
                                        flexDirection: 'column-reverse'
                                    }}
                                >
                                    <Footer />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* end of 5th page(DayWiseitineary page)*/}

                    {/* start of 6th page (DetailItineary page)*/}
                    <div className="page-break">
                        <div className="itinearypage"
                            style={{
                                background: 'black'
                            }}
                        >
                            <div>
                                <img className="inclusionPage_img"
                                    src={`/assets/destination/${name}/DetailItineary.png`}
                                />

                                <span className='headLineDaywiseItineary'>Detail  Itineary</span>
                                <div className='itinearyDiv'>
                                    {
                                        itineary.map((data, index) => (
                                            <div className={(index + 1) % 2 == 0 ? 'DaywiseItinearyDiv' : 'DaywiseItinearyDivReverse'}>
                                                <div className='DaywiseItinearyDivleft'>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span className='dayheader'>
                                                            Day {index + 1} - {data.Day}
                                                        </span>
                                                    </div>
                                                    <p className='dayDetailsitineary'>{data.Description}</p>
                                                </div>
                                                <div className='DaywiseItinearyDivRight'>
                                                    <img
                                                        // src='/assets/pdfDefaultImage/BALI ACTIVITIES IMAGES-20220704T120432Z-001/SolangValleym (1).png'
                                                        src={`/assets/destination/${name}/${data.Activity}.png`}
                                                        style={{ width: "14rem", height: "14rem" }} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div
                                    style={{
                                        backgroundImage: "url(/assets/pdfDefaultImage/seprateFooter1.jpg)",
                                        backgroundPosition: "top",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        height: '5.5rem',
                                        display: 'flex',
                                        flexDirection: 'column-reverse'
                                    }}
                                >
                                    <Footer />
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* end of 6th page(detail itineary page)*/}

                    {/*start of 7th page (hotel page)*/}
                    <div className="page-break">
                        <div className="HotelPage"
                            style={{
                                background: 'black'

                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src="/assets/pdfDefaultImage/hotel header.png" />
                                <span className='headLineDaywiseItineary'>Accommodation</span>

                                {
                                    NightDataFields.map((data, index) => (
                                        <div key={index} className='hotelUni'>
                                            <div>
                                                <img src={`/assets/pdfDefaultImage/demoHotel${index + 1}.png`} width="320px" />
                                            </div>
                                            <div className='hotelUniRight'>
                                                <h4 style={{ color: 'yellow' }}>{
                                                    data.Night.map((data_, index) => (<span key={index}>{data_},</span>))
                                                } Stay at {data.City}</h4>

                                                <span>Hotel-{data.HotelName}</span><br />
                                                <span>Meal-{data.HotelMeal.map((data__, index) => (console.log(data__), <span>{data__},</span>))}</span>  <br />
                                                <span>Room-{data.RoomType}</span><br />
                                                <h4></h4>
                                                <NightsController
                                                    nights={data.Night.length}
                                                    checkIn={checkIn}
                                                    controlsetCheckIn={controlsetCheckIn}
                                                />


                                            </div>
                                        </div>
                                    ))
                                }

                                <div
                                    style={{
                                        backgroundImage: "url(/assets/pdfDefaultImage/seprateFooter1.jpg)",
                                        // backgroundPosition: "top",
                                        backgroundRepeat: "no-repeat",
                                        backgroundSize: "cover",
                                        height: '5.5rem',
                                        display: 'flex',
                                        flexDirection: 'column-reverse',
                                        marginTop: '2rem'
                                    }}
                                >
                                    <Footer />
                                </div>
                            </div>
                            {/* <div>
                                <a href={"https://wa.me/919304247331"} target="_blank">
                                    <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
                                </a>
                            </div> */}

                        </div>
                    </div>
                    {/*end of 7th page (hotel page)*/}

                    {/* start of 8th page(Flights page) */}
                    {
                        flight ? <>
                            <div className="page-break">
                                <div className="HotelPage"
                                    style={{
                                        background: 'black'

                                    }}
                                >
                                    <div>
                                        <img className="inclusionPage_img" src="/assets/pdfDefaultImage/FlightsHeader.png" />
                                        <span className='headLineDaywiseItineary'>Flight</span>
                                        {
                                            flightsLocalUrl ? <>
                                                {
                                                    flightsLocalUrl.map((link, index) => (
                                                        <img key={index} className='flightsImgcss' src={link.Link} />
                                                    ))
                                                }
                                            </> : <></>
                                        }

                                        <div
                                            style={{
                                                backgroundImage: "url(/assets/pdfDefaultImage/seprateFooter1.jpg)",
                                                // backgroundPosition: "top",
                                                backgroundRepeat: "no-repeat",
                                                backgroundSize: "cover",
                                                height: '5.5rem',
                                                display: 'flex',
                                                flexDirection: 'column-reverse',
                                                marginTop: '2rem'
                                            }}
                                        >
                                            <Footer />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </> : <></>
                    }

                    {/* end of 8th page(Flights page) */}

                    {/* start of 9th page(payments details) */}
                    <div className="page-break">
                        <div className="page2"
                            style={{
                                backgroundImage: "url(/assets/pdfDefaultImage/paymentspage.png)",
                                backgroundPosition: "top",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}
                        >
                            <div>
                                <a href={"https://wa.me/919304247331"} target="_blank">
                                    <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
                                </a>
                            </div>

                        </div>
                    </div>
                    {/* end of 9th page(payments details) */}

                    {/* start of jr info page */}
                    <div className="page-break">
                        <div className="page2"
                            style={{
                                backgroundImage: "url(/assets/pdfDefaultImage/journeyRouters_about.png)",
                                backgroundPosition: "top",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}
                        >
                            <div>
                                <a href={"https://wa.me/919304247331"} target="_blank">
                                    <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
                                </a>
                            </div>

                        </div>
                    </div>
                    {/* end of jr info page */}

                    {/* start of jr FAQ page */}
                    <div className="page-break">
                        <div className="page2"
                            style={{
                                backgroundImage: "url(/assets/pdfDefaultImage/FAQ.png)",
                                backgroundPosition: "top",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}
                        >
                            <div>
                                <a href={"https://wa.me/919304247331"} target="_blank">
                                    <img className="whatsAppOnInclusionExclusionPage" src='/assets/pdfDefaultImage/whatApp.png' />
                                </a>
                            </div>

                        </div>
                    </div>
                    {/* end of jr FAQ page */}


                </div>
            </PDFExport>
            {
                indicator ? <>
                    <button className='download_button' onClick={() => handleExportWithComponent()}>downloadURL</button>

                </> : <>
                    <button className='download_button' onClick={() => pdfgenrator()}>downloadURL</button>
                </>
            }
            {/* <button className='download_button' onClick={() => pdfgenrator()}>save Quote</button> */}



        </>
    );
}

export default Profile
