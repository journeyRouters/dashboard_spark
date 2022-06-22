import { CircularProgress, Modal } from '@material-ui/core';
import { Flag } from '@material-ui/icons';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import app from '../required';
import Box from './Box';
import './TripComponent.css';
import SortableTbl from 'react-sort-search-table';
import Profile from '../Profile/Profile';




const Createquote = (props) => {
    const [open, setopen] = useState(true)
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState([])
    const [popupopener, set_popupopner] = useState(false)
    const [user_uni_data, set_uni_data] = useState([])
    const time = new Date()
    const [profile, setProfile] = useState(null)
    const Current = time.getSeconds()
    const [lastVisible, setlastVisible] = useState()

    let tHead = [
        "TripId",
        "NAME",
        "Contact_Number",
        "Destination",
        "Budget",
        "Email",
        "Lead_Status",
        "Delete",
        "Quote",
    ];
    let col = [
        "TripId",
        "Traveller_name",
        "Contact_Number",
        "Destination",
        "Budget",
        "Email",
        "Lead_Status",
        "delete",
        "Quote",
    ];
    // /**new logic solution be apart from previous one */

    async function getProfile(args) {
        console.log(args)
        try {
            const docRef = doc(db, "Profile", args.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data())
                getLeadOnBoard(docSnap.data())
                // console.log("Document data:", docSnap.data());
            } else {
                console.log("No such document!");
            }
        }
        catch (error) {
            console.log({ error })
        }
    }
    function updateTableDataAfterQuote(tripid) {
        var pre_tableData = props.Lead_data
        var new_tableData = pre_tableData.filter((data) => data.TripId !== tripid)
        setLead_data(new_tableData)

    }
    async function updateprofile_LeadFollowup(tripid) {
        const docref = doc(db, "Profile", profile.uid);
        var pre_Lead_followUp = profile.Lead_followUp
        var new_Lead_followUp = pre_Lead_followUp.push(tripid)
        await updateDoc(docref, {
            "Lead_followUp": new_Lead_followUp
        });
    }
    async function updateprofile_Lead_Current(tripid) {
        var pre_Lead_Current = profile.Lead_Current
        var elementIndex = pre_Lead_Current.indexOf(tripid)
        var new_Lead_Current = pre_Lead_Current.splice(elementIndex, 1)
        const docref = doc(db, "Profile", profile.uid)
        await updateDoc(docref, {
            "Lead_Current": new_Lead_Current
        })
    }
    async function getLeadOnBoard(profile) {
        console.log(profile.Lead_Current)
        let list = []
        var q;
        if (profile) {
            q = query(collection(db, "Trip"), where('TripId', 'in', profile.Lead_Current));
        }
        var querySnapshot;
        try {
            if (profile.Lead_Current.lenght !== 0) {

                querySnapshot = await getDocs(q);
                try {

                    if (querySnapshot.docs.length == 0) {
                        setopen(false)
                    }

                    querySnapshot.forEach((doc) => {
                        list.push(doc.data())
                        // doc.data() is never undefined for query doc snapshots
                    });
                    setLead_data(list)
                    console.log(list);
                    setopen(false)
                }
                catch (error) {
                    console.log(error)
                }
            }
            else {
                setLead_data([])
            }
        }
        catch {
            setopen(false)
        }

    }

    /**//////////////////////////////////////////////////// */
    useEffect(() => {
        window.scrollTo(0, 0);
        console.log(props.auth.uid)
        getProfile(props.auth)
    }, [popupopener]);
    // useEffect(() => {
    //     if (lead_data.length == 0) {

    //         getnextData()
    //     }
    // }, [lead_data]);
    // async function datahandle() {
    //     if (props.auth) {
    //         let list = []
    //         var q;
    //         if (props.userProfile.access_type == 'User') {
    //             console.log(props.userProfile.following_lead)
    //             q = query(collection(db, "Trip"), where('Destination', 'in', props.userProfile.following_lead), where("quotation_flg", "==", false), where("Lead_Status", "!=", "Dump"));
    //         }

    //         if (props.userProfile.access_type == 'admin') {

    //             q = query(collection(db, "Trip"), where("quotation_flg", "==", false));
    //         }
    //         var querySnapshot;
    //         try {
    //             if (props.userProfile.following_lead !== 0) {

    //                 querySnapshot = await getDocs(q);
    //             }
    //             else {
    //                 setLead_data([])
    //             }
    //         }
    //         catch {
    //             setopen(false)
    //         }
    //         try {

    //             if (querySnapshot.docs.length == 0) {
    //                 setopen(false)
    //             }

    //             querySnapshot.forEach((doc) => {
    //                 list.push(doc.data())
    //                 // doc.data() is never undefined for query doc snapshots
    //             });
    //             setLead_data(list)
    //             console.log(list);
    //             setopen(false)
    //         }
    //         catch (error) {
    //             console.log(error)
    //         }
    //         // console.log(lead_data)
    //     }
    //     else {
    //         setopen(false)
    //         setLead_data([])
    //     }

    // }
    class BaseProductDeleteComponent extends React.Component {
        constructor(props) {
            super(props);
            this.deleteItem = this.deleteItem.bind(this);
        }
        deleteItem() {
            alert("delete " + this.props.rowData.name);
            console.log(this.props.rowData, this.props.tdData);
        }
        render() {
            return (
                <td>
                    <input
                        type="button"
                        className="btn btn-danger"
                        value="Delete"
                        onClick={this.deleteItem}
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
            console.log(this.props.rowData, this.props.tdData);
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
    // async function getnextData() {
    //     if (props.auth) {
    //         let list = []
    //         var q;
    //         if (props.userProfile.access_type == 'User') {
    //             q = query(collection(db, "Trip"), where('Destination', 'in', props.userProfile.following_lead), where("quotation_flg", "==", false), where("Lead_Status", "!=", "Dump"), orderBy("Lead_Status"), startAfter(lastVisible), limit(15));
    //         }
    //         if (props.userProfile.access_type == 'admin') {

    //             q = query(collection(db, "Trip"), where("uploaded_by", "==", props.auth.uid), where("quotation_flg", "==", false), orderBy("TripId"), startAfter(lastVisible), limit(3));
    //         }
    //         const querySnapshot = await getDocs(q);
    //         if (querySnapshot.docs.length == 0) {
    //             setopen(false)
    //             datahandle()
    //         }
    //         querySnapshot.forEach((doc) => {
    //             list.push(doc.data())
    //         });

    //         setlastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])

    //         if (list.lenght === 0) {
    //             datahandle()
    //         }
    //         else {
    //             setLead_data(list)
    //             console.log(list)
    //         }
    //         setopen(false)
    //     }
    //     else {
    //         setopen(false)
    //         setLead_data([])
    //     }
    // }
    // function getnextdatacontroller() {
    //     getnextData()
    // }

    // useEffect(() => {
    //     // window.location.reload(false);
    //     datahandle()
    // }, [props.auth])

    return (

        <div>
            {
                props.auth ? <>
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
                                        // datahandle={datahandle}
                                        set_popupopner={set_popupopner}
                                        userProfile={props.userProfile}
                                        setLead_data={setLead_data}
                                        lead_data={lead_data}
                                    /> :
                                    <SortableTbl
                                        tblData={lead_data}
                                        tHead={tHead}
                                        defaultCSS={true}
                                        paging={false}
                                        customTd={[
                                            // { custd: BaseProductTblImageComponent, keyItem: "imageUrl" },
                                            { custd: BaseProductEditComponent, keyItem: "Quote" },
                                            { custd: BaseProductDeleteComponent, keyItem: "delete" },
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
