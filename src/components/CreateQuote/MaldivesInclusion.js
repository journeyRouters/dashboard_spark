import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { useState } from 'react';
import './inclusioncss.css';

const MaldivesInclusion = (props) => {
    const [btn_flg, setflg] = useState(false)
    const [inclusionFeed, setFeed] = useState(props.inclusion_data)
    function handleSave() {
        props.setinclusion(inclusionFeed)
        props.onClose()
    }
    // console.log(inclusionFeed)
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
        if (e.target.name === "MealPlan") {
            setFeed(prevState => ({
                ...prevState,
                MealPlan: firevalue
            }))
        }
        if (e.target.name === "Transfer") {
            setFeed(prevState => ({
                ...prevState,
                Transfer: firevalue
            }))
        }
        if (e.target.name === "Accommodation") {
            setFeed(prevState => ({
                ...prevState,
                Accommodation: firevalue
            }))
        }
        if (e.target.name === "GST") {
            setFeed(prevState => ({
                ...prevState,
                Gst: firevalue
            }))
        }
        if (e.target.name === "Tcs") {
            setFeed(prevState => ({
                ...prevState,
                Tcs: firevalue
            }))
        }
        if (e.target.name === "Visa") {
            setFeed(prevState => ({
                ...prevState,
                Visa: firevalue
            }))
        }
        if (e.target.name === "Visa") {
            setFeed(prevState => ({
                ...prevState,
                Visa: firevalue
            }))
        }
        if (e.target.name === "GreenTax") {
            setFeed(prevState => ({
                ...prevState,
                GreenTax: firevalue
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
                    <p className='tag_heading'>Accommodation</p>
                    <div className='breakfast'>
                    Accommodation
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Accommodation' value={inclusionFeed.Accommodation} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />

                            </RadioGroup >

                        </div>

                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <div className='breakfast'>
                        MealPlan
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='MealPlan' value={inclusionFeed.MealPlan} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />
                            </RadioGroup >
                        </div>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <div className='breakfast'>
                        Transfer
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='Transfer' value={inclusionFeed.Transfer} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />

                            </RadioGroup >
                        </div>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>
                    <div className='breakfast'>
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
                            <RadioGroup className='radiogroup' name='Tcs' value={inclusionFeed.Tcs} onChange={(event) => handleData_inclusion(event)}>
                                <FormControlLabel control={<Radio />} value={true} />
                                <FormControlLabel control={<Radio />} value={false} />

                            </RadioGroup >
                        </div>
                    </div>
                </div>
            </div>
            <div className='inclusionContaint1'>
                <div className='setaline'>

                    <div className='breakfast'>
                        GreenTax
                        <div className='settingToSide'>
                            <RadioGroup className='radiogroup' name='GreenTax' value={inclusionFeed.GreenTax} onChange={(event) => handleData_inclusion(event)}>
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

export default MaldivesInclusion;
