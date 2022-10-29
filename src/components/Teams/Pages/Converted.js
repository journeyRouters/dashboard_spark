import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { useEffect } from 'react';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { useState } from 'react';
import app from '../../required';
import VouchersCompo from '../../payments_vouchers/Vouchers_compo';

const Converted = ({ setcount, uid,profile }) => {
    const [lead_data, setLead_data] = useState([])
    const [open, setopen] = useState(true)
    const [currentMonth, setmonth] = useState(moment(new Date()).format('MMMM'))
    const animatedComponents = makeAnimated();
    const db = getFirestore(app);


    const months = [
        { value: 'January', label: 'JAN', color: '#00B8D9' },
        { value: 'February', label: 'FEB', color: '#0052CC' },
        { value: 'March', label: 'MAR', color: '#5243AA' },
        { value: 'April', label: 'APR', color: '#FF5630', },
        { value: 'May', label: 'MAY', color: '#FF8B00' },
        { value: 'June', label: 'JUNE', color: '#FFC400' },
        { value: 'July', label: 'JUL', color: '#36B37E' },
        { value: 'August', label: 'AUG', color: '#00875A' },
        { value: 'September', label: 'SEP', color: '#253858' },
        { value: 'October', label: 'OCT', color: '#666666' },
        { value: 'November', label: 'NOV', color: '#666666' },
        { value: 'December', label: 'DEC', color: '#666666' },

    ];
    function monthHandler(e) {
        setmonth(e.value)
    }
    async function getLeadOnBoard(currentMonth) {
        var testvar=new Date('2022')
        try {
            let list = []
            var q = query(collection(db, "Trip"), where("assign_to.uid", "==", uid),
                where('Lead_Status', '==', 'Converted'), where("quotation_flg", "==", true),
                where("month", "==", currentMonth),where("assigned_date_time",">",testvar)
            );
            var querySnapshot;

            querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length == 0) {
                setopen(false)
                console.log("no data")

            }
            else {

                querySnapshot.forEach((doc) => {
                    list.push(doc.data())
                });
                setLead_data(list)
                setcount(list.length)
                // console.log(list)
                setopen(false)

            }
        }
        catch (erorr) {
            console.log(erorr)
            setopen(false)
        }

    }
    useEffect(() => {
        getLeadOnBoard(currentMonth)
    }, []);
    return (
        <div>
                <div style={{ width: '20rem', position:'sticky' ,top:'1rem' ,display:'flex'}}>
                    <Select
                        placeholder='Month'
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        options={months}
                        onChange={(e) => monthHandler(e)}
                    />
                    <button onClick={()=>getLeadOnBoard(currentMonth)}> Search</button>
                </div>
            <div style={{ overflowY: 'scroll', height: '44rem' }}>

                <div>
                {
                    lead_data.map((data, index) => (
                        <>
                            <VouchersCompo key={index} data={data} datahandle={getLeadOnBoard} profile={profile}/>
                        </>
                    ))
                }
                </div>

            </div>
        </div>
    );
}

export default Converted;
