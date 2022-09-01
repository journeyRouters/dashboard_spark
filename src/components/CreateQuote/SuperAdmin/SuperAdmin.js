import { CircularProgress, Modal } from '@material-ui/core';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import SortableTbl from 'react-sort-search-table';
import Maldives from '../Maldives';
import app from '../../required';
import SuggestionQuotes from '../suggestionQuotes';
import Box from '../Box';
import '../TripComponent.css'
import MaldiveSuggestion from '../MaldiveSuggestion';




const SuperAdmin = (props) => {
    const [open, setopen] = useState(true)
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState([])
    const [popupopener, set_popupopner] = useState(false)
    const [user_uni_data, set_uni_data] = useState([])
    const time = new Date()
    const [profile, setprofile] = useState(null)
    const Current = time.getSeconds()
    const [SuggestionModal, settransfermodal] = useState(false)
    const [lastVisible, setlastVisible] = useState(null)
    const [sampleQuotes, setsampleQuotes] = useState([])
    const [currentUser, setCurrentuser] = useState(null)



    function handleSuggestion(data) {
        set_uni_data(data)
        settransfermodal(!SuggestionModal)
    }
    function closeMaldivesSuggestionModal(){
        settransfermodal(false)
    }
    useEffect(() => {
        const q = query(collection(db, "Profile"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data())
            });
            setprofile(Profile)
            // console.log(Profile,);
        });
        return () => unsubscribe()

    }, []);
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
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", currentUser[0].uid), where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
                setLead_data([])
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
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = profile.filter((data) => data.uid === uid)
        // console.log(profile_of_user)
        setCurrentuser(profile_of_user)

    }

    return (

        <div className='tableAliner'>
            <div>
                {
                    profile ? <>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)}>
                            <option value={0}> assign to</option>
                            {
                                profile.map((data, index) => (<>
                                    {/* {console.log(data.Lead_Current)} */}
                                    <option key={index} value={data.uid}>{data.name}</option>

                                </>))
                            }
                        </select>
                        <button onClick={() => getLeadOnBoard()}>Search</button>
                    </> : <></>
                }


            </div>

            {
                props.auth ? <>
                    <Modal open={SuggestionModal} onClose={handleSuggestion} >
                        
                        {
                            user_uni_data.Destination == 'Maldives' ? <>
                                <MaldiveSuggestion
                                    closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                                    Lead_data_to_be_quoted={user_uni_data}
                                    email={props.auth.email}
                                    profile={props.profile}
                                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                                />
                            </> : <>
                                <SuggestionQuotes
                                    handleSuggestion={closeMaldivesSuggestionModal}
                                    Lead_data_to_be_quoted={user_uni_data}
                                    email={props.auth.email}
                                    profile={props.profile}
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

                                        <div className='no_data'></div>
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
                                                profile={props.profile}
                                            />
                                        </> : <>
                                            <Box
                                                email={props.auth.email}
                                                data={user_uni_data}
                                                updateTableDataAfterQuote={updateTableDataAfterQuote}
                                                set_popupopner={set_popupopner}
                                                profile={props.profile}
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

export default SuperAdmin;
