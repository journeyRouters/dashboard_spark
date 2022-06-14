import React, { useEffect, useState } from 'react';
import './inclusioncss.css'

const Inclusion = (props) => {
    const [storeData, setStoreData] = useState(null)
    const [btn_flg, setflg] = useState(false)
    const [inclusionFeed, setFeed] = useState({
        breakfast:'',
        lunch:'',
        lunch_comments:'',
        dinner:'',
        dinner_comments:'',
        airport_arival:'',
        airport_departure:'',
        cab_SIC:'',
        cab_Private:'',
        cab_Private_comments:'',
        Gst:'',
        airfair:'',
        siteseeing:'',
        siteseeing_comments:'',
        Visa:'',
        Visa_comments:'',
        Entrance_fee:'',
        Entrance_comments:'',
        other_Inclusion:'',
        other_Exclusion:''
    })
    function isNullish() {/* this function check  every key value in object for null value*/ 
        Object.values(inclusionFeed).every(value => {
            if (value === false) {
                // console.log(value)
                return true;
            }
            return false;
        });
    }
    useEffect(() => {

        setStoreData(props.Inclusion_data)

    });

    function handleSave() {
        // let confirm=isNullish()
        // console.log(confirm)
        // if (confirm === null || confirm === undefined || confirm === '') {
        //     setflg(true)
        
        // }
            props.setinclusion(inclusionFeed)
            props.onClose()
        
    }
    function handleData_inclusion(e) {
        // console.log(e.target)
        // debugger

        if (e.target.name === "Breakfast") {
            setFeed(prevState => ({
                ...prevState,
                breakfast: e.target.value
            }))
        }
        if (e.target.name === "Lunch") {
            setFeed(prevState => ({
                ...prevState,
                lunch: e.target.value
            }))
        }
        if (e.target.name === "Dinner") {
            setFeed(prevState => ({
                ...prevState,
                dinner: e.target.value
            }))
        }
        if (e.target.name === "lunch_comments") {
            setFeed(prevState => ({
                ...prevState,
                lunch_comments: e.target.value
            }))
        }
        if (e.target.name === "dinner_comments") {
            setFeed(prevState => ({
                ...prevState,
                dinner_comments: e.target.value
            }))
        }
        if (e.target.name === "Arival") {
            setFeed(prevState => ({
                ...prevState,
                airport_arival: e.target.value
            }))
        }
        if (e.target.name === "Departure") {
            setFeed(prevState => ({
                ...prevState,
                airport_departure: e.target.value
            }))
        }
        if (e.target.name === "SIC") {
            setFeed(prevState => ({
                ...prevState,
                cab_SIC: e.target.value
            }))
        }
        if (e.target.name === "Private") {
            setFeed(prevState => ({
                ...prevState,
                cab_Private: e.target.value
            }))
        }
        if (e.target.name === "airfair") {
            setFeed(prevState => ({
                ...prevState,
                airfair: e.target.value
            }))
        }
        if (e.target.name === "GST") {
            setFeed(prevState => ({
                ...prevState,
                Gst: e.target.value
            }))
        }
        if (e.target.name === "siteseeing") {
            setFeed(prevState => ({
                ...prevState,
                siteseeing: e.target.value
            }))
        }
        if (e.target.name === "siteseeing_comments") {
            setFeed(prevState => ({
                ...prevState,
                siteseeing_comments: e.target.value
            }))
        }
        if (e.target.name === "Visa") {
            setFeed(prevState => ({
                ...prevState,
                Visa: e.target.value
            }))
        }
        if (e.target.name === "visa_comments") {
            setFeed(prevState => ({
                ...prevState,
                Visa_comments: e.target.value
            }))
        }
        if (e.target.name === "Entrance") {
            setFeed(prevState => ({
                ...prevState,
                Entrance_fee: e.target.value
            }))
        }
        if (e.target.name === "Entrance_comments") {
            setFeed(prevState => ({
                ...prevState,
                Entrance_comments: e.target.value
            }))
        }
        if (e.target.name === "other_inclusion") {
            setFeed(prevState => ({
                ...prevState,
                other_Inclusion: e.target.value
            }))
        }
        if (e.target.name === "other_Exclusion") {
            setFeed(prevState => ({
                ...prevState,
                other_Exclusion: e.target.value
            }))
        }
        if (e.target.name === "Private_cab") {
            setFeed(prevState => ({
                ...prevState,
                cab_Private_comments: e.target.value
            }))
        }
        console.log(inclusionFeed)

    }
    return (
        <div className='center'>
            <div className='headerinclusion'>
                <p>Inclusion/Exclusion</p>
            </div>
            <div className='indicatorHeader'>
                <p>Inclusion</p>
                <p>Exclusion</p>

            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>

                    <p className='tag_heading'>Meal plan</p>
                    <div className='breakfast'>
                        Breakfast
                        <div onChange={(event) => handleData_inclusion(event)} value={inclusionFeed.breakfast} className='settingToSide'>

                            <input name='Breakfast' type='radio' value='Breakfast' />
                            <input name='Breakfast' type='radio' value='Breakfast is not included' />

                        </div>

                    </div>
                    <div >
                        <div onChange={(event) => handleData_inclusion(event)} className='breakfast'>
                            Lunch
                            <div className='settingToSide'>
                                <input name='Lunch' type='radio' value="Lunch" />
                                <input name='Lunch' type='radio' value='Lunch is not included' />
                            </div>
                        </div>
                        <textarea onChange={(event) => handleData_inclusion(event)} name='lunch_comments' className='comments_from' placeholder='Please write comments'></textarea>
                    </div>
                    <div >
                        <div onChange={(event) => handleData_inclusion(event)} className='breakfast'>
                            Dinner
                            <div className='settingToSide'>
                                <input name='Dinner' type='radio' value="Dinner" />
                                <input name='Dinner' type='radio' value='Dinner is not included' />
                            </div>
                        </div>
                        <textarea onChange={(event) => handleData_inclusion(event)} name='dinner_comments' className='comments_from' placeholder='Please write comments'></textarea>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>airport transfer</p>
                    <div className='breakfast'>
                        Arival
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='Arival' type='radio' value='Arival' />
                            <input name='Arival' type='radio' value='Arival is not included' />
                        </div>
                    </div>
                    <div className='breakfast'>
                        Departure
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='Departure' type='radio' value='Departure' />
                            <input name='Departure' type='radio' value='Departure is not included' />
                        </div>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>Cab Type</p>
                    <div className='breakfast'>
                        SIC
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='SIC' type='radio' value='SIC CAB' />
                            <input name='SIC' type='radio' value='SIC is not included' />
                        </div>
                    </div>
                    <div className='breakfast'>
                        Private
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='Private' type='radio' value='Private cab' />
                            <input name='Private' type='radio' value='Private cab is not included' />
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='Private_cab' className='comments_from' placeholder='Please write comments'></textarea>
                </div>


            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <div className='breakfast'>
                        airfair
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='airfair' type='radio' value='airfair' />
                            <input name='airfair' type='radio' value='airfair is not included' />
                        </div>
                    </div>
                    <div className='breakfast'>
                        GST
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='GST' type='radio' value='GST' />
                            <input name='GST' type='radio' value='GST is not included' />
                        </div>
                    </div>
                    <div className='breakfast'>
                        siteseeing
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='siteseeing' type='radio' value='siteseeing' />
                            <input name='siteseeing' type='radio' value='siteseeing is not included' />
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='siteseeing_comments' className='comments_from' placeholder='Please write comments'></textarea>
                    <div className='breakfast'>
                        Visa
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='Visa' type='radio' value='Visa' />
                            <input name='Visa' type='radio' value='Visa is not included' />
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='visa_comments' className='comments_from' placeholder='Please write comments'></textarea>
                    <div className='breakfast'>
                        Entrance Fee/Extra activity
                        <div onChange={(event) => handleData_inclusion(event)} className='settingToSide'>
                            <input name='Entrance' type='radio' value='Entrance fee' />
                            <input name='Entrance' type='radio' value='Entrance fee is not included' />
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='Entrance_comments' className='comments_from' placeholder='Please write comments'></textarea>
                </div>


            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>others</p>
                    <div className='breakfast'>
                        other Inclusion
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='other_inclusion' className='other_inclusion' placeholder='Please write comments'></textarea>
                    <div className='breakfast'>
                        other Exclusion
                    </div>
                    <textarea className='other_exclusion' onChange={(event) => handleData_inclusion(event)} name='other_Exclusion' placeholder='Please write comments'></textarea>
                </div>
            </div>
            <div className='cancel_button_div'>
                <button className='cancel_button' onClick={() => props.onClose()}>cancel</button>
                <button className='cancel_button' onClick={() => handleSave()}>save</button>
            </div>
        </div>
    );
}

export default Inclusion;
