import { Modal, Radio } from '@material-ui/core';
import Select from 'react-select';
import { EmojiTransportation, ExtensionSharp, Flight, PermIdentityTwoTone } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Profile from '../Profile/Profile';
import Inclusion from './Inclusion';
import makeAnimated from 'react-select/animated';
import './TripComponent.css';
import { ActivityResolver } from '../Profile/Activity';

const Box = ({
    email,
    data,
    updateprofile_LeadFollowup,
    updateprofile_Lead_Current,
    updateTableDataAfterQuote,
    set_popupopner,
    userProfile,
    profile
}) => {
    const animatedComponents = makeAnimated();
    const [Travel_Duration, setTravel_Duration] = useState(data.Travel_Duration)
    const [open, setOpen] = useState(true)
    const [SelectedpackageType, setSelectedpackageType] = useState("per Person")
    const [flightcost, setFlightcost] = useState(0)
    const [visacost, setvisacost] = useState(0)
    const [landPackage, setlandpackage] = useState(0)
    const [countNight, setCountnight] = useState(0)
    const [flight, setflight] = useState(true)
    const [cab, setcab] = useState(true)
    const [itineary, setItineary] = useState([{ Day: '', Description: '', Activity: '' },])
    const days = Array(data.Travel_Duration).fill('a');
    const [days_total, setTotalDays] = useState(days);
    const [count_days, setDayscounter] = useState(parseInt(data.Travel_Duration))
    const [NightDataFields, setNightDataFields] = useState([
        { Night: [], HotelName: '', City: '', Category: '', HotelType: '', comments: '' },])
    const [selected_Travel_date, set_selected_Travel_date] = useState()
    const [opennclusion, setInclusion] = useState(false)
    const [openPDF, setPDF] = useState(false)
    const [flights, setflights] = useState(null)
    const [cabDetailsData, setcabDetails] = useState(null)
    const [nights, setnights] = useState([])
    const [activity, setActivity] = useState([])
    const [inclusion_data, setinclusion] = useState(
        {
            Hotels: false,
            accommodation: false,
            breakfast: false,
            lunch: false,
            lunch_comments: '',
            dinner: false,
            dinner_comments: '',
            airport_arival: false,
            airport_departure: false,
            cab_SIC: false,
            cab_Private: false,
            cab_Private_comments: '',
            Gst: false,
            Tcs: false,
            airfair: false,
            siteseeing: false,
            siteseeing_comments: '',
            Visa: false,
            Visa_comments: '',
            Entrance_fee: false,
            Entrance_comments: '',
            other_Inclusion: '',
            other_Exclusion: ''
        }
    )


    function cabDetails(e) {
        setcabDetails(e.target.value)
    }
    function closePDF() {
        setPDF(false)
    }
    function showPDF() {
        setPDF(true)
    }
    function openInclusion() {
        setInclusion(true)
    }
    function closeInclusion() {
        setInclusion(false)
    }


    function handleOptionOfNights() {
        var list = []
        for (let start = 1; start <= days_total.length - 1; start++) {
            var tmp = { value: '', label: '' }
            tmp.value = ` N${start}`
            tmp.label = ` N${start}`
            list.push(tmp)
        }
        setnights(list)
    }
    useEffect(() => {
        handleOptionOfNights()
    }, [countNight]);
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
    function itinearyDaysincrease() {
        let data = { Day: '', Description: '', Activity: '' }
        setItineary([...itineary, data])
    }
    function itinearyDaydecrease() {
        let data = [...itineary];
        data.pop()
        setItineary(data)
    }
    function setVar() {
        for (let s = 0; s < Travel_Duration - 1; s++) {
            let data = { Day: '', Description: '', Activity: '' }
            let temp = itineary
            temp.push(data)
            setItineary(temp)
        }
    }
    useEffect(() => {
        setVar()
        setActivity(ActivityResolver(data.Destination))
    }, []);

    const handleFormChangeItineary = (event, index) => {
        let data = [...itineary];
        try {

            data[index][event.target.name] = event.target.value;
        }
        catch {
            data[index]['Activity'] = event.value
        }
        setItineary(data);
        console.log(data)

    }
    function addFields() {
        if (countNight < Travel_Duration - 2) {
            let object = { Night: '', HotelName: '', City: '', Category: '', HotelType: '', comments: '' }
            setNightDataFields([...NightDataFields, object])
            setCountnight(countNight + 1)
        }
    }
    function removeFields(index) {
        let data = [...NightDataFields];
        data.splice(index, 1)
        setNightDataFields(data)
        setCountnight(countNight - 1)

    }
    function advance_controller_nights(e, index) {
        let data = [...NightDataFields];
        let local_list = []
        for (var i = 0; i < e.length; i++) {
            local_list.push(e[i].value)
        }
        data[index]['Night'] = local_list;
        setNightDataFields(data);
    }
    const handleFormChange = (event, index) => {
        let data = [...NightDataFields];
        data[index][event.target.name] = event.target.value;
        setNightDataFields(data);
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

    const currency = ["INR", "ILS", "CNY", "KWD", "AFN", "MYR", "NPR", "PHP", "AMD", "EUR", "ISK", "USD", "CLP"]
    function openHandler() {
        setOpen(true)

    }
    function closeHandler() {
        setOpen(false)
        set_popupopner(false)
    }
    function handleChange(event) {
        setSelectedpackageType(event.target.value);
    };
    function Save_download() {
        showPDF()
    }
    function select_date(e) {
        set_selected_Travel_date(e.target.value)
    }
    function flightDetails(e) {
        setflights(e.target.value)
    }


    return (
        <>
            <Modal open={openPDF} onClose={closePDF} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <Profile
                    SelectedpackageType={SelectedpackageType}
                    email={email}
                    userProfile={userProfile}
                    indicator={false}
                    count_days={count_days}
                    inclusion_data={inclusion_data}
                    travel_data={data}
                    cabDetailsData={cabDetailsData}
                    flights={flights}
                    closePDF={closePDF}
                    closeHandler={closeHandler}
                    itineary={itineary}
                    NightDataFields={NightDataFields}
                    selected_Travel_date={selected_Travel_date}
                    flightcost={flightcost}
                    visacost={visacost}
                    landPackage={landPackage}
                    updateprofile_LeadFollowup={updateprofile_LeadFollowup}
                    updateprofile_Lead_Current={updateprofile_Lead_Current}
                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                    profile={profile}
                />
            </Modal>
            <Modal open={open} style={{ display: "flex", justifyContent: "right", marginTop: "4rem" }} >
                <div className='popUp_body'>
                    <div className='save_close'>
                        <button className='compo_button' onClick={() => closeHandler()} >close</button>
                        <button className='compo_button' onClick={() => Save_download()}>save&downlod</button>
                    </div>
                    <div>
                        <p className='basicDetailsheading'>Basic Details</p>
                        <div className='basicDetails'>
                            <div>
                                <label>Days</label>
                                <input type="number" placeholder='Days count eg:-0,1,2,3..' onChange={(e) => daysChanges(e)} value={days_total.length}></input>
                            </div>
                            <div>
                                <label>Night</label>
                                <input placeholder='Night count eg:-0,1,2,3..' value={days_total.length - 1} readOnly={true}></input>
                            </div>
                        </div>
                        <div className='cost_estimation_body'>
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
                                <div>
                                    <select className='currency_option'>
                                        <option value={currency[0]}>{currency[0]}</option>
                                        <option value={currency[1]}>{currency[1]}</option>
                                        <option value={currency[2]}>{currency[2]}</option>
                                        <option value={currency[3]}>{currency[3]}</option>
                                        <option value={currency[4]}>{currency[4]}</option>
                                        <option value={currency[5]}>{currency[5]}</option>
                                        <option value={currency[6]}>{currency[6]}</option>
                                        <option value={currency[7]}>{currency[7]}</option>
                                        <option value={currency[8]}>{currency[8]}</option>
                                        <option value={currency[9]}>{currency[9]}</option>
                                        <option value={currency[10]}>{currency[10]}</option>
                                        <option value={currency[11]}>{currency[11]}</option>

                                    </select>
                                </div>
                            </div>
                            <div className='costOption_estimatiom'>
                                <div>
                                    <label >Flight Cost</label><br />
                                    <input type="number"
                                        className='input_filed'
                                        placeholder='0'
                                        onChange={(e) => flightcostChange(e)}
                                    ></input>
                                    <text className='spacer'>+</text>
                                </div>
                                <div>
                                    <label>Visa Cost</label><br />
                                    <input type="number" className='input_filed' placeholder='0' onChange={(e) => visacostChange(e)}></input>
                                    <text className='spacer'>+</text>
                                </div>
                                <div>
                                    <label>Land Package Cost</label><br />
                                    <input type="number" className='input_filed' placeholder='0' onChange={(e) => landPackagechange(e)}></input>
                                    <text className='spacer'>=</text>
                                </div>

                                <div className='totalSeprator'>
                                    <label>Quotation price</label><br />
                                    <input type="number" className='input_filed' value={parseInt(flightcost) + parseInt(visacost) + parseInt(landPackage)} placeholder='0' readOnly={true}></input>
                                </div>

                            </div>
                        </div>
                        <div className='cost_estimation_body'>
                            <p className='HotelDetailsheading'>Hotel Details</p>
                            {
                                NightDataFields &&
                                NightDataFields.map((form, index) => {
                                    return (
                                        <>
                                            <div key={index} className='costOption_estimatiom'>
                                                <div className='unitComponent'>
                                                    <label>Night</label><br />
                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        isMulti
                                                        options={nights}
                                                        onChange={(e) => advance_controller_nights(e, index)}
                                                    />

                                                </div>
                                                <div className='unitComponent'>
                                                    <label>Hotel Name</label><br />
                                                    <input placeholder='hotel Name'
                                                        // list="programmingLanguages"
                                                        name='HotelName'
                                                        onChange={(event) => handleFormChange(event, index)}
                                                    // list="suggestions"
                                                    >
                                                    </input>

                                                </div>

                                                <div className='unitComponent'>
                                                    <label>City</label><br />
                                                    <input placeholder='city'
                                                        name='City'
                                                        onChange={(event) => handleFormChange(event, index)}
                                                    ></input>
                                                </div>
                                                <div className='unitComponent'>
                                                    <label>Category</label><br />
                                                    <input placeholder='Category'
                                                        list="programmingLanguages"
                                                        name='Category'
                                                        onChange={(event) => handleFormChange(event, index)}
                                                    />
                                                    <datalist id="programmingLanguages">
                                                        <option value="1 star">1 star</option>
                                                        <option value="2 star">2 star</option>
                                                        <option value="3 Star">3 star</option>
                                                        <option value="4 star">4 star</option>
                                                        <option value="5 star">5 star</option>
                                                        <option value="7 star">Java</option>

                                                    </datalist>
                                                </div>
                                                <div className='unitComponent'>
                                                    <label>Room Type</label><br />
                                                    <select defaultValue='normal' name='HotelType' onChange={(event) => handleFormChange(event, index)}>
                                                        <option value='standrad'>standrad</option>
                                                        <option value='delux'>delux</option>
                                                        <option value='super delux'>super delux</option>
                                                        <option value='Luxury'>Luxury</option>
                                                        <option value='duplex'>duplex</option>
                                                        <option value='Excutive suite'>Excutive suite</option>
                                                        <option value='family suite'>family suite</option>
                                                        <option value='grand suite'>grand suite</option>
                                                        <option value='HouseBoat'>HouseBoat</option>
                                                        <option value='superior room'>superior room</option>
                                                        <option value='others'>others</option>

                                                    </select>
                                                </div>
                                                <button onClick={() => removeFields(index)}>Remove</button>
                                            </div>
                                            <textarea
                                                className='comments'
                                                name='comments'
                                                onChange={(event) => handleFormChange(event, index)}
                                                placeholder='Additional information'
                                            ></textarea>
                                        </>
                                    );
                                }
                                )
                            }
                            <button className='addMore' onClick={addFields}>Add More..</button>
                            <div className='FlightDetails'>
                                <Flight />
                                <p>
                                    <input type='checkbox' onChange={() => setflight(!flight)}></input>
                                    <label>Flight Not Included</label>
                                </p>
                            </div>
                            {
                                flight ?
                                    <>
                                        <textarea onChange={(e) => flightDetails(e)} value={flights} className='flightdetails'>
                                        </textarea>
                                    </>
                                    :
                                    <></>
                            }
                            <div className='FlightDetails'>
                                <EmojiTransportation />
                                <p>
                                    <input type='checkbox' onChange={() => setcab(!cab)}></input>
                                    <label>cab Not Included</label>
                                </p>
                            </div>
                            {
                                cab ?
                                    <>
                                        <textarea onChange={(e) => cabDetails(e)} value={cabDetailsData} className='flightdetails'>
                                        </textarea>
                                    </>
                                    :
                                    <></>
                            }
                            <div className='inclusionExclusion'>
                                <ExtensionSharp />
                                <button onClick={() => openInclusion()}>Inclusion/Exclusion</button>
                            </div>
                            <Modal open={opennclusion} style={{ justifyContent: "center", with: '100%', overflowY: 'scroll' }} >
                                <>
                                    <Inclusion onClose={closeInclusion} setinclusion={setinclusion} inclusion_data={inclusion_data}></Inclusion>
                                </>
                            </Modal>

                            <div className='itineary'>
                                <p>Itinerary Start date</p>
                                <input type='date' onChange={(e) => select_date(e)}></input>
                            </div>
                            {
                                days_total &&
                                days_total.map((data, index) => {
                                    return (
                                        <div key={index} className='days'>
                                            <label className='title'>Day{index + 1}:Title</label><br />
                                            <div style={{ display: 'flex', alignItems: 'center' }} >
                                                <input className='dayByitineary' placeholder='Enter Title of the day' name='Day' onChange={(e) => handleFormChangeItineary(e, index)}></input>
                                                <Select
                                                    placeholder='Activity'
                                                    name='Activity'
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    options={activity}
                                                    onChange={(event) => handleFormChangeItineary(event, index)}
                                                />
                                            </div>
                                            <div>
                                                <label className='title'>Description</label><br />
                                                <textarea placeholder=' Write Description' name='Description' onChange={(event) => handleFormChangeItineary(event, index)} className='Description'></textarea>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
export default Box;