import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import React from 'react';
import app from '../required';
import moment from 'moment';
import { useEffect } from 'react';
import { useState } from 'react';
const db = getFirestore(app);

const CommentsUniCompo = ({ row }) => {
    const [latestComment, setLatestComment] = useState([])
    const [comments, setcomments] = useState(null)
    const today = new Date()

    function handlecomment(e) {
        setcomments(e.target.value)
    }
    async function update_comments() {
        if (comments) {
            let allComments = row.comments
            let comment_holder = {
                comments: comments,
                date: moment(today).format('YYYY-MM-DD'),
                time: moment(today).calendar()
            }
            allComments.push(comment_holder)
            // console.log('allcoments new', allComments, row.trip_doc)
            setDoc(doc(db, "Trip", row.TripId), {
                comments: allComments,
                updated_last: today
            }, { merge: true });

            // latestTripData()
            // setLimit(false)
            setLatestComment(allComments)
            setcomments(null)
        }
        else {
            alert('please comment something to save')
        }


    }
    async function latestTripData() {
        const docRef = doc(db, "Trip", `${row.TripId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setLatestComment(docSnap.data().comments)
            // console.log(docSnap.data().comments)

        } else {
            console.log("No such document!");
        }

    }
    useEffect(() => {
        latestTripData()
    }, []);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className='remark' >
                {
                    (latestComment.slice(0).reverse()).map((sapn, index) => (
                        <div key={index} className='comments_maping'>
                            {/* {console.log("comments data",sapn)} */}
                            <p style={{ fontSize: '10px', borderRight: '1px solid' }}>
                                {sapn.comments}
                            </p>
                            <div className='time_date'>
                                <p>{moment(sapn.date).format('DD-MMM-YYYY')}</p>
                                <p>{sapn.time}</p>

                            </div>
                        </div>
                    ))
                }
                <h4 className='TravelersComments'>
                    <span>
                        {row.Comment}
                    </span>
                    <span>
                        Traveler's comments
                    </span>
                </h4>

            </div>
            <div className='comments_box'>
                <input className='Autocomplete'
                    list='Comments'
                    value={comments == null ? '' : comments}
                    onChange={(e) => handlecomment(e)}
                ></input>
                <datalist id="Comments">
                    <option value="Traveler not Reachable">Traveler not Reachable</option>
                    <option value="Won't book with me">Won't book with me</option>
                    <option value="Talk in progress with traveler">Talk in progress with traveler</option>
                    <option value="Traveler will Finalize and it's my hot">Traveler will Finalize and it's my hot</option>
                    <option value="Call not connecting">Call not connecting</option>
                    <option value="Travler change their mind">Travler change their mind</option>
                    <option value="Quote shared on whatsapp">Quote shared on what's app</option>
                    <option value="Traveler not responding">Travel not responding</option>
                    <option value="Booking form somewhere else">Booking form somewhere else</option>
                    <option value="will let know after few days/time">will let know after few days/time</option>
                    <option value="Converting/ Booking amount received">Converting /Booking amount received</option>
                </datalist>

                <button className='button_save_comments' onClick={() => update_comments()}>save</button>
            </div>
        </div>
    );
}

export default CommentsUniCompo;
