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
import './investigation.css'
import TotalLeadAssigned from './TotalLeadAssigned';
const db = getFirestore(app);


const AdminInvestigation = ({ }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const [data_Analysed, setdata_Analysed] = useState([])
    const [PaymentAwaited, setPaymentAwaited] = useState([])
    const [prevMonth, setPrevMonth] = useState([])
    const [AllUserprofile, setAllUserprofile] = useState([])
    const [Create_quote_data_Analysed, setCreate_quote_data_Analysed] = useState([])
    const [lastupdated72hr, setlastupdated72hr] = useState([])
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
    ////////////////////////////////////////////////////////////
    // below variables are for getting leads type i.e ConvertedLeadType,DirectLeadType,reapeateadLeadtype e.t.c
    const [LeadType, setLeadType] = useState()
    const [AlluserLeadType, setAlluserLeadType] = useState([])
    function handleSearch(e) {
        if (e == 'hide') {
            setdetailsFlg(false)
        }
        else if (e == 'show') {
            setdetailsFlg(true)
        }
    }
    // this getAllUserProfie function is fetching all user in Dashboard.
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"])
            , where("user_type", "==", "show")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
            });
            setAllUserprofile(Profile)
            GetLeadTypeAssignedToSales(Profile)
            getPendingLead(Profile)
        });
    }
    // this  GetPendingLead function is fetching all leads in create quotes and also the specific user's create qoute leads
    async function getPendingLead(AllUserprofile) {
        var holdAlluserAnalytics = []
        var local = { name: 'C.Q', value: 0, fill: 'yellow' }
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
                user_analytics.value = list.length
                local.value = local.value + list.length
                holdAlluserAnalytics.push(user_analytics)


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
                name: `'Lead to be quoted' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getcoldLeadData(AllUserprofile)


    }
    function checkForLastUpdate(LeadList) {
        var counted = 0
        LeadList.forEach((Lead) => {
            var today = new Date()
            if (Lead.updated_last) {
                var commentLimit = new Date(Lead.updated_last.toDate());
                commentLimit.setDate(commentLimit.getDate() + 3)
                // setLimit(commentLimit < today)
                if (commentLimit < today) {
                    counted++
                }

            }
        })
        return counted
    }
    // this unresponsedLead72hr is checking for those which have last update timestamp more than 72 hr
    async function unresponsedLead72hr(AllUserprofile) {
        var datePrev = moment(new Date()).subtract(2, 'month').calendar()
        var month = moment(datePrev).format('MMMM')
        var holdAlluserAnalytics = []
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true)
                );
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(doc.data())
                });
                user_analytics.value = checkForLastUpdate(list)
                holdAlluserAnalytics.push(user_analytics)
                // console.log(holdAlluserAnalytics)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        setlastupdated72hr([
            {
                name: `'72 hr' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        setdataAvailablityFlg(true)

    }
    //    this getPaymentawaitedLead function is fetching the leads which have status of payments Awaited
    async function getPaymentawaitedLead(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        var local = { name: 'P.A', value: 0, fill: 'cyna' }
        var prev_instance = dataLoaded
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where('Lead_Status', '==', 'Paymentawaited'));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                user_analytics.value = list.length
                local.value = local.value + list.length
                holdAlluserAnalytics.push(user_analytics)


            }
            catch (erorr) {
                console.log(erorr)
                // setopen(false)
            }
        }
        prev_instance.push(local)
        loadData(prev_instance)
        setPaymentAwaited([
            {
                name: `'Payment Awaited' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getConvertedLeadData(AllUserprofile)


    }
    //    this getHotLeadData function is fetching the leads which have status of Hot
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
                name: `'Lead HoT' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getPaymentawaitedLead(AllUserprofile)

    }
    //    this getActiveLeadData function is fetching the leads which have status of Active
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
                name: `'Lead Active' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getHotLeadData(AllUserprofile)
        // setdataAvailablityFlg(true)

    }
    // this getConvertedByAllSpokes function is fetching leads which have status of Converted/ specific all user
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
                name: `${currentMonth}-Conversion ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getdirectleadConvertedByAllSpokes(AllUserprofile)

    }
    // this getdirectleadConvertedByAllSpokes function is fetching Direct leads which have status of Converted/ specific all user
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
                    where("Campaign_code", "==", "Direct"),
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
                name: `${currentMonth}-Direct-Lead-Conversion ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getPrevMonthConvertedByAllSpokes(AllUserprofile)

    }
    // this getPrevMonthConvertedByAllSpokes function is fetching all the leads of specific user converted in previous month
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
                name: `${month}-Conversion ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        // console.log(holdAlluserAnalytics)
        getPre_PrevMonthConvertedByAllSpokes(AllUserprofile)
        // setdataAvailablityFlg(true)

    }
    //error this getPre_PrevMonthConvertedByAllSpokes function is fetching all the leads of specific user converted in two previous month
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
                name: `${month}-Conversion ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getTotalLeadData(AllUserprofile)
        // console.log(holdAlluserAnalytics)
        // setdataAvailablityFlg(true)

    }
    function filterDataFromProfile(uid) {
        /**this function is to filter the current user from the all user data */
        var profile_of_user = AllUserprofile.filter((data) => data.uid === uid)
        // console.log(profile_of_user)
        setCurrentuser(profile_of_user)

    }
    // error this getConvertedLeadData function is fetching all the leads of specific user converted in Current month
    async function getConvertedLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        var local = { name: 'convt', value: 0, fill: '#814fdc' }
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
                name: `'Lead Converted' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getDumpLeadData(AllUserprofile)
    }
    // this getDumpLeadData function is fetching all the leads of specific user Dumped in Current month
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
                name: `'Lead Dumped' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getAllStatusLeadData(AllUserprofile)
    }
    // this getAllStatusLeadData function fetching all status Leads except Dump for specific user
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
                name: `'Total In funnel'${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getConvertedByAllSpokes(AllUserprofile)
    }
    // this  getcoldLeadData function is fetching all leads having status of Cold and also the specific user's.
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
                name: `'Total Cold Leads' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        getActiveLeadData(AllUserprofile)
    }
    // this getTotalLeadData function total assigned to a specific user in a month.
    async function getTotalLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // console.log(firstDay)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].name, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"),
                    where("assign_to.uid", "==", AllUserprofile[i].uid),
                    where("assigned_date_time", ">=", firstDay));
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
            }
        }

        set_Total_Lead_Analysed([
            {
                name: `'Total lead Assigned' ${holdAlluserAnalytics.reduce((sum, item) => sum + item.value, 0)}`,
                values: holdAlluserAnalytics
            }
        ])
        unresponsedLead72hr(AllUserprofile)
    }
    async function GetLeadTypeAssignedToSales(AllUserprofile) {
        var TotalDirect = { name: 'Direct', value: 0, fill: 'blue' }
        var SalesDirect = { name: 'D-Sales', value: 0, fill: 'cyan' }
        var JRDirect = { name: 'D-JR', value: 0, fill: 'black' }
        var Repeated = { name: 'Repeated', value: 0, fill: 'green' }
        var Converted = { name: 'Converted', value: 0, fill: 'yellow' }
        var Premium = { name: 'Premium', value: 0, fill: 'pink' }
        function dataSetter(data, Type) {
            switch (Type) {
                case 'Direct':
                    TotalDirect.value += data;
                    break;
                case 'sales direct':
                    SalesDirect.value += data
                    break;
                case 'Jr direct':
                    JRDirect.value += data
                    break
                case 'Repeated':
                    Repeated.value += data;
                    break;
                case 'Converted':
                    Converted.value += data;
                    break;
                case 'Premium':
                    Premium.value += data;
                    break;
                default:
                    console.log('Unknown Type');
            }
        }
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        for (var i = 0; i < AllUserprofile.length; i++) {
            var q = query(collection(db, 'Trip'),
                where("assign_to.uid", "==", AllUserprofile[i].uid),
                where("Campaign_code", "in", ['Direct', 'Repeated', 'Premium', 'Converted']),
                where("assigned_date_time", ">=", firstDay)
            );
            try {
                var list = []
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((Docs) => {
                    list.push(Docs.data())
                })
                DataResolver(list, AllUserprofile[i].name, dataSetter, i)
            } catch (error) {
                console.log(error);
            }
        }
        let mergelist = [TotalDirect, SalesDirect, JRDirect, Repeated, Premium, Converted]
        setLeadType(mergelist)
    }
    function DataResolver(Data, Name, dataSetter, index) {
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        var userIndividual_analytics = { id: index, label: Name, value: 0, color: randomColor }
        if (Data.length > 0) {
            var Repeated = Data.filter(item => item.Campaign_code === "Repeated")
            dataSetter(Repeated.length, 'Repeated')
            var Direct = Data.filter(item => item.Campaign_code === "Direct")
            dataSetter(Direct.length, 'Direct')
            var SalesDirect = Data.filter(item => item.Campaign_code === "Direct" && item.InstaId === "Direct lead")
            dataSetter(SalesDirect.length, 'sales direct')
            var JrDirect = Data.filter(item => item.Campaign_code === "Direct" && item.InstaId != "Direct lead")
            dataSetter(JrDirect.length, 'Jr direct')
            var Converted = Data.filter(item => item.Campaign_code === "Converted")
            dataSetter(Converted.length, 'Converted')
            var Premium = Data.filter(item => item.Campaign_code === "Premium")
            dataSetter(Premium.length, 'Premium')

        }


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
                    <div className='TopBarChart'>
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
                        <BarChart
                            width={500}
                            height={300}
                            data={LeadType}
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
                            <YAxis type="number" domain={[0, 'dataMax+20']} />
                            <Tooltip />
                            <Legend legendType='circle' />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar
                                dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
                        </BarChart>
                    </div>
                    <button onClick={() => setDetailGraphFlg(!DetailGraphFlg)}>Detail</button>
                    {
                        DetailGraphFlg ? <>
                            <div style={{ display: 'flex', borderTop: '20px solid blue' }}>
                                <DynamicBarChart
                                    data={Create_quote_data_Analysed}
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
                            <div style={{ display: 'flex', borderTop: '20px solid pink' }}>

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
                                <div style={{ width: '100%' }}>
                                    <TotalLeadAssigned Total_Lead_Analysed={Total_Lead_Analysed} AllUserprofile={AllUserprofile} />
                                </div>
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
                            <div style={{ borderTop: '20px solid green', borderBottom: '20px solid yellow', display: 'flex' }}>
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
                                <DynamicBarChart
                                    data={lastupdated72hr}
                                    // Timeout in ms between each iteration
                                    iterationTimeout={1200}
                                    startRunningTimeout={2500}
                                    barHeight={20}
                                    iterationTitleStyles={{
                                        fontSize: 18
                                    }}
                                />
                                <DynamicBarChart
                                    data={PaymentAwaited}
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
                    <div style={{ display: 'flex', borderTop: '20px solid green' }}>
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
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', borderTop: '20px solid black' }}>
                        <ConversionPrecentage />
                        <ConversionPercentageAgaintLeadSeeded />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '-3rem', justifyContent: 'space-around', borderTop: '20px solid red', borderBottom: '10px solid cyan' }}>
                        <TotalLeadeSeeded />
                        <AvgLeadSeeded />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '20%', }}>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)} >
                            <option value={0}> assign to</option>
                            {
                                AllUserprofile.map((data, index) => (
                                    <option key={index} value={data.uid}>{data.name}</option>

                                ))
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
