import { getFirestore, onSnapshot } from 'firebase/firestore';
import app from '../../required';
const db = getFirestore(app);
export function getConvertedDataForUserProfile(usersProfile,DataQuery,statemanagment) {
    const unsubscribe = onSnapshot(DataQuery, (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
            list.push(doc.data());
        });
        const IncomingData = { Name: usersProfile.name, Data: list, Number: list.length };
        HandleIncomingData(IncomingData,statemanagment)
    });
    return unsubscribe;
}
function HandleIncomingData(IncomingData,statemanagment) {
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