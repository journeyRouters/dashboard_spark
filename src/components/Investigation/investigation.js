import { Modal } from '@material-ui/core';
import { DynamicBarChart } from 'react-dynamic-charts';
import "react-dynamic-charts/dist/index.css";
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import app from '../required';
const db = getFirestore(app);

const Investigation = ({ profile }) => {
    var date = new Date()
    const [data_Analysed, setdata_Analysed] = useState([])
    const[prevMonth,setPrevMonth]=useState([])
    const [dataLoaded, loadData] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    // var graphData = []
    const [currentMonth, setmonth] = useState(moment(date).format('MMMM'))
    const [AllUserprofile, setAllUserprofile] = useState([])
    // console.log(moment(date).subtract(1, 'month').calendar())
  
    function getAllUserProfie() {
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User","Team Leader"]), where('user_type', '==', 'show'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const Profile = [];
            querySnapshot.forEach((doc) => {
                Profile.push(doc.data());
                // console.log(doc.data().name)
            });
            setAllUserprofile(Profile)
            // console.log(Profile,);
            getPrevMonthConvertedByAllSpokes(Profile)
            getConvertedByAllSpokes(Profile)


        });
    }
    async function getPrevMonthConvertedByAllSpokes(AllUserprofile) {
        var datePrev=moment(date).subtract(1, 'month').calendar()
        var month=moment(datePrev).format('MMMM')
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
        setdataAvailablityFlg(true)

    }
    async function currentLead() {
        var local = { name: 'Create quote', value: 0, fill: 'yellow' }
        var prev_instance = dataLoaded
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", profile.uid), where('Lead_Status', '!=', 'Dump'), where("quotation_flg", "==", false));
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
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", profile.uid),
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
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", profile.uid),
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
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", profile.uid),
                where('Lead_Status', 'in', ['Converted']), where("quotation_flg", "==", true),
                where("month", "==", currentMonth));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
            // console.log(prev_instance)
            prev_instance.push(local)
            loadData(prev_instance)
            count_total_lead_provided()

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    function count_total_lead_provided() {
        var prev_instance = dataLoaded
        var local = { name: 'Total', value: 0, fill: '#6AA121' }
        var total = 0
        prev_instance.forEach((item, index) => {
            total = total + item.value
        })
        local.value = total
        prev_instance.push(local)
        loadData(prev_instance)
    }

    function dataMiner() {
        getAllUserProfie()
        currentLead()
        followUp()
        Dump()
        Converted()

    }
    useEffect(() => {

        dataMiner()

    }, []);
    // const demodata = [
    //     {
    //         name: 'kishor',
    //         value: 10
    //     },
    //     {
    //         name: 'ram',
    //         value: 125
    //     },
    //     {
    //         name: 'rohit',
    //         value: 22
    //     },
    //     {
    //         name: 'tezal',
    //         value: 133
    //     },
    //     {
    //         name: 'rana',
    //         value: 17
    //     },
    //     {
    //         name: 'akash',
    //         value: 170
    //     },
    //     {
    //         name: 'singh',
    //         value: 101
    //     },
    //     {
    //         name: 'tezal',
    //         value: 177
    //     }
    // ]

    return (

        <div className='investigation'>
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
                    {/* <PieChart width={400} height={400}>
                        <Pie
                            dataKey="value"
                            isAnimationActive={false}
                            data={dataLoaded}
                            cx={200}
                            cy={200}
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        />

                        <Tooltip />
                    </PieChart> */}
                    {/* <LineChart width={730} height={250} data={dataLoaded}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }}/>
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    </LineChart> */}
                    {/* <LineChart width={600} height={300} data={demodata} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                    </LineChart> */}
                    <div style={{display:'flex'}}>
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
    );
}

export default Investigation;
