import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import { Modal } from '@material-ui/core';
import { DynamicBarChart } from 'react-dynamic-charts';
import "react-dynamic-charts/dist/index.css";
import React, { useEffect, useState } from 'react';
import app from '../../required';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
const db = getFirestore(app);

const Investigation = ({ uid, TeamProfile }) => {
    var date = new Date()
    const [data_Analysed, setdata_Analysed] = useState([])
    const [prevMonth, setPrevMonth] = useState([])
    const [dataLoaded, loadData] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const [member, setmember] = useState()
    // var graphData = []
    const [currentMonth, setmonth] = useState(moment(date).format('MMMM'))
    async function fetch_profile() {
        // console.log(args)
        try {
            const docRef = doc(db, "Profile", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log(docSnap.data())
                setmember(docSnap.data())
            }
        }
        catch (error) {
            console.log({ error })
        }


    }
    async function getConvertedByAllSpokes(AllUserprofile) {
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].label, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].value),
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
        // setdataAvailablityFlg(true)

    }
    async function getPrevMonthConvertedByAllSpokes(AllUserprofile) {
        var datePrev = moment(date).subtract(1, 'month').calendar()
        var month = moment(datePrev).format('MMMM')
        var holdAlluserAnalytics = []
        // console.log(AllUserprofile)
        for (var i = 0; i < AllUserprofile.length; i++) {
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var user_analytics = { id: i, label: AllUserprofile[i].label, value: 0, color: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", AllUserprofile[i].value),
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
        // setdataAvailablityFlg(true)

    }
    async function currentLead() {
        var local = { name: 'Create quote', value: 0, fill: 'yellow' }
        var prev_instance = dataLoaded
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', '!=', 'Dump'), where("month", "==", currentMonth)
            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            // console.log(prev_instance)
            prev_instance.push(local)
            loadData(prev_instance)

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    async function followUp() {
        var local = { name: 'followUp', value: 0, fill: 'green' }
        var prev_instance = dataLoaded
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', 'not-in', ['Dump', 'Converted']), where("quotation_flg", "==", true));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            // console.log(prev_instance)
            prev_instance.push(local)
            loadData(prev_instance)


        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
        }

    }
    async function Dump() {
        var local = { name: 'dump', value: 0, fill: 'red' }
        var prev_instance = dataLoaded
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', 'in', ['Dump']), where("quotation_flg", "==", true), where("month", "==", currentMonth));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            // console.log(prev_instance)
            prev_instance.push(local)
            loadData(prev_instance)

        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
        }

    }
    async function Converted() {
        var local = { name: 'Converted', value: 0, fill: 'blue' }
        var prev_instance = dataLoaded
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', 'in', ['Converted']), where("quotation_flg", "==", true),
                where("month", "==", currentMonth));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            prev_instance.push(local)
            loadData(prev_instance)
            setdataAvailablityFlg(true)

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    function dataMiner() {
        getConvertedByAllSpokes(TeamProfile)
        getPrevMonthConvertedByAllSpokes(TeamProfile)
        currentLead()
        followUp()
        Dump()
        Converted()
    }
    useEffect(() => {
        if(uid!==0){
            fetch_profile()
            dataMiner()
        }


    }, []);
    return (
        <div>
            <div style={{ overflowY: 'scroll', height: '44rem' }}>
                <Modal open={!dataAvailablityFlg} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                    <>
                        <img src='/assets/pdfDefaultImage/loader.gif' width={'200px'} />
                    </>
                </Modal>

                {
                    dataAvailablityFlg ?
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                                <div>{
                                    uid != 0 ?
                                        <>
                                            <div>
                                                <h2>Target for {moment(new Date()).format('MMMM')}</h2>
                                                <span>{member.name}</span>
                                                <div>
                                                    <input type={'number'}></input>
                                                    <button>Update</button>
                                                </div>
                                            </div>
                                        </> : <></>
                                }</div>
                            </div>
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
                            </div>
                        </> : <></>
                }
            </div>
        </div>
    );
}

export default Investigation;
