import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Row from '../quotation_follow_up/Row';
import app from '../required';
const db = getFirestore(app);

const Rapid = (props) => {
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    
    function updateTableDataAfterConversion(tripid) {
        var pre_tableData = lead_data
        var remaining_data = pre_tableData.filter((data) => data.TripId !== tripid)
        // console.log(remaining_data, pre_tableData)
        setLead_data(remaining_data)
    }
    async function getLeadOnBoard() {
        // console.log(props.target.uid)
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", props.auth.uid),
                where('Lead_Status', '==', 'Hot'), where("quotation_flg", "==", true)
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
    useEffect(() => {
        getLeadOnBoard()
    }, []);
    return (
        <div>
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
        </div>
    );
}

export default Rapid;
