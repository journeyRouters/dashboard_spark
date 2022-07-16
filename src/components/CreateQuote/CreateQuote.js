import { CircularProgress, Modal } from '@material-ui/core';
import { Flag } from '@material-ui/icons';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, Query, query, startAfter, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import app from '../required';
import Box from './Box';
import './TripComponent.css';
import SortableTbl from 'react-sort-search-table';
import Profile from '../Profile/Profile';
import SendIcon from '@material-ui/icons/Send';
import SuggestionQuotes from './suggestionQuotes';




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

    function handleSuggestion(data) {
        set_uni_data(data)
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
        "Lead_Status",
        "Last 10 Quote",
        "Quote",
        
    ];
    // /**new logic solution be apart from previous one */

    // async function getProfile(args) {
    //     console.log(args)
    //     try {
    //         const docRef = doc(db, "Profile", args.uid);
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //             setProfile(docSnap.data())
    //             getdocandmergetolist(docSnap.data().Lead_Current)
    //         } else {
    //             console.log("No such document!");
    //             // alert("Developer issue")
    //         }
    //     }
    //     catch (error) {
    //         console.log({ error })
    //     }
    // }
    function updateTableDataAfterQuote(tripid) {
        var pre_tableData = lead_data
        console.log(lead_data)
        var new_tableData = pre_tableData.filter((data) => data.TripId !== tripid)
        setLead_data(new_tableData)

    }
    // async function updateprofile_LeadFollowup(tripid) {
    //     const docref = doc(db, "Profile", profile.uid);
    //     var pre_Lead_followUp = profile.Lead_followUp
    //     var new_Lead_followUp = pre_Lead_followUp.push(tripid)
    //     console.log(new_Lead_followUp)
    //     await updateDoc(docref, {
    //         "Lead_followUp": new_Lead_followUp
    //     });
    // }
    // async function updateprofile_Lead_Current(tripid) {
    //     var pre_Lead_Current = profile.Lead_Current
    //     var elementIndex = pre_Lead_Current.indexOf(tripid)
    //     var new_Lead_Current = pre_Lead_Current.splice(elementIndex, 1)
    //     const docref = doc(db, "Profile", profile.uid)
    //     await updateDoc(docref, {
    //         "Lead_Current": pre_Lead_Current
    //     })
    // }
    // async function getdocandmergetolist(list) {
    //     /** this function is getting the list of trips from
    //      * user profile and fetching the doc from firebase one by one.
    //      * beacause the list query is limited to 10 elements in a single list
    //      */
    //     console.log(list.length)
    //     let list_ = []
    //     for (let index = 0; index < list.length; index++) {
    //         const docRef = doc(db, "Trip", list[index]);
    //         const docSnap = await getDoc(docRef);
    //         if (docSnap.exists()) {
    //             list_.push(docSnap.data())
    //             console.log("Document data:", docSnap.data());
    //         } else {
    //             // doc.data() will be undefined in this case
    //             console.log("No such document!");
    //         }
    //     }
    //     setLead_data(list_)
    //     setopen(false)

    // }
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

        <div>
            {
                props.auth ? <>
                    <Modal open={SuggestionModal} onClose={handleSuggestion} >
                        <SuggestionQuotes
                            handleSuggestion={handleSuggestion}
                            Lead_data_to_be_quoted={user_uni_data}
                            email={props.auth.email}
                            profile={profile}
                            updateTableDataAfterQuote={updateTableDataAfterQuote}

                        />


                    </Modal>
                    {
                        lead_data.length == 0 ? <>
                            {

                                open ?
                                    <Modal style={{ display: "flex", justifyContent: "center", marginTop: "15rem" }} open={open}  >
                                        <CircularProgress />

                                    </Modal> :
                                    <>

                                        <div className='no_data'></div>
                                    </>
                            }

                        </> : <>
                            {
                                popupopener ?
                                    <Box
                                        email={props.auth.email}
                                        data={user_uni_data}
                                        updateTableDataAfterQuote={updateTableDataAfterQuote}
                                        set_popupopner={set_popupopner}
                                        profile={profile}
                                    /> :
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
