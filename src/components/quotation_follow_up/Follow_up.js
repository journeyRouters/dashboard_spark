import { CircularProgress, makeStyles, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Row from './Row';
import './quote.css'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



const FollowUp = (props) => {
    const db = getFirestore(app);
    const [lead_data, setLead_data] = useState(props.adminFlg ? props.data : [])
    const [open, setopen] = useState(true)
    const [Destination, SetDestination_list] = useState([])
    const [month, setMonths] = useState([])
    const [lead, setLead] = useState([])
    const [agent, setagent] = useState([])
    const animatedComponents = makeAnimated();
    const [profile, setProfile] = useState(null)

    async function getOthersStatusLeadOnBoard(status) {
        // console.log(props.target.uid)
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
                console.log(list);
                setopen(false)
            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }
    async function getLeadOnBoard() {
        // console.log(props.target.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", props.auth.uid),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true)
            );
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
                console.log(list);
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
        console.log(remaining_data, pre_tableData)
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
        { value: 'Europe', label: 'Europe', color: '#FF5630', },
        { value: 'Sri Lanka', label: 'Sri Lanka', color: '#FF8B00' },
        { value: 'Mauritius', label: 'Mauritius', color: '#FFC400' },
        { value: 'Seychelles', label: 'Seychelles', color: '#36B37E' },
        { value: 'Vietnmam', label: 'Vietnmam', color: '#00875A' },
        { value: 'Malaysia', label: 'Malaysia', color: '#253858' },
        { value: 'Singapore', label: 'Singapore', color: '#666666' },
        { value: 'Australia', label: 'Australia', color: '#666666' },
        { value: 'New Zealand', label: 'New Zealand', color: '#666666' },
        { value: 'Kashmir', label: 'Kashmir', color: '#666666' },
        { value: 'Himachal', label: 'Himachal', color: '#666666' },
        { value: 'Rajasthan', label: 'Rajasthan', color: '#666666' },
        { value: 'Uttrakhand', label: 'Uttrakhand', color: '#666666' },
        { value: 'Goa', label: 'Goa', color: '#666666' },
        { value: 'Kerala', label: 'Kerala', color: '#666666' },
        { value: 'Andaman', label: 'Andaman', color: '#666666' },
        { value: 'Sikkim', label: 'Sikkim', color: '#666666' },
        { value: 'Karnataka', label: 'Karnataka', color: '#666666' },
        { value: "Manali", label: "Manali", color: '#666666' },
        { value: "Andaman", label: "Andaman", color: '666666' }
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
        { value: 'ACTIVE', label: 'ACTIVE', color: '#00B8D9' },
        { value: 'HOT', label: 'HOT', color: '#0052CC' },
        { value: 'In Progress', label: 'In Progress', color: '#5243AA' },
        { value: 'Book Now', label: 'Book Now', color: '#FF5630', },
        { value: 'Invoiced', label: 'Invoiced', color: '#FF8B00' },
        { value: 'My Hot', label: 'My Hot', color: '#FFC400' },
        { value: 'No Response', label: 'No Response', color: '#36B37E' },
        { value: 'Booker', label: 'Booker', color: '#00875A' },
        { value: 'Hidden Lead', label: 'Hidden Lead', color: '#253858' },
    ];
    const Agent = [
        { value: 'Nand', label: 'Nand', color: '#00B8D9' },
        { value: 'kishor', label: 'kishor', color: '#0052CC' },
        { value: 'kumar', label: 'kumar', color: '#5243AA' },
        { value: 'singh', label: 'singh', color: '#FF5630', },
        { value: 'verma', label: 'verma', color: '#FF8B00' },
        { value: 'jacove', label: 'jacove', color: '#FFC400' },

    ];

    function DestinationHandler(e) {
        const list = []
        for (let len = 0; len <= e.length - 1; len++) {
            list.push(e[len].value)
            // console.log(e[len].value)
        }
        SetDestination_list(list)


        // queryDesigner(list)
        if (list.length == 0) {
            // datahandle()
        }
    }
    function monthHandler(e) {
        console.log(e)
        const list = []
        if (e.length != 0) {
            for (let len = 0; len <= e.length - 1; len++) {
                list.push(e[len].value)
                // console.log(e[len].value)
            }
            setMonths(list)
            console.log(e.value)
        }

        else if (list.length == 0) {
            // datahandle()
        }
    }
    function leadHandler(e) {
        console.log(e)
        const list = []
        if (e.length != 0) {
            for (let len = 0; len <= e.length - 1; len++) {
                list.push(e[len].value)
                // console.log(e[len].value)
            }
            setLead(list)
            console.log(e.value)
        }

        else if (list.length == 0) {
            // datahandle()
        }
    }
    function AgentHandler(e) {
        console.log(e)
        const list = []
        if (e.length != 0) {
            for (let len = 0; len <= e.length - 1; len++) {
                list.push(e[len].value)
                // console.log(e[len].value)
            }
            setagent(list)
            console.log(e.value)
        }

        else if (list.length == 0) {
            // datahandle()
        }
    }
    return (
        <div>
            {
                props.auth ? <>
                    <div className='global_search' >

                        <button onClick={() => getLeadOnBoard()}>Refresh</button>
                        <span style={{background:'yellow'}}>Lead= {lead_data.length}</span>
                        <select onChange={(e) => getOthersStatusLeadOnBoard(e.target.value)}>
                            <option>select</option>
                            <option value='Dump'>Dump</option>
                            <option value='Cold'>cold</option>
                            <option value='Active'>Active</option>
                            <option value='Hot'>Hot</option>
                        </select>


                    </div>

                    <div className='filter'>
                        <div>
                            <label>Destination</label>
                            {
                                month.length > 1 || lead.length > 1 || agent.length > 1 ? <>
                                    <Select
                                        placeholder='Destination'
                                        className='select_opt'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        // isMulti
                                        options={Destinations}
                                    // onChange={(e) => DestinationHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Destination'
                                        className='select_opt'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={Destinations}
                                    // onChange={(e) => DestinationHandler(e)}
                                    />


                                </>
                            }


                        </div>
                        <div>
                            <label>Month of travel</label>
                            {
                                Destination.length > 1 || lead.length > 1 || agent.length > 1 ? <>
                                    <Select
                                        placeholder='Month'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        // isMulti
                                        options={months}
                                    // onChange={(e) => monthHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Month'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={months}
                                    // onChange={(e) => monthHandler(e)}
                                    />


                                </>

                            }


                        </div>
                        <div>
                            <label>Lead Type</label>
                            {
                                Destination.length > 1 || month.length > 1 || agent.length > 1 ? <>
                                    <Select
                                        placeholder='Lead'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        // isMulti
                                        options={Lead_type}
                                    // onChange={(e) => leadHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Lead'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={Lead_type}
                                    // onChange={(e) => leadHandler(e)}
                                    />
                                </>

                            }


                        </div>
                        <div>
                            <label>Agent</label>
                            {
                                Destination.length > 1 || month.length > 1 || lead.length > 1 ? <>
                                    <Select
                                        placeholder='Agent'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        // isMulti
                                        options={Agent}
                                        onChange={(e) => AgentHandler(e)}
                                    />
                                </> : <>

                                    <Select
                                        placeholder='Agent'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={Agent}
                                        onChange={(e) => AgentHandler(e)}
                                    />

                                </>
                            }


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
                                            <TableCell>Trip</TableCell>
                                            <TableCell align="right">Name</TableCell>
                                            <TableCell align="right">Lead Status</TableCell>
                                            <TableCell align="right">Destination</TableCell>
                                            <TableCell align="right">Departure City</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lead_data &&
                                            lead_data.map((row, index) => (
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
