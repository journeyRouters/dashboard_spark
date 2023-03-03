import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import app from '../../required';
import PieRechartComponent from './PieRechartComponent';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
const db = getFirestore(app);

const GraphHandler = ({ TeamData }) => {
    const [leadAssign, setLeadAssignedNumber] = useState([])
    const [convertedFile, setcountConverted] = useState([])
    const [DumpedByTeam, setDumped] = useState([])
    async function getLeadSeededInTeam() {
        var len = TeamData.TeamMembers.length
        var totalLeadSeeded = []
        for (var member = 0; member < len; member++) {
            var currentMonth = moment(new Date()).format('MMMM')
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var local = { name: '', value: 0, fill: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", TeamData.TeamMembers[member].value),
                    // where('Lead_Status', '!=', 'Dump'), 
                    where("month", "==", currentMonth)
                );
                var querySnapshot;

                querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                local.value = list.length
                local.name = (TeamData.TeamMembers[member].label)
                // prev_instance.push(local)
                // loadData(prev_instance)

            }
            catch (erorr) {
                console.log(erorr)
            }
            totalLeadSeeded.push(local)
        }
        setLeadAssignedNumber(totalLeadSeeded)
    }
    async function getLeadConvertedInTeam() {
        var len = TeamData.TeamMembers.length
        var totalConverted = []
        for (var member = 0; member < len; member++) {
            var currentMonth = moment(new Date()).format('MMMM')
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var local = { name: '', value: 0, fill: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", TeamData.TeamMembers[member].value),
                    where('Lead_Status', '==', 'Converted'),
                    where("month", "==", currentMonth)
                );
                var querySnapshot;

                querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                local.value = list.length
                local.name = TeamData.TeamMembers[member].label
                // prev_instance.push(local)
                // loadData(prev_instance)

            }
            catch (erorr) {
                console.log(erorr)
            }
            totalConverted.push(local)
        }
        setcountConverted(totalConverted)
    }
    async function getLeadDumpByTeam() {
        var len = TeamData.TeamMembers.length
        var totalDumped = []
        for (var member = 0; member < len; member++) {
            var currentMonth = moment(new Date()).format('MMMM')
            var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var local = { name: '', value: 0, fill: randomColor }
            try {
                let list = []
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", TeamData.TeamMembers[member].value),
                    where('Lead_Status', '==', 'Dump'),
                    where("month", "==", currentMonth)
                );
                var querySnapshot;

                querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                local.value = list.length
                local.name = TeamData.TeamMembers[member].label
                // prev_instance.push(local)
                // loadData(prev_instance)

            }
            catch (erorr) {
                console.log(erorr)
            }
            totalDumped.push(local)
        }
        setDumped(totalDumped)
    }
    useEffect(() => {
        getLeadSeededInTeam()
        getLeadConvertedInTeam()
        getLeadDumpByTeam()
    }, []);
    return (
        <div style={{ display: 'flex', }}>
            <div >
                <span style={{ marginLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Lead Seeded</span><br />
                <BarChart
                    width={270}
                    height={150}
                    data={leadAssign}
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
            <div>
                <span style={{ marginLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Lead Converted</span><br />
                <BarChart
                    width={270}
                    height={150}
                    data={convertedFile}
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
            <div>
                <span style={{ marginLeft: '1rem', fontSize: '1.1rem', fontWeight: '700' }}>Lead Dump</span><br />
                <BarChart
                    width={270}
                    height={150}
                    data={DumpedByTeam}
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
        </div>
    );
}

export default GraphHandler;
