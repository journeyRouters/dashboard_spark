import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import app from "../../required";
import Whatsappleadcomponent from "./Whatsappleadcomponent";


function Whatsappleads({ }) {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [lead_data, setLead_data] = useState([])
    const db = getFirestore(app);
    const [selectedDate, setSeletctedDate] = useState(new Date())
    const [openlistOfUsers, setopenlistOfUsers] = useState(false)
    const [SearchOptionkey, setSearchOptionkey] = useState(null)
    const [SearchOptionkeyValue, setSearchOptionkeyValue] = useState(null)
    function handleListChange() {
        setopenlistOfUsers(!openlistOfUsers)
    }

    async function getLeadByDate(selectedDate) {      
       var date=new Date(selectedDate)
        date.setHours(0, 0, 0, 0);        
        var currentTime = new Date()
        var q = query(collection(db, "whatsapp"), where('Date', '>=', date), where('Date', '<=', currentTime));
        try {
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc.data());
                });
                setLead_data(list);
                // console.log(list)
            }, (error) => {
                console.error("Error getting documents: ", error);
            });
    
            // Return the unsubscribe function to allow caller to detach listener when needed
            return unsubscribe;
        } catch (error) {
            console.error("Error setting up document listener: ", error);
        }

    }
   
    useEffect(() => {
        window.scrollTo(0, 0);
        getTripCounter()
        getLeadByDate(selectedDate)
    }, []);

    async function getTripCounter() {
        const TripRef = doc(db, "Support", "tripCount");
        let SupportSnap;
        try {
            SupportSnap = await getDoc(TripRef);
        }
        catch (e) { console.log(e) }
        if (SupportSnap.exists()) {
            // setTripCount(SupportSnap.data().tripCount)
            // console.log(SupportSnap.data().tripCount)

        }
    }
    async function updateTripCounter(counted) {
        const TripRef = doc(db, "Support", "tripCount");
        await updateDoc(TripRef, {
            tripCount: counted
        });

    }
    async function dynamicSearch() {
        let q = null
        let list = []
        switch (SearchOptionkey) {
            case 'null': {
                return
            }
            case 'TripId': {
                q = query(collection(db, 'whatsapp'), where('TripId', '==', SearchOptionkeyValue))
                break
            }
            case 'Contact_Number': {
                q = query(collection(db, 'whatsapp'), where('Contact_Number', '==', parseInt(SearchOptionkeyValue)))
                break
            }

        }
        try {
            var querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            try {
                setLead_data(list)
            }
            catch (e) { console.log(e) }
        }
        catch (error) {
            console.log(error.message)
        }
    }
    function OptionSelector(value) { setSearchOptionkey(value) }
    function valueSelector(value) { setSearchOptionkeyValue(value) }
    return (
        <div>
            <div className='Driver_header'>
                <div>
                    <input onChange={(e) => setSeletctedDate(e.target.value)} type='date' value={selectedDate}></input>
                    <button onClick={() => getLeadByDate(selectedDate)}>Search</button>
                </div>
                <div>
                    <select onChange={(event) => OptionSelector(event.target.value)}>
                        <option value={null}>select</option>
                        <option value={'TripId'}>TripId</option>
                        <option value={'Contact_Number'}>Contact_Number</option>
                    </select>
                    <input onChange={(e) => valueSelector(e.target.value)} placeholder="Input Search Value"></input>
                    <button onClick={() => dynamicSearch()}>Search</button>
                </div>
                <span style={{ background: 'yellow' }}>Total uploaded leads= {lead_data.length}</span>
                <button className='userlist_button' onClick={handleListChange}>All listed User</button>
                {/* <button onClick={() => UploadFile()}>upload the Leads</button> */}
            </div>
            <div style={{ background: 'cyan' }}>
                {lead_data.map((data, index) => (
                    <Whatsappleadcomponent key={index} profile={auth} data={data} index={index} getLeadByDate={getLeadByDate} selectedDate={selectedDate} />
                ))}
            </div>
        </div>
    );
}

export default Whatsappleads;