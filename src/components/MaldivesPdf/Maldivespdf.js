import React, { useEffect, useState } from 'react';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useRef } from 'react';
import moment from 'moment';
import Footer, { GoogleReviews } from '../Profile/footer';
import { Modal } from '@material-ui/core';
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../required';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
const db = getFirestore(app);
const storage = getStorage();



const Maldivespdf = ({
    closeMaldivesForm,
    flightsLinkfromstorage,
    closeMaldivesSuggestionModal,
    inclusionLinkfromstorage,
    data, no_rooms,
    SelectedpackageType,
    selected_Travel_date,
    MealPlan,
    Transfer,
    Property,
    NightDataFields,
    count_days,
    flightcost,
    visacost,
    landPackage,
    flightFlg,
    flightsObject,
    inclusionObject,
    inclusionImgFlg,
    doNotOverideflg,
    Pax,
    Child,
    inclusion_data,
    profile,
    indicator,
    E_indicator,
    Allquote,
    onClosePdf,
    updateTableDataAfterQuote
}) => {
    console.log(inclusion_data)
    const currentdate = new Date();
    const [layoutSelection, setLayoutSelection] = useState({
        sapn: "A4",
        value: "size-a4"
    });
    const [flightsLocalUrl, setflightsLocalUrl] = useState(flightsLinkfromstorage ? flightsLinkfromstorage : null)
    const [inclusionImgUrl, setinclusionImgUrl] = useState(inclusionLinkfromstorage ? inclusionLinkfromstorage : null)
    const [clientName, setClientName] = useState(data.Traveller_name)
    const [wait, setWait] = useState(false)
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [flightImgLinks, setflightImgLinks] = useState([])
    const [inclusionLinks, setinclusionLinks] = useState([])
    function controllLinks(args) {
        setflightImgLinks(args)
    }
    function controllinclusionLinks(args) {
        setinclusionLinks(args)
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

    async function inclusionImgconvertObjectToLink() {
        try {
            const file = inclusionObject
            // console.log(file)
            // debugger
            var local_link_list = []
            for (var start = 0; start < inclusionObject.length; start++) {
                var temp = { Link: '', path: '' }
                const url = URL.createObjectURL(file[start])
                temp.Link = url
                local_link_list.push(temp)
                // console.log('url', url)
            }
            setinclusionImgUrl(local_link_list)
        }
        catch (e) { console.log(e) }

    }
    async function update_quotation_flg() {
        // debugger
        let quotation_new = parseInt(data.quotation) + 1
        await updateDoc(doc(db, "Trip", `${data.TripId}`), {
            quotation: quotation_new,
            quotation_flg: true,
            month: moment(currentdate).format('MMMM'),
            Follow_Up_date: String(selected_Travel_date),
            time: currentdate,
            Quoted_by: profile.email,
            Travel_Duration: count_days,
            Pax: data.Pax,
            Child: data.Child,


        });
    }
    async function setQuotationData() {
        // console.log(ImgLinks)
        // debugger

        if (indicator) {
            // console.log(flightImgLinks, inclusionLinks)
            await addDoc(collection(db, "Quote"), {
                label: moment(currentdate).format('lll'),
                value: {
                    travel_data: data,
                    count_days: count_days,
                    flightcost: flightcost,
                    visacost: visacost,
                    landPackage: landPackage,
                    selected_Travel_date: String(selected_Travel_date),
                    NightDataFields: NightDataFields,
                    pdf_name: moment(currentdate).format('lll'),
                    // flights: flights,
                    inclusion_data: inclusion_data,
                    SelectedpackageType: SelectedpackageType,
                    Quoted_by: profile.name,
                    no_rooms: no_rooms,
                    MealPlan: MealPlan,
                    Transfer: Transfer,
                    Property: Property,
                    flightImgLinks: E_indicator ? flightsLinkfromstorage : flightImgLinks,
                    inclusionLinks: E_indicator ? inclusionLinkfromstorage : inclusionLinks
                }
            });

        }
    }
    function uploadFlightsScreenShots() {
        var files = flightsObject
        var TripId = data.TripId
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
    function uploadInclusionScreenShots() {
        var files = inclusionObject
        var TripId = data.TripId
        var localList = []
        var tempMemo = { Link: '', path: '' }
        for (var loadIndex = 0; loadIndex < files.length; loadIndex++) {
            const storageRef = ref(storage, `vouchers/${TripId}/IncludionScreenShots/${files[loadIndex].destinationName}`);
            const path = `vouchers/${TripId}/IncludionScreenShots/${files[loadIndex].destinationName}`
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
        controllinclusionLinks(localList)
    }
    useEffect(() => {
        if (indicator) {
            if (E_indicator) {

            }
            else {
                console.log(E_indicator)
                convertObjectToLink()
                inclusionImgconvertObjectToLink()
                uploadFlightsScreenShots()
                uploadInclusionScreenShots()
            }
        }

    }, []);
    async function downloadPdfOnly() {
        // console.log(data.travel_data.Traveller_name)
        // setClientName(data.travel_data.Traveller_name)
        setWait(true)
        pdfExportComponent.current.save();
        await delay(6000);
        setWait(false)
        onClosePdf()

    }
    async function handleExportWithComponent() {
        pdfExportComponent.current.save();
        setWait(true)
        await delay(20000);
        update_quotation_flg()
        setQuotationData()
        setWait(false)
        try{updateTableDataAfterQuote(data.TripId)}
        catch(error){console.log(error)}
        try{closeMaldivesForm()}
        catch(error){console.log(error)}
        try{closeMaldivesSuggestionModal()}
        catch(error){console.log(error)}
        try{Allquote()}
        catch(error){console.log(error)}
    };
    const pdfExportComponent = useRef(null);
    // console.log(count_days)
    var formatter = new Intl.NumberFormat('en-US', {})
    let whatsApp = profile.WhatsApp_number
    let Call = profile.contact_number
    return (
        <div>
            <Modal open={wait} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <>
                    <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
                </>
            </Modal>
            <PDFExport
                ref={pdfExportComponent}
                fileName={`${data.Traveller_name}-${Property.label}`}
                forcePageBreak=".page-break"
            >
                <div className={`pre ${layoutSelection.value}`}>
                    <div className={'Header'}
                        // RoomType
                        style={{
                            // backgroundImage: `url(/assets/destination/${Property.value}/Header.png)`,
                            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(Property.value).toUpperCase()}%2FHeader.png?alt=media)`,
                            // backgroundImage:`url(/assets/destination/BALI/testmaldives.png)`,
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
                        <div className="footer_">
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
                                {/* public\assets\pdfDefaultImage\PackageDetailsMaldives.png */}
                            </div>
                        </div>
                    </div>
                    <div className="page-break">
                        <div className={'Header'}
                            style={{
                                backgroundImage: `url(/assets/pdfDefaultImage/PackageDetailsMaldives3.png)`,
                                backgroundPosition: "top",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                // color:"white"
                            }}
                        >
                            <div className='trip_summary'>
                                <span>TRIP ID:-JR-&nbsp;</span>
                                <span>{`${data.TripId}`}</span>
                            </div>
                            <div>
                                <table style={{ border: '1px solid', color: 'white', marginLeft: '4rem', width: '47rem', height: '20rem', fontSize: '1.3rem' }}>
                                    <tbody>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>NAME</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{`${data.Traveller_name}`}</td>
                                        </tr>
                                        <tr style={{ border: '1px solid white', borderCollapse: 'collapse' }} >
                                            <th style={{ border: '1px solid white' }}>HOTEL</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{Property.label}</td>
                                        </tr>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>STAY</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>
                                                {
                                                    NightDataFields.map((data, index) => (
                                                        <> <span>
                                                            {/* {
                                                                data.Night.map((data_, index) => (<span>{data_.value},</span>))
                                                            } */}
                                                            {
                                                                <span>{data.Night.length} Nights </span>
                                                            }
                                                            at {data.RoomType.label}</span><br /></>
                                                    ))
                                                }

                                            </td>
                                        </tr>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>TRANSFERS</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{Transfer ? Transfer.value : ''}</td>
                                        </tr>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>MEAL PLAN</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{MealPlan ? MealPlan.value : ''}</td>
                                        </tr>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>DATE</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{selected_Travel_date ? moment(selected_Travel_date).format('DD-MMMM-YYYY') : ''}</td>
                                        </tr>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>NO OF PAX</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{Pax} Adult, {Child}Child</td>
                                        </tr>
                                        <tr >
                                            <th style={{ border: '1px solid white' }}>NO OF ROOMS</th>
                                            <td style={{ border: '1px solid white', paddingLeft: '0rem' }}>{no_rooms ? no_rooms : 0}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className='pricing'>
                                <center>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>{count_days} day, {count_days - 1} Night</td>
                                            </tr>
                                            <tr>
                                                <td>at just</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4 style={{ fontSize: '2.1rem', fontWeight: '900',marginTop:'0rem',marginBottom:'0rem' }}>
                                                        INR:-{formatter.format(parseInt(flightcost) + parseInt(landPackage) + parseInt(visacost))}/-
                                                    </h4>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>{SelectedpackageType}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </center>
                                {/* <span>{count_days} day, {count_days - 1} Night</span><br />
                                <span style={{ marginLeft: '2.5rem', marginBottom: '-1rem' }}>at just</span><br />
                                <h3 style={{ marginTop: '0rem', marginBottom: '-2.5rem' }}>INR:-{parseInt(flightcost) + parseInt(landPackage) + parseInt(visacost)}/-</h3><br />
                                <span style={{ marginLeft: '2.4rem', }} >{SelectedpackageType}</span> */}
                                {/* margin-left: 2.4rem; */}
                            </div>
                            <div style={{ marginTop: '-3.4rem' }}>
                                <Footer whatsApp={whatsApp} />
                            </div>
                        </div>

                    </div>
                    <div className="page-break">
                        <div className="HotelPage"
                            style={{
                                background: 'black'

                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src="/assets/pdfDefaultImage/RoomCategory.png" />
                                <div>
                                    {
                                        NightDataFields.map((data, index) => (
                                            <>
                                                {console.log(data)},
                                                <span style={{ color: 'yellow', fontSize: '1.5rem', marginLeft: '1rem' }} >{data.Night.map((data_, index_) => (<>{data_.value},</>))}</span><br />
                                                <img className="inclusionPage_img"
                                                    // src={`assets/destination/${Property.value}/${data.RoomType.value}.png`}
                                                    src={`https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(Property.value).toUpperCase()}%2F${data.RoomType.value}.png?alt=media`}
                                                // src={`https://firebasestorage.googleapis.com/v0/b/destination_image/o/${(Property.value).toUpperCase()}%2${data.RoomType.value}.png?alt=media`}
                                                />
                                            </>
                                        ))
                                    }
                                </div>
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
                    <div className="page-break">
                        <div className="inclusion"
                            style={{
                                background: 'black'
                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src='/assets/pdfDefaultImage/InclusionExclusion.png' />
                            </div>
                            <div className="inclusionPage_blocks" >
                                <span> Inclusion</span>
                                <span>Exclusion</span>
                            </div>
                            <div className="Details" style={{ color: 'white' }}>
                                <div>
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
                                                {inclusion_data.other_Inclusion.split("\n").map((data, index) => (<>
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
                                                {inclusion_data.other_Exclusion.split("\n").map((data, index) => (<>
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
                                    height: '5.3rem',
                                    display: 'flex',
                                    flexDirection: 'column-reverse'
                                }}
                            >
                                <Footer whatsApp={whatsApp} />
                            </div>

                        </div>
                    </div>
                    {
                        flightFlg ? <>
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
                                                        <img key={index} className='flightsImgcss_
                                                        ' src={link.Link} />
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

                    {
                        inclusionImgFlg ? <>
                            <div className="page-break">
                                <div className="HotelPage"
                                    style={{
                                        background: 'black'

                                    }}
                                >
                                    <div>
                                        <img className="inclusionPage_img" src="/assets/pdfDefaultImage/InclusionExclusion.png" />
                                        <span className='headLineDaywiseItineary'>INCLUSION</span>
                                        {
                                            inclusionImgUrl ? <>
                                                {
                                                    inclusionImgUrl.map((link, index) => (
                                                        <img key={index} className='flightsImgcss_' src={link.Link} />
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
                                            <Footer whatsApp={whatsApp} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </> : <></>
                    }
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
                </div>
            </PDFExport >
            {
                indicator ?
                    <button className='download_button' onClick={() => handleExportWithComponent()}>downloadURL</button> :
                    <button className='download_button' onClick={() => downloadPdfOnly()}>ReDownload</button>

            }


        </div >
    );
}

export default Maldivespdf;

