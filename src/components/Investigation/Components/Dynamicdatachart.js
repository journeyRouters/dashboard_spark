import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import { React, useEffect, useState } from 'react';
import app from '../../required';
import Verticlechart from './Verticlechart';
import Currentmonthconversionchart from '../Pages/Currentmonthconversionchart';
import Previousmonthconversionchart from '../Pages/Previousmonthconversionchart';
import Last3rdmonthconversionchart from '../Pages/Last3rdmonthconversionchart';
import Leadtobequoted from '../Pages/Leadtobequoted';
import Hotleads from '../Pages/Hotleads';
import Activeleads from '../Pages/Activeleads';
import Dumpleads from '../Pages/Dumpleads';
import Totalleadsinfunnel from '../Pages/Totalleadsinfunnel';
import Coldleads from '../Pages/Coldleads';
import Paymentawaited from '../Pages/Paymentawaited';
import Seventytwohr from '../Pages/Seventytwohr';
import Totalassignedleads from '../Pages/Totalassignedleads';
const db = getFirestore(app);

function Dynamicdatachart() {


    return (
        <div className=''>
            <div className='three_month_conversion_data'>
                <Paymentawaited/>
                <Seventytwohr/>
                <Totalassignedleads/>
            </div>
            <div className='three_month_conversion_data'>
                <Currentmonthconversionchart />
                <Previousmonthconversionchart />
                <Last3rdmonthconversionchart />
            </div>
            <div className='three_month_conversion_data'>
                <Leadtobequoted />
                <Hotleads />
                <Activeleads />

            </div>
            <div className='three_month_conversion_data'>
                <Dumpleads />
                <Totalleadsinfunnel/>
                <Coldleads/>
            </div> 
            
        </div>
    );
}

export default Dynamicdatachart;