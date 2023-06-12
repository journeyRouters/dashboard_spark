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
    // console.log(userProfile)
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
            <div className={userProfile.user_type == 'Team Leader' && data.x_callerFlg == true ? 'called' : <></>}>
                <h4>TripId:-{data.TripId} </h4>
                <h4>Name:-{data.Traveller_name}</h4>
                <h4>Contact:- {data.Contact_Number}</h4>
                {
                    data.x_callerFlg == true ?
                        <h4>x-Caller:-{data.x_Caller}</h4> : <></>
                }
            </div>
            <div>
                <h4>Budget:-{data.Budget}</h4>
                <h4>Pax:-{data.Pax}</h4>
                <h4>Child:-{data.Child}</h4>
            </div>
            {
                data.FlightBookedFlg ?
                    <img src='../assets/Notification/plane1.gif' className='flightbook' /> : <></>
            }
            <div>
                <h4>Assign Date:-{data.uploaded_date}</h4>
                <h4>Destination:-{data.Destination}</h4>
                <h4>Status:-{data.Lead_Status}</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <button onClick={() => editItem()}>Fresh Quote</button>
                <button onClick={() => handleSuggestion(data)}>Last 10 quotes</button>
            </div>
        </div>
    );
}

export default CreateQuoteTableRow;
