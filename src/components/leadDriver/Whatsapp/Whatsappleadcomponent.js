import React, { useState } from 'react';
import './Whatsapp.css'
import { Modal } from '@material-ui/core';
import { doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import app from '../../required';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import moment from 'moment';
function Whatsappleadcomponent({ data, profile }) {
    const animatedComponents = makeAnimated();
    const [TripCounter, setTripCounter] = useState(null)
    const db = getFirestore(app);
    const [openLeadGenratorModal, setopenLeadGenratorModal] = useState(false)
    const Destinations = [
        { value: 'Thailand', label: 'Thailand', color: '#00B8D9' },
        { value: 'Bali', label: 'Bali', color: '#0052CC' },
        { value: 'Dubai', label: 'Dubai', color: '#5243AA' },
        { value: 'Kashmir', label: 'Kashmir', color: '#666666' },
        { value: 'Himachal', label: 'Himachal', color: '#666666' },
        { value: 'Kerala', label: 'Kerala', color: '#666666' },
        { value: "Andaman", label: "Andaman", color: '#666666' },
        { value: 'Maldives', label: 'Maldives', color: '#666666' },
        { value: 'Goa', label: 'Goa', color: '#666666' },
        { value: 'Rajasthan', label: 'Rajasthan', color: '#666666' },
        { value: 'Singapore', label: 'Singapore', color: '#666666' },
        { value: 'Veitnam', label: 'Veitnam', color: '#5243AA' },
        { value: 'Europe', label: 'Europe', color: '#5243AA' },
        { value: 'Northeast', label: 'Northeast', color: '#5243AA' },
        { value: 'Ladakh', label: 'Ladakh', color: '#666666' },
        { value: 'Turkey', label: 'Turkey', color: '#666666' },
        { value: 'Malasiya', label: 'Malasiya', color: '#666666' },
    ];
    const leadData = {
        name: null,
        Contact_Number: parseInt(data.Contact),
        Destination: data.Destionation_more,
        Departure_City: null,
        Travel_Duration: null,
        Travel_date: null,
        Budget: null,
        pax: null,
        Child: null,
        Email: null,
        Assigner: function (key, value) {
            switch (key) {
                case 'name':
                    this.name = value
                    break
                case 'Contact_Number':
                    this.Contact_Number = value
                    break
                case 'Destination':
                    this.Destination = value
                    break
                case 'Departure_City':
                    this.Departure_City = value
                    break
                case 'Travel_Duration':
                    this.Travel_Duration = value
                    break
                case 'Budget':
                    this.Budget = value
                    break
                case 'Pax':
                    this.pax = value
                    break
                case 'Child':
                    this.Child = value
                    break
                case 'Travel_date':
                    this.Travel_date = value
                    break
                case 'Email':
                    this.Email = value
                    break
                default:
                    console.log('no match')
            }

        },
        Checker: function () {
            if (this.name == null ||
                this.Destination == null ||
                this.Travel_Duration == null ||
                this.Contact_Number == null ||
                this.pax == null ||
                this.Travel_date == null
            ) { return true }
            return false
        }
    }
    const onclose = () => {
        setopenLeadGenratorModal(false)
    }
   async function updatewhatsappCollectionDoc(){
    const Databaseref = doc(db, "whatsapp", data.TripId);
    await updateDoc(Databaseref, {
        "lead_gen_flag": true,
        "lead_gen_Date":new Date()
    });
   }
    function genrateLeadByLeadTeam() {
        let today = new Date()
        setDoc(doc(db, "Trip", data.TripId), {
            TripId: data.TripId,
            Lead_Status: 'Hot',
            Campaign_code: 'whatsapp',
            Date_of_lead: today,
            Traveller_name: leadData.name,
            FlightBookedFlg: false,
            InstaId: '',
            Contact_Number: leadData.Contact_Number,
            Destination: leadData.Destination,
            Comment: `${data.Client_type}, ${data.Budget}`,
            Departure_City: leadData.Departure_City,
            Travel_Date: new Date(leadData.Travel_date),
            Travel_Duration: parseInt(leadData.Travel_Duration),
            Budget: parseInt(leadData.Budget),
            Pax: parseInt(leadData.pax),
            Child: parseInt(leadData.Child),
            Email: null,
            Remark: 'none',
            Lead_genrate_date: today,
            uploaded_by: profile.email,
            Quoted_by: null,
            uploaded_date: moment(today).format('YYYY-MM-DD'),
            uploaded_time: `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}:${today.getMilliseconds()}`,
            quotation: 0,
            quotation_flg: false,
            month: '',
            Lead_status_change_date: null,
            comments: [],
            Vouchers_flight: [],
            Vouchers_hotels: [],
            Vouchers_others: [],
            vouchers_idproof: [],
            PaymentScreenshots_flight: [],
            PaymentScreenshots_hotels: [],
            PaymentScreenshots_others: [],
            transfer_request: false,
            transfer_request_reason: [],
            assign_to: {
                uid: '',
                name: ''
            },
            assigned_date_time: today,
            updated_last: null,
            assign_flg: false,
            final_package: null
        });
        setopenLeadGenratorModal(false)
        updatewhatsappCollectionDoc()
    }
    return (<>

        <div className={data.lead_gen_flag ? 'Parent' : 'parent2'}>
            <div className='Child1'>
                <div className='childTitle'>
                    <span className='TitleText'>Client Contact</span>
                    <span className='TitleText'>Destination</span>
                    <span className='TitleText'>Package Type</span>
                    <span className='TitleText'>Days</span>
                    <span className='TitleText'>Travel Month</span>
                    <span className='TitleText'>Pax </span>
                </div>

                <div className='childTitleValue'>
                    <span className='ValueText'> :-{data.Contact}</span>
                    <span className='ValueText'> :-{data.Destionation_more}</span>
                    <span className='ValueText'> :-{data.Client_type}</span>
                    <span className='ValueText'> :-{data.Days}</span>
                    <span className='ValueText'> :-{data.Month}</span>
                    <span className='ValueText'> :-{data.Pax}</span>
                </div>
            </div>
            <div>
                <span className='TitleText'>Trip Id</span>
                <span className='ValueText'>:-{data.TripId}</span>
            </div>
            <div className='childButtons'>
                <button onClick={() => setopenLeadGenratorModal(true)}>Gen.Lead</button>
                <button>Not interested</button>
                <button>unable to Connect</button>
            </div>
        </div>
        <Modal open={openLeadGenratorModal} onClose={onclose} style={{ display: "grid", justifyContent: "center", marginTop: "2rem", overflowY: 'scroll' }}>

            <div className='genLeadparentdiv'>
                <h3 style={{ marginLeft: '10rem' }}>GEN. LEAD</h3>
                <div className='SelfLeadGenParentDiv'>
                    <div className='SelfLeadGenleftDiv'>
                        <p>Name </p>
                        <p>Contact </p>
                        <p>Email</p>
                        <p>Destination </p>
                        <p>Departure_City </p>
                        <p>Duration </p>
                        <p>Travel_Date </p>
                        <p>Pax </p>
                        <p>Child </p>
                        <p>Budget </p>
                    </div>
                    <div className='SelfLeadGenleftDiv'>
                        {
                            [0, 1, 2, 3, 4, 5, 7, 8, 9, 10].map((data, index) => <p key={index}>:-</p>)
                        }

                    </div>
                    <div className='whatsappSelfLeadGenRightDiv'>
                        <input className='required' onChange={(e) => leadData.Assigner('name', e.target.value)} value={leadData.name}></input>
                        <input className='required' type='number' onChange={(e) => leadData.Assigner('Contact_Number', e.target.value)} value={leadData.Contact_Number} ></input>
                        <input type='email' onChange={(e) => leadData.Assigner('Email', e.target.value)}></input>
                        <Select
                            placeholder='Destination'
                            className='required'
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={Destinations}
                            onChange={(e) => leadData.Assigner('Destination', e.value)}
                        />
                        <input onChange={(e) => leadData.Assigner('Departure_City', e.target.value)}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Travel_Duration', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Travel_date', e.target.value)} type={'date'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Pax', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Child', e.target.value)} type={'number'}></input>
                        <input className='required' onChange={(e) => leadData.Assigner('Budget', e.target.value)} type={'number'}></input>
                    </div>
                    <div className='whatsappSelfLeadGenRightDiv'>
                        <p className='whatsappdatasidesuggestion'>n/a </p>
                        <p className='whatsappdatasidesuggestion'>{data.Contact} </p>
                        <p className='whatsappdatasidesuggestion'>n/a</p>
                        <p className='whatsappdatasidesuggestion'>{data.Destionation_more} </p>
                        <p className='whatsappdatasidesuggestion'>n/a </p>
                        <p className='whatsappdatasidesuggestion'>{data.Days} </p>
                        <p className='whatsappdatasidesuggestion'>n/a </p>
                        <p className='whatsappdatasidesuggestion'>{data.Pax} </p>
                        <p className='whatsappdatasidesuggestion'>n/a </p>
                        <p className='whatsappdatasidesuggestion'>{data.Budget} </p>
                    </div>
                </div>
                <div className='SelfLeadButtonDiv'>
                    {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                        <span>Assign to
                        </span>
                        <select onChange={(e) => filterDataFromProfile(e.target.value)}>
                            <option value={0}>Select Spokes</option>
                            {
                                AllUserprofile.map((data, index) => (
                                    <option key={index} value={data.uid} >{data.name}</option>
                                ))
                            }
                        </select>
                        <button onClick={()=>saveToOthers()}>save</button>
                    </div> */}
                    <div>
                        <button onClick={() => genrateLeadByLeadTeam()} >Gen.Lead</button>
                    </div>
                </div>
            </div>
        </Modal>
    </>);
}

export default Whatsappleadcomponent;