import React, { useEffect, useState } from 'react';
import Maldives from '../../../CreateQuote/Maldives';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import app from '../../../required';
import Box from '../../../CreateQuote/Box';
import PictureAsPdfTwoToneIcon from '@material-ui/icons/PictureAsPdfTwoTone';
import moment from 'moment';
import { Modal } from '@material-ui/core';
import Maldivespdf from '../../../MaldivesPdf/Maldivespdf';
import Profile from '../../../Profile/Profile';
import './Components.css'

function Allquotes({ TripId }) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [viewPDF, setviewPDF] = useState(false)
    const db = getFirestore(app);
    const [Allpdf, setAllpdf] = useState([])
    const [requote, setrequote] = useState(false)
    const [data, setDataForPdf] = useState()
    async function getAllquote() {
        let list = []
        const q = query(collection(db, "Quote"), where("value.travel_data.TripId", "==", TripId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setAllpdf(list)
    }
    const Controller_reqoute = () => {
        setrequote(true)

    }
    const closePDF = () => {
        setviewPDF(false)
    }
    const MaldivesComponent = ({ tripData }) => {
        return (
            <Maldives
                Allquote={Allpdf}
                email={auth.email}
                data={tripData.travel_data}
                inclusion_data_={tripData.inclusion_data}
                Edit_SelectedpackageType={tripData.SelectedpackageType}
                // updateTableDataAfterQuote={props.updateTableDataAfterConversion}
                set_popupopner={setrequote}
                profile={profile}
                E_indicator={true}
                Edit_no_rooms={tripData.no_rooms}
                Edit_NightDataFields={tripData.NightDataFields}
                Edit_itineary={tripData.itineary}
                Edit_selected_Travel_date={tripData.selected_Travel_date}
                Edit_visacost={tripData.visacost}
                Edit_flightcost={tripData.flightcost}
                Edit_landPackage={tripData.landPackage}
                Edit_count_days={tripData.count_days}
                Edit_Property={tripData.Property}
                Edit_MealPlan={tripData.MealPlan}
                Edit_Transfer={tripData.Transfer}
                pre_flightImgLinks={tripData.flightImgLinks}
                pre_inclusionLinks={tripData.inclusionLinks}
            />
        )
    }
    const BoxComponent = ({ tripData }) => {
        return (
            <Box
                email={auth.email}
                data={tripData.travel_data}
                inclusion_data_={tripData.inclusion_data}
                SelectedpackageTyp={tripData.SelectedpackageType}
                // updateTableDataAfterQuote={props.updateTableDataAfterConversion}
                set_popupopner={setrequote}
                profile={profile}
                indicator={true}
                Edit_NightDataFields={tripData.NightDataFields}
                Edit_itineary={tripData.itineary}
                Edit_selected_Travel_date={tripData.selected_Travel_date}
                Edit_visacost={tripData.visacost}
                Edit_flightcost={tripData.flightcost}
                Edit_landPackage={tripData.landPackage}
                Edit_count_days={tripData.count_days}
                Allquote={Allpdf}

            />
        )
    }
    const Pdfopener = ({ viewPDF, closePDF, data, profile,rawdata }) => {
       
        return (
            <Modal open={viewPDF} onClose={closePDF} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                {
                    data.Destination == 'Maldives' ? <>
                        <Maldivespdf
                            data={data.travel_data}
                            no_rooms={data.no_rooms}
                            selected_Travel_date={data.selected_Travel_date}
                            MealPlan={data.MealPlan}
                            Transfer={data.Transfer}
                            NightDataFields={data.NightDataFields}
                            count_days={rawdata.count_days}
                            flightcost={rawdata.flightcost}
                            visacost={rawdata.visacost}
                            landPackage={rawdata.landPackage}
                            SelectedpackageType={data.SelectedpackageType}
                            Property={data.Property}
                            flightsLinkfromstorage={data.flightImgLinks}
                            inclusionLinkfromstorage={data.inclusionLinks}
                            flightFlg={data.flightImgLinks ? true : false}
                            inclusionImgFlg={data.inclusionLinks ? true : false}
                            Pax={data.travel_data.Pax}
                            Child={data.travel_data.Child}
                            inclusion_data={rawdata.inclusion_data}
                            profile={profile}
                            indicator={false}
                            onClosePdf={closePDF}

                        />
                    </> : <>
                        <Profile
                            SelectedpackageType={data.SelectedpackageType}
                            indicator={true}
                            inclusion_data={rawdata.inclusion_data}
                            travel_data={data}
                            count_days={rawdata.count_days}
                            cabDetailsData={data.cabDetailsData}
                            flights={data.flights}
                            itineary={rawdata.itineary}
                            NightDataFields={rawdata.NightDataFields}
                            selected_Travel_date={data.selected_Travel_date}
                            flightcost={rawdata.flightcost}
                            visacost={rawdata.visacost}
                            landPackage={rawdata.landPackage}
                            profile={profile}
                            flight={true}
                            flightsLinkfromstorage={data.flightsImagesLinks}
                        />
                    </>
                }

            </Modal>
        )
    }
    const HandlePdf = (data) => {
        setDataForPdf(data)
        setviewPDF(true)
    }
    useEffect(() => {
        getAllquote()
    }, [])
    return (
        <div>
            <div className='remark'>
                {
                    Allpdf.map((data, index) =>
                        <div key={index} className='childPdf'>
                            <PictureAsPdfTwoToneIcon style={{ margin: '15px' }} />
                            <span style={{ color: 'red' }}>{data.value.travel_data.Destination}</span>
                            <p key={index}>
                                {
                                    typeof (data.value.pdf_name) === 'string' ? <>
                                        {data.value.pdf_name}
                                    </> : <>
                                        {moment(data.value.pdf_name.toDate()).format('lll')}
                                    </>
                                }
                            </p>
                            <button onClick={() => HandlePdf(data.value)} className='download_requote'>downloadURL</button>
                            <button className='download_requote' onClick={() => Controller_reqoute(data)}>Edit</button>
                            {
                                requote ? <>
                                    {
                                        data.value.travel_data.Destination == 'Maldives' ?
                                            <MaldivesComponent tripData={data.value} /> :
                                            <BoxComponent tripData={data.value} />
                                    }
                                </> : <></>
                            }
                        </div>
                    )
                }

            </div>
            {
                viewPDF ?
                    <Pdfopener viewPDF={viewPDF} closePDF={closePDF} profile={profile} data={data.travel_data} rawdata={data}/> :
                    <></>
            }


        </div>
    );
}

export default Allquotes;

