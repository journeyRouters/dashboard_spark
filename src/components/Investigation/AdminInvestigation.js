import React from 'react';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import app from '../required';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from 'react';
import Investigation from './investigation';
import { useEffect } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import moment from 'moment';
import { Modal } from '@material-ui/core';
const db = getFirestore(app);


const AdminInvestigation = ({ profile }) => {
    const [data_Analysed, setdata_Analysed] = useState([])
    const [prevMonth, setPrevMonth] = useState([])
    const [AllUserprofile, setAllUserprofile] = useState([])
    const [Create_quote_data_Analysed, setCreate_quote_data_Analysed] = useState([])
    const [Hot_Lead_Analysed, set_Hot_Lead_Analysed] = useState([])
    const [Active_Lead_Analysed, set_Active_Lead_Analysed] = useState([])
    const [Converted_Lead_Analysed, set_Converted_Lead_Analysed] = useState([])
    const [Pre_prevMonth, setPre_PrevMonth] = useState([])
    const [Dump_Lead_Analysed, set_Dump_Lead_Analysed] = useState([])
    const [Total_Lead_Analysed, set_Total_Lead_Analysed] = useState([])
    const [currentMonth, setmonth] = useState(moment(new Date()).format('MMMM'))
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const [dataLoaded, loadData] = useState([])
    const [DetailGraphFlg, setDetailGraphFlg] = useState(false)
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"]), where('user_type', '==', 'show'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data().name)
            });
            setAllUserprofile(Profile)
            getPendingLead(Profile)
        });
    }
    async function getPendingLead(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        var local = { name: 'Create quote', value: 0, fill: 'yellow' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                user_analytics.value = list.length
                // console.log(list.length,local.value)
                local.value = local.value + list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        prev_instance.push(local)
        loadData(prev_instance)
        setCreate_quote_data_Analysed([
            {
                name: 'Lead to be quoted',
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getHotLeadData(AllUserprofile)


    }
    async function getHotLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        var local = { name: 'HoT', value: 0, fill: 'Green' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Hot'), where("quotation_flg", "==", true));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                user_analytics.value = list.length
                local.value = local.value + list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        prev_instance.push(local)
        loadData(prev_instance)
        set_Hot_Lead_Analysed([
            {
                name: 'Lead HoT',
                values: holdAlluserAnalytics
            }
        ])
        getActiveLeadData(AllUserprofile)

    }
    async function getActiveLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        var local = { name: 'Active', value: 0, fill: 'blue' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Active'), where("quotation_flg", "==", true));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                user_analytics.value = list.length
                local.value = local.value + list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        prev_instance.push(local)
        loadData(prev_instance)
        set_Active_Lead_Analysed([
            {
                name: 'Lead Active',
                values: holdAlluserAnalytics
            }
        ])
        getConvertedByAllSpokes(AllUserprofile)
        // setdataAvailablityFlg(true)

    }
    async function getConvertedByAllSpokes(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true), where("month", "==", currentMonth),);
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(doc.data())
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        setdata_Analysed([
            {
                name: `${currentMonth}-Conversion`,
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getPrevMonthConvertedByAllSpokes(AllUserprofile)
        // setdataAvailablityFlg(true)

    }
    async function getPrevMonthConvertedByAllSpokes(AllUserprofile) {
        var datePrev = moment(new Date()).subtract(1, 'month').calendar()
        var month = moment(datePrev).format('MMMM')
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true), where("month", "==", month),);
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(doc.data())
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(holdAlluserAnalytics)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        setPrevMonth([
            {
                name: `${month}-Conversion`,
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getPre_PrevMonthConvertedByAllSpokes(AllUserprofile)
        // setdataAvailablityFlg(true)

    }
    async function getPre_PrevMonthConvertedByAllSpokes(AllUserprofile) {
        var datePrev = moment(new Date()).subtract(2, 'month').calendar()
        var month = moment(datePrev).format('MMMM')
        console.log(month)
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true), where("month", "==", month),);
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(doc.data())
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(holdAlluserAnalytics)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        setPre_PrevMonth([
            {
                name: `${month}-Conversion`,
                values: holdAlluserAnalytics
            }
        ])
        getConvertedLeadData(AllUserprofile)
        // console.log(holdAlluserAnalytics)
        // setdataAvailablityFlg(true)

    }
    async function getConvertedLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        var local = { name: 'converted', value: 0, fill: '#814fdc' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true), where("month", "==", currentMonth));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                user_analytics.value = list.length
                local.value = local.value + list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        prev_instance.push(local)
        loadData(prev_instance)
        set_Converted_Lead_Analysed([
            {
                name: 'Lead Converted',
                values: holdAlluserAnalytics
            }
        ])
        getDumpLeadData(AllUserprofile)
    }
    async function getDumpLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Dump'), where("quotation_flg", "==", true), where("assigned_date_time", ">=", firstDay));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }

        set_Dump_Lead_Analysed([
            {
                name: 'Lead Dumped',
                values: holdAlluserAnalytics
            }
        ])
        getTotalLeadData(AllUserprofile)
    }
    async function getTotalLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid), where("assigned_date_time", ">=", firstDay));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                // console.log(list)
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
                // console.log(list)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }

        set_Total_Lead_Analysed([
            {
                name: 'Total lead Assigned',
                values: holdAlluserAnalytics
            }
        ])
        setdataAvailablityFlg(true)
    }
    useEffect(() => {
        getAllUserProfie()
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
                        data={dataLoaded}
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
                    <button onClick={() => setDetailGraphFlg(!DetailGraphFlg)}>Detail</button>
                    {
                        DetailGraphFlg ? <>
                            <div style={{ display: 'flex' }}>
                                <DynamicBarChart
                                    data={Create_quote_data_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                                <DynamicBarChart
                                    data={Hot_Lead_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                                <DynamicBarChart
                                    data={Active_Lead_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex' }}>

                                <DynamicBarChart
                                    data={Dump_Lead_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                                <DynamicBarChart
                                    data={Total_Lead_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                            </div>

                        </> : <></>
                    }
                    <div style={{ display: 'flex' }}>
                        <DynamicBarChart
                            data={data_Analysed}
                            // Timeout in ms between each iteration
                            iterationTimeout={1200}
                            startRunningTimeout={2500}
                            barHeight={20}
                            iterationTitleStyles={{
                                fontSize: 18
                            }}
                        />
                        <DynamicBarChart
                            data={prevMonth}
                            // Timeout in ms between each iteration
                            iterationTimeout={1200}
                            startRunningTimeout={2500}
                            barHeight={20}
                            iterationTitleStyles={{
                                fontSize: 18
                            }}
                        />
                        <DynamicBarChart
                            data={Pre_prevMonth}
                            // Timeout in ms between each iteration
                            iterationTimeout={1200}
                            startRunningTimeout={2500}
                            barHeight={20}
                            iterationTitleStyles={{
                                fontSize: 18
                            }}
                        />
                    </div>
                </> : <></>
            }

            {/* <Investigation profile={profile} /> */}
        </div>
    );
}

export default AdminInvestigation;
