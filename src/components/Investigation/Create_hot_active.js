import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import app from '../required';
const db = getFirestore(app);

function Create_hot_active({ AllUserprofile,loadData ,dataLoaded}) {
    const [Create_quote_data_Analysed, setCreate_quote_data_Analysed] = useState([])
    const [Hot_Lead_Analysed, set_Hot_Lead_Analysed] = useState([])
    const [Active_Lead_Analysed, set_Active_Lead_Analysed] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    async function getPendingLead(AllUserprofile) {
        var holdAlluserAnalytics = []
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
        getHotLeadData(AllUserprofile)
    }
    async function getHotLeadData(AllUserprofile) {
        var holdAlluserAnalytics = []
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
        setdataAvailablityFlg(true)

    }
    useEffect(() => {
        getPendingLead(AllUserprofile)
    })
    return (
        <div style={{ display: 'flex' }}>
            {
                dataAvailablityFlg ? <>

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
                    {/* <div style={{ display: 'flex' }}>

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
                    <div>
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
                    </div> */}
                </> : null
            }
        </div>
    );
}

export default Create_hot_active;