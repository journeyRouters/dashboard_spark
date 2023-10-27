import { Modal } from '@material-ui/core';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import app from '../required';
import CurrentMonthcharts from './CurrentMonthcharts';
import OverallChart from './OverallChart';
import ConversionPrecentage from './ConversionPrecentage';
import ConversionPercentageAgaintLeadSeeded from './ConversionPercentageAgaintLeadSeeded';
import TotalLeadeSeeded from './TotalLeadSeeded';
import AvgLeadSeeded from './AvgLeadSeeded';
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
    const [Cold_Lead_Analysed, set_Cold_Lead_Analysed] = useState([])
    const [AllStatus_Lead_Analysed, set_AllStatus_Lead_Analysed] = useState([])
    const [Total_Lead_Analysed, set_Total_Lead_Analysed] = useState([])
    const [currentMonth, setmonth] = useState(moment(new Date()).format('MMMM'))
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const [dataLoaded, loadData] = useState([])
    const [DetailGraphFlg, setDetailGraphFlg] = useState(false)
    const [currentUser, setCurrentuser] = useState(null)
    const [detailsFlg, setdetailsFlg] = useState(false)
    const [DirectLead, setDirectLead] = useState([])

    function handleSearch(e) {
        if (e == 'hide') {
            setdetailsFlg(false)
        }
        else if (e == 'show') {
            setdetailsFlg(true)
        }
    }
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"]));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data())
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
        getdirectleadConvertedByAllSpokes(AllUserprofile)

    }
    async function getdirectleadConvertedByAllSpokes(AllUserprofile) {
        var holdAlluserAnalytics = []
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Converted'),
                    where("quotation_flg", "==", true),
                    where("Campaign_code","==","Direct"),
                    where("month", "==", currentMonth),);
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)
            }
            catch (erorr) {
                console.log(erorr)
            }
        }
        setDirectLead([
            {
                name: `${currentMonth}-Direct-Lead-Conversion`,
                values: holdAlluserAnalytics
            }
        ])
        getPrevMonthConvertedByAllSpokes(AllUserprofile)

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
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = AllUserprofile.filter((data) => data.uid === uid)
        // console.log(profile_of_user)
        setCurrentuser(profile_of_user)

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
        var local = { name: 'Dump', value: 0, fill: '#FF0000' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Dump'), where("quotation_flg", "==", true), where("updated_last", ">=", firstDay));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(moment(doc.data().updated_last.toDate()).format('DD-MMM-YYYY'))
                });
                // console.log(list, firstDay)
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
        set_Dump_Lead_Analysed([
            {
                name: 'Lead Dumped',
                values: holdAlluserAnalytics
            }
        ])
        getAllStatusLeadData(AllUserprofile)
    }
    async function getAllStatusLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', 'in', ['Active', 'Cold', 'Hot']),);
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

        set_AllStatus_Lead_Analysed([
            {
                name: 'Total In funnel',
                values: holdAlluserAnalytics
            }
        ])
        getcoldLeadData(AllUserprofile)
    }
    async function getcoldLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        var date = new Date();
        var local = { name: 'Cold', value: 0, fill: '#814fdc' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Cold'), where("quotation_flg", "==", true));
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
        set_Cold_Lead_Analysed([
            {
                name: 'Total Cold Leads',
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
                        <YAxis type="number" domain={[0, 'dataMax+100']} />
                        <Tooltip />
                        <Legend legendType='circle' />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar
                            dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
                    </BarChart>
                    <button onClick={() => setDetailGraphFlg(!DetailGraphFlg)}>Detail</button>
                    {
                        DetailGraphFlg ? <>
                            <div style={{ display: 'flex',borderTop:'20px solid blue' }}>
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
                            <div style={{ display: 'flex',borderTop:'20px solid pink'  }}>

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
                                <DynamicBarChart
                                    data={AllStatus_Lead_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                            </div>
                            <div style={{borderTop:'20px solid green',borderBottom:'20px solid yellow'  }}>
                                <DynamicBarChart
                                    data={Cold_Lead_Analysed}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                            </div>
                            <div style={{ width: "60%", }}>
                                <DynamicBarChart
                               
                                    data={DirectLead}
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
                    <div style={{ display: 'flex',borderTop:'20px solid green'  }}>
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around',borderTop:'20px solid black'  }}>
                        <ConversionPrecentage />
                        <ConversionPercentageAgaintLeadSeeded />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '-3rem', justifyContent: 'space-around',borderTop:'20px solid red',borderBottom:'10px solid cyan'   }}>
                        <TotalLeadeSeeded />
                        <AvgLeadSeeded />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '20%', }}>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)} >
                            <option value={0}> assign to</option>
                            {
                                AllUserprofile.map((data, index) => (<>
                                    <option key={index} value={data.uid}>{data.name}</option>

                                </>))
                            }
                        </select>
                        {
                            detailsFlg ?
                                <button onClick={() => handleSearch('hide')}>Hide</button> :
                                <button onClick={() => handleSearch('show')}>Show</button>
                        }
                    </div>

                    <div>
                        {
                            detailsFlg ? <>
                                <h2>CurrentMonthcharts</h2>
                                <CurrentMonthcharts currentUser={currentUser} />
                                <h2>OverallChart</h2>
                                <OverallChart currentUser={currentUser} />

                            </> : <></>
                        }
                    </div>
                </> : <></>
            }

            {/* <Investigation profile={profile} /> */}
        </div>
    );
}

export default AdminInvestigation;
