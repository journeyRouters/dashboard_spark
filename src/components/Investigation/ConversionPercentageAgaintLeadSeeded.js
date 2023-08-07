import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import app from '../required';
const db = getFirestore(app);

const ConversionPercentageAgaintLeadSeeded = () => {
    const [currentMonth, setmonth] = useState(moment(new Date()).format('MMMM'))
    const [dataLoaded, loadData] = useState([])
    const [LeadSeeded, setLeadSeeded] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(true)
    const [totaluser, settotaluser] = useState([])

    function getAllUserProfie() {
        var list = []
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"]), where("user_type", "==", "show"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            settotaluser(list)
            findAssignedLeads(list)
        });
    }
    function findAssignedLeads(totaluser) {
        var month = moment(new Date()).format('MMMM-YYYY')
        var date = new Date();
        var CurrentdateOfMonth = new Date()
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firstDateOfMonth = new Date(CurrentdateOfMonth.getFullYear(), date.getMonth(), 1);
        var diff = parseInt((CurrentdateOfMonth - firstDateOfMonth) / (1000 * 60 * 60 * 24))
        totaluser.forEach(async (item, index) => {
            var prev_instance = LeadSeeded
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            try {
                var list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", item.uid),
                    where('assigned_date_time', '>=', firstDay));
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                    // console.log(doc.data())
                });
                var userConversionPercentage = { id: item.uid, label: item.name, value: Math.round((list.length) / diff), color: randomColor }
                prev_instance.push(userConversionPercentage)
                setLeadSeeded(prev_instance)
                findConversion(list.length, item.uid, item.name,)
            }
            catch (error) {
                console.log(error)
            }

        }
        )
        // console.log(LeadSeeded)

    }
    async function findConversion(SeededLead, uid, name) {
        var month = moment(new Date()).format('MMMM-YYYY')
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() + 6, 1);
        var list = []
        var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
            where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true), where("month", "==", currentMonth),);
        var querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        PercentageCalculator(name, list.length, SeededLead, uid)

    }
    function PercentageCalculator(name, convertedFile, SeededLead, uid) {
        // console.log(name, SeededLead, convertedFile)
        var percentage = Math.round((convertedFile / SeededLead) * 100)
        if (percentage != percentage || percentage === Infinity) {
            percentage = 0
        }
        // console.log(percentage)
        var prev_instance = dataLoaded
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        var userConversionPercentage = { id: uid, label: name, value: percentage, color: randomColor }
        prev_instance.push(userConversionPercentage)
        loadData(prev_instance)
        loadData([
            {
                name: ' Leads vs Conversion %',
                values: prev_instance
            }
        ])
    }
    useEffect(() => {
        if (totaluser.length == dataLoaded.length) {
            setdataAvailablityFlg(!dataAvailablityFlg)
        }
    }, [dataLoaded]);
    useEffect(() => {
        getAllUserProfie()
    }, []);
    return (
        <div style={{width:'30rem'}}>
            {
                dataAvailablityFlg ?
                    <DynamicBarChart
                        data={dataLoaded}
                        iterationTimeout={1200}
                        startRunningTimeout={2500}
                        barHeight={20}
                        iterationTitleStyles={{
                            fontSize: 18
                        }}
                    /> 
                    : <></>
            }
        </div>
    );
}

export default ConversionPercentageAgaintLeadSeeded;
