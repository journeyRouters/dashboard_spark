import { collection, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import app from '../required';
import Userunitcomponent from './UserUnitComponent';

const Usercontrol = (props) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const Profile = JSON.parse(localStorage.getItem('profile'));

    // console.log(props)
    const [user, setUser] = useState([])
    const db = getFirestore(app);
    async function datahandle() {
        if (auth) {
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
            {Profile?
                Profile.access_type === "admin"||"Super Admin"? <>
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
