import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { useState } from 'react';
import './inclusioncss.css';

const Inclusion = (props) => {
    const [btn_flg, setflg] = useState(false)
    const [inclusionFeed, setFeed] = useState(props.inclusion_data)




    function handleSave() {
        props.setinclusion(inclusionFeed)
        props.onClose()

    }
    function BooleanCaseResolver(value) {
        /**a case is not working
         * when it should parse string value to boolean
         * Boolean(value) returns true always
         * so this function will handle the vaue
         */
        if (value == 'true') return true
        return false
    }
    function handleData_inclusion(e) {

        var firevalue = BooleanCaseResolver(e.target.value)
        // debugger

        if (e.target.name === "Breakfast") {
            setFeed(prevState => ({
                ...prevState,
                breakfast: firevalue
            }))
        }
        if (e.target.name === "Lunch") {
            setFeed(prevState => ({
                ...prevState,
                lunch: firevalue
            }))
        }
        if (e.target.name === "Dinner") {
            setFeed(prevState => ({
                ...prevState,
                dinner: firevalue
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
                airport_Arival: firevalue
            }))
        }
        if (e.target.name === "Departure") {
            setFeed(prevState => ({
                ...prevState,
                airport_Departure: firevalue
            }))
        }
        if (e.target.name === "CAB") {
            setFeed(prevState => ({
                ...prevState,
                Transfer: firevalue
            }))
        }
       
        if (e.target.name === "airfair") {
            setFeed(prevState => ({
                ...prevState,
                Flight: firevalue
            }))
        }
        if (e.target.name === "GST") {
            setFeed(prevState => ({
                ...prevState,
                Gst: firevalue
            }))
        }
        if (e.target.name === "TCS") {
            setFeed(prevState => ({
                ...prevState,
                Tcs: firevalue
            }))
        }
        if (e.target.name === "siteseeing") {
            setFeed(prevState => ({
                ...prevState,
                sightseeing: firevalue
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
                Visa: firevalue
            }))
        }
        if (e.target.name === "accommodation") {
            setFeed(prevState => ({
                ...prevState,
                accommodation: firevalue
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
                Entrance_fee: firevalue
            }))
        }
        if (e.target.name === "Entrance_comments") {
            e.persist();
            setFeed(prevState => ({
                ...prevState,
                Entrance_comments: e.target.value
            }))
        }
        if (e.target.name === "other_inclusion") {
            e.persist();
            setFeed(prevState => ({
                ...prevState,
                other_Inclusion: e.target.value
            }))
        }
        if (e.target.name === "other_Exclusion") {
            e.persist();
            setFeed(prevState => ({
                ...prevState,
                other_Exclusion: e.target.value

            }))
        }
        if (e.target.name === "Private_cab") {
            e.persist();
            setFeed(prevState => ({
                ...prevState,
                cab_Private_comments: (e.target.value)
            }))
        }

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
                    <p className='tag_heading'>accommodation</p>
                    <div className='breakfast'>
                    accommodation
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='accommodation' value={inclusionFeed.accommodation} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >

                        </div>

                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>Meal plan</p>
                    <div className='breakfast'>
                        Breakfast
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Breakfast' value={inclusionFeed.breakfast} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >

                        </div>

                    </div>
                    <div >
                        <div className='breakfast'>
                            Lunch
                            <div className='settingToSide'>
                                <RadioGroup className='radiogroup' name='Lunch' value={inclusionFeed.lunch} onChange={(event) => handleData_inclusion(event)}>
                                    <FormControlLabel control={<Radio />} value={true} />
                                    <FormControlLabel control={<Radio />} value={false} />
                                </RadioGroup >
                            </div>
                        </div>
                        {/* <textarea onChange={(event) => handleData_inclusion(event)} name='lunch_comments' className='comments_from' placeholder='Please write comments' value={inclusionFeed.lunch_comments}></textarea> */}
                    </div>
                    <div >
                        <div className='breakfast'>
                            Dinner
                            <div className='settingToSide'>
                                <RadioGroup className='radiogroup' name='Dinner' value={inclusionFeed.dinner} onChange={(event) => handleData_inclusion(event)}>
                                    <FormControlLabel control={<Radio />} value={true} />
                                    <FormControlLabel control={<Radio />} value={false} />
                                </RadioGroup >
                            </div>
                        </div>
                        {/* <textarea onChange={(event) => handleData_inclusion(event)} name='dinner_comments' value={inclusionFeed.dinner_comments} className='comments_from' placeholder='Please write comments'></textarea> */}
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <p className='tag_heading'>airport transfer</p>
                    <div className='breakfast'>
                        Arival
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Arival' value={inclusionFeed.airport_Arival} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        Departure
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Departure' value={inclusionFeed.airport_Departure} onChange={(event) => handleData_inclusion(event)}>
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
                        CAB
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='CAB' value={inclusionFeed.Transfer} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    {/* <textarea onChange={(event) => handleData_inclusion(event)} name='Private_cab' value={inclusionFeed.cab_Private_comments} className='comments_from' placeholder='Please write comments'></textarea> */}
                </div>


            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <div className='breakfast'>
                        Flights
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='airfair' value={inclusionFeed.Flight} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    {/* <div className='breakfast'>
                        GST
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='GST' value={inclusionFeed.Gst} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    <div className='breakfast'>
                        TCS
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='TCS' value={inclusionFeed.Tcs} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>

                    <div className='breakfast'>
                        siteseeing
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='siteseeing' value={inclusionFeed.sightseeing} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    {/* <textarea onChange={(event) => handleData_inclusion(event)} name='siteseeing_comments' value={inclusionFeed.siteseeing_comments} className='comments_from' placeholder='Please write comments'></textarea> */}
                    <div className='breakfast'>
                        Visa
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Visa' value={inclusionFeed.Visa} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                    {/* <textarea onChange={(event) => handleData_inclusion(event)} name='visa_comments' value={inclusionFeed.Visa_comments} className='comments_from' placeholder='Please write comments'></textarea> */}
                    {/* <div className='breakfast'>
                        Entrance Fee/Extra activity
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Entrance' value={inclusionFeed.Entrance_fee} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div> */}
                    {/* <textarea onChange={(event) => handleData_inclusion(event)} name='Entrance_comments' value={inclusionFeed.Entrance_comments} className='comments_from' placeholder='Please write comments'></textarea> */}
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
