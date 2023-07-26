import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
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
    const [StatusData, setStatusData] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const [member, setmember] = useState()
    const [lastTarget, setLastTarget] = useState([])
    const [Target, setTarget] = useState(0)
    var today = new Date();
    var counted = 0
    // const[noResponseCounter,setnoResponseCounter]=useState(localStorage.getItem('Counter'))
    const [currentMonth, setmonth] = useState(moment(date).format('MMMM'))

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
                var local = { name: '72 HR', value: counted, fill: '#ffef7d' }
                prev_instance.push(local)
                setStatusData(prev_instance)


            }
        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    function checkForLastUpdate(row) {
        if (row.updated_last) {
            var commentLimit = new Date(row.updated_last.toDate());
            commentLimit.setDate(commentLimit.getDate() + 3)
            // setLimit(commentLimit < today)
            if (commentLimit < today) {
                // var count = localStorage.getItem('Counter')
                // localStorage.setItem('Counter', count+1);
                counted++
            }

        }
    }

    async function fetch_profile() {
        try {
            const docRef = doc(db, "Profile", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setmember(docSnap.data())
                lastTargets(docSnap.data())

            }
        }
        catch (error) {
            console.log({ error })
        }


    }
    async function getConvertedByAllSpokes(AllUserprofile) {
        var holdAlluserAnalytics = []
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
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)


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

    }
    async function getPrevMonthConvertedByAllSpokes(AllUserprofile) {
        var datePrev = moment(date).subtract(1, 'month').calendar()
        var month = moment(datePrev).format('MMMM')
        var holdAlluserAnalytics = []
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
                });
                user_analytics.value = list.length
                holdAlluserAnalytics.push(user_analytics)


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
        setdataAvailablityFlg(true)

    }
    async function currentLead() {
        var local = { name: 'Create quote', value: 0, fill: 'yellow' }
        var prev_instance = dataLoaded
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("assign_to.uid", "==", uid),
                where("quotation_flg", "==", false),
                where('Lead_Status', '!=', 'Dump')
            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
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
            prev_instance.push(local)
            loadData(prev_instance)


        }
        catch (erorr) {
            console.log(erorr)
            // setopen(false)
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

    }
    async function Dump() {
        var local = { name: 'dump', value: 0, fill: 'red' }
        var prev_instance = dataLoaded
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        try {
            let list = []
            var q = query(collection(db, "Trip"),
                where("assign_to.uid", "==", uid),
                where('Lead_Status', '==', 'Dump'),
                where("quotation_flg", "==", true),
                where("updated_last", ">=", firstDay));
            var querySnapshot;

            querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            local.value = list.length
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

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    function OnsubmitTarget() {
        if (Target != 0 && Target > 0) {
            var month = moment(new Date()).format('MMMM-YYYY')
            setDoc(doc(db, "Profile", uid), {
                Target: { [month]: Target }
            }, { merge: true })
            fetch_profile()
            setTarget(0)
        }
        else {
            alert('Target should be greater than "0"')
        }

    }
    function lastTargets(member) {
        var localList = []
        Object.entries(member.Target).forEach(([key, value]) => {
            var localObject = { Key: '', value: '' }
            localObject.Key = key
            localObject.value = value
            localList.push(localObject)
        });
        setLastTarget(localList)
    }
    function dataMiner() {
        currentLead()
        followUp()
        Dump()
        Converted()
        HotLead()
        getLeadOnBoard()
    }
    useEffect(() => {
        if (uid !== 0) {
            fetch_profile()
            dataMiner()
        }
        getConvertedByAllSpokes(TeamProfile)
        getPrevMonthConvertedByAllSpokes(TeamProfile)

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
                            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '2rem' }}>
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
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Bar
                                        dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
                                </BarChart>
                                <div>
                                    <BarChart
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
                                    </BarChart>
                                </div>
                                <div>{
                                    uid != 0 ?
                                        <>
                                            <div>
                                                <h2>Target for {moment(new Date()).format('MMMM')}</h2>
                                                <span>{member.name}</span>
                                                <div>
                                                    <input value={Target} onChange={(e) => setTarget(e.target.value)} type={'number'}></input>
                                                    <button onClick={() => OnsubmitTarget()}>Update</button>
                                                </div>
                                                <div style={{ height: '4rem', overflowY: 'scroll' }}>
                                                    {
                                                        lastTarget.map((data, index) => <><span>{(data.Key)}- {data.value}</span><br /></>)
                                                    }
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
