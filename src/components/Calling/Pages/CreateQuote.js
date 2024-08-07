import { CircularProgress, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Row from '../../quotation_follow_up/Row';
import app from '../../required';

const CreateQuote = ({ }) => {
    const [lead_data, setLead_data] = useState([])
    const profile = JSON.parse(localStorage.getItem('profile'));
    const Auth = JSON.parse(localStorage.getItem('auth'));
    const db = getFirestore(app);
    const [open, setopen] = useState(true)
    async function getLeadOnBoard() {
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                // where('Lead_Status', '==', 'Dump'),
                where('callingStatus', 'not-in', ['Cold', 'Dump', 'Active', 'Hot', 'Converted'])
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
                setopen(false)
            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }
    // function update(tripid) {
    //     setDoc(doc(db, "Trip", tripid), {
    //         callingStatus: 'Dump'
    //     }, { merge: true })
    // }

    function updateTableDataAfterUpdate(tripid) {
        var pre_tableData = lead_data
        var remaining_data = pre_tableData.filter((data) => data.TripId !== tripid)
        setLead_data(remaining_data)
    }
    useEffect(() => {
        getLeadOnBoard()

    }, [])

    return (
        <>
            {
                Auth ? <>
                    <div className='global_search' >
                        <span style={{ background: 'yellow' }}>Lead= {lead_data.length}</span>

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
                                            (lead_data.slice(0).reverse()).map((row, index) => (
                                                <Row
                                                    auth={Auth}
                                                    profile={profile}
                                                    key={index}
                                                    row={row}
                                                    getLeadOnBoard={getLeadOnBoard}
                                                    updateTableDataAfterUpdate={updateTableDataAfterUpdate}
                                                    Caller={1}
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

        </>
    );
}

export default CreateQuote;
