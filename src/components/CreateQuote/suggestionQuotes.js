import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { ExtensionSharp } from '@material-ui/icons';
import HotelIcon from '@material-ui/icons/Hotel';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import app from '../required';
import './TripComponent.css';


const db = getFirestore(app)
const SuggestionQuotes = ({ destination,handleSuggestion }) => {
    const [sampleQuotes, setsampleQuotes] = useState([])
    const [searchKey, setSearchKey] = useState(0)
    const [selectedData, setselectedData] = useState()
    const [inclusionlist, setinclusion] = useState([])
    const [exclusionlist, setexclusion] = useState([''])
    const [lead_data, setLead_data] = useState()
    useEffect(() => {
        getSampleQuotes('Manali')

    }, []);


    function handleSearchOption(e) {
        console.log(typeof (e.target.value))
        setSearchKey(parseInt(e.target.value))
    }
    async function getSampleQuotes(Destination) {
        var quotesref = collection(db, "Quote")
        const queryQuotes = query(quotesref, where("value.travel_data.Destination", "==", Destination)
            // , where("value.selected_Travel_date",">","2022-07-12") 
        )
        var querySnapshot;
        var list = []
        try {

            querySnapshot = await getDocs(queryQuotes);
        }
        catch (e) {
            console.log(e)
        }
        if (querySnapshot.docs.length != 0) {
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            setsampleQuotes(list)
            setselectedData(list[0])
            setLead_data(list[0].value.travel_data)
        }
        console.log(list)



    }

    return (
        <div className='Suggestions'>
            <div className='sampleQuoteHeader'>
                <RadioGroup row className='searchOption' name='searchOption' value={searchKey} onChange={(e) => handleSearchOption(e)}>
                    <FormControlLabel control={<Radio />} value={0} label="10 recent Quote" />
                    <FormControlLabel control={<Radio />} value={1} label="most Matched Quote" />
                    <FormControlLabel control={<Radio />} value={2} label="Search by TripId" />
                </RadioGroup >
                <button onClick={()=>handleSuggestion()}>Cancel</button>
            </div>
            <div className='divContainsThreeDiv'>
                <div className='QuotesMapperDiv'>
                    {
                        sampleQuotes.map((data, index) => (

                            <div key={index} className='Topsamplequotes_components' onClick={()=>setselectedData(data)}>
                                <div className='samplequotes_components'>
                                    <span className='highglight2'>{data.value.travel_data.TripId}</span><br />
                                    <span>{data.value.travel_data.Traveller_name}</span><br />
                                    <span className='highglight'>{data.value.count_days} day, {data.value.count_days - 1} Nights</span><br />
                                    <span>{data.value.travel_data.Destination}</span><br />
                                    <span className='highglight'>INR:-{parseInt(data.value.flightcost) + parseInt(data.value.visacost) + parseInt(data.value.landPackage)}</span><br />
                                    <span>By:- kishor</span>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div className='QuotesDetails'>
                    {
                        selectedData ? <>
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
                                        <div key={index}>{data.Night},{data.HotelName}, {data.City} , {data.RoomType} Room</div>
                                    ))
                                }
                            </div>
                            <div className='SuggestionInclusion'>
                                <p style={{ display: "flex", flexDirection: "row", alineItem: "center" }}>
                                    <ExtensionSharp />
                                    <span>inclusion/Exclusion</span>
                                </p>
                                <div className="inclusionExclusion">
                                    <div>
                                        {
                                            Object.keys(selectedData.value.inclusion_data)
                                                .filter(function (k) {
                                                    return selectedData.value.inclusion_data[k] == false &&
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
                            </div>
                        </> : <></>
                    }
                </div>
                <div className='LeadLookUp'>{console.log(lead_data)}
                    {
                        selectedData ? <>
                            <span>Trip Details</span>
                            <p className='lookupaliner'>
                                <span>Starting date</span>
                                <span>22/06/2022</span>
                            </p>

                        </> : <></>
                    }

                </div>

            </div>


        </div>
    );
}

export default SuggestionQuotes;
