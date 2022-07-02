import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import React, { useRef, useState, useEffect } from 'react';
import app from '../required';
import './pdfcss.css';
import './profile.css';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Image } from '@material-ui/icons';
const db = getFirestore(app);

const Profile = (
    {
        SelectedpackageType,
        email,
        userProfileuserProfile,
        indicator,
        inclusion_data,
        travel_data,
        cabDetailsData,
        flights,
        closePDF,
        datahandle,
        closeHandler,
        itineary,
        NightDataFields,
        selected_Travel_date,
        flightcost,
        visacost,
        landPackage,
        Allquote
    }
) => {
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    console.log(selected_Travel_date)
    const Data = travel_data
    const [callback, setcallback] = useState(false)
    const [inclusionlist, setinclusion] = useState([])
    const [exclusionlist, setexclusion] = useState([''])
    const pdfExportComponent = useRef(null);
    const [comment_inclusion, set_comment_inclusion] = useState([])
    const [Comment_Exclusion, set_Comment_Exclusion] = useState([])
    // console.log(userProfile)
    

    function fiterInclusion() {
        var keys = Object.keys(inclusion_data).filter(function (k) { return inclusion_data[k] == true && typeof (inclusion_data[k]) !== "string" && inclusion_data[k] !== null });
        console.log(keys)
        setinclusion(keys)
    }
    function filterExclusion() {
        var keys = Object.keys(inclusion_data).filter(function (k) { return inclusion_data[k] == false && typeof (inclusion_data[k]) !== "string" && inclusion_data[k] !== null });
        console.log(keys)
        setexclusion(keys)
    }
    useEffect(() => {
        fiterInclusion()
        filterExclusion()

    }, []);
    useEffect(() => {
        // console.log(inclusion_data.other_Inclusion, inclusion_data.other_Exclusion)
        try {

            set_comment_inclusion(inclusion_data.other_Inclusion.split("."))
        }
        catch {
            set_comment_inclusion([])
        }
        try {

            set_Comment_Exclusion(inclusion_data.other_Exclusion.split("."))
        }
        catch {
            set_Comment_Exclusion([])
        }
    }, []);
    const currentdate = new Date();
    // console.log(currentdate)
    // var doc = new jsPDF("p", "pt", "a4");
    const TripId = Data.TripId
    const month = currentdate.toLocaleString('default', { month: 'long' })

    async function dataSetter() {
        if (indicator) {

        }
        else {
            await addDoc(collection(db, "Quote"), {
                label: `${currentdate.getDate()}:${currentdate.getMonth() + 1}:${(currentdate.getFullYear())}:${currentdate.getHours()}:${currentdate.getMinutes()}`,
                value: {
                    travel_data: travel_data,
                    flightcost:flightcost,
                    visacost:visacost,
                    landPackage:landPackage,
                    itineary: itineary,
                    followUpDate: String(selected_Travel_date),
                    NightDataFields: NightDataFields,
                    pdf_name: `${currentdate.getDate()}:${currentdate.getMonth() + 1}:${(currentdate.getFullYear())}:${currentdate.getHours()}:${currentdate.getMinutes()}`,
                    cabDetailsData: cabDetailsData,
                    flights: flights,
                    inclusion_data: inclusion_data,
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
            Quoted_by: email
        });
    }

    function handleExportWithComponent() {
        pdfExportComponent.current.save();

    };
    function pdfgenrator() {
        handleExportWithComponent()
        update_quotation_flg()


        try {
            datahandle()
        }
        catch (e) {
            console.log(e)
        }

        try {

            dataSetter()
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

    var name = "BALI.png"
    var link = `/assets/destination/${name}`

    return (
        <>
            <PDFExport
                ref={pdfExportComponent}
                fileName={`${'Traveller_name'}`}
                forcePageBreak=".page-break"
            >
                <div className={`pre ${layoutSelection.value}`}>
                    <div className={'page1'}
                        style={{
                            backgroundImage: `url(${link})`,
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            // color:"white"
                        }}
                    >
                        <div>
                            <a href={"https://wa.me/919304247331"} target="_blank">
                                <img className='page1whatsApp' src='/assets/pdfDefaultImage/whatApp.png' />
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
                    <div className="page-break">
                        <div className="page2" style={{
                            backgroundImage: "url(/assets/pdfDefaultImage/package.png)",
                            backgroundPosition: "top",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            // color:"white"
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
                                    <span>- {travel_data.Travel_Duration} Days, {travel_data.Travel_Duration-1} Nights</span><br />
                                    <span>- {travel_data.Pax} Adults , {travel_data.Child?travel_data.Child:0} Child</span><br />
                                </div>

                            </div>
                            <div className="yellow_details">
                                <p className="dayDetails">{travel_data.Travel_Duration} Days, {travel_data.Travel_Duration-1} Nights</p>
                                <p className="setPara">at just</p>
                                <h4 className="seth4">INR 3,00,000/-</h4>
                                <p className="setPara_">{SelectedpackageType}</p>
                            </div>
                            <div >
                                <div className="bottom_media_details">Follow Us At
                                    <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                                        <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
                                    </a>
                                    <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
                                        <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
                                    </a>
                                    <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
                                        <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
                                    </a>
                                    <a href="https://twitter.com/JourneyRouters" target="_blank">
                                        <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
                                    </a>
                                    @journeyrouters
                                    <a href={"https://wa.me/919304247331"} target="_blank">
                                        <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
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
                                <img className="inclusionPage_img" src="/assets/pdfDefaultImage/Singapre Header.png" />
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
                                <div className="bottom_media_details">Follow Us At
                                    <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                                        <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
                                    </a>
                                    <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
                                        <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
                                    </a>
                                    <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
                                        <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
                                    </a>
                                    <a href="https://twitter.com/JourneyRouters" target="_blank">
                                        <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
                                    </a>
                                    @journeyrouters
                                    <a href={"https://wa.me/919304247331"} target="_blank">
                                        <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
                                    </a>
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
                            <div className="google_review_bottom">
                                <div className="reiew_c1">
                                    <a href="https://g.co/kgs/VwbmYT" target="_blank">
                                        <img src="/assets/pdfDefaultImage/google_reviews/Aashishsingh.PNG" className="review_img5" />
                                    </a>
                                    <a href="https://g.co/kgs/ZK68wZ" target="_blank">
                                        <img src="/assets/pdfDefaultImage/google_reviews/Amit singh.PNG" className="review_img1" />
                                    </a>
                                    <a href="https://g.co/kgs/qM1e2f" target="_blank">

                                        <img src="/assets/pdfDefaultImage/google_reviews/imran.PNG" className="review_img2" />
                                    </a>

                                </div>
                                <div className="reiew_c2">
                                    <a
                                        href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x390ce1d4b9237199:0x7b102f107dc6a192?source=g.page.m._"
                                        target='_blank' className="link">
                                        <img src="/assets/pdfDefaultImage/google.png" className="googleImg_" />
                                        <img src="/assets/pdfDefaultImage/4.8ratting.png" className="ratting" />
                                        <span> 400 & Counting Google Review</span>
                                    </a>
                                    <a href="https://g.co/kgs/ReZyXo" target="_blank">
                                        <img src="/assets/pdfDefaultImage/google_reviews/Tanmay.PNG" className="review_img" />
                                    </a>
                                    <a href="https://g.co/kgs/ByT5hQ" target="_blank">
                                        <img src="/assets/pdfDefaultImage/google_reviews/Stephen Raj.PNG" className="review_img" />
                                    </a>


                                </div>
                                <div className="reiew_c3">
                                    <a href="https://g.co/kgs/iD3DvX" target="_blank">
                                        <img src="/assets/pdfDefaultImage/google_reviews/Kajal.PNG" className="review_img" />
                                    </a>
                                    <a href="https://g.co/kgs/iD3DvX" target="_blank" >
                                        <img src="/assets/pdfDefaultImage/google_reviews/manoj.PNG" className="review_img3" />
                                    </a>
                                    <a href="https://g.co/kgs/kXdzCU" target="_blank" >
                                        <img src="/assets/pdfDefaultImage/google_reviews/Naveen.PNG" className="review_img4" />
                                    </a>

                                </div>
                            </div>
                            <div className="bottom_media_details">Follow Us At
                                <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                                    <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
                                </a>
                                <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
                                    <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
                                </a>
                                <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
                                    <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
                                </a>
                                <a href="https://twitter.com/JourneyRouters" target="_blank">
                                    <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
                                </a>
                                @journeyrouters
                                <a href={"https://wa.me/919304247331"} target="_blank">
                                    <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="page-break">
                        <div className="itinearypage"
                            style={{
                                // backgroundImage: "url(/assets/pdfDefaultImage/blank_border-bottom.png)",
                                // backgroundPosition: "top",
                                // backgroundRepeat: "no-repeat",
                                // backgroundSize: "cover"
                                background: 'black'
                            }}
                        >
                            <div>
                                <img className="inclusionPage_img" src="/assets/pdfDefaultImage/Singapre Header.png" />

                                <span className='headLineDaywiseItineary'>Itineary</span>
                                <div className='itinearyDiv'>
                                    {
                                        itineary.map((data, index) => (
                                            <div className='mapitineary'>
                                                <span style={{ width: '5rem' }}>Day {index + 1}  -</span>
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
                                        height: '6rem',
                                    }}
                                >
                                    <div className="bottom_media_details" style={{ paddingTop: '2.8rem' }}>Follow Us At
                                        <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                                            <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
                                        </a>
                                        <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
                                            <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
                                        </a>
                                        <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
                                            <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
                                        </a>
                                        <a href="https://twitter.com/JourneyRouters" target="_blank">
                                            <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
                                        </a>
                                        @journeyrouters
                                        <a href={"https://wa.me/919304247331"} target="_blank">
                                            <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
                                        </a>
                                    </div>
                                </div>

                            </div>



                        </div>
                    </div>
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

                </div>
            </PDFExport>

            <button className='download_button' onClick={() => pdfgenrator()}>downloadURL</button>
            {/* <button className='download_button' onClick={() => pdfgenrator()}>save Quote</button> */}



        </>
    );
}

export default Profile
