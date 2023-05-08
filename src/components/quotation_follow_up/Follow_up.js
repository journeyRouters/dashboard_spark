import { CircularProgress, makeStyles, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Row from './Row';
import './quote.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';



const FollowUp = (props) => {
    const [SearchKey, setSearchKey] = useState(0)
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState(props.adminFlg ? props.data : [])
    const [open, setopen] = useState(true)
    const [Destination, SetDestination_list] = useState([])
    const [month, setMonths] = useState([])
    const [lead, setLead] = useState([])
    const [assign_date, setassign_month] = useState([])
    const animatedComponents = makeAnimated();
    const [user, setuser] = useState(props.adminFlg ? props.user : props.auth.uid)
    const [leadStatus, setStatus] = useState(0)
    async function getOthersStatusLeadOnBoard(status) {
        // console.log(props.target.uid)
        setStatus(status)
        if (status == 0) { }
        else {
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", props.target ? props.target.uid : props.auth.uid),
                    where('Lead_Status', 'in', [status]), where("quotation_flg", "==", true));
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

    }
    async function getLeadOnBoard() {
        // console.log(props.target.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true),


            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
                setStatus(0)

            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                setStatus(0)
                setopen(false)

            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }


    function updateTableDataAfterConversion(tripid) {
        var pre_tableData = lead_data
        var remaining_data = pre_tableData.filter((data) => data.TripId !== tripid)
        // console.log(remaining_data, pre_tableData)
        setLead_data(remaining_data)
    }

    useEffect(() => {
        if (props.adminFlg) {
            setopen(false)
        }
        else {
            getLeadOnBoard()
        }
    }, [props.auth])


    const Destinations = [
        { value: 'Thailand', label: 'Thailand', color: '#00B8D9' },
        { value: 'Bali', label: 'Bali', color: '#0052CC' },
        { value: 'Dubai', label: 'Dubai', color: '#5243AA' },
        { value: 'Kashmir', label: 'Kashmir', color: '#666666' },
        { value: 'Himachal', label: 'Himachal', color: '#666666' },
        { value: 'Kerala', label: 'Kerala', color: '#666666' },
        { value: "Andaman", label: "Andaman", color: '666666' },
        { value: 'Maldives', label: 'Maldives', color: '666666' },
        { value: 'Veitnam', label: 'Veitnam', color: '666666' },
        { value: 'NorthEast', label: 'NorthEast', color: '666666' }


    ];
    const months = [
        { value: 'January', label: 'JAN', color: '#00B8D9' },
        { value: 'February', label: 'FEB', color: '#0052CC' },
        { value: 'March', label: 'MAR', color: '#5243AA' },
        { value: 'April', label: 'APR', color: '#FF5630', },
        { value: 'May', label: 'MAY', color: '#FF8B00' },
        { value: 'June', label: 'JUNE', color: '#FFC400' },
        { value: 'July', label: 'JUL', color: '#36B37E' },
        { value: 'August', label: 'AUG', color: '#00875A' },
        { value: 'September', label: 'SEP', color: '#253858' },
        { value: 'October', label: 'OCT', color: '#666666' },
        { value: 'November', label: 'NOV', color: '#666666' },
        { value: 'December', label: 'DEC', color: '#666666' },

    ];
    const Lead_type = [
        { value: 'Active', label: 'Active', color: '#00B8D9' },
        { value: 'Hot', label: 'Hot', color: '#0052CC' },
        { value: 'Cold', label: 'Cold', color: '#5243AA' },
        { value: 'Dump', label: 'Dump', color: '#FF5630', },
        { value: 'Converted', label: 'Converted', color: '#FF5630', },


    ];


    async function handlefilter() {
        var q;
        var today = new Date()
        // console.log(assign_date.length )
        var dateBelow = new Date(assign_date[0])
        try {
            dateBelow.setDate(dateBelow.getDate() + 1)
        }
        catch (e) { console.log(e) }
        var currentMonth = moment(today).format('MMMM')
        if (Destination.length > 1) {
            if (lead.length != 0 && month.length != 0 && assign_date != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination),
                    where("Lead_Status", "==", lead[0]),
                    where("month", "==", month[0]),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),

                );
            }
            else if (lead.length != 0 && month.length != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination),
                    where("month", "==", month[0]),
                    where("Lead_Status", "==", lead[0]),


                );
            }
            else if (lead.length != 0 && assign_date.length != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),
                    where("Lead_Status", "==", lead[0]),


                );
            }
            else if (month.length != 0 && assign_date.length != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),
                    where("month", "==", month[0]),


                );
            }
            else if (month.length != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination), where("month", "==", month[0]),


                );
            }
            else if (lead.length != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination), where("Lead_Status", "==", lead[0]),


                );
            }
            else if (assign_date.length != 0) {
                q = query(collection(db, "Trip"), where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),


                );
            }
            else if (Destination.length != 0) {
                q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", user),
                    where('Destination', 'in', Destination), where("month", "==", currentMonth),


                );
            }
        }
        else if (month.length > 1) {
            if (Destination.length != 0 && lead.length != 0 && assign_date.length != 0) {
                q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),
                    where("Destination", "==", Destination[0]),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),
                    where("Lead_Status", "==", lead[0]),

                )
            }
            else if (Destination.length != 0 && assign_date.length != 0) {
                q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),
                    where("Destination", "==", Destination[0]),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),


                )
            }
            else if (Destination.length != 0 && lead.length != 0) {
                q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),
                    where("Destination", "==", Destination[0]),
                    where("Lead_Status", "==", lead[0]),


                )
            }
            else if (Destination.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),
                    where("Destination", "==", Destination[0]),


                )
            }
            else if (lead.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),
                    where("Lead_Status", "==", lead[0]),


                )
            }
            else if (month.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),


                )
            }
            else if (assign_date.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("month", "in", month),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),


                )
            }

        }
        else if (lead.length > 1) {
            if (month.length != 0 && Destination.length != 0 && assign_date.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where("month", "==", month[0]),
                    where("Destination", "==", Destination[0]),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),


                );
            }
            else if (month.length != 0 && Destination.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where("month", "==", month[0]),
                    where("Destination", "==", Destination[0]),


                );
            }
            else if (month.length != 0 && assign_date.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where("month", "==", month[0]),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),


                );
            }
            else if (Destination.length != 0 && assign_date.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where("month", "==", currentMonth),
                    where("Destination", "==", Destination[0]),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),


                );
            }
            else if (month.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where("month", "==", month[0]),


                );
            }
            else if (Destination.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where("Destination", "==", Destination[0]),
                    where("month", "==", currentMonth),



                );
            }
            else if (assign_date.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    where('assigned_date_time', '>=', assign_date[0]),
                    where('assigned_date_time', '<', dateBelow),



                );
            }
            else if (lead.length != 0) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("Lead_Status", "in", lead),
                    limit(200),
                    orderBy("updated_last")
                    // where("month", "==", currentMonth),
                );
            }
        }
        else if (Destination.length == 1 && lead.length == 1 && month.length == 1 && assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("month", "==", month[0]),
                where("Lead_Status", "==", lead[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),


            )
        }
        else if (Destination.length == 1 && lead.length == 1 && assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("Lead_Status", "==", lead[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),


            )
        }
        else if (month.length == 1 && lead.length == 1 && assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("month", "==", month[0]),
                where("Lead_Status", "==", lead[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),


            )
        }
        else if (Destination.length == 1 && month.length == 1 && assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("month", "==", month[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),


            )
        }
        else if (Destination.length == 1 && lead.length == 1 && month.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("month", "==", month[0]),
                where("Lead_Status", "==", lead[0]),


            )
        }
        else if (Destination.length == 1 && lead.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("month", "==", currentMonth),
                where("Lead_Status", "==", lead[0]),


            )
        }
        else if (Destination.length == 1 && assign_date.length == 1) {
            console.log('yes', assign_date, dateBelow, Destination[0])
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),


            )
        }
        else if (Destination.length == 1 && month.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("month", "==", month[0]),


            )
        }
        else if (lead.length == 1 && month.length == 1) {
            const firstdate = new Date(`${month[0]} 1, ${new Date().getFullYear()}`);
            const lastdate = new Date(`${month[0]} 1, ${new Date().getFullYear()}`);
            const month = lastdate.getMonth();
            lastdate.setMonth(month + 1);
            lastdate.setDate(0);
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Lead_Status", "==", lead[0]),
                where("month", "==", month[0]),
                where("updated_last", ">=", firstdate),
                where("updated_last", "<=", lastdate)


            )
        }
        else if (lead.length == 1 && assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Lead_Status", "==", lead[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),



            )
        }
        else if (month.length == 1 && assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("month", "==", month[0]),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),

            )
        }
        else if (Destination.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("Destination", "==", Destination[0]),
                where("month", "==", currentMonth),


            )
        }
        else if (lead.length == 1) {
            // console.log('trigger')
            if (lead[0].includes('Converted')) {
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    where("month", "==", currentMonth),
                    where("Lead_Status", "==", lead[0]),
                )
            }
            else {
            // console.log('trigger')
                // console.log('get',lead[0],currentMonth)
                q = query(collection(db, 'Trip'),
                    where("assign_to.uid", "==", user),
                    // where("month", "==", currentMonth),
                    where("Lead_Status", "==", lead[0]),


                )
            }
        }
        else if (month.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where("month", "==", month[0]),


            )
        }
        else if (assign_date.length == 1) {
            q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", user),
                where('assigned_date_time', '>=', assign_date[0]),
                where('assigned_date_time', '<', dateBelow),


            )
        }
        else if (Destination.length == 0 && lead.length == 0 && month.length == 0) {
            getLeadOnBoard()
        }

        try {
            let list = []
            var querySnapshot;
            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
                console.log('no data')
                setLead_data(list)
                setStatus(0)

            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(doc.data().TripId);
                });
                setLead_data(list)
                // console.log(list);
                setStatus(0)
                setopen(false)

            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }
    }
    function DestinationHandler(e) {
        // console.log(e)

        const list = []
        if (e.length > 0) {
            for (let len = 0; len <= e.length - 1; len++) {
                list.push(e[len].value)
            }
            SetDestination_list(list)
        }
        else if (e != 0) {
            list.push(e.value)
            SetDestination_list(list)
        }
        // queryDesigner(list)
        if (list.length == 0) {
            // datahandle()
            SetDestination_list(list)
        }
    }
    function monthHandler(e) {
        // console.log(e)
        const list = []
        if (e.length > 0) {
            for (let len = 0; len <= e.length - 1; len++) {
                list.push(e[len].value)
            }
            setMonths(list)
            // console.log(list)
        }
        else if (e != 0) {
            list.push(e.value)
            setMonths(list)
        }

        else if (list.length == 0) {
            setMonths(list)
            // datahandle()
        }
    }
    function Assigner_monthHandler(e) {
        const list = []
        if (e.target.value) {
            // console.log(e.target.value)
            var date = new Date(e.target.value)
            list.push(date)
            setassign_month(list)
            // console.log(date)
            // console.log(moment(list[0]).format('YYYY-MM'))
        }
        else {
            setassign_month(list)
        }

    }
    function leadHandler(e) {
        // console.log(e)
        const list = []
        if (e.length > 0) {
            for (let len = 0; len <= e.length - 1; len++) {
                list.push(e[len].value)
            }
            setLead(list)
        }
        else if (e != 0) {
            list.push(e.value)
            setLead(list)
        }

        else if (list.length == 0) {
            // datahandle()
            setLead(list)
        }
    }

    return (
        <div>
            {
                props.auth ? <>
                    {
                        props.adminFlg ? <></>
                            : <>
                                <div className='global_search' >
                                    <button onClick={() => getLeadOnBoard()}>Refresh</button>
                                    <span style={{ background: 'yellow' }}>Lead= {lead_data.length}</span>
                                </div>
                            </>
                    }

                    <div className='filter'>
                        <div>
                            <label>Destination</label>
                            {
                                month.length > 1 || lead.length > 1 || assign_date.length > 1 ? <>
                                    <Select
                                        placeholder='Destination'
                                        className='select_opt'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        options={Destinations}
                                        onChange={(e) => DestinationHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Destination'
                                        className='select_opt'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={Destinations}
                                        onChange={(e) => DestinationHandler(e)}
                                    />


                                </>
                            }


                        </div>
                        <div>
                            <label>Month</label>
                            {
                                Destination.length > 1 || lead.length > 1 || assign_date.length > 1 ? <>
                                    <Select
                                        placeholder='Month'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        options={months}
                                        onChange={(e) => monthHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Month'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={months}
                                        onChange={(e) => monthHandler(e)}
                                    />


                                </>

                            }


                        </div>
                        <div className='assignDatePicker'>
                            <label>Month of assign</label>
                            <input type={'date'} onChange={(e) => Assigner_monthHandler(e)}></input>

                        </div>
                        <div>
                            <label>Lead Type</label>
                            {
                                Destination.length > 1 || month.length > 1 || assign_date.length > 1 ? <>
                                    <Select
                                        placeholder='Lead'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        options={Lead_type}
                                        onChange={(e) => leadHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Lead'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={Lead_type}
                                        onChange={(e) => leadHandler(e)}
                                    />
                                </>

                            }


                        </div>
                        <div className='Searchbutton' onClick={() => handlefilter()}>
                            <img src='/assets/img/search.png' height={'48px'} />

                        </div>
                    </div>
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
                            {/* {
                        lead_data.map((info, index) => (
                            <Boxs key={index} data={info} />
                        ))
                    } */}
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table" style={{ width: "99%" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Trip Id</TableCell>
                                            <TableCell align="right">Name</TableCell>
                                            <TableCell align="right">Lead Status</TableCell>
                                            <TableCell align="right">Destination</TableCell>
                                            <TableCell align="right">Departure City</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lead_data &&
                                            (lead_data.slice(0).reverse()).map((row, index) => (
                                                <Row
                                                    auth={props.auth}
                                                    profile={props.profile}
                                                    key={index}
                                                    row={row}
                                                    getLeadOnBoard={getLeadOnBoard}
                                                    updateTableDataAfterConversion={updateTableDataAfterConversion}
                                                // datahandle={datahandle}
                                                />
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </>
                    }
                </> : <>
                    <div className='no_data'></div>
                </>
            }


        </div>
    );
}

export default FollowUp;
