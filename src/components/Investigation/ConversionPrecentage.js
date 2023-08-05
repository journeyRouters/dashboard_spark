import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DynamicBarChart } from 'react-dynamic-charts';
import app from '../required';
const db = getFirestore(app);



const ConversionPrecentage = () => {
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
    function findConversion(totaluser) {
        var month = moment(new Date()).format('MMMM-YYYY')
        totaluser.forEach(async (item, index) => {
            try {
                var list = []
                var CurrentTarget = item.Target[month]//just put item.target[month]
                var q = query(collection(db, "Trip"), where("assign_to.uid", "==", item.uid),
                    where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true), where("month", "==", currentMonth),);
                var querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                PercentageCalculator(item.name, list.length, parseInt(CurrentTarget), item.uid)
                if ((totaluser.length) - 1 == index) {
                    setdataAvailablityFlg(true)
                }
            }
            catch (error) {
                console.log(error)
            }

        }
        )
    }
    function PercentageCalculator(name, convertedFile, target, uid) {
        var CurrentTarget = target
        if (CurrentTarget != CurrentTarget) {
            CurrentTarget = 0
        }
        var percentage = Math.round((convertedFile / CurrentTarget) * 100)
        if (percentage != percentage || percentage === Infinity) {
            percentage = 0
        }
        var prev_instance = dataLoaded
        var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        var userConversionPercentage = { id: uid, label: name, value: percentage, color: randomColor }
        prev_instance.push(userConversionPercentage)
        loadData(prev_instance)
        loadData([
            {
                name: 'Conversion % Against Target',
                values: prev_instance
            }
        ])
    }
    useEffect(() => {
        getAllUserProfie()
    }, []);
    return (
        <div>
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

export default ConversionPrecentage;
