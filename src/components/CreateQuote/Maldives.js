import { Modal, Radio } from '@material-ui/core';
import { Flight } from '@material-ui/icons';
import DeckIcon from '@material-ui/icons/Deck';
import { Upload } from "@progress/kendo-react-upload";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Maldivespdf from '../MaldivesPdf/Maldivespdf';
import Box from './Box';
import './Maldives.css';
import MaldivesInclusion from './MaldivesInclusion';
import { RoomTypeReflector } from './MaldivesRoomTypeReflector';
import { propertyMaldives } from './subComponents/MaldivesPropertyReflector';

const Maldives = ({
    closeMaldivesSuggestionModal,
    set_popupopner
    , Edit_no_rooms
    , data: PassData
    , Edit_SelectedpackageType
    , Edit_itineary
    , Edit_count_days
    , Edit_NightDataFields
    , Edit_selected_Travel_date
    , Travel_Duration
    , Edit_flightcost
    , Edit_visacost
    , Edit_landPackage
    , inclusion_data_
    , profile
    , Edit_Property
    , Edit_MealPlan
    , Edit_Transfer
    , pre_flightImgLinks
    , pre_inclusionLinks
    , E_indicator
    , Allquote
    , updateTableDataAfterQuote
    , email
}) => {
    const animatedComponents = makeAnimated();
    const [open, setopen] = useState(true)
    const [data, setdata] = useState(PassData)
    const days = Array(data.Travel_Duration).fill('a');
    const [countNight, setCountnight] = useState(0)
    const [days_total, setTotalDays] = useState(Edit_itineary ? Edit_itineary : days);
    const [count_days, setDayscounter] = useState(parseInt(Edit_count_days ? Edit_count_days : data.Travel_Duration))
    const [NightDataFields, setNightDataFields] = useState(Edit_NightDataFields ? Edit_NightDataFields : [
        { Night: [], RoomType: '' }])
    // const[other]
    const [OtherOption, setOtherOption] = useState(
        [
            {
                Price: 0,
                Food: null,
                stay: [{ Night: [], RoomType: '' }]
            }
        ]
    )
    const [itineary, setItineary] = useState(Edit_itineary ? Edit_itineary : [{ Day: '', Description: '', Activity: {} },])
    const [selected_Travel_date, set_selected_Travel_date] = useState(Edit_selected_Travel_date ? Edit_selected_Travel_date : null)
    const [flightcost, setFlightcost] = useState(Edit_flightcost ? Edit_flightcost : 0)
    const [visacost, setvisacost] = useState(Edit_visacost ? Edit_visacost : 0)
    const [landPackage, setlandpackage] = useState(Edit_landPackage ? Edit_landPackage : 0)
    const [SelectedpackageType, setSelectedpackageType] = useState(Edit_SelectedpackageType ? Edit_SelectedpackageType : "Per Person")
    const [nights, setnights] = useState([])
    const [Transfer, settransfer] = useState(Edit_Transfer ? Edit_Transfer : [])
    const [propertyAvail, setpropertyAvail] = useState(propertyMaldives)
    const [roomTypeAvail, setRoomTye] = useState([])
    const [property, setproperty] = useState(Edit_Property ? Edit_Property : null)
    const [MealPlan, setmealplan] = useState(Edit_MealPlan ? Edit_MealPlan : null)
    const [pdfFlg, setpdfFlg] = useState(false)
    const [no_rooms, setrooms] = useState(Edit_no_rooms ? Edit_no_rooms : 0)
    const [flightFlg, setflightFlg] = useState(true)
    const [inclusionImgFlg, setinclusionImgFlg] = useState(true)
    const [flightsObject, setflightsObject] = useState([])
    const [flightImgUrl, setflightImgUrl] = useState([])
    const [Pax, setPax] = useState(data.Pax)
    const [Child, setChild] = useState(data.Child ? data.Child : 0)
    const [inclusionflg, setinclusion] = useState(false)
    const [Destination, setDestination] = useState(data.Destination)
    const [ScreenShotsurl, setScreenShotsurl] = useState([])
    const [screenshotsObject, setScreenshotsobject] = useState([])

    const inclusion = {
        Accommodation: false,
        MealPlan: false,
        Transfer: false,
        Gst: false,
        Tcs: false,
        Visa: false,
        GreenTax: false,
        Other_Inclusion: '',
        Other_Exclusion: ''
    }
    const [InclusionExclusion, setInclusionExclusion] = useState(inclusion_data_ ? inclusion_data_ : inclusion)
    const [EditController, setEditController] = useState(false)

    const TransferOption = [
        {
            label: "Speed Boat",
            value: "Speed Boat"
        },
        {
            label: "Domestic Flights",
            value: "Domestic Flights"
        },
        {
            label: "Sea Plane",
            value: "Sea Plane"
        },

    ]
    const HotelMeals = [
        {
            label: "BreakFast",
            value: "BreakFast"
        },
        {
            label: "Half Board",
            value: "Half Board"
        },
        {
            label: "Full Board",
            value: "Full Board"
        },
        {
            label: "All Inclusive",
            value: "All Inclusive"
        }
    ]
    function deletefrom(index, zone) {
        // console.log(index, 'done', screenshotsObject.ScreenShotsurl)
        if (zone == 'inclusion') {

            var OperationObjects = [...screenshotsObject]
            var oprationLinks = [...ScreenShotsurl]
            OperationObjects.splice(index, 1)
            setScreenshotsobject(OperationObjects)
            oprationLinks.splice(index, 1)
            setScreenShotsurl(oprationLinks)
        }
        if (zone == 'flight') {
            var OperationObjects = [...flightsObject]
            var oprationLinks = [...flightImgUrl]
            OperationObjects.splice(index, 1)
            setflightsObject(OperationObjects)
            oprationLinks.splice(index, 1)
            setflightImgUrl(oprationLinks)
        }

    }
    function handlePasteFlight(e) {
        if (e.clipboardData.files.length) {
            var localHolder = flightsObject
            const fileObject = e.clipboardData.files[0];
            // console.log(fileObject)
            localHolder.push(fileObject)
            setflightsObject(localHolder)
            convertObjectToLink(fileObject, 'flight')
        }
    }
    function handlePaste(e) {
        if (e.clipboardData.files.length) {
            var localHolder = screenshotsObject
            const fileObject = e.clipboardData.files[0];
            // console.log(fileObject)
            localHolder.push(fileObject)
            setScreenshotsobject(localHolder)
            convertObjectToLink(fileObject, 'inclusion')
        }
    }
    async function convertObjectToLink(files, zone) {
        try {
            const file = files
            // console.log(file)
            if (zone == 'inclusion') {
                var local_link_list = [...ScreenShotsurl]
                const url = URL.createObjectURL(file)
                local_link_list.push(url)
                setScreenShotsurl(local_link_list)
            }
            if (zone == 'flight') {
                var local_link_list = [...flightImgUrl]
                const url = URL.createObjectURL(file)
                local_link_list.push(url)
                setflightImgUrl(local_link_list)
            }
        }
        catch (e) { console.log(e) }

    }

    function closeInclusion() {
        setinclusion(false)
    }
    function NO_ofRooms(e) {
        setrooms(e.target.value)
    }
    function onClosePdf() {
        setpdfFlg(!pdfFlg)
    }
    function addFields() {
        let object = { Night: [], RoomType: '' }
        setNightDataFields([...NightDataFields, object])
        setCountnight(countNight + 1)

    }
    function removeFields(index) {
        let data = [...NightDataFields];
        data.splice(index, 1)
        setNightDataFields(data)
        setCountnight(countNight - 1)

    }
    useEffect(() => {
        handleOptionOfNights()

    }, []);
    function ChangeNameOnPackage(name) {
        data.Traveller_name = name
    }
    function emailhandler(email) {
        data.Email = email
    }
    function flightDetails(files) {
        // console.log(files)
        setflightsObject(files)
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
    function closeHandler() {
        try {
            Allquote()
        }
        catch (error) { console.log(error) }
        setopen(false)
        set_popupopner(false)
    }
    function closeMaldivesForm() {
        set_popupopner(false)

    }

    function Save_download() {
        if (property) {
            setpdfFlg(true)
        }
        else { alert('select a property') }
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

    const handleFormChange = (event, index) => {
        let data = [...NightDataFields];
        data[index]['RoomType'] = event;
        setNightDataFields(data);
    }
    const handleFormChangePropety = (event, index) => {
        // console.log(RoomTypeReflector(event.label))
        setRoomTye(RoomTypeReflector(event.value))
        setproperty(event)
    }
    function handleMealPlan(e) {
        setmealplan(e)
    }
    function removeFields(index) {
        let data = [...NightDataFields];
        data.splice(index, 1)
        setNightDataFields(data)
        setCountnight(countNight - 1)

    }
    function handleTransfer(e) {
        // console.log(e)
        settransfer(e)
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
    function select_date(e) {
        var date = e.target.value
        // console.log(date)
        set_selected_Travel_date(date)
        localStorage.setItem('Journeydate', date);
    }
    function newImageObjectWilAppear(e) {
        setEditController(!EditController)
    }
    function changingDestination(Destination) {
        // console.log(Destination.target.value)
        setDestination(Destination.target.value)
        data.Destination = Destination.target.value
    }

    return (<>
        <Modal open={pdfFlg} onClose={onClosePdf} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }}>
            <Maldivespdf
                updateTableDataAfterQuote={updateTableDataAfterQuote}
                data={data}
                closeMaldivesForm={closeMaldivesForm}
                closeMaldivesSuggestionModal={closeMaldivesSuggestionModal}
                no_rooms={no_rooms}
                selected_Travel_date={selected_Travel_date}
                MealPlan={MealPlan}
                Transfer={Transfer}
                NightDataFields={NightDataFields}
                count_days={count_days}
                flightcost={flightcost}
                visacost={visacost}
                landPackage={landPackage}
                SelectedpackageType={SelectedpackageType}
                Property={property}
                flightsObject={flightsObject}
                inclusionObject={screenshotsObject}
                flightFlg={flightFlg}
                inclusionImgFlg={inclusionImgFlg}
                Pax={Pax}
                Child={Child}
                inclusion_data={InclusionExclusion}
                profile={profile}
                indicator={true}
                E_indicator={EditController}
                flightsLinkfromstorage={pre_flightImgLinks}
                inclusionLinkfromstorage={pre_inclusionLinks}
                Allquote={Allquote}
                onClosePdf={onClosePdf}
            />
        </Modal>
        <Modal open={inclusionflg} style={{ display: "grid", justifyContent: "center", marginTop: "4rem", with: '100%', overflowY: 'scroll' }}>
            <MaldivesInclusion
                setinclusion={setInclusionExclusion}
                onClose={closeInclusion}
                inclusion_data={InclusionExclusion}
            />
        </Modal>
        {
            Destination === "Maldives" ? <>
                <Modal open={open} style={{ display: "flex", justifyContent: "right", marginTop: "4rem" }} >
                    <div className='popUp_body'>
                        <div className='save_close'>
                            <button className='compo_button' onClick={() => closeHandler()} >close</button>
                            <button className='compo_button' onClick={() => Save_download()}>save&downlod</button>
                        </div>
                        <div style={{ display: 'flex', width: '64%', justifyContent: 'space-between' }} >
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
                                        <option value={'Kashmir'}>Kashmir</option>
                                        <option value={'Andaman'}>Andaman</option>
                                        <option value={'Goa'}>Goa</option>
                                        <option value={'Singapore'}>Singapore</option>
                                        <option value={'Rajasthan'}>Rajasthan</option>
                                        <option value={'Vietnam'}>Vietnam</option>
                                        <option value={'Mauritius'}>Mauritius</option>
                                        <option value={'Baku'}>Baku</option>
                                        <option value={'Almaty'}>Almaty</option>
                                        <option value={'Srilanka'}>Srilanka</option>
                                        <option value={'Hongkong'}>Hongkong</option>
                                        <option value={'Nepal'}>Nepal</option>

                                    </select>
                                </h4>
                            </div>
                            <div>
                                <h4>
                                    <span>Departure City:- </span>
                                    <span style={{ border: "2px solid green" }}>{data.Departure_City}</span>
                                </h4>
                                <h4>
                                    <span>Traveler:- </span>
                                    <input style={{ border: "2px solid Blue" }} onChange={(e) => ChangeNameOnPackage(e.target.value)} placeholder={data.Traveller_name}></input>
                                </h4>
                                <h4>
                                    <span>Email:- </span>
                                    <input style={{ border: "2px solid Blue", width: '15rem' }} onChange={(e) => emailhandler(e.target.value)} placeholder={data.Email}></input>
                                </h4>
                                <h4>
                                    comments:-
                                    <span>
                                        {
                                            data.Comment
                                        }
                                    </span>
                                </h4>
                            </div>
                            {/* <div>
                                {
                                    data.Comment ? <>
                                        comments:-
                                        {data.Comment.map((data, index) => (<>
                                            <span key={index}>{data}</span><br />
                                        </>))}
                                    </> : <></>
                                }

                            </div> */}
                        </div>
                        <div className='basicDetails'>
                            <div>
                                <label>Days</label>
                                <input type="number" min="1" max="50"
                                    placeholder='Days count eg:-0,1,2,3..'
                                    value={days_total.length}
                                    onChange={(e) => daysChanges(e)}
                                />
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
                                        checked={SelectedpackageType === 'Per Person'}
                                        onChange={handleChange}
                                        value="Per Person"
                                        name="radio-button"
                                        color='primary'
                                    // inputProps={{ 'aria-label': 'A' }}
                                    />
                                    <label>Per Person</label>
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
                                    <label>Per Couple</label>
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
                                    <label>Total</label>
                                </div>

                            </div>
                            <div className='costOption_estimatiom'>
                                <div>
                                    <label >Flight Cost</label><br />
                                    <input type="number"
                                        className='input_filed'
                                        placeholder='flight'
                                        value={flightcost}
                                        onChange={(e) => flightcostChange(e)}
                                    ></input>
                                    <span className='spacer'>+</span>
                                </div>
                                <div>
                                    <label>Visa Cost</label><br />
                                    <input type="number" className='input_filed' placeholder='Visa' value={visacost} onChange={(e) => visacostChange(e)}></input>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid', borderTop: '1px dotted' }}>
                            <div>
                                <label className='san-serif'>select Travel Date</label><br />
                                <input width={'80px'} type='date' value={selected_Travel_date} onChange={(e) => select_date(e)}></input>
                            </div>
                            <div>
                                <label className='san-serif'>number of Pax</label><br />
                                <input value={Pax} onChange={(e) => changePax(e)}></input>
                            </div>
                            <div>
                                <label className='san-serif'>number of Child</label><br />
                                <input onChange={(e) => changechild(e)} value={Child}></input>
                            </div>
                            <div>
                                {/* <lable className='san-serif'>INCLUSION/EXCLUSION</lable><br /> */}
                                <button className='inclusionButtoon' onClick={(e) => setinclusion(true)} >Inclusion / Exclusion</button>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '58rem' }}>
                                <div className='unitComponent_'>
                                    <h4>property</h4>
                                    <Select
                                        components={animatedComponents}
                                        options={propertyAvail}
                                        defaultValue={Edit_Property ? Edit_Property : null}
                                        onChange={(e) => handleFormChangePropety(e)}
                                    />
                                </div>
                                <div className='unitComponent_'>
                                    <h4>Transfer Selection</h4>
                                    <Select
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        options={TransferOption}
                                        defaultValue={Edit_Transfer ? Edit_Transfer : null}
                                        onChange={(e) => handleTransfer(e)}
                                    />
                                </div>
                                <div className='unitComponent_'>
                                    <h4>MealPlan</h4>
                                    <Select
                                        components={animatedComponents}
                                        options={HotelMeals}
                                        defaultValue={MealPlan ? MealPlan : null}
                                        onChange={(e) => handleMealPlan(e)}
                                    />
                                </div>
                                <div>
                                    <h4>No of rooms</h4>
                                    <input style={{ height: '2rem' }} onChange={(e) => NO_ofRooms(e)} value={no_rooms}></input>
                                </div>
                            </div>


                            {
                                // console.log(NightDataFields),
                                NightDataFields &&
                                NightDataFields.map((data, index) => {
                                    return (
                                        <>
                                            <div key={index} className='costOption_estimatiom'>

                                                <div className='unitComponent_'>
                                                    <label>Room Type</label><br />
                                                    <Select
                                                        components={animatedComponents}
                                                        // isMulti
                                                        options={roomTypeAvail}
                                                        defaultValue={Edit_NightDataFields ? data.RoomType : null}
                                                        onChange={(e) => handleFormChange(e, index)}
                                                    />

                                                </div>
                                                <div className='unitComponent_'>
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
                            <button className='addMore' onClick={() => addFields()}>Add More..</button>
                        </div>
                        <div>

                            <label>To use previous image mark here</label>
                            <input checked={EditController} type={'checkbox'} onChange={(e) => newImageObjectWilAppear(e)}></input>


                        </div>
                        <div className='FlightDetails'>
                            <Flight />
                            <p>
                                <input type='checkbox' onChange={() => setflightFlg(!flightFlg)}></input>
                                <label>Flight Not Included</label>
                            </p>
                        </div>
                        {
                            flightFlg ?
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

                        <div className='FlightDetails' style={{ marginTop: '2rem' }} >
                            <DeckIcon />
                            <p>
                                <input type='checkbox' onChange={() => setinclusionImgFlg(!inclusionImgFlg)}></input>
                                <label>inclusionImg Not Included</label>
                            </p>
                        </div>
                        {
                            inclusionImgFlg ?
                                <>
                                    <div onPaste={(e) => handlePaste(e)}>
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
                                                    ScreenShotsurl ? <>
                                                        <div className='grid-container'>
                                                            <div className='grid-item'>
                                                                {
                                                                    ScreenShotsurl.map((link, index) => (<>
                                                                        <div>
                                                                            <span onClick={() => deletefrom(index, 'inclusion')}>
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
                        {/* <div>
                            {
                                OtherOption ? <>
                                    {
                                        OtherOption.map((data, OtherOptionIndex) => (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className='unitComponent_'>
                                                        <h4>MealPlan</h4>
                                                        <Select
                                                            components={animatedComponents}
                                                            options={HotelMeals}
                                                            defaultValue={MealPlan ? MealPlan : null}
                                                        // onChange={(e) => handleMealPlan(e)}
                                                        />
                                                    </div>
                                                    <div className='unitComponent_'>
                                                        <h4>MealPlan</h4>
                                                        <Select
                                                            components={animatedComponents}
                                                            options={HotelMeals}
                                                            defaultValue={MealPlan ? MealPlan : null}
                                                        // onChange={(e) => handleMealPlan(e)}
                                                        />
                                                    </div>

                                                </div>
                                            </>
                                        ))
                                    }
                                </> : <></>
                            }
                        </div> */}
                    </div>

                </Modal>
            </> : <>
                <Box
                    email={email}
                    data={data}
                    updateTableDataAfterQuote={updateTableDataAfterQuote}
                    set_popupopner={set_popupopner}
                    profile={profile}
                />
            </>
        }

    </>
    );
}

export default Maldives;
