import { getFirestore, onSnapshot } from 'firebase/firestore';
import app from '../../required';
import moment from 'moment';
const db = getFirestore(app);
export function getConvertedDataForUserProfile(usersProfile, DataQuery, statemanagment) {
    const unsubscribe = onSnapshot(DataQuery, (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
            list.push(doc.data());
        });
        const IncomingData = { Name: usersProfile.name, Data: list, Number: list.length };
        HandleIncomingData(IncomingData, statemanagment)
    });
    return unsubscribe;
}
function HandleIncomingData(IncomingData, statemanagment) {
    // console.log(IncomingData)
    statemanagment(prevData => {
        const dataIndex = prevData.findIndex(item => item.Name === IncomingData.Name);

        if (dataIndex !== -1) {
            const newData = [...prevData];
            newData[dataIndex] = IncomingData;
            return newData;
        } else {
            return [...prevData, IncomingData];
        }
    });
}


export function get72hrNon_respondedLeads(usersProfile, DataQuery, statemanagment) {
    const Today = new Date()
    const unsubscribe = onSnapshot(DataQuery, (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
            list.push(doc.data());
        });
        const finalData = list.filter((item) => {
            // console.log(item)
            var commentLimit = new Date(item.updated_last.toDate());
            commentLimit.setDate(commentLimit.getDate() + 2)
            // console.log(commentLimit<Today)
            if(commentLimit<Today)return item
        })
        // console.log(finalData)
        const IncomingData = { Name: usersProfile.name, Data: finalData, Number: finalData.length };
        // console.log(IncomingData)
        Handle_non_replyedData(IncomingData, statemanagment)
    });
    return unsubscribe;
}

function Handle_non_replyedData(IncomingData, statemanagment) {
    statemanagment(prevData => {
        const dataIndex = prevData.findIndex(item => item.Name === IncomingData.Name);
        if (dataIndex !== -1) {
            const newData = [...prevData];
            newData[dataIndex] = IncomingData;
            return newData;
        } else {
            return [...prevData, IncomingData];
        }
    });
}