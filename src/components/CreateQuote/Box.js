import { Modal, Radio } from '@material-ui/core';
import Select from 'react-select';
import { EmojiTransportation, ExtensionSharp, Flight, PermIdentityTwoTone, Tune } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import Profile from '../Profile/Profile';
import Inclusion from './Inclusion';
import makeAnimated from 'react-select/animated';
import './TripComponent.css';
import { ActivityResolver } from '../Profile/Activity';
import { DropzoneArea } from 'material-ui-dropzone';
import moment from 'moment';
import RoomType from './subComponents/RoomType';
import Maldives from './Maldives';
import { Upload } from "@progress/kendo-react-upload";


const Box = ({
    email,
    handleSuggestion,
    data,
    usingLastQuotes,
    updateTableDataAfterQuote,
    set_popupopner,
    userProfile,
    profile,
    indicator,
    inclusion_data_,
    Edit_itineary,
    Edit_NightDataFields,
    Edit_selected_Travel_date,
    Edit_visacost,
    Edit_flightcost,
    Edit_landPackage,
    Edit_count_days,
    Allquote
}) => {
    // console.log(data)
    const animatedComponents = makeAnimated();
    const [Travel_Duration, setTravel_Duration] = useState(data.Travel_Duration)
    const [open, setOpen] = useState(true)
    const [SelectedpackageType, setSelectedpackageType] = useState("Per Person")
    const [flightcost, setFlightcost] = useState(Edit_flightcost ? Edit_flightcost : 0)
    const [visacost, setvisacost] = useState(Edit_visacost ? Edit_visacost : 0)
    const [landPackage, setlandpackage] = useState(Edit_landPackage ? Edit_landPackage : 0)
    const [countNight, setCountnight] = useState(0)
    const [flight, setflight] = useState(true)
    const [cab, setcab] = useState(true)
    const [itineary, setItineary] = useState(Edit_itineary ? Edit_itineary : [{ Day: '', Description: '', Activity: {} },])
    const days = Array(data.Travel_Duration).fill('a');
    const [days_total, setTotalDays] = useState(Edit_itineary ? Edit_itineary : days);
    const [count_days, setDayscounter] = useState(parseInt(Edit_count_days ? Edit_count_days : Travel_Duration))
    const [NightDataFields, setNightDataFields] = useState(Edit_NightDataFields ? Edit_NightDataFields : [
        { Night: [], HotelMeal: [], HotelName: '', City: '', Category: '', RoomType: '', comments: '' },])
    const [selected_Travel_date, set_selected_Travel_date] = useState(Edit_selected_Travel_date ? Edit_selected_Travel_date : null)
    const [opennclusion, setInclusion] = useState(false)
    const [openPDF, setPDF] = useState(false)
    const [flightsObject, setflightsObject] = useState([])
    const [flightImgUrl, setflightImgUrl] = useState([])
    const [cabDetailsData, setcabDetails] = useState(null)
    const [nights, setnights] = useState([])
    const [activity, setActivity] = useState([])
    const [Pax, setPax] = useState(data.Pax)
    const [Child, setChild] = useState(data.Child ? data.Child : 0)
    const [Destination, setDestination] = useState(data.Destination)
    const inclusion = {
        accommodation: false,
        breakfast: false,
        lunch: false,
        lunch_comments: '',
        dinner: false,
        dinner_comments: '',
        airport_Arival: false,
        airport_Departure: false,
        Transfer: false,
        cab_Private_comments: '',
        // Gst: false,
        // Tcs: false,
        Flight: false,
        sightseeing: false,
        siteseeing_comments: '',
        Visa: false,
        Visa_comments: '',
        Entrance_fee: false,
        Entrance_comments: '',
        other_Inclusion: '',
        other_Exclusion: ''
    }
    const [inclusion_data, setinclusion] = useState(indicator ? inclusion_data_ : inclusion)
    const HotelMeals = [
        {
            label: "BreakFast",
            value: "BreakFast"
        },
        {
            label: "Lunch",
            value: "Lunch"
        },
        {
            label: "Dinner",
            value: "Dinner"
        },
        {
            label: "Drinks",
            value: "Drinks"
        }
    ]
    function changingDestination(Destination) {
        console.log(itineary)
        setDestination(Destination.target.value)
        data.Destination = Destination.target.value
    }
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
            tmp.value = `N${start}`
            tmp.label = `N${start}`
            list.push(tmp)
        }
        setnights(list)
    }
    useEffect(() => {
        // console.log(data)
        handleOptionOfNights()
    }, [countNight]);
    useEffect(() => {
        // console.log(Edit_itineary)
        if (!Edit_itineary) {
            setVar()
        }

        setActivity(ActivityResolver(data.Destination))
        // console.log(Edit_itineary)

    }, [Destination]);
    useEffect(() => {
        localStorage.setItem('Journeydate', selected_Travel_date);
    }, [openPDF]);
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
    function changePax(event) {
        setPax(event.target.value)
        data.Pax = event.target.value
    }
    function changechild(event) {
        setChild(event.target.value)
        data.Child = event.target.value
        // console.log(data)
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
    function setVar() {
        console.log('hey')
        if(itineary.length<=1){

            for (let s = 0; s < Travel_Duration - 1; s++) {
                let data = { Day: '', Description: '', Activity: {} }
                let temp = itineary
                temp.push(data)
                setItineary(temp)
            }
        }
    }
    function advance_controller_Activity(e, index) {
        let data = [...itineary];
        // console.log(e,data)    
        data[index]['Activity'] = e;
        setItineary(data);
    }

    const handleFormChangeItineary = (event, index) => {
        let data = [...itineary];
        data[index][event.target.name] = event.target.value;
        setItineary(data);
        // console.log(data)

    }
    function addFields() {
        if (countNight < Travel_Duration - 2) {
            let object = { Night: [], HotelMeal: [], HotelName: '', City: '', Category: '', RoomType: '', comments: '' }
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
            let Local_Object = { label: '', value: '' }
            Local_Object.label = e[i].value
            Local_Object.value = e[i].value
            local_list.push(Local_Object)
        }
        data[index]['Night'] = local_list;
        setNightDataFields(data);
    }
    function advance_controller_Hotel_meals(e, index) {
        let data = [...NightDataFields];
        let local_list = []
        for (var i = 0; i < e.length; i++) {
            let Local_Object = { label: '', value: '' }
            Local_Object.label = e[i].value
            Local_Object.value = e[i].value
            local_list.push(Local_Object)
        }
        data[index]['HotelMeal'] = local_list;
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

    function openHandler() {
        setOpen(true)

    }
    function closeHandler() {
        try {
            Allquote()
        }
        catch (error) { console.log(error) }
        setOpen(false)
        set_popupopner(false)
    }
    function handleChange(event) {
        setSelectedpackageType(event.target.value);
    };
    function Save_download() {
        showPDF()
    }
    // function test(date,days) {
    //     let date_= new Date(date);
    //     date_.setDate(date_.getDate() + days);
    //     console.log(moment(date_).format('DD MMMM YYYY'))
    //     return date_;
    // }
    function select_date(e) {
        var date = e.target.value
        // console.log(date)
        set_selected_Travel_date(date)
        localStorage.setItem('Journeydate', date);
    }
    function flightDetails(files) {
        // console.log(files)
        setflightsObject(files)
    }
    function handlePasteFlight(e) {
        if (e.clipboardData.files.length) {
            var localHolder = flightsObject
            const fileObject = e.clipboardData.files[0];
            // console.log(fileObject)
            localHolder.push(fileObject)
            setflightsObject(localHolder)
            convertObjectToLink(fileObject)
        }
    }
    function deletefrom(index) {
        var OperationObjects = [...flightsObject]
        var oprationLinks = [...flightImgUrl]
        OperationObjects.splice(index, 1)
        setflightsObject(OperationObjects)
        oprationLinks.splice(index, 1)
        setflightImgUrl(oprationLinks)

    }
    async function convertObjectToLink(files) {
        try {
            const file = files
            var local_link_list = [...flightImgUrl]
            const url = URL.createObjectURL(file)
            local_link_list.push(url)
            setflightImgUrl(local_link_list)
        }
        catch (e) { console.log(e) }

    }
    var formatter = new Intl.NumberFormat('en-US', {})

    return (
        <>
            {
                Destination === "Maldives" ? <>
                    <Maldives
                        email={email}
                        data={data}
                        updateTableDataAfterQuote={updateTableDataAfterQuote}
                        set_popupopner={set_popupopner}
                        profile={profile}
                    />
                </> : <>
                    <Modal open={open} style={{ display: "flex", justifyContent: "right", marginTop: "4rem" }} >
                        <div className='popUp_body'>

                            <div className='save_close'>
                                <button className='compo_button' onClick={() => closeHandler()} >close</button>
                                <button className='compo_button' onClick={() => Save_download()}>save&downlod</button>
                            </div>
                            <div >
                                <div style={{ display: 'flex', width: '64%', justifyContent: 'space-between' }} >
                                    <div>
                                        <h4>
                                            <span>Trip id:- </span>
                                            <span>{data.TripId}</span>
                                        </h4>
                                        <h4>
                                            <span>Budget:-</span>
                                            <span>INR {formatter.format(data.Budget)}/-</span>
                                        </h4>
                                        <h4>
                                            <span>Travel Date:- </span>
                                            <span>{moment(data.Travel_Date.toDate()).format('DD-MMMM-YYYY')}</span>
                                        </h4>
                                        <h4>
                                            <span>Travel Duration :- </span>
                                            <span>{data.Travel_Duration} days,{data.Travel_Duration - 1}Nights</span>
                                        </h4>
                                    </div>
                                    <div>
                                        <h4>
                                            <span>No of pax:- </span>
                                            <span>{data.Pax}</span>
                                        </h4>
                                        <h4>
                                            <span>No of child:- </span>
                                            <span>{data.Child ? data.Child : 0}</span>
                                        </h4>
                                        <h4>
                                            <span>Contact:- </span>
                                            <span>{data.Contact_Number}</span>
                                        </h4>

                                    </div>
                                    <div>
                                        <h4>
                                            <span>Departure City:- </span>
                                            <span style={{ border: "2px solid green" }}>{data.Departure_City}</span>
                                        </h4>
                                        <h4>
                                            <span>Traveler:- </span>
                                            <span style={{ border: "2px solid Blue" }}>{data.Traveller_name}</span>
                                        </h4>
                                        <h4>
                                            <span>Destination:- </span>
                                            <span style={{ border: "2px solid green" }}>{data.Destination}</span>
                                            <select onChange={(destination) => changingDestination(destination)}>
                                                <option value={'change Destination'}>change Destination</option>
                                                <option value={'Dubai'}>Dubai</option>
                                                <option value={'Maldives'}>Maldives</option>
                                                <option value={'Thailand'}>Thailand</option>
                                                <option value={'Singapore'}>Singapore</option>
                                                <option value={'Malaysia'}>Malaysia</option>
                                                <option value={'Bali'}>Bali</option>
                                                <option value={'Himachal'}>Himachal</option>
                                                <option value={'Ladakh'}>Ladakh</option>
                                                <option value={'Kerala'}>Kerala</option>
                                            </select>
                                        </h4>
                                    </div>
                                    {/* <div>
                                        {
                                            data.Comment? <>
                                                comments:-
                                                {data.Comment.map((data, index) => (<>
                                                    <span key={index}>{data}</span><br />
                                                </>))}
                                            </> : <></>
                                        }

                                    </div> */}
                                </div>
                                <p className='basicDetailsheading'>Basic Details</p>
                                <div className='basicDetails'>
                                    <div>
                                        <label className='san-serif'>Days</label><br />
                                        <input type="number" min="1" max="50" placeholder='Days count eg:-0,1,2,3..' onChange={(e) => daysChanges(e)} value={days_total.length} />
                                    </div>
                                    <div>
                                        <label className='san-serif'>Night</label><br />
                                        <input placeholder='Night count eg:-0,1,2,3..' value={days_total.length - 1} readOnly={true}></input>
                                    </div>
                                    <div>
                                        <label className='san-serif'>number of Pax</label><br />
                                        <input value={Pax} onChange={(e) => changePax(e)}></input>
                                    </div>
                                    <div>
                                        <label className='san-serif'>number of Child</label><br />
                                        <input onChange={(e) => changechild(e)} value={Child}></input>
                                    </div>
                                </div>
                                <div className='cost_estimation_body'>
                                    <div className='costOption'>
                                        <div>
                                            <Radio
                                                checked={SelectedpackageType === 'Per Person'}
                                                onChange={handleChange}
                                                value="Per Person"
                                                name="radio-button"
                                                color='primary'
                                            // inputProps={{ 'aria-label': 'A' }}
                                            />
                                            <label>per Person</label>
                                        </div>
                                        <div>
                                            <Radio
                                                checked={SelectedpackageType === 'Per Couple'}
                                                onChange={handleChange}
                                                value="Per Couple"
                                                name="radio-button"
                                                color='primary'
                                            // inputProps={{ 'aria-label': 'A' }}
                                            />
                                            <label>per Couple</label>
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
                                                placeholder='Flight'
                                                value={flightcost}
                                                onChange={(e) => flightcostChange(e)}
                                            ></input>
                                            <span className='spacer'>+</span>
                                        </div>
                                        <div>
                                            <label>Visa Cost</label><br />
                                            <input type="number" className='input_filed' placeholder='visa' value={visacost} onChange={(e) => visacostChange(e)}></input>
                                            <span className='spacer'>+</span>
                                        </div>
                                        <div>
                                            <label>Land Package Cost</label><br />
                                            <input type="number" className='input_filed' placeholder='Land' value={landPackage} onChange={(e) => landPackagechange(e)}></input>
                                            <span className='spacer'>=</span>
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
                                        // console.log(NightDataFields),
                                        NightDataFields &&
                                        NightDataFields.map((data, index) => {
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
                                                                defaultValue={Edit_NightDataFields ? data.Night : null}
                                                                onChange={(e) => advance_controller_nights(e, index)}
                                                            />
                                                        </div>
                                                        <div className='unitComponent'>
                                                            <label>HotelMeal</label><br />
                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                components={animatedComponents}
                                                                isMulti
                                                                defaultValue={Edit_NightDataFields ? data.HotelMeal : null}
                                                                options={HotelMeals}
                                                                onChange={(e) => advance_controller_Hotel_meals(e, index)}
                                                            />
                                                        </div>
                                                        <div className='unitComponent'>
                                                            <label>Hotel Name</label><br />
                                                            <input placeholder='hotel Name'
                                                                name='HotelName'
                                                                value={data.HotelName}
                                                                onChange={(event) => handleFormChange(event, index)}
                                                            >
                                                            </input>

                                                        </div>

                                                        <div className='unitComponent'>
                                                            <label>City</label><br />
                                                            <input placeholder='city'
                                                                name='City'
                                                                value={data.City}
                                                                onChange={(event) => handleFormChange(event, index)}
                                                            ></input>
                                                        </div>
                                                        <div className='unitComponent'>
                                                            <label>Category</label><br />
                                                            <input placeholder='Category'
                                                                list="HotelCategory"
                                                                name='Category'
                                                                value={data.Category}
                                                                onChange={(event) => handleFormChange(event, index)}
                                                            />
                                                            <datalist id="HotelCategory">
                                                                <option value="1 star">1 star</option>
                                                                <option value="2 star">2 star</option>
                                                                <option value="3 Star">3 star</option>
                                                                <option value="4 star">4 star</option>
                                                                <option value="5 star">5 star</option>
                                                                <option value="7 star">7 Star</option>

                                                            </datalist>
                                                        </div>
                                                        <div className='unitComponent'>
                                                            <label>Room Type</label>
                                                            <RoomType
                                                                handleFormChange={handleFormChange}
                                                                index={index}
                                                                value={data.RoomType}
                                                            />
                                                        </div>
                                                        <button style={{ height: '32px' }} onClick={() => removeFields(index)}>Remove</button>
                                                    </div>
                                                    {/* <textarea
                                                className='comments'
                                                name='comments'
                                                value={data.comments}
                                                onChange={(event) => handleFormChange(event, index)}
                                                placeholder='Additional information'
                                            ></textarea> */}
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

                                                <div onPaste={(e) => handlePasteFlight(e)}>
                                                    <Upload
                                                        autoUpload={false}
                                                        batch={false}
                                                        multiple={true}
                                                    />
                                                    <div
                                                        className='copypastArea'
                                                    >
                                                        <div >
                                                            {
                                                                flightImgUrl ? <>
                                                                    <div className='grid-container'>
                                                                        <div className='grid-item'>
                                                                            {
                                                                                flightImgUrl.map((link, index) => (<>
                                                                                    <div>
                                                                                        <span onClick={() => deletefrom(index, 'flight')}>
                                                                                            <img alt='delete icon' src='/assets/img/deleteIcon.png' />
                                                                                        </span>
                                                                                        <img width='320px' src={link} />
                                                                                    </div>
                                                                                </>))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </> : <></>
                                                            }
                                                        </div>
                                                        Paste Area

                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <></>
                                    }
                                    {/* <div className='FlightDetails'>
                                <EmojiTransportation />
                                <p>
                                    <input type='checkbox' onChange={() => setcab(!cab)}></input>
                                    <label>cab Not Included</label>
                                </p>
                            </div>
                            {
                                cab ?
                                    <>
                                        <input accept="image" onChange={(e) => cabDetails(e)} value={cabDetailsData} className='flightdetails'>
                                        </input>
                                    </>
                                    :
                                    <></>
                            } */}
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
                                        <input type='date' value={selected_Travel_date} onChange={(e) => select_date(e)}></input>
                                    </div>
                                    {
                                        days_total &&
                                        days_total.map((data, index) => {
                                            // console.log(data)
                                            return (
                                                <div key={index} className='days'>
                                                    <label className='title'>Day{index + 1}:Title</label><br />
                                                    <div style={{ display: 'flex', alignItems: 'baseline' }} >
                                                        <input className='dayByitineary' placeholder='Enter Title of the day' value={data.Day} name='Day' onChange={(e) => handleFormChangeItineary(e, index)}></input>
                                                        <Select
                                                            className='Autocomplete'
                                                            placeholder='Activity'
                                                            name='Activity'
                                                            closeMenuOnSelect={true}
                                                            components={animatedComponents}
                                                            options={activity}
                                                            defaultValue={Edit_itineary ? data.Activity : null}
                                                            onChange={(event) => advance_controller_Activity(event, index)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='title'>Description</label><br />
                                                        <textarea placeholder=' Write Description' name='Description' value={data.Description} onChange={(event) => handleFormChangeItineary(event, index)} className='Description'></textarea>
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
            }
            <Modal open={openPDF} onClose={closePDF} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }} >
                <Profile
                    SelectedpackageType={SelectedpackageType}
                    handleSuggestion={handleSuggestion}
                    email={email}
                    indicator={false}
                    count_days={count_days}
                    inclusion_data={inclusion_data}
                    travel_data={data}
                    cabDetailsData={cabDetailsData}
                    flightsObject={flightsObject}
                    closePDF={closePDF}
                    closeHandler={closeHandler}
                    itineary={itineary}
                    NightDataFields={NightDataFields}
                    selected_Travel_date={selected_Travel_date}
                    flightcost={flightcost}
                    visacost={visacost}
                    landPackage={landPackage}
                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                    profile={profile}
                    flight={flight}
                    Allquote={Allquote}
                />
            </Modal>

        </>
    );
}
export default Box;