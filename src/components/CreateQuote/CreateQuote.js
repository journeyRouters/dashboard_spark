import { CircularProgress, Modal } from '@material-ui/core';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import SortableTbl from 'react-sort-search-table';
import app from '../required';
import Box from './Box';
import Maldives from './Maldives';
import MaldiveSuggestion from './MaldiveSuggestion';
import SelfLeadgenrator from './SelfLeadgenrator';
import SuggestionQuotes from './suggestionQuotes';
import './TripComponent.css';




const Createquote = (props) => {
    const [open, setopen] = useState(true)
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState([])
    const [popupopener, set_popupopner] = useState(false)
    const [user_uni_data, set_uni_data] = useState([])
    const time = new Date()
    const [profile, setProfile] = useState(null)
    const Current = time.getSeconds()
    const [SuggestionModal, settransfermodal] = useState(false)
    const [lastVisible, setlastVisible] = useState(null)
    const [sampleQuotes, setsampleQuotes] = useState([])
    const[AddLead, setAddLead]=useState(false)
    function AddLeadButtonController(){
        setAddLead(true)
    }

    function handleSuggestion(data) {
        set_uni_data(data)
        settransfermodal(!SuggestionModal)

    }
    function closeMaldivesSuggestionModal() {
        settransfermodal(!SuggestionModal)

    }
    let tHead = [
        "TripId",
        "NAME",
        "Contact_Number",
        "Destination",
        "Budget",
        "Pax",
        'Child',
        "Email",
        "assign_date",
        "Lead_Status",
        "Action",
        "Quote",
    ];
    let col = [
        "TripId",
        "Traveller_name",
        "Contact_Number",
        "Destination",
        "Budget",
        "Pax",
        'Child',
        "Email",
        "uploaded_date",
        "Lead_Status",
        "Last 10 Quote",
        "Quote",

    ];

    function updateTableDataAfterQuote(tripid) {
        var pre_tableData = lead_data
        // console.log(lead_data)
        var new_tableData = pre_tableData.filter((data) => data.TripId !== tripid)
        setLead_data(new_tableData)

    }

    async function getLeadOnBoard() {
        // console.log(props.auth.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", props.auth.uid), where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
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

        // console.log(props.auth.uid)

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
                props.auth ? <>
                    <div className='global_search' >

                        <button onClick={() => getLeadOnBoard()}>Refresh</button>
                        <span style={{ background: 'yellow' }}>Lead= {lead_data.length}</span>
                        <button onClick={()=>AddLeadButtonController()} className='addNewLeadButton'>Add Lead</button>
                        <SelfLeadgenrator open={AddLead} setAddLead={setAddLead} userProfile={props.userProfile} getLeadOnBoard={getLeadOnBoard}/>
                    </div>
                    <Modal open={SuggestionModal} onClose={closeMaldivesSuggestionModal} >
                        {
                            user_uni_data.Destination == 'Maldives' ? <>
                                <MaldiveSuggestion
                                    closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                                    Lead_data_to_be_quoted={user_uni_data}
                                    email={props.auth.email}
                                    profile={props.userProfile}
                                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                                />
                            </> : <>
                                <SuggestionQuotes
                                    handleSuggestion={closeMaldivesSuggestionModal}
                                    Lead_data_to_be_quoted={user_uni_data}
                                    email={props.auth.email}
                                    profile={props.userProfile}
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
                                        user_uni_data.Destination === "Maldives" ? <>
                                            <Maldives
                                                email={props.auth.email}
                                                data={user_uni_data}
                                                updateTableDataAfterQuote={updateTableDataAfterQuote}
                                                set_popupopner={set_popupopner}
                                                profile={props.userProfile}
                                            />
                                        </> : <>
                                            <Box
                                                email={props.auth.email}
                                                data={user_uni_data}
                                                updateTableDataAfterQuote={updateTableDataAfterQuote}
                                                set_popupopner={set_popupopner}
                                                profile={props.userProfile}
                                            />
                                        </>
                                    }
                                </> :
                                    <SortableTbl
                                        tblData={lead_data}
                                        tHead={tHead}
                                        defaultCSS={true}
                                        paging={false}
                                        customTd={[
                                            // { custd: BaseProductTblImageComponent, keyItem: "imageUrl" },
                                            { custd: BaseProductEditComponent, keyItem: "Quote" },
                                            { custd: BaseProductDeleteComponent, keyItem: "Last 10 Quote" },
                                        ]}
                                        dKey={col}
                                    />
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

export default Createquote;
