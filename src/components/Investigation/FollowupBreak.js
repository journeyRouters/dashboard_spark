import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import "react-dynamic-charts/dist/index.css";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import app from '../required';
import { useEffect } from 'react';
const db = getFirestore(app);


const FollowupBreak = ({ uid }) => {
    const [StatusData, setStatusData] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    var counted = 0

    function checkForLastUpdate(row) {
        var today = new Date()
        if (row.updated_last) {
            var commentLimit = new Date(row.updated_last.toDate());
            commentLimit.setDate(commentLimit.getDate() + 2)
            // setLimit(commentLimit < today)
            if (commentLimit < today) {
                counted++
            }

        }
    }
    async function HotLead() {
        var local = { name: 'Hot', value: 0, fill: 'red' }
        var prev_instance = StatusData
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', '==', 'Hot'), where("quotation_flg", "==", true));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setStatusData(prev_instance)
            ColdLead()

        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
        }

    }
    async function getLeadOnBoard() {
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true)
            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                return
            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    checkForLastUpdate(doc.data())
                });
                // console.log(counted)
                var prev_instance = StatusData
                var local = { name: '72 Hr.', value: counted, fill: '#ffef7d' }
                prev_instance.push(local)
                setStatusData(prev_instance)


            }
        }
        catch (erorr) {
            console.log(erorr)
        }
        setdataAvailablityFlg(true)


    }
    async function ColdLead() {
        var local = { name: 'Cold', value: 0, fill: 'blue' }
        var prev_instance = StatusData
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', '==', 'Cold'), where("quotation_flg", "==", true));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setStatusData(prev_instance)
            ActiveLead()

        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
        }

    }
    async function ActiveLead() {

        var local = { name: 'Active', value: 0, fill: 'yellow' }
        var prev_instance = StatusData
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', '==', 'Active'), where("quotation_flg", "==", true));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setStatusData(prev_instance)
        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
        }
        getLeadOnBoard()

    }
    useEffect(() => {
        HotLead()
    }, []);
    return (
        <div>
            {
                dataAvailablityFlg ?
                    < BarChart
                        width={500}
                        height={300}
                        data={StatusData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                        barSize={30}
                    >
                        <XAxis
                            dataKey="name"
                            scale="point"
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                            dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
                    </BarChart> : <></>
            }
        </div >
    );
}

export default FollowupBreak;
