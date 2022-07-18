import React from 'react';
import './pdfcss.css';
import './profile.css';

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
                <a href="https://g.co/kgs/VwbmYT" target="_blank">
                    <img src="/assets/google_reviews/Aashishsingh.PNG" className="review_img5" />
                </a>
                <a href="https://g.co/kgs/ZK68wZ" target="_blank">
                    <img src="/assets/google_reviews/Amit singh.PNG" className="review_img1" />
                </a>
                <a href="https://g.co/kgs/qM1e2f" target="_blank">

                    <img src="/assets/google_reviews/imran.PNG" className="review_img2" />
                </a>

            </div>
            <div className="reiew_c2">
                <a
                    href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x390ce1d4b9237199:0x7b102f107dc6a192?source=g.page.m._"
                    target='_blank' className="link">
                    <img src="/assets/pdfDefaultImage/google.png" className="googleImg_" />
                    <img src="/assets/pdfDefaultImage/4.8ratting.png" className="ratting" />
                    <span> 400 & Counting Google Review</span>
                </a>
                <a href="https://g.co/kgs/ReZyXo" target="_blank">
                    <img src="/assets/google_reviews/Tanmay.PNG" className="review_img" />
                </a>
                <a href="https://g.co/kgs/ByT5hQ" target="_blank">
                    <img src="/assets/google_reviews/Stephen Raj.PNG" className="review_img" />
                </a>


            </div>
            <div className="reiew_c3">
                <a href="https://g.co/kgs/iD3DvX" target="_blank">
                    <img src="/assets/google_reviews/Kajal.PNG" className="review_img" />
                </a>
                <a href="https://g.co/kgs/iD3DvX" target="_blank" >
                    <img src="/assets/google_reviews/manoj.PNG" className="review_img3" />
                </a>
                <a href="https://g.co/kgs/kXdzCU" target="_blank" >
                    <img src="/assets/google_reviews/Naveen.PNG" className="review_img4" />
                </a>

            </div>
        </div>
    );
}


export default Footer;
