import React from 'react';
import './TripComponent.css';
import { useState } from 'react';
import Box from './Box';
import Maldives from './Maldives';
import MaldiveSuggestion from './MaldiveSuggestion';
import SuggestionQuotes from './suggestionQuotes';
import { Modal } from '@material-ui/core';

const CreateQuoteTableRow = ({
    data, updateTableDataAfterQuote,
    email, userProfile
}) => {
    const [SuggestionModal, settransfermodal] = useState(false)
    const [popupopener, set_popupopner] = useState(false)
    const [user_uni_data, set_uni_data] = useState([])


    function closeMaldivesSuggestionModal() {
        settransfermodal(!SuggestionModal)

    }
    function handleSuggestion(data) {
        set_uni_data(data)
        settransfermodal(!SuggestionModal)

    }
    function editItem() {
        set_uni_data(data)
        set_popupopner(true)
    }
    return (
        <div className='Createquoteunicompo'>
            <Modal open={SuggestionModal} onClose={closeMaldivesSuggestionModal} >
                {
                    user_uni_data.Destination == 'Maldives' ? <>
                        <MaldiveSuggestion
                            closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                            Lead_data_to_be_quoted={user_uni_data}
                            email={email}
                            profile={userProfile}
                            updateTableDataAfterQuote={updateTableDataAfterQuote}
                        />
                    </> : <>
                        <SuggestionQuotes
                            handleSuggestion={closeMaldivesSuggestionModal}
                            Lead_data_to_be_quoted={user_uni_data}
                            email={email}
                            profile={userProfile}
                            updateTableDataAfterQuote={updateTableDataAfterQuote}

                        />
                    </>
                }



            </Modal>
            {
                popupopener ? <>
                    {
                        user_uni_data.Destination === "Maldives" ? <>
                            <Maldives
                                email={email}
                                profile={userProfile}
                                data={user_uni_data}
                                updateTableDataAfterQuote={updateTableDataAfterQuote}
                                set_popupopner={set_popupopner}
                            />
                        </> : <>
                            <Box
                                email={email}
                                data={user_uni_data}
                                updateTableDataAfterQuote={updateTableDataAfterQuote}
                                set_popupopner={set_popupopner}
                                profile={userProfile}
                            />
                        </>
                    }
                </> : <></>
            }
            <div className='createQouteBox'>
                <div className='createQouteBoxFirstHalf'>
                    <div className={userProfile.user_type == 'Team Leader' && data.x_callerFlg == true ? 'called' : 'called1'}>
                        {
                            data.Potential == 'Nurture'?<span style={{fontSize:'12px'}}>Nurture</span>:<></>

                        }
                        <h4 className='tripId'>TripId:-{data.Campaign_code[0]} {data.TripId} </h4>
                        <h4>Name:-{data.Traveller_name}</h4>
                        <h4>Contact:- {data.Contact_Number}</h4>
                        <h4>E-mail:-</h4>
                        {
                            data.x_callerFlg == true ?
                                <h4>x-Caller:-{data.x_Caller}</h4> : <></>
                        }
                    </div>
                </div>
                <div className='createQouteBox2'>
                    <div style={{ marginLeft: '2rem' }}>

                        <div>
                            <h4>Destination:-{data.Destination}</h4>
                            <h4>Pax:-{data.Pax}</h4>
                            <h4>Child:-{data.Child}</h4>
                            <h4>Departure City:-{data.Departure_City}</h4>
                        </div>
                        {
                            data.FlightBookedFlg ?
                            <img
                            src='https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2FPlane1.gif?alt=media'
                            className='flightbook_' /> : <></>
                        }
                    </div>
                    <div>
                        <h4>Budget:-{data.Budget}</h4>
                        <h4>Assign Date:-{data.uploaded_date}</h4>
                        <h4>Assign Time:-{data.uploaded_time}</h4>
                        <h4>Status:-{data.Lead_Status}</h4>
                    </div>
                    <div style={{ height:'5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-around',marginTop:'2.5rem' }}>
                        <button className='last10quoteButton' onClick={() => editItem()}>Fresh Quote</button>
                        <button className='last10quoteButton' onClick={() => handleSuggestion(data)}>Last 10 quotes</button>
                    </div>
                </div>
            </div >
        </div>
    );
}

export default CreateQuoteTableRow;
