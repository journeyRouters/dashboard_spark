import { collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Userunitcomponent from './UserUnitComponent';

const Usercontrol = (props) => {
    // console.log(props)
    const [user, setUser] = useState([])
    const db = getFirestore(app);
    async function datahandle() {
        if (props.auth) {
            let list = []
            const querySnapshot = await getDocs(collection(db, "Profile"));
            querySnapshot.forEach((doc) => {
                list.push(doc.data())
            });
            setUser(list)

        }
        else {
            // setopen(false)
            setUser([])
        }

    }
    function refreshPage(){
        window.location.reload(false);
    }
    useEffect(() => {
        datahandle()
        // refreshPage()
    },[])
    return (
        <div>
            {props.data?
                props.data.access_type === "admin" ? <>
                    {
                        user.map((d, index) => (
                            <Userunitcomponent key={index} data={d} datahandle={datahandle} />
                        ))
                    }
                </> : <>
                
                </>:refreshPage()


            }
        </div>
    );
}

export default Usercontrol;
