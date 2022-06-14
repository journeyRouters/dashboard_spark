import { Modal, Radio } from '@material-ui/core';
import { EmojiTransportation, ExtensionSharp, Flight } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Inclusion from '../CreateQuote/Inclusion';
import '../CreateQuote/TripComponent.css';
import Profile from '../Profile/Profile';


const Reqoute = (props) => {
    const animatedComponents = makeAnimated();
    const Data = props.data
    const [Travel_Duration, setTravel_Duration] = useState(Data.Travel_Duration)
    const [open, setOpen] = useState(true)
    const [SelectedValue, setSelectedValue] = useState("perPerson")
    const [flightcost, setFlightcost] = useState(0)
    const [visacost, setvisacost] = useState(0)
    const [landPackage, setlandpackage] = useState(0)
    const [marketcorrection, setmarketcorrection] = useState(0)
    const [countNight, setCountnight] = useState(0)
    const [flight, setflight] = useState(true)
    const [cab, setcab] = useState(true)
    const [itineary, setItineary] = useState(props.itineary)
    const days = Array(Data.Travel_Duration).fill('a');
    const [days_total, setTotalDays] = useState(props.itineary);
    const [NightDataFields, setNightDataFields] = useState([
        { Night: [], HotelName: '', City: '', Category: '', HotelType: '', comments: '' },])
    const [selected_date, set_selected_date] = useState(props.selected_date)
    const [opennclusion, setInclusion] = useState(false)
    const [openPDF, setPDF] = useState(false)
    const [inclusion_data, setinclusion] = useState([])
    const [flights, setflights] = useState(props.flights)
    const [cabDetailsData, setcabDetails] = useState(props.cabDetailsData)
    const [nights,setnights]=useState([])
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
    function handleOptionOfNights(){
        console.log('run')
        var list=[]
        for(let start=1;start<=days_total.length-1;start++){
            var tmp={ value: '', label: '' }
            tmp.value=` Night ${start}`
            tmp.label=` Night ${start}`
            console.log(tmp)
            list.push(tmp)
            console.log(list)
        }
        setnights(list)
    }
    useEffect(() => {
        handleOptionOfNights()
    }, [countNight]);
    function daysChanges(event) {
        // console.log(event,)
        let len = parseInt(event.target.value)
        var temp = Array(len).fill('a');
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
        handleOptionOfNights()


    }
    function itinearyDaysincrease() {
        let data = { Day: '', Description: '' }
        setItineary([...itineary, data])
    }
    function itinearyDaydecrease() {
        let data = [...itineary];
        data.pop()
        setItineary(data)
    }
    const handleFormChangeItineary = (event, index) => {
        let data = [...itineary];
        // console.log(data[index][event.target.name])
        data[index][event.target.name] = event.target.value;
        setItineary(data);
        console.log(itineary)
    }
    function addFields() {
        if (countNight < Travel_Duration - 2) {
            // console.log('hiii')
            let object = { Night: [], HotelName: '', City: '', Category: '', HotelType: '', comments: '' }
            setNightDataFields([...NightDataFields, object])
            setCountnight(countNight + 1)
            // console.log(NightDataFields)
        }
        console.log('hiii')


    }
    function removeFields(index) {
        let data = [...NightDataFields];
        data.splice(index, 1)
        setNightDataFields(data)
        setCountnight(countNight - 1)

    }
    const handleFormChange = (event, index) => {
        let data = [...NightDataFields];
        data[index][event.target.name] = event.target.value;
        setNightDataFields(data);
        // console.log(data)
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
    function marketcorrectionChnage(e) {
        setmarketcorrection(e.target.value)
    }
    const currency = [
        "INR",
        "ILS",
        "CNY",
        "KWD",
        "AFN",
        "MYR",
        "NPR",
        "PHP",
        "AMD",
        "EUR",
        "ISK",
        "USD",
        "CLP"
    ]

    function openHandler() {
        setOpen(true)


    }
   
    function advance_controller_nights(e, index) {
        console.log(e)
        let data = [...NightDataFields];
        let local_list = []
        for (var i = 0; i < e.length; i++) {
            local_list.push(e[i].value)
        }
        data[index]['Night'] = local_list;
        setNightDataFields(data);
    }
    function closeHandler() {
        setOpen(false)
        props.closeReqoute_flg()
    }
    function handleChange(event) {
        setSelectedValue(event.target.value);
    };
    function Save_download() {
        showPDF()
    }
    function select_date(e) {
        console.log(e)
        set_selected_date(e.target.value)
    }
    function flightDetails(e) {
        setflights(e.target.value)
    }

    return (
        <>

            <Modal open={openPDF} onClose={closePDF} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <Profile Allquote={props.Allquote} indicator={false} inclusion_data={inclusion_data} travel_data={Data} cabDetailsData={cabDetailsData} flights={flights} closePDF={closePDF} datahandle={props.datahandle} closeHandler={closeHandler} itineary={itineary} NightDataFields={NightDataFields} selected_date={selected_date} cost={parseInt(flightcost) + parseInt(visacost) + parseInt(marketcorrection) + parseInt(landPackage)} />
            </Modal>
            <Modal open={open} onClose={closeHandler} style={{ display: "flex", justifyContent: "right", marginTop: "4rem" }} >
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
                                        checked={SelectedValue === 'perPerson'}
                                        onChange={handleChange}
                                        value="perPerson"
                                        name="radio-button"
                                        color='primary'
                                    // inputProps={{ 'aria-label': 'A' }}
                                    />
                                    <label>per Person</label>
                                </div>
                                <div>
                                    <Radio
                                        checked={SelectedValue === 'total'}
                                        onChange={handleChange}
                                        value="total"
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
                                    <text className='spacer'>+</text>
                                </div>
                                <div>
                                    <label>Market Correction Amount</label><br />
                                    <input type="number" className='input_filed' placeholder='0' onChange={(e) => marketcorrectionChnage(e)}></input>
                                    <text className='spacer'>=</text>
                                </div>
                                <div className='totalSeprator'>
                                    <label>Quotation price</label><br />
                                    <input type="number" className='input_filed' value={parseInt(flightcost) + parseInt(visacost) + parseInt(marketcorrection) + parseInt(landPackage)} placeholder='0' readOnly={true}></input>
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
                                            <div className='costOption_estimatiom'>
                                                <div className='unitComponent'>
                                                    <label>Night</label><br />
                                                    <Select
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        isMulti
                                                        options={nights}
                                                        onChange={(e) => advance_controller_nights(e, index)}
                                                    />
                                                    {/* <select placeholder='select'
                                                        name='Night'
                                                        onChange={(event) =>
                                                            handleFormChange(event, index)
                                                            // console.log(event)
                                                        }


                                                    >
                                                        {days_total.map((option, index) => (
                                                            <option value={index + 1}>{index + 1} night</option>
                                                        ))}


                                                    </select> */}
                                                </div>
                                                <div className='unitComponent'>
                                                    <label>Hotel Name</label><br />
                                                    <input placeholder='hotel Name'
                                                        name='HotelName'
                                                        onChange={(event) => handleFormChange(event, index)}
                                                    ></input>
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
                                                        name='Category'
                                                        onChange={(event) => handleFormChange(event, index)}
                                                    ></input>
                                                </div>
                                                <div className='unitComponent'>
                                                    <label>Hotel Type</label><br />
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
                                    <input type='checkbox' onChange={() => setflight(!flight)} ></input>
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
                            <Modal open={opennclusion} onClose={closeInclusion} style={{ justifyContent: "center", with: '100%', overflowY: 'scroll' }} >
                                <>
                                    <Inclusion onClose={closeInclusion} setinclusion={setinclusion}></Inclusion>
                                </>
                            </Modal>

                            <div className='itineary'>
                                <p>Itinerary Start date</p>
                                <input type='date' onChange={(e) => select_date(e)} value={selected_date}></input>
                            </div>
                            {
                                days_total &&
                                days_total.map((data, index) => {
                                    return (
                                        <div className='days'>
                                            <label className='title'>Day{index + 1}:Title</label><br />
                                            <input className='dayByitineary' value={data.Day} placeholder='Enter Title of the day' name='Day' onChange={(e) => handleFormChangeItineary(e, index)}></input>
                                            <div>
                                                <label className='title'>Description</label><br />
                                                <textarea placeholder=' Write Description' value={data.Description} name='Description' onChange={(event) => handleFormChangeItineary(event, index)} className='Description'></textarea>
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

export default Reqoute;
