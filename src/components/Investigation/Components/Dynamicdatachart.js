import { getFirestore } from 'firebase/firestore';
import { React } from 'react';
import app from '../../required';
import Activeleads from '../Pages/Activeleads';
import Coldleads from '../Pages/Coldleads';
import Leadsaccordingtotraveldate from '../Pages/Components/Leadsaccordingtotraveldate';
import Currentmonthconversionchart from '../Pages/Currentmonthconversionchart';
import Dumpleads from '../Pages/Dumpleads';
import DumpLeadsOnBasisOfPacCount from '../Pages/DumpLeadsOnBasisOfPacCount';
import Hotleads from '../Pages/Hotleads';
import Last3rdmonthconversionchart from '../Pages/Last3rdmonthconversionchart';
import Leadtobequoted from '../Pages/Leadtobequoted';
import Paxmorethan4 from '../Pages/Paxmorethan4';
import Paymentawaited from '../Pages/Paymentawaited';
import Previousmonthconversionchart from '../Pages/Previousmonthconversionchart';
import Seventytwohr from '../Pages/Seventytwohr';
import Totalassignedleads from '../Pages/Totalassignedleads';
import Totalleadsinfunnel from '../Pages/Totalleadsinfunnel';
import JrDirectLead from '../Pages/JrDirectLead';
import SalesDirectLead from '../Pages/SalesDirectLead';
import RepeatedClientLeads from '../Pages/RepeatedClientLeads';
import ConvertedClientLeads from '../Pages/ConvertedClientLeads';
import CurrentMonthDumpLead from '../Pages/CurrentMonthDumpLead';
import PreviousMonthDumpLead from '../Pages/PreviousMonthDumpLead';
import Last3rdMonthDumpLead from '../Pages/Last3rdMonthDumpLead';
const db = getFirestore(app);

function Dynamicdatachart() {


    return (
        <div className=''>
            <div className='three_month_conversion_data'>
                {/* <JrDirectLead /> */}
                <SalesDirectLead />
                <ConvertedClientLeads />
                <RepeatedClientLeads />

            </div>
            <div className='three_month_conversion_data'>
                <CurrentMonthDumpLead/>
                <PreviousMonthDumpLead/>
                <Last3rdMonthDumpLead/>

            </div>
            <div className='three_month_conversion_data'>
                <Paymentawaited />
                <Seventytwohr />
                <Totalassignedleads />
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
                <Totalleadsinfunnel />
                <Coldleads />
            </div>
            <div className='three_month_conversion_data'>
                <Leadsaccordingtotraveldate />
                <Paxmorethan4 />
                <DumpLeadsOnBasisOfPacCount />
            </div>
            {/* <div>
                <Destinationdatadriven/>
            </div> */}

        </div>
    );
}

export default Dynamicdatachart;