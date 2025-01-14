import { Modal } from '@material-ui/core';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import "react-dynamic-charts/dist/index.css";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import app from '../required';
const db = getFirestore(app);

const Freelance_Investigation = ({  }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    var date = new Date()
    const [data_Analysed, setdata_Analysed] = useState([])
    const [dataLoaded, loadData] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    // var graphData = []
    const [currentMonth, setmonth] = useState(moment(date).format('MMMM'))

   
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
                where('Lead_Status', 'not-in', ['Dump', 'Converted','Cancel']), where("quotation_flg", "==", true));
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
            prev_instance.push(local)
            loadData(prev_instance)
            count_total_lead_provided()

        }
        catch (erorr) {
            console.log(erorr)
        }

    }
    function count_total_lead_provided(){
        var prev_instance = dataLoaded
        var local = { name: 'Total', value: 0, fill: '#6AA121' }
        var total=0
        prev_instance.forEach((item,index)=>{
            total=total+item.value
        })
        local.value=total
        prev_instance.push(local)
        loadData(prev_instance)
        setdataAvailablityFlg(!dataAvailablityFlg)

    }

    function dataMiner() {
        currentLead()
        followUp()
        Dump()
        Converted()

    }
    useEffect(() => {

        dataMiner()

    }, []);
    

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
                </> : <></>
            }
        </div>
    );
}

export default Freelance_Investigation;
