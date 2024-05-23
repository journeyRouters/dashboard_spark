import React from 'react';
import { Akriti, Akshat, Himanshu, Manjit, NehaGupta, Sanu, Saumil, Tanmay } from './ImgDispathcher';
import './pdfcss.css';
import './profile.css';
import { Akriti_Dogra, Akshat_Aggarwal, Himanshu_Gangwar, Manjit_, Neha, Sanu_lawrence, Saumil_, Tanmay_ } from './ReviewLinkDispatcher';

export const Footer = ({whatsApp}) => {
    return (
        <div className="bottom_media_details">Follow Us At
            <a href="https://www.instagram.com/journeyrouters/?hl=en" target="_blank">
                <img src="/assets/pdfDefaultImage/instagram.png" width="40px" />
            </a>
            <a href="https://www.facebook.com/JourneyRouters/" target="_blank">
                <img src="/assets/pdfDefaultImage/facebook.png" width="40px" />
            </a>
            <a href="https://in.linkedin.com/company/journeyrouters" target="_blank">
                <img src="/assets/pdfDefaultImage/linkedin.png" width="40px" />
            </a>
            <a href="https://twitter.com/JourneyRouters" target="_blank">
                <img src="/assets/pdfDefaultImage/twiter.png" width="40px" />
            </a>
            @journeyrouters
            <a href={"https://wa.me/"+whatsApp} target="_blank">
                <img className="whatsAppOnInclusionExclusionPage_" src='/assets/pdfDefaultImage/whatApp.png' />
            </a>
        </div>
    );
}

export const GoogleReviews = () => {
    return (
        <div className="google_review_bottom">
            <div className="reiew_c1">
                <a href={Neha} target="_blank">
                    <img src={NehaGupta} className="review_img5" />
                </a>
                <a href={Saumil_} target="_blank">
                    <img src={Saumil} className="review_img1" />
                </a>
                <a href={Akriti_Dogra} target="_blank">

                    <img src={Akriti} className="review_img2" />
                </a>

            </div>
            <div className="reiew_c2">
                <a
                    href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x390ce1d4b9237199:0x7b102f107dc6a192?source=g.page.m._"
                    target='_blank' className="link">
                    <img src="/assets/pdfDefaultImage/google.png" className="googleImg_" />
                    <img src="/assets/pdfDefaultImage/4.8ratting.png" className="ratting" />
                    <span> 1249 & Counting Google Review</span>
                </a>
                <a href={Akshat_Aggarwal} target="_blank">
                    <img src={Akshat} className="review_img" />
                </a>
                <a href={Himanshu_Gangwar} target="_blank">
                    <img src={Himanshu} className="review_img" />
                </a>


            </div>
            <div className="reiew_c3">
                <a href={Manjit_} target="_blank">
                    <img src={Manjit} className="review_img" />
                </a>
                <a href={Sanu_lawrence} target="_blank" >
                    <img src={Sanu} className="review_img3" />
                </a>
                <a href={Tanmay_} target="_blank" >
                    <img src={Tanmay} className="review_img4" />
                </a>

            </div>
        </div>
    );
}


export default Footer;
