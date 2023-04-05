import { Modal } from '@material-ui/core';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import { React, useEffect, useState } from 'react';
import "react-dynamic-charts/dist/index.css";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import app from '../required';

const CallerInvestigation = ({ profile }) => {
    const db = getFirestore(app);
    const [ConvertedByCaller, setConvertedByCaller] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const month = moment(new Date()).format('MMMM-YYYY')
    // console.log(month)
    const date = new Date()
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    async function ConvertedLead() {
        var local = { name: 'Converted', value: 0, fill: 'blue' }
        var prev_instance = ConvertedByCaller
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('callingStatus', '==', 'Converted'),
                where("CallingConversionMonth", "==", month));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            // console.log(list)
            local.value = list.length
            prev_instance.push(local)
            setConvertedByCaller(prev_instance)
            DumpLead()
        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    async function DumpLead() {
        var local = { name: 'Dumped', value: 0, fill: 'red' }
        var prev_instance = ConvertedByCaller
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('callingStatus', '==', 'Converted'),
                where('Lead_Status', '==', 'Dump'),
                where("updated_last_By_Caller", ">", firstDay));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setConvertedByCaller(prev_instance)
            ActiveLeads()

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    async function ActiveLeads() {
        var local = { name: 'Active', value: 0, fill: '#9DF242' }
        var prev_instance = ConvertedByCaller
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('callingStatus', '==', 'Converted'),
                where('Lead_Status', '==', 'Active'));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setConvertedByCaller(prev_instance)
            HotLead()
        }
        catch (erorr) {
            console.log(erorr)
        }

    }

    async function HotLead() {
        var local = { name: 'Hot', value: 0, fill: 'cyan' }
        var prev_instance = ConvertedByCaller
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('callingStatus', '==', 'Converted'),
                where('Lead_Status', '==', 'Hot'));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setConvertedByCaller(prev_instance)
            ColdLeads()

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    async function ColdLeads() {
        var local = { name: 'Cold', value: 0, fill: 'gray' }
        var prev_instance = ConvertedByCaller
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('callingStatus', '==', 'Converted'),
                where('Lead_Status', '==', 'Cold'));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setConvertedByCaller(prev_instance)
            ConvertedLeadBySales()
        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    async function ConvertedLeadBySales() {
        var local = { name: 'Sold', value: 0, fill: 'Green' }
        var prev_instance = ConvertedByCaller
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("caller.uid", "==", profile.uid),
                where('callingStatus', '==', 'Converted'),
                where('Lead_Status', '==', 'Converted'),
                where("month", "==", month));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            setConvertedByCaller(prev_instance)
            setdataAvailablityFlg(true)

        }
        catch (erorr) {
            console.log(erorr)
        }

    }

    useEffect(() => {
        ConvertedLead()
    }, []);
    return (
        <div>
            <Modal open={!dataAvailablityFlg} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <>
                    <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
                </>
            </Modal>

            {
                dataAvailablityFlg ? <>
                    <BarChart
                        width={500}
                        height={300}
                        data={ConvertedByCaller}
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
                        <Legend legendType='circle' />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                            dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
                    </BarChart>
                </> : <></>

            }
        </div>
    );
}

export default CallerInvestigation;
