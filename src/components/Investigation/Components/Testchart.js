import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import moment from 'moment';
import { React, useEffect, useState } from 'react';
import app from '../../required';
import Verticlechart from './Verticlechart';
import Currentmonthconversionchart from '../Pages/Currentmonthconversionchart';
import Previousmonthconversionchart from '../Pages/Previousmonthconversionchart';
import Last3rdmonthconversionchart from '../Pages/Last3rdmonthconversionchart';
const db = getFirestore(app);

function Testchart() {


    return (
        <div className=''>
            <div className='three_month_conversion_data'>
            <Currentmonthconversionchart />
            <Previousmonthconversionchart />
            <Last3rdmonthconversionchart/>
            </div>
        </div>
    );
}

export default Testchart;