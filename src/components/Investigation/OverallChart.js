import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import moment from 'moment';
import { default as React,  useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import app from '../required';
import './investigation.css';
const db = getFirestore(app);

const OverallChart = ({ currentUser }) => {
    // console.log(currentUser[0])
    const [loading, setLoading] = useState(true)
    const [Totaldata, setTotaldata] = useState()
    const [dataDump, setDataDump] = useState()
    const [dataActive, setdataActive] = useState()
    const [dataCold, setdataCold] = useState()
    const [dataHot, setdataHot] = useState()
    const [dataLoaded, loadData] = useState([])
    const [dataConverted, setdataConverted] = useState()
    const [Percentage, setPercentage] = useState({
        Dump: 0,
        Cold: 0,
        Active: 0,
        Hot: 0,
        converted: 0,
    })


    async function totalLeadOfCurrentMonth() {
        var date = new Date()
        var list = []
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firequery = query(collection(db, "Trip"),
        where("assigned_date_time", '>=', firstDay),
        where("assign_to.uid", "==", currentUser[0].uid)
        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setTotaldata(list)
        // TotalDumpOfCurrentMonth(list.length)
        totalPassOverLead(list.length,list)

    }
    async function totalPassOverLead(length,list) {
        var date = new Date()
        var local = { name: 'Assign', value: 0, fill: 'blue' }
        var prev_instance = dataLoaded
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firequery = query(collection(db, "Trip"),
        where("assigned_date_time", '<', firstDay),
        where("Lead_Status","==","Cold",),
        where("Lead_Status","==","Active",),
        where("Lead_Status","==","Hot",),
        where("assign_to.uid", "==", currentUser[0].uid)
        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
            console.log(moment(doc.data().assigned_date_time.toDate()).format('DD-MM-YYYY'))
        });
        setTotaldata(list)
        console.log(list)
        local.value = local.value + list.length
        prev_instance.push(local)
        loadData(prev_instance)
        TotalDumpOfCurrentMonth(length)

    }
    async function TotalDumpOfCurrentMonth(total) {
        var date = new Date()
        var list = []
        var local = { name: 'Dump', value: 0, fill: 'Red' }
        var prev_instance = dataLoaded
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firequery = query(collection(db, "Trip"),
            where("updated_last", '>=', firstDay),
            where("Lead_Status", "==", "Dump"),
            where("assign_to.uid", "==", currentUser[0].uid)

        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setDataDump(list)
        local.value = local.value + list.length
        prev_instance.push(local)
        loadData(prev_instance)
        performencePercentage('Dump', list.length, total)
        TotalActiveOfCurrentMonth(total)
    }
    async function TotalActiveOfCurrentMonth(total) {
        var date = new Date()
        var list = []
        var local = { name: 'Active', value: 0, fill: 'cyan' }
        var prev_instance = dataLoaded
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firequery = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Active"),
            where("assign_to.uid", "==", currentUser[0].uid)

        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setdataActive(list)
        local.value = local.value + list.length
        prev_instance.push(local)
        loadData(prev_instance)
        performencePercentage('Active', list.length, total)
        TotalColdOfCurrentMonth(total)
    }
    async function TotalColdOfCurrentMonth(total){
        var date = new Date()
        var list = []
        var local = { name: 'Cold', value: 0, fill: 'sky' }
        var prev_instance = dataLoaded
        // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firequery = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Cold"),
            where("assign_to.uid", "==", currentUser[0].uid)

        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setdataCold(list)
        local.value = local.value + list.length
        prev_instance.push(local)
        loadData(prev_instance)
        performencePercentage('Cold', list.length, total)
        TotalHotOfCurrentMonth(total)
    }
    async function TotalHotOfCurrentMonth(total) {
        var date = new Date()
        var list = []
        var local = { name: 'Hot', value: 0, fill: 'green' }
        var prev_instance = dataLoaded
        // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var firequery = query(collection(db, "Trip"),
            where("Lead_Status", "==", "Hot"),
            where("assign_to.uid", "==", currentUser[0].uid)

        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setdataHot(list)
        local.value = local.value + list.length
        prev_instance.push(local)
        loadData(prev_instance)
        performencePercentage('Hot', list.length, total)
        TotalConvertedOfCurrentMonth(total)
    }
    async function TotalConvertedOfCurrentMonth(total) {
        var date = new Date()
        var list = []
        var local = { name: 'Converted', value: 0, fill: 'yellow' }
        var prev_instance = dataLoaded
        var month = moment(date).format('MMMM');
        var firequery = query(collection(db, "Trip"),
            where("month", '==', month),
            where("Lead_Status", "==", "Converted"),
            where("assign_to.uid", "==", currentUser[0].uid)
        );
        var querySnapshot = await getDocs(firequery);
        querySnapshot.forEach((doc) => {
            list.push(doc.data())
        });
        setdataConverted(list)
        local.value = local.value + list.length
        prev_instance.push(local)
        loadData(prev_instance)
        performencePercentage('Converted', list.length, total)
        setLoading(false)
    }
    function performencePercentage(response, result, total) {
        var percent = (result / total) * 100;
        var hold = Percentage
        switch (response) {
            case 'Dump': {
                hold.Dump = percent
                setPercentage(hold)
                break;
            }
            case 'Cold': {
                hold.Cold = percent
                setPercentage(hold)
                break;
            }
            case 'Active': {
                hold.Active = percent
                setPercentage(hold)
                break;
            }
            case 'Hot': {
                hold.Hot = percent
                setPercentage(hold)
                break;
            }
            case 'Converted': {
                hold.converted = percent
                setPercentage(hold)
                break
            }
        }
    }

    useEffect(() => {
        totalLeadOfCurrentMonth()
    }, []);
    return (
        <>
            <div>
                {
                    loading ? <>
                        <img src='https://firebasestorage.googleapis.com/v0/b/jrspark-adb98.appspot.com/o/pdfHelperImages%2Floading-gif.gif?alt=media&token=ffe281f9-1d5c-4d8c-b6a5-19fe94e38c00' />
                    </> :
                        <>
                            {/* {console.log(dataLoaded)} */}
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
                                <YAxis type="number" domain={[0, 'dataMax+10']} />
                                <Tooltip />
                                <Legend legendType='circle' />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Bar
                                    dataKey="value" fill="#8884d8" background={{ fill: "#eee" }} />
                            </BarChart>
                        </>
                }
                <div style={{display:'flex',justifyContent:'space-between',width:'50%', fontFamily: 'emoji',fontWeight:'600'}}>
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between'}}> 
                        <span>Dump</span><br/>
                        <span>Active</span><br/>
                        <span>Cold</span><br/>
                        <span>Converted</span><br/>
                        <span>Hot</span>
                    </div>
                    <div style={{width:'10rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid #00ff9a' }}>
                            <div className='myBar' style={{ width: Percentage.Dump,backgroundColor:'red' }}></div>{parseFloat(Percentage.Dump).toFixed(2)}%
                        </div><br/>
                        <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid #00ff9a' }}>
                            <div className='myBar' style={{ width: Percentage.Active ,backgroundColor:'cyan'}}></div>{parseFloat(Percentage.Active).toFixed(2)}%
                        </div><br/>


                        <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid #00ff9a' }}>
                            <div className='myBar' style={{ width: Percentage.Cold ,backgroundColor:'black'}}></div>{parseFloat(Percentage.Cold).toFixed(2)}%
                        </div><br/>


                        <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid #00ff9a' }}>
                            <div className='myBar' style={{ width: Percentage.converted,backgroundColor:'yellow' }}></div>{parseFloat(Percentage.converted).toFixed(2)}%
                        </div><br/>


                        <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid #00ff9a' }}>
                            <div className='myBar' style={{ width: Percentage.Hot,backgroundColor:'green' }}></div>{parseFloat(Percentage.Hot).toFixed(2)}%
                        </div>
                    </div>

                </div>

            </div>

        </>
    );
}

export default OverallChart;
