import { CircularProgress, Modal } from '@material-ui/core';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import app from '../required';
import Box from './Box';
import CreateQuoteTableRow from './CreateQuoteTableRow';
import MaldiveSuggestion from './MaldiveSuggestion';
import Maldives from './Maldives';
import SelfLeadgenrator from './SelfLeadgenrator';
import './TripComponent.css';
import SuggestionQuotes from './suggestionQuotes';

const MainCreatequote = (props) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [open, setopen] = useState(true)
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState([])
    const [popupopener, set_popupopner] = useState(false)
    const [user_uni_data, set_uni_data] = useState([])
    const [SuggestionModal, settransfermodal] = useState(false)
    const [AddLead, setAddLead] = useState(false)
    function AddLeadButtonController() {
        setAddLead(true)
    }

    function handleSuggestion(data) {
        set_uni_data(data)
        settransfermodal(!SuggestionModal)

    }
    function closeMaldivesSuggestionModal() {
        settransfermodal(!SuggestionModal)

    }
   

    function updateTableDataAfterQuote(tripid) {
        var pre_tableData = lead_data
        // console.log(lead_data)
        var new_tableData = pre_tableData.filter((data) => data.TripId !== tripid)
        setLead_data(new_tableData)

    }

    async function getLeadOnBoard() {
        // console.log(auth.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", auth.uid), where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                // console.log(list);
                setopen(false)
            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getLeadOnBoard()

        // console.log(auth.uid)

    }, [popupopener]);

    class BaseProductDeleteComponent extends React.Component {
        constructor(props) {
            super(props);
            this.suggestedQuotes = this.suggestedQuotes.bind(this);
        }
        suggestedQuotes() {

            // alert("delete " + this.props.rowData.name);
            // console.log(this.props.rowData, this.props.tdData);
        }
        render() {
            return (
                <td>
                    <input
                        type="button"
                        className="btn btn-danger"
                        value="Last 10 Quote"
                        // disabled
                        onClick={() => handleSuggestion(this.props.rowData)}
                    />
                </td>
            );
        }
    }
    class BaseProductEditComponent extends React.Component {
        constructor(props) {
            super(props);
            this.editItem = this.editItem.bind(this);
        }
        editItem() {
            /**this set uni data function is setting the row data for box.js explanation */
            set_uni_data(this.props.rowData)
            set_popupopner(true)
            // console.log(this.props.rowData, this.props.tdData);
        }
        render() {
            return (
                <td>
                    <input
                        type="button"
                        className="btn btn-warning"
                        value="Quote"
                        onClick={this.editItem}
                    />
                </td>
            );
        }
    }

    return (

        <div className='tableAliner'>
            {
                auth ? <>
                    <div className='global_search_adminpage' >

                        {/* <button onClick={() => getLeadOnBoard()}>Refresh</button> */}
                        <span style={{
                            color: 'yellow',
                            fontSize: '20px',
                            fontWeight: '700',
                            color: 'yellow',
                        }}>Total Lead - {lead_data.length}</span>
                        <button onClick={() => AddLeadButtonController()} className='addNewLeadButton'>Add Lead</button>
                        <SelfLeadgenrator open={AddLead} onClose={setAddLead} userProfile={profile} getLeadOnBoard={getLeadOnBoard} />
                    </div>
                    <Modal open={SuggestionModal} onClose={closeMaldivesSuggestionModal} >
                        {
                            user_uni_data.Destination == 'Maldives' ? <>
                                <MaldiveSuggestion
                                    closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                                    Lead_data_to_be_quoted={user_uni_data}
                                    email={auth.email}
                                    profile={profile}
                                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                                />
                            </> : <>
                                <SuggestionQuotes
                                    handleSuggestion={closeMaldivesSuggestionModal}
                                    Lead_data_to_be_quoted={user_uni_data}
                                    email={auth.email}
                                    profile={profile}
                                    updateTableDataAfterQuote={updateTableDataAfterQuote}

                                />
                            </>
                        }



                    </Modal>
                    {
                        lead_data.length == 0 ? <>
                            {

                                open ?
                                    <Modal style={{ display: "flex", justifyContent: "center", marginTop: "15rem" }} open={open}  >
                                        <CircularProgress />

                                    </Modal> :
                                    <>

                                        <div className='no_data'>
                                            {/* <iframe 
                                        width="560" height="315"
                                         src="https://www.youtube.com/embed/yXWw0_UfSFg" 
                                         title="YouTube video player" frameborder="0" 
                                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowfullscreen>

                                          </iframe> */}
                                        </div>
                                    </>
                            }

                        </> : <>
                            {
                                popupopener ? <>
                                    {
                                        user_uni_data.Destination === "Maldives"  ?
                                            <>
                                                <Maldives
                                                    email={auth.email}
                                                    profile={profile}
                                                    data={user_uni_data}
                                                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                                                    set_popupopner={set_popupopner}
                                                />
                                            </>
                                            :
                                            <>
                                                <Box
                                                    email={auth.email}
                                                    data={user_uni_data}
                                                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                                                    set_popupopner={set_popupopner}
                                                    profile={profile}
                                                />
                                            </>
                                    }
                                </> :
                                    // <SortableTbl
                                    //     tblData={lead_data}
                                    //     tHead={tHead}
                                    //     defaultCSS={true}
                                    //     paging={false}
                                    //     customTd={[
                                    //         // { custd: BaseProductTblImageComponent, keyItem: "imageUrl" },
                                    //         { custd: BaseProductEditComponent, keyItem: "Quote" },
                                    //         { custd: BaseProductDeleteComponent, keyItem: "Last 10 Quote" },
                                    //     ]}
                                    //     dKey={col}
                                    // />

                                    lead_data.map((data, index) =>
                                        <CreateQuoteTableRow
                                            key={index}
                                            updateTableDataAfterQuote={updateTableDataAfterQuote}
                                            handleSuggestion={closeMaldivesSuggestionModal}
                                            closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                                            set_popupopner={set_popupopner}
                                            email={auth.email}
                                            userProfile={profile}
                                            data={data}

                                        />
                                    )
                            }
                            {/* <button className='loadMOreBUtton' onClick={() => getnextdatacontroller()}>Load more</button> */}
                        </>
                    }
                </> : <>
                    <div className='no_data'></div>
                </>
            }


        </div>
    );
}

export default MainCreatequote;
