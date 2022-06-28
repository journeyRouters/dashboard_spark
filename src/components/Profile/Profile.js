import { addDoc, collection, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import React, { useRef, useState, useEffect } from 'react';
import app from '../required';
import './pdfcss.css';
import './profile.css';
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { Image } from '@material-ui/icons';
const db = getFirestore(app);

const Profile = (props) => {
    const [layoutSelection, setLayoutSelection] = useState({
        text: "A4",
        value: "size-a4"
    });
    const Data = props.travel_data
    const [callback, setcallback] = useState(false)
    const pdfExportComponent = useRef(null);
    const [comment_inclusion, set_comment_inclusion] = useState([])
    const [Comment_Exclusion, set_Comment_Exclusion] = useState([])
    console.log(props.userProfile)
    useEffect(() => {
        // console.log(props.inclusion_data.other_Inclusion, props.inclusion_data.other_Exclusion)
        try {

            set_comment_inclusion(props.inclusion_data.other_Inclusion.split("."))
        }
        catch {
            set_comment_inclusion([])
        }
        try {

            set_Comment_Exclusion(props.inclusion_data.other_Exclusion.split("."))
        }
        catch {
            set_Comment_Exclusion([])
        }
    }, []);
    const currentdate = new Date();
    // console.log(currentdate)
    // var doc = new jsPDF("p", "pt", "a4");
    const TripId = Data.TripId
    const month = currentdate.toLocaleString('default', { month: 'long' })

    async function dataSetter() {
        if (props.indicator) {

        }
        else {
            await addDoc(collection(db, "Quote"), {
                label: `${currentdate.getDate()}:${currentdate.getMonth() + 1}:${(currentdate.getFullYear())}:${currentdate.getHours()}:${currentdate.getMinutes()}`,
                value: {
                    travel_data: props.travel_data,
                    cost: props.cost,
                    itineary: props.itineary,
                    followUpDate: String(props.selected_date),
                    NightDataFields: props.NightDataFields,
                    pdf_name: `${currentdate.getDate()}:${currentdate.getMonth() + 1}:${(currentdate.getFullYear())}:${currentdate.getHours()}:${currentdate.getMinutes()}`,
                    cabDetailsData: props.cabDetailsData,
                    flights: props.flights,
                    inclusion_data: props.inclusion_data,
                }
            });

        }
    }

    async function update_quotation_flg() {
        // debugger
        let quotation_new = parseInt(props.travel_data.quotation) + 1
        await updateDoc(doc(db, "Trip", `${props.travel_data.TripId}`), {
            quotation: quotation_new,
            quotation_flg: true,
            month: month,
            Follow_Up_date: String(props.selected_date),
            Quoted_by: props.email
        });
    }

    function handleExportWithComponent() {
        pdfExportComponent.current.save();

    };
    function pdfgenrator() {
        handleExportWithComponent()
        update_quotation_flg()


        try {
            props.datahandle()
        }
        catch (e) {
            console.log(e)
        }

        try {

            dataSetter()
        }
        catch (e) {
            console.log(e)
        }
        try {
            props.Allquote()
        }
        catch (error) {
            console.log(error)
        }
    }



    return (
        <>
            <PDFExport
                ref={pdfExportComponent}
                fileName={`${Data.Traveller_name}`}

            >
                <div className={`pre ${layoutSelection.value}`}>
                    <div className='page1'>
                        <div>
                            <img src="/assets/pdfDefaultImage/jrlogo.png" styles={{ width: "46rem", height: "14rem" }} />
                        </div>
                        <div className='footer_pdf'>
                            <a className='whatsapp_' href={"https://wa.me/919304247331"}>
                                <img className='whatsapp' src='/assets/pdfDefaultImage/whatApp.png' />
                            </a>
                            <img className='footer_pdf_img' src="/assets/pdfDefaultImage/footer.png" />

                        </div>
                    </div>

                </div>
            </PDFExport>

            <button className='download_button' onClick={() => pdfgenrator()}>downloadURL</button>
            {/* <button className='download_button' onClick={() => pdfgenrator()}>save Quote</button> */}



        </>
    );
}

export default Profile
