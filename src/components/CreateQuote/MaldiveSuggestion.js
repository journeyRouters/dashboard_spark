import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { ExtensionSharp } from '@material-ui/icons';
import HotelIcon from '@material-ui/icons/Hotel';
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Maldives from './Maldives';
import './TripComponent.css';
const db = getFirestore(app)

const MaldiveSuggestion = ({
    destination,
    closeMaldivesSuggestionModal,
    Lead_data_to_be_quoted,
    profile,
    updateTableDataAfterQuote,
    email
}) => {
    const [sampleQuotes, setsampleQuotes] = useState([])
    const [searchKey, setSearchKey] = useState(0)
    const [selectedData, setselectedData] = useState([])
    const [inclusionlist, setinclusion] = useState([])
    const [exclusionlist, setexclusion] = useState([''])
    const [lead_data, setLead_data] = useState()
    const [usethisKey, setusethisKey] = useState(false)
    function syncDataToMapper(data) {
        let list = []
        // console.log(data.value)
        list.push(data)
        setselectedData(data.value)
    }
    useEffect(() => {
        getSampleQuotes(Lead_data_to_be_quoted.Destination)

    }, []);

    function usethisquoteHandler() {
        setusethisKey(!usethisKey)
    }
    function handleSearchOption(e) {
        // console.log(typeof (e.target.value))
        setSearchKey(parseInt(e.target.value))
    }
    async function getSampleQuotes(Destination) {
        // console.log(Destination)
        var formateDate=moment(new Date()).format("YYYY-MM-DD")
        var quotesref = collection(db, "Quote")
        const queryQuotes = query(quotesref, where("value.travel_data.Destination", "==", Destination),
        where("value.selected_Travel_date",">",formateDate),
        limit(50)
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

        // console.log(list)
    }

    return (
        <div className='Suggestions'>
            {
                usethisKey ?
                    <>
                        <Maldives
                            email={email}
                            data={Lead_data_to_be_quoted}
                            Edit_SelectedpackageType={selectedData.SelectedpackageType}
                            updateTableDataAfterQuote={updateTableDataAfterQuote}
                            set_popupopner={setusethisKey}
                            closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                            profile={profile}
                            E_indicator={true}
                            Edit_no_rooms={selectedData.no_rooms}
                            Edit_NightDataFields={selectedData.NightDataFields}
                            Edit_selected_Travel_date={selectedData.selected_Travel_date}
                            Edit_visacost={selectedData.visacost}
                            Edit_flightcost={selectedData.flightcost}
                            Edit_landPackage={selectedData.landPackage}
                            Edit_count_days={selectedData.count_days}
                            Edit_Property={selectedData.Property}
                            Edit_MealPlan={selectedData.MealPlan}
                            Edit_Transfer={selectedData.Transfer}
                            pre_flightImgLinks={selectedData.flightImgLinks}
                            pre_inclusionLinks={selectedData.inclusionLinks}
                            inclusion_data_={selectedData.inclusion_data}
                        />
                    </> :
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
                    <button onClick={() => closeMaldivesSuggestionModal()}>Cancel</button>
                </div>
            </div>
            <div className='divContainsThreeDiv'>
                <div className='QuotesMapperDiv'>
                    {
                        sampleQuotes.map((data, index) => (

                            <div key={index} className='Topsamplequotes_components' onClick={() => syncDataToMapper(data)}>
                                <div className='samplequotes_components'>
                                    <span className='highglight2' >TRIP ID:-{data.value.travel_data.TripId}</span><br />
                                    <span style={{ color: 'white', marginLeft: '1rem' }} >{data.value.travel_data.Traveller_name}</span><br />
                                    <ul>
                                        <li style={{ color: 'white', fontSize: '15px', marginBottom: '4px' }}>{data.value.travel_data.Destination}</li>
                                        <li style={{ color: 'white', fontSize: '15px', marginBottom: '4px' }}>{data.value.count_days} day, {data.value.count_days - 1} Nights</li>
                                        <li style={{ color: 'white', fontSize: '15px', marginBottom: '4px' }}>INR:-{parseInt(data.value.flightcost) + parseInt(data.value.visacost) + parseInt(data.value.landPackage)} / {data.value.SelectedpackageType}</li>
                                        <li style={{ color: 'white', fontSize: '15px' }}>By:- {data.value.Quoted_by}</li>
                                    </ul>
                                </div>
                            </div>

                        ))
                    }
                </div>
                <div>
                    {
                        selectedData.length != 0 ? <>
                            <div className='QuotesDetails'>
                                <div>
                                    <table style={{ border: '3px solid', color: 'black', marginLeft: '4rem', width: '47rem', height: '40rem', fontSize: '1.3rem' }}>
                                        <tbody>
                                            <tr style={{ border: '3px solid black', borderCollapse: 'collapse' }} >
                                                <th style={{ border: '3px solid black' }}>HOTEL</th>
                                                <td style={{ border: '3px solid black', paddingLeft: '0rem', fontWeight: '500' }}>
                                                    {selectedData.Property.label}
                                                </td>
                                            </tr>
                                            <tr >
                                                <th style={{ border: '3px solid black' }}>STAY</th>
                                                <td style={{ border: '3px solid black', fontWeight: '500', paddingLeft: '0rem' }}>
                                                    {
                                                        selectedData.NightDataFields.map((data, index) => (
                                                            <> <span>
                                                                {
                                                                    data.Night.map((data_, index) => (<span>{data_.value},</span>))
                                                                }
                                                                {
                                                                    <span>{data.Night.length} Nights </span>
                                                                }
                                                                at {data.RoomType.label}</span><br /></>
                                                        ))
                                                    }

                                                </td>
                                            </tr>
                                            <tr>
                                                <th style={{ border: '3px solid black' }}>DURATION</th>
                                                <td style={{ border: '3px solid black', fontWeight: '500' }}>{selectedData.count_days} day, {selectedData.count_days - 1} Nights</td>
                                            </tr>
                                            <tr >
                                                <th style={{ border: '3px solid black' }}>TRANSFERS</th>
                                                <td style={{ border: '3px solid black', paddingLeft: '0rem', fontWeight: '500' }}>{selectedData.Transfer ? selectedData.Transfer.value : ''}</td>
                                            </tr>
                                            <tr >
                                                <th style={{ border: '3px solid black' }}>MEAL PLAN</th>
                                                <td style={{ border: '3px solid black', paddingLeft: '0rem', fontWeight: '500' }}>{selectedData.MealPlan ? selectedData.MealPlan.value : ''}</td>
                                            </tr>
                                            <tr >
                                                <th style={{ border: '3px solid black' }}>DATE</th>
                                                <td style={{ border: '3px solid black', paddingLeft: '0rem', fontWeight: '500' }}>{selectedData.selected_Travel_date ? moment(selectedData.selected_Travel_date).format('DD-MMMM-YYYY') : ''}</td>
                                            </tr>
                                            <tr >
                                                <th style={{ border: '3px solid black' }}>NO OF PAX</th>
                                                <td style={{ border: '3px solid black', paddingLeft: '0rem', fontWeight: '500' }}>{selectedData.Pax} Adult, {selectedData.Child}Child</td>
                                            </tr>
                                            <tr >
                                                <th style={{ border: '3px solid black' }}>NO OF ROOMS</th>
                                                <td style={{ border: '3px solid black', paddingLeft: '0rem', fontWeight: '500' }}>{selectedData.no_rooms ? selectedData.no_rooms : 0}</td>
                                            </tr>
                                        </tbody>
                                    </table>
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

export default MaldiveSuggestion;
