import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import app from '../required';
const db = getFirestore(app);



const AvgLeadSeeded = () => {
    const [currentMonth, setmonth] = useState(moment(new Date()).format('MMMM'))
    const [dataLoaded, loadData] = useState([])
    const [dataAvailablityFlg, setdataAvailablityFlg] = useState(false)
    const [totaluser, settotaluser] = useState([])

    function getAllUserProfie() {
        var list = []
        const q = query(collection(db, "Profile"), where("access_type", "in", ["User", "Team Leader", "freelance"]), where("user_type", "==", "show"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            settotaluser(list)
            findConversion(list)
        });
    }
    // function findConversion(totaluser) {
    //     var date = new Date()
    //     var month = moment(new Date()).format('MMMM-YYYY')
    //     var CurrentdateOfMonth = new Date()
    //     var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    //     var firstDateOfMonth = new Date(CurrentdateOfMonth.getFullYear(), date.getMonth(), 1);
    //     var diff = parseInt((CurrentdateOfMonth - firstDateOfMonth) / (1000 * 60 * 60 * 24))
    //     totaluser.forEach(async (item, index) => {
    //         try {
    //             var list = []
    //             var CurrentTarget = item.Target[month]//just put item.target[month]
    //             var q = query(collection(db, "Trip"), where("assign_to.uid", "==", item.uid),
    //                 where('assigned_date_time', '>=', firstDay));
    //             var querySnapshot = await getDocs(q);
    //             querySnapshot.forEach((doc) => {
    //                 list.push(doc.data())
    //             });
    //             // PercentageCalculator(item.name, list.length, parseInt(CurrentTarget), item.uid)
    //             var prev_instance = dataLoaded
    //             var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    //             var userConversionPercentage = { id: item.uid, label: item.name, value: Math.round((list.length) / diff), color: randomColor }
    //             prev_instance.push(userConversionPercentage)
    //             loadData(prev_instance)
    //             loadData([
    //                 {
    //                     name: `'Daily Avg Lead' ${prev_instance.reduce((sum, item) => sum + item.value, 0)}`,
    //                     values: prev_instance
    //                 }
    //             ])
    //             if ((totaluser.length) - 1 == index) {
    //                 setdataAvailablityFlg(true)
    //             }
    //         }
    //         catch (error) {
    //             console.log(error)
    //         }

    //     }
    //     )
    // }
    async function findConversion(totaluser) {
        const date = new Date();
        const month = moment(date).format('MMMM-YYYY');
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const today = new Date();

        // Function to count days excluding Sundays
        function countDaysExcludingSundays(startDate, endDate) {
            let count = 0;
            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                if (date.getDay() !== 0) count++; // Exclude Sundays
            }
            return count;
        }

        const daysExcludingSundays = countDaysExcludingSundays(firstDay, today);

        const fetchUserLeads = async (item) => {
            const q = query(collection(db, "Trip"), where("assign_to.uid", "==", item.uid),
                where('assigned_date_time', '>=', firstDay));
            const querySnapshot = await getDocs(q);
            const list = querySnapshot.docs.map(doc => doc.data());
            const CurrentTarget = item.Target[month] || 0;
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            return { id: item.uid, label: item.name, value: Math.round((list.length) / daysExcludingSundays), color: randomColor };
        };

        try {
            const userConversions = await Promise.all(totaluser.map(fetchUserLeads));
            loadData([
                {
                    name: 'Daily Avg Lead',
                    values: userConversions
                }
            ]);
            setdataAvailablityFlg(true);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllUserProfie()
    }, []);
    return (
        <div style={{ width: '30rem' }}>
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
                    /> : <></>
            }
        </div>
    );
}

export default AvgLeadSeeded;
