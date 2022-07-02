import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { useState } from 'react';
import './inclusioncss.css';

const Inclusion = (props) => {
    const [btn_flg, setflg] = useState(false)
    console.log(props.inclusion_data)
    const [inclusionFeed, setFeed] = useState(props.inclusion_data)
    console.log(inclusionFeed)

   


    function handleSave() {
        props.setinclusion(inclusionFeed)
        console.log(inclusionFeed)
        props.onClose()

    }
    function handleData_inclusion(e) {
        console.log(typeof(Boolean(e.target.value)))
        // debugger

        if (e.target.name === "Breakfast") {
            setFeed(prevState => ({
                ...prevState,
                breakfast: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "Lunch") {
            setFeed(prevState => ({
                ...prevState,
                lunch: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "Dinner") {
            setFeed(prevState => ({
                ...prevState,
                dinner: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "lunch_comments") {
            setFeed(prevState => ({
                ...prevState,
                lunch_comments: (e.target.value)
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
                airport_arival: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "Departure") {
            setFeed(prevState => ({
                ...prevState,
                airport_departure: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "SIC") {
            setFeed(prevState => ({
                ...prevState,
                cab_SIC: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "Private") {
            setFeed(prevState => ({
                ...prevState,
                cab_Private: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "airfair") {
            setFeed(prevState => ({
                ...prevState,
                airfair: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "GST") {
            setFeed(prevState => ({
                ...prevState,
                Gst: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "TCS") {
            setFeed(prevState => ({
                ...prevState,
                Tcs: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "siteseeing") {
            setFeed(prevState => ({
                ...prevState,
                siteseeing: Boolean(e.target.value)
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
                Visa: Boolean(e.target.value)
            }))
        }
        if (e.target.name === "visa_comments") {
            setFeed(prevState => ({
                ...prevState,
                Visa_comments: (e.target.value)
            }))
        }
        if (e.target.name === "Entrance") {
            setFeed(prevState => ({
                ...prevState,
                Entrance_fee: Boolean(e.target.value)
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
                cab_Private_comments: (e.target.value)
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
                        <div  className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Breakfast' value={inclusionFeed.breakfast} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >

                        </div>

                    </div>
                    <div >
                        <div  className='breakfast'>
                            Lunch
                            <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Lunch' value={inclusionFeed.lunch} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                            </div>
                        </div>
                        <textarea onChange={(event) => handleData_inclusion(event)} name='lunch_comments' className='comments_from' placeholder='Please write comments' value={inclusionFeed.lunch_comments}></textarea>
                    </div>
                    <div >
                        <div  className='breakfast'>
                            Dinner
                            <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Dinner' value={inclusionFeed.dinner} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                            </div>
                        </div>
                        <textarea onChange={(event) => handleData_inclusion(event)} name='dinner_comments' value={inclusionFeed.dinner_comments} className='comments_from' placeholder='Please write comments'></textarea>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>airport transfer</p>
                    <div className='breakfast'>
                        Arival
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='Arival' value={inclusionFeed.airport_arival} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        Departure
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='Departure' value={inclusionFeed.airport_departure} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>Cab Type</p>
                    <div className='breakfast'>
                        SIC
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='SIC' value={inclusionFeed.cab_SIC} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        Private
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='Private' value={inclusionFeed.cab_Private} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='Private_cab' value={inclusionFeed.cab_Private_comments} className='comments_from' placeholder='Please write comments'></textarea>
                </div>


            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <div className='breakfast'>
                        airfair
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='airfair' value={inclusionFeed.airfair} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        GST
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='GST' value={inclusionFeed.Gst} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        TCS
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='TCS' value={inclusionFeed.Tcs} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        siteseeing
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='siteseeing' value={inclusionFeed.siteseeing} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='siteseeing_comments' value={inclusionFeed.siteseeing_comments} className='comments_from' placeholder='Please write comments'></textarea>
                    <div className='breakfast'>
                        Visa
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='Visa' value={inclusionFeed.Visa} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='visa_comments' value={inclusionFeed.Visa_comments} className='comments_from' placeholder='Please write comments'></textarea>
                    <div className='breakfast'>
                        Entrance Fee/Extra activity
                        <div  className='settingToSide'>
                        <RadioGroup className='radiogroup' name='Entrance' value={inclusionFeed.Entrance_fee} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='Entrance_comments' value={inclusionFeed.Entrance_comments} className='comments_from' placeholder='Please write comments'></textarea>
                </div>


            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>others</p>
                    <div className='breakfast'>
                        other Inclusion
                    </div>
                    <textarea onChange={(event) => handleData_inclusion(event)} name='other_inclusion' value={inclusionFeed.other_Inclusion} className='other_inclusion' placeholder='Please write comments'></textarea>
                    <div className='breakfast'>
                        other Exclusion
                    </div>
                    <textarea className='other_exclusion' onChange={(event) => handleData_inclusion(event)} value={inclusionFeed.other_Exclusion} name='other_Exclusion' placeholder='Please write comments'></textarea>
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
