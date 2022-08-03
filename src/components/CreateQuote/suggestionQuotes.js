import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { ExtensionSharp } from '@material-ui/icons';
import HotelIcon from '@material-ui/icons/Hotel';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Box from './Box';
import './TripComponent.css';


const db = getFirestore(app)
const SuggestionQuotes = ({
    destination,
    handleSuggestion,
    Lead_data_to_be_quoted,
    profile,
    updateTableDataAfterQuote,
    email

}) => {
    console.log(Lead_data_to_be_quoted.Destination)
    const [sampleQuotes, setsampleQuotes] = useState([])
    const [searchKey, setSearchKey] = useState(0)
    const [selectedData, setselectedData] = useState([])
    const [inclusionlist, setinclusion] = useState([])
    const [exclusionlist, setexclusion] = useState([''])
    const [lead_data, setLead_data] = useState()
    const [usethisKey, setusethisKey] = useState(false)

    function syncDataToMapper(data)
    {
        let list=[]
        console.log(data.value.NightDataFields)
        list.push(data)
        setselectedData(data)
    }
    useEffect(() => {
        getSampleQuotes(Lead_data_to_be_quoted.Destination)

    }, []);

    function usethisquoteHandler() {
        setusethisKey(!usethisKey)
    }
    function handleSearchOption(e) {
        console.log(typeof (e.target.value))
        setSearchKey(parseInt(e.target.value))
    }
    async function getSampleQuotes(Destination) {
        // console.log(Destination)
        var quotesref = collection(db, "Quote")
        const queryQuotes = query(quotesref, where("value.travel_data.Destination", "==", Destination)
            // , where("value.selected_Travel_date",">","2022-07-12") 
        )
        var querySnapshot;
        var list = []
        try {

            querySnapshot = await getDocs(queryQuotes);
            if (querySnapshot.docs.length != 0) {
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setsampleQuotes(list)
                // setselectedData(list[0])
                // console.log(list[0].value.itineary)
                // setLead_data(list[0].value.travel_data)
            }
        }
        catch (e) {
            console.log(e)
        }
        
        console.log(list)
    }

    return (
        <div className='Suggestions'>
            {
                usethisKey ?
                    <Box
                        email={email}
                        usingLastQuotes={true}
                        data={Lead_data_to_be_quoted}
                        inclusion_data_={selectedData.value.inclusion_data}
                        SelectedpackageTyp={selectedData.value.SelectedpackageType}
                        updateTableDataAfterQuote={updateTableDataAfterQuote}
                        set_popupopner={usethisquoteHandler}
                        profile={profile}
                        indicator={true}
                        Edit_NightDataFields={selectedData.value.NightDataFields}
                        Edit_itineary={selectedData.value.itineary}
                        Edit_selected_Travel_date={selectedData.value.selected_Travel_date}
                        Edit_visacost={selectedData.value.visacost}
                        Edit_flightcost={selectedData.value.flightcost}
                        Edit_landPackage={selectedData.value.landPackage}
                        Edit_count_days={selectedData.value.count_days}
                    // Allquote={Allquote}
                    /> :
                    <>

                    </>
            }
            <div className='sampleQuoteHeader'>
                <RadioGroup row className='searchOption' name='searchOption' value={searchKey} onChange={(e) => handleSearchOption(e)}>
                    <FormControlLabel control={<Radio />} value={0} label="10 recent Quote" />
                    <FormControlLabel control={<Radio />} value={1} label="most Matched Quote" />
                    <FormControlLabel control={<Radio />} value={2} label="Search by TripId" />
                </RadioGroup >
                <div>
                    <button onClick={() => usethisquoteHandler()}>USE THIS QUOTE</button>
                    <button onClick={() => handleSuggestion()}>Cancel</button>
                </div>
            </div>
            <div className='divContainsThreeDiv'>
                <div className='QuotesMapperDiv'>
                    {
                        sampleQuotes.map((data, index) => (

                            <div key={index} className='Topsamplequotes_components' onClick={() => syncDataToMapper(data)}>
                                <div className='samplequotes_components'>
                                    <span className='highglight2' >TRIP ID:-{data.value.travel_data.TripId}</span><br />
                                    <span style={{color:'white',marginLeft:'1rem'}} >{data.value.travel_data.Traveller_name}</span><br />
                                    <ul>
                                        <li style={{color:'white',fontSize:'15px',marginBottom:'4px'}}>{data.value.travel_data.Destination}</li>
                                        <li  style={{color:'white',fontSize:'15px',marginBottom:'4px'}}>{data.value.count_days} day, {data.value.count_days - 1} Nights</li>
                                        <li style={{color:'white',fontSize:'15px',marginBottom:'4px'}}>INR:-{parseInt(data.value.flightcost) + parseInt(data.value.visacost) + parseInt(data.value.landPackage)} / {data.value.SelectedpackageType}</li>
                                        <li style={{color:'white',fontSize:'15px'}}>By:- {data.value.Quoted_by}</li>
                                    </ul>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className='QuotesDetails'>
                    {
                        selectedData.length !=0 ? <>
                            <div className='tripIdDetails'>{selectedData.value.travel_data.TripId}</div>
                            <div className='basicInfo'>
                                <p>
                                    <span>Duration</span><br />
                                    <span>{selectedData.value.count_days} day, {selectedData.value.count_days - 1} Nights</span>
                                </p>
                                <p>
                                    <span>Quotation price</span><br />
                                    <span>INR:-{parseInt(selectedData.value.flightcost) + parseInt(selectedData.value.visacost) + parseInt(selectedData.value.landPackage)}</span>
                                </p>
                                <p>
                                    <span>Destination</span><br />
                                    <span>{selectedData.value.travel_data.Destination}</span>
                                </p>
                                <p>
                                    <span>Traveller</span><br />
                                    <span>{selectedData.value.travel_data.Pax} Adult,{selectedData.value.travel_data.Child ? selectedData.value.travel_data.Child : 0}Child </span>
                                </p>
                            </div>
                            <div className='hotelDetails'>
                                <p style={{ display: "flex", flexDirection: "row", alineItem: "center" }}>
                                    <HotelIcon />
                                    <span>Hotel</span>
                                </p>
                                {
                                    selectedData.value.NightDataFields.map((data, index) => (
                                    
                                        <div key={index}>{data.Night.map((Ndata,index)=>(<span>{Ndata.value},</span>))} {data.HotelName}, {data.City} , {data.RoomType} Room</div>
                                    ))
                                }
                            </div>
                            <div className='SuggestionInclusion'>
                                <p style={{ display: "flex", flexDirection: "row", alineItem: "center" }}>
                                    <ExtensionSharp />
                                    <span>inclusion/Exclusion</span>
                                </p>
                                <div className="inclusionExclusion__">
                                    <div>
                                        {
                                            Object.keys(selectedData.value.inclusion_data)
                                                .filter(function (k) {
                                                    return selectedData.value.inclusion_data[k] == true &&
                                                        typeof (selectedData.value.inclusion_data[k]) !== "string" && selectedData
                                                            .value.inclusion_data[k] !== null
                                                }).map((data, index) => (
                                                    <div key={index} className="aliner_">
                                                        <span key={index}>
                                                            <img src="/assets/pdfDefaultImage/correct.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />
                                                            {data}</span>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                    <div className="sepratorLineForInclusionExclusion_"></div>
                                    <div>
                                        {
                                            Object.keys(selectedData.value.inclusion_data)
                                                .filter(function (k) {
                                                    return selectedData.value.inclusion_data[k] == false &&
                                                        typeof (selectedData.value.inclusion_data[k]) !== "string" &&
                                                        selectedData.value.inclusion_data[k] !== null
                                                }).map((data, index) => (
                                                    <div key={index} className="aliner_">
                                                        <span key={index}>
                                                            <img src="/assets/pdfDefaultImage/cross.png" width="16px" height="16px" style={{ marginRight: "0.3rem" }} />

                                                            {data}</span>
                                                    </div>
                                                ))
                                        }
                                    </div>
                                </div>
                                <div className=''>
                                    {
                                        selectedData.value.itineary.map((data, index) => (
                                            <div key={index} className='suggestionmapItineary'>
                                                <span>Day:-{index + 1}</span>
                                                <p>{data.Day}</p>
                                                <div>{data.Description}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </> : <></>
                    }
                </div>
                <div className='LeadLookUp'>

                    <span>Trip Details</span>
                    <p className='lookupaliner'>
                        <p className='tripInfoP'>
                            <span>Starting date</span>
                            <span>{moment(Lead_data_to_be_quoted.Travel_Date.toDate()).format('YYYY-MM-DD')}</span>
                        </p>
                        <p className='tripInfoP'>
                            <span>Travel Duration</span>
                            <span>{Lead_data_to_be_quoted.Travel_Duration} Days, {Lead_data_to_be_quoted.Travel_Duration - 1} Nights</span>
                        </p>
                        <p className='tripInfoP'>
                            <span>Destination</span>
                            <span>{Lead_data_to_be_quoted.Destination}</span>
                        </p>
                        <p className='tripInfoP'>
                            <span>Budget</span>
                            <span>{Lead_data_to_be_quoted.Budget}</span>
                        </p>
                        <p className='tripInfoP'>
                            <span>Number of Traveller</span>
                            <span>{Lead_data_to_be_quoted.Pax} Adult, {Lead_data_to_be_quoted.Child ? Lead_data_to_be_quoted.Child : 0} Child</span>
                        </p>


                    </p>



                </div>

            </div>


        </div>
    );
}

export default SuggestionQuotes;
