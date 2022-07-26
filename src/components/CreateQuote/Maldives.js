import { Modal, Radio } from '@material-ui/core';
import moment from 'moment';
import React, { useState } from 'react';
import './Maldives.css'

const Maldives = ({ set_popupopner, data,
    Edit_itineary
    , Edit_count_days
    , Edit_NightDataFields
    , Edit_selected_Travel_date
    , Travel_Duration
    , Edit_flightcost
    , Edit_visacost
    , Edit_landPackage
}) => {
    const [open, setopen] = useState(true)
    console.log(data)
    const days = Array(data.Travel_Duration).fill('a');
    const [countNight, setCountnight] = useState(0)
    const [days_total, setTotalDays] = useState(Edit_itineary ? Edit_itineary : days);
    const [count_days, setDayscounter] = useState(parseInt(Edit_count_days ? Edit_count_days : Travel_Duration))
    const [NightDataFields, setNightDataFields] = useState(Edit_NightDataFields ? Edit_NightDataFields : [
        { Night: [], HotelMeal: [], HotelName: '', City: '', Category: '', RoomType: '', comments: '' },])
    const [itineary, setItineary] = useState(Edit_itineary ? Edit_itineary : [{ Day: '', Description: '', Activity: {} },])
    const [selected_Travel_date, set_selected_Travel_date] = useState(Edit_selected_Travel_date ? Edit_selected_Travel_date : null)
    const [flightcost, setFlightcost] = useState(Edit_flightcost ? Edit_flightcost : 0)
    const [SelectedpackageType, setSelectedpackageType] = useState("Per Person")
    const [visacost, setvisacost] = useState(Edit_visacost ? Edit_visacost : 0)
    const [landPackage, setlandpackage] = useState(Edit_landPackage ? Edit_landPackage : 0)
    function closeHandler() {
        setopen(false)
        set_popupopner(false)
    }

    function Save_download() {
        // showPDF()
    }
    function itinearyDaysincrease() {
        let data = { Day: '', Description: '', Activity: {} }
        setItineary([...itineary, data])
    }
    function itinearyDaydecrease() {
        let data = [...itineary];
        data.pop()
        setItineary(data)
    }
    function flightcostChange(e) {
        setFlightcost(e.target.value)
    }
    function visacostChange(e) {
        setvisacost(e.target.value)
    }
    function landPackagechange(e) {
        setlandpackage(e.target.value)
    }
    function handleChange(event) {
        setSelectedpackageType(event.target.value);
    };
    function daysChanges(event) {
        let len = parseInt(event.target.value)
        var temp = Array(len).fill('a');
        setDayscounter(len)
        setTotalDays(temp)
        if (len > days_total.length) {
            itinearyDaysincrease()
        }
        if (len < days_total.length) {
            itinearyDaydecrease()
        }
        if (countNight < len) {
            setCountnight(countNight - 1)
        }
        else if (countNight > len) {
            setCountnight(countNight + 1)

        }

    }
    function select_date(e) {
        var date = e.target.value
        // console.log(date)
        set_selected_Travel_date(date)
        localStorage.setItem('Journeydate', date);
    }
    return (
        <Modal open={open} style={{ display: "flex", justifyContent: "right", marginTop: "4rem" }} >
            <div className='popUp_body'>
                <div className='save_close'>
                    <button className='compo_button' onClick={() => closeHandler()} >close</button>
                    <button className='compo_button' onClick={() => Save_download()}>save&downlod</button>
                </div>
                <h1>Basic Info</h1>
                <div>
                    <h4>
                        <span>Trip id:- </span>
                        <span>{data.TripId}</span>
                    </h4>
                    <h4>
                        <span>Budget:-</span>
                        <span>INR {data.Budget}/-</span>
                    </h4>
                    <h4>
                        <span>Travel Date:- </span>
                        <span>{moment(data.Travel_Date.toDate()).format('DD-MM-YYYY')}</span>
                    </h4>
                    <h4>
                        <span>Travel Duration :- </span>
                        <span>{data.Travel_Duration} days,{data.Travel_Duration - 1}Nights</span>
                    </h4>
                    <div>
                        {data.comments.map((data, index) => (<>
                            <span>{data}</span><br />
                        </>))}
                    </div>
                </div>
                <div className='basicDetails'>
                    <div>
                        <label>Days</label>
                        <input type="number" min="1" max="50" placeholder='Days count eg:-0,1,2,3..' onChange={(e) => daysChanges(e)} value={days_total.length} />
                    </div>
                    <div>
                        <label>Night</label>
                        <input placeholder='Night count eg:-0,1,2,3..' value={days_total.length - 1} readOnly={true}></input>
                    </div>
                </div>
                <div className='cost_body'>
                    <div className='costOption'>
                        <div>
                            <Radio
                                checked={SelectedpackageType === 'per Person'}
                                onChange={handleChange}
                                value="per Person"
                                name="radio-button"
                                color='primary'
                            // inputProps={{ 'aria-label': 'A' }}
                            />
                            <label>per Person</label>
                        </div>
                        <div>
                            <Radio
                                checked={SelectedpackageType === 'Total'}
                                onChange={handleChange}
                                value="Total"
                                name="radio-button"
                                color='primary'
                            // inputProps={{ 'aria-label': 'A' }}
                            />
                            <label>total</label>
                        </div>

                    </div>
                    <div className='costOption_estimatiom'>
                        <div>
                            <label >Flight Cost</label><br />
                            <input type="number"
                                className='input_filed'
                                placeholder='0'
                                value={flightcost}
                                onChange={(e) => flightcostChange(e)}
                            ></input>
                            <text className='spacer'>+</text>
                        </div>
                        <div>
                            <label>Visa Cost</label><br />
                            <input type="number" className='input_filed' placeholder='0' value={visacost} onChange={(e) => visacostChange(e)}></input>
                            <text className='spacer'>+</text>
                        </div>
                        <div>
                            <label>Land Package Cost</label><br />
                            <input type="number" className='input_filed' placeholder='0' value={landPackage} onChange={(e) => landPackagechange(e)}></input>
                            <text className='spacer'>=</text>
                        </div>

                        <div className='totalSeprator'>
                            <label>Quotation price</label><br />
                            <input type="number" className='input_filed' value={parseInt(flightcost) + parseInt(visacost) + parseInt(landPackage)} placeholder='0' readOnly={true}></input>
                        </div>
                    </div>
                </div>
                <label className='san-serif'>select Travel Date</label><br/>
                    <input type='date' value={selected_Travel_date} onChange={(e) => select_date(e)}></input>
            </div>

        </Modal>
    );
}

export default Maldives;
