import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import React, { useRef, useState, useEffect } from 'react';
import app from '../required';
import './pdfcss.css';
import './profile.css';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import moment from 'moment';
import { Call, CallMissedOutgoing, ContactlessOutlined, Image } from '@material-ui/icons';
import Footer, { GoogleReviews } from './footer';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import NightsController from './subcomponents/NightsController';
import { Modal } from '@material-ui/core';
import { wait } from '@testing-library/user-event/dist/utils';
const db = getFirestore(app);
const storage = getStorage();


const Profile = (
    {
        handleSuggestion,
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
    console.log(itineary)
    const [layoutSelection, setLayoutSelection] = useState({
        sapn: "A4",
        value: "size-a4"
    });
    const pdfExportComponent = useRef(null);
    const Data = travel_data
    const currentdate = new Date();
    const TripId = Data.TripId
    const month = currentdate.toLocaleString('default', { month: 'long' })
    const [flightsLocalUrl, setflightsLocalUrl] = useState(flightsLinkfromstorage ? flightsLinkfromstorage : null)
    const [checkIn, setcheckIn] = useState(selected_Travel_date)
    const [wait, setwait] = useState(false)
    const [destinationName, setname] = useState((travel_data.Destination).toUpperCase())
    const [whatsApp, setwhatsApp] = useState(profile.WhatsApp_number)
    const [Call, setCalling] = useState(profile.contact_number)
    const [ImgLinks, setImgLinks] = useState([])
    function controllLinks(args) {
        setImgLinks(args)
    }

    function controlsetCheckIn(value) {
        setcheckIn(value)
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
        if (!indicator) {
            uploadFlightsScreenShots()
        }
        console.log(destinationName)

    }, []);

    async function setQuotationData() {
        // console.log(ImgLinks)
        // debugger
        if (indicator) {
        }
        else {
            await addDoc(collection(db, "Quote"), {
                label: moment(currentdate).format('lll'),
                value: {
                    travel_data: Data,
                    count_days: count_days,
                    flightcost: flightcost,
                    visacost: visacost,
                    landPackage: landPackage,
                    itineary: itineary,
                    selected_Travel_date: String(selected_Travel_date),
                    NightDataFields: NightDataFields,
                    pdf_name: moment(currentdate).format('lll'),
                    cabDetailsData: cabDetailsData,
                    // flights: flights,
                    inclusion_data: inclusion_data,
                    SelectedpackageType: SelectedpackageType,
                    flightsImagesLinks: ImgLinks,
                    Quoted_by: profile.name
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
            month: moment(selected_Travel_date).format('MMMM'),
            Follow_Up_date: String(selected_Travel_date),
            time: currentdate,
            Quoted_by: email,
            Travel_Duration: count_days
        });
    }


    function uploadFlightsScreenShots() {
        var files = flightsObject
        var TripId = Data.TripId
        var localList = []
        var tempMemo = { Link: '', path: '' }
        for (var loadIndex = 0; loadIndex < files.length; loadIndex++) {
            const storageRef = ref(storage, `vouchers/${TripId}/flightsScreenShots/${files[loadIndex].destinationName}`);
            const path = `vouchers/${TripId}/flightsScreenShots/${files[loadIndex].destinationName}`
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
                        // console.log('File available at', downloadURL);
                        tempMemo.Link = downloadURL
                        tempMemo.path = path

                    });
                }
            );
            localList.push(tempMemo)
        }
        // console.log(localList)
        controllLinks(localList)
    }
    function closeFormAndPdf() {
        setwait(false)
        updateTableDataAfterQuote(travel_data.TripId)
        try { handleSuggestion() }
        catch (error) { console.log(error) }
        closeHandler()
        try {
            Allquote()
        }
        catch (e) {
            console.log(e)
        }
        closePDF()

    }
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function handleExportWithComponent() {
        setwait(true)
        pdfExportComponent.current.save();
        await delay(20000);
        closeFormAndPdf()

    };
    async function pdfgenrator() {
        setwait(true)
        pdfExportComponent.current.save();
        await delay(20000);
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
        closeFormAndPdf()
    }
    var formatter = new Intl.NumberFormat('en-US', {})

    return (
        <>
            <Modal open={wait} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <>
                    <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
                </>
            </Modal>
            <PDFExport
                ref={pdfExportComponent}
                fileName={`${travel_data.Traveller_name}/${travel_data.Destination}`}
                forcePageBreak=".page-break"
            >
                <div className={`pre ${layoutSelection.value}`}>
                    {/* this is the first page for introduction to the destination */}
                    <div className={'page1'}
                        style={{
                            backgroundImage: `url(/assets/destination/${destinationName}/Header.png)`,
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            // color:"white"
                        }}
                    >
                        <div>
                            <a href={"https://wa.me/" + whatsApp} target="_blank">
                                <img className='page1whatsApp' src='/assets/pdfDefaultImage/whatApp.png' />
                                {/* <img className='page1whatsApp' src={flightsLocalUrl} /> */}

                            </a>
                        </div>
                        <div className="footer">
                            <a className="href" href={"tel:" + Call}>
                                <div className="footer_img_with_text">
                                    <img src="/assets/pdfDefaultImage/callinglogo.png" height='63px' />
                                    <div className="footer_call_for_more_info">
                                        <span>Call for More Information</span>
                                        <span>
                                            +91-{Call}
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
                            backgroundImage: `url(/assets/destination/${destinationName}/PackageDetails.png)`,
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}>
                            <div className='trip_summary'>
                                <span>TRIP ID:- JR-&nbsp;</span>
                                <span>{travel_data.TripId}</span>
                            </div>

                            <div className="package_details">
                                <div>
                                    <span>Name</span><br />
                                    <span>Destination</span><br />
                                    <span>Date</span><br />
                                    <span>Duration</span><br />
                                    <span>Traveler</span>
                                </div>
                                <div >
                                    <span>- {travel_data.Traveller_name}</span><br />
                                    <span>- {travel_data.Destination}</span><br />
                                    <span>- {selected_Travel_date}</span><br />
                                    <span>- {count_days} Days, {count_days - 1} Nights</span><br />
                                    <span>- {travel_data.Pax} Adults ,{travel_data.Child ? travel_data.Child : 0} Child</span><br />
                                </div>

                            </div>
                            <div className="yellow_details">
                                <p className="dayDetails">{count_days} Days,{count_days - 1} Nights</p>
                                <p className="setPara">at just</p>
                                <h4 className="seth4">INR :{formatter.format(parseInt(landPackage) + parseInt(flightcost) + parseInt(visacost))}/-</h4>
                                <p style={SelectedpackageType == 'Total' ? { marginLeft: '5.4rem' } : {}} className="setPara_">{SelectedpackageType}</p>
                            </div>
                            <div style={{ marginTop: '8.3rem' }}>
                                <Footer whatsApp={whatsApp} />
                            </div>
                        </div>

                    </div>
                    {/* end of 2st page(Package Details page)*/}

                    {/* 3rd page start (inclusionAndExclusion page))*/}
                    <div className="page-break">
                        <div className="inclusion"
                            style={{
                                background: 'black'
                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src={`/assets/destination/${destinationName}/InclusionExclusion.png`} />
                            </div>
                            <div className="inclusionPage_blocks" >
                                <span> Inclusion</span>
                                <span>Exclusion</span>
                            </div>
                            <div className="inclusionExclusionDetails">
                                <div style={{ width: '50%' }}>
                                    {
                                        Object.keys(inclusion_data).filter(function (k) {
                                            return inclusion_data[k]
                                                == true && typeof (inclusion_data[k]) !==
                                                "string" && inclusion_data[k] !== null
                                        }
                                        ).map((data, index) => (
                                            <div className="aliner_">
                                                <span key={index}>
                                                    <img src="/assets/pdfDefaultImage/correct.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />
                                                    {data}</span>
                                            </div>
                                        ))
                                    }
                                    <div className='otherInclusion'>
                                        {
                                            inclusion_data.other_Inclusion ? <>
                                                {inclusion_data.other_Inclusion.split('\n').map((data, index) => (<>
                                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '17px', marginLeft: '2rem', marginBottom: '-1.7rem', overflowWrap: "break-word" }}>
                                                        <span>-&nbsp; </span>
                                                        <span>  {data.trim()}</span>
                                                    </div><br />
                                                </>))}
                                            </> : <></>
                                        }

                                    </div>
                                </div>

                                <div className="sepratorLineForInclusionExclusion"></div>
                                <div>
                                    {
                                        Object.keys(inclusion_data).filter(function (k) {
                                            return inclusion_data[k] ==
                                                false && typeof (inclusion_data[k]) !==
                                                "string" && inclusion_data[k] !== null
                                        }).map((data, index) => (
                                            <div className="aliner_">
                                                <span key={index}>
                                                    <img src="/assets/pdfDefaultImage/cross.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />

                                                    {data}</span>
                                            </div>
                                        ))
                                    }
                                    <div className='otherInclusion'>
                                        {
                                            inclusion_data.other_Exclusion ? <>
                                                {inclusion_data.other_Exclusion.split('\n').map((data, index) => (<>
                                                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '17px', marginLeft: '2rem', marginBottom: '-1.7rem', overflowWrap: "break-word" }}>
                                                        <span>-&nbsp; </span>
                                                        <span>  {data.trim()}</span>
                                                    </div><br />
                                                </>))}
                                            </> : <></>
                                        }

                                    </div>

                                </div>
                            </div>
                            <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                                <img className='setInsta' src='/assets/pdfDefaultImage/insta2.png' />
                            </a>
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
                                <Footer whatsApp={whatsApp} />
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
                            <Footer whatsApp={whatsApp} />
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
                                <img className="inclusionPage_img" src={`/assets/destination/${destinationName}/DayWiseItineary.png`} />

                                <span className='headLineDaywiseItineary'> Day wise Itinerary</span>
                                <div className='itinearyDiv'>
                                    {itineary &&
                                        itineary.map((data, index) => (
                                            <div className='mapitineary'>
                                                <span style={{ width: '5rem' }}><span> Day </span> {index + 1} -</span>
                                                <p style={{ width: '91%', textTransform: 'uppercase' }}>{data.Day}</p>
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
                                    <Footer whatsApp={whatsApp} />
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
                                    src={`/assets/destination/${destinationName}/DetailItineary.png`}
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
                                                    <p className='dayDetailsitineary'>{data.Description.split('\n').map((data, index) => (<><div style={{ marginBottom: '-1rem' }}>{data}</div><br /></>))}</p>
                                                </div>
                                                <div className='DaywiseItinearyDivRight'>
                                                    <img
                                                        // src='/assets/pdfDefaultImage/BALI ACTIVITIES IMAGES-20220704T120432Z-001/SolangValleym (1).png'
                                                        src={`/assets/destination/${destinationName}/${data.Activity.value}.png`}
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
                                    <Footer whatsApp={whatsApp} />
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
                                                {/* 'https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2FLogout3.png?alt=media' */}
                                                <img src={`https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2Fhotel${index + 1}.png?alt=media`} width="320px" />
                                                {/* <img src={`/assets/pdfDefaultImage/hotel${index + 1}.png`} width="320px" /> */}
                                            </div>
                                            <div className='hotelUniRight'>
                                                <h4 style={{ color: 'yellow' }}>{
                                                    data.Night.map((data_, index) => (<span key={index}>{data_.value},</span>))
                                                } Stay at {data.City} </h4>

                                                <span>Hotel-{data.HotelName}</span><br />
                                                <span>Meal-{data.HotelMeal.map((data__, index) => (<span>{data__.value},</span>))}</span>  <br />
                                                <span>Room-{data.RoomType}</span><br />
                                                <span>Hotel Category-{data.Category}</span><br />
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
                                    <Footer whatsApp={whatsApp} />
                                </div>
                            </div>
                            {/* <div>
                                <a href={"https://wa.me/"+whatsApp} target="_blank">
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
                                        <sapn style={{ textDecoration: 'underline', color: '#bbc9ef', marginLeft: '13rem', fontSize: '13px', fontStyle: 'italic' }}>Note - Flight Fare is Dynamic, Actual Cost would be Shared at the Time of Booking</sapn>

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
                                            <Footer whatsApp={whatsApp} />
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
                            <div className='paymentsPage'>
                                <Footer whatsApp={whatsApp} />
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
                            <div className='paymentsPage'>
                                <Footer whatsApp={whatsApp} />
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
                            <div className='paymentsPage'>
                                <Footer whatsApp={whatsApp} />
                            </div>

                        </div>
                    </div>
                    {/* end of jr FAQ page */}


                </div>
            </PDFExport>
            {
                indicator ? <>
                    <button className='download_button' onClick={() => handleExportWithComponent()}>ReDownload</button>

                </> : <>
                    <button className='download_button' onClick={() => pdfgenrator()}>Download</button>
                </>
            }
            {/* <button className='download_button' onClick={() => pdfgenrator()}>save Quote</button> */}



        </>
    );
}

export default Profile
