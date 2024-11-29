import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import MultiStepEvent from '../components/MultiStepEvent'

import togatherLogo from '../resources/assets/Logo/togather-logo.png'
import scrollImage1 from '../resources/assets/Images/togather-image-16.jpg'
import scrollImage2 from '../resources/assets/Images/togather-image-15.jpeg'
import scrollImage3 from '../resources/assets/Images/togather-image-19.jpeg'
import scrollImage4 from '../resources/assets/Images/togather-image-11.jpg'
import scrollImage5 from '../resources/assets/Images/togather-image-13.jpg'
import scrollImage6 from '../resources/assets/Images/togather-image-14.jpg'
import scrollImage7 from '../resources/assets/Images/togather-image-17.jpg'
import scrollImage8 from '../resources/assets/Images/togather-image-18.jpg'
import scrollImage9 from '../resources/assets/Images/togather-image-21.jpg'

import vendor_management from '../resources/assets/Images/vendor-management.svg';
import budget_management from '../resources/assets/Images/budget-management.svg';
import guest_management from '../resources/assets/Images/guests-management.svg';
import checklist_management from '../resources/assets/Images/checklist-management.svg';
import collaboration_management from '../resources/assets/Images/collabration-management.svg';

import DarkVariantExample from '../components/LandingPageCarousel';
import Card from '../components/TeamCards';
import BannerLandingPage from '../components/BannerLandingPage';

import teamMemberShashank from '../resources/assets/teamMembers/team-member-1.png'
import teamMemberNamrata from '../resources/assets/teamMembers/team-member-2.png'
import teamMemberAndrei from '../resources/assets/teamMembers/team-member-3.png'
import teamMemberMehul from '../resources/assets/teamMembers/team-member-4.png'
import teamMemberKapil from '../resources/assets/teamMembers/team-member-5.png'
import teamMemberVishnu from '../resources/assets/teamMembers/team-member-6.png'
import teamMemberAmneesh from '../resources/assets/teamMembers/team-member-7.png'
import teamMemberSudiksha from '../resources/assets/teamMembers/team-member-8.png'
import teamMemberSangeetha from '../resources/assets/teamMembers/team-member-9.png'

import downloadEventProposal from '../resources/eventProposalPDF/Togathr_Project_Proposal.pdf'
import AOS from "aos";
import "aos/dist/aos.css";
import { createDataInMongo } from '../../api/mongoRoutingFile';
const LandingPage = () => {

    useEffect(() => {
        AOS.init({
            duration: 700,
            easing: "ease-out-cubic",
        });
    }, []);
    const teamDesigners = [
        {
            id: 1,
            title: 'Sudikhsha Kumar',
            description: 'UI/UX designer',
            imageUrl: teamMemberSudiksha,
            linkedinURL: 'https://www.linkedin.com/in/sudiksha-kumar-b7ab21112/'
        },
        {
            id: 2,
            title: 'Shashank Panjeti',
            description: 'UI/UX designer',
            imageUrl: teamMemberShashank,
            linkedinURL: 'https://www.linkedin.com/in/shashank-panjeti'
        },
        {
            id: 3,
            title: 'Sangeetha Ravi',
            description: 'UI/UX designer',
            imageUrl: teamMemberSangeetha,
            linkedinURL: 'https://www.linkedin.com/in/sangeetha-ravi-0a23072a7/'
        },
        {
            id: 4,
            title: 'Andrei Gallardo',
            description: 'UI/UX designer',
            imageUrl: teamMemberAndrei,
            linkedinURL: 'https://www.linkedin.com/in/andrei-gallardo-93b8b4252'
        },
        {
            id: 5,
            title: 'Mehul Sharma',
            description: 'UI/UX designer',
            imageUrl: teamMemberMehul,
            linkedinURL: 'https://www.linkedin.com/in/'
        }


    ];

    const teamDevelopers = [
        {
            id: 7,
            title: 'Amneesh Singh',
            description: 'Full Stack Developer',
            imageUrl: teamMemberAmneesh,
            linkedinURL: 'https://www.linkedin.com/in/amneesh-pal-singh'
        },
        {
            id: 6,
            title: 'Kapil Pokhriyal',
            description: 'Full Stack Developer',
            imageUrl: teamMemberKapil,
            linkedinURL: 'https://www.linkedin.com/in/kapil-pokhriyal/'
        },
        {
            id: 8,
            title: 'Namrata Kanda',
            description: 'Full Stack Developer',
            imageUrl: teamMemberNamrata,
            linkedinURL: 'https://www.linkedin.com/in/namrata-kanda/'
        },
        {
            id: 9,
            title: 'Vishnu Vardhan',
            description: 'Full Stack Developer',
            imageUrl: teamMemberVishnu,
            linkedinURL: 'https://www.linkedin.com/in/'
        }
    ]

    const images = [
        scrollImage1,
        scrollImage2,
        scrollImage3,
        scrollImage4,
        scrollImage5,
        scrollImage6,
        scrollImage7,
        scrollImage8,
        scrollImage9
    ].map((image) => ({
        id: crypto.randomUUID(),
        image,
    }));

    const [activeId, setActiveId] = useState('');
    const sectionsRef = useRef([]);

    const [showMobileHeader, setshowMobileHeader] = useState(false);

    const [landingShow, setLandingShow] = useState(true);

    const [activeComponent, setActiveComponent] = useState('landingPage')

    const [contactForm, setContactForm] = useState(
        {
            name: '',
            email: '',
            message: ''
        }
    )

    const [formSubmit, setFormSubmit] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, { threshold: 0.5 }); // Adjust threshold as needed

        sectionsRef.current.forEach(section => {
            if (section) {
                observer.observe(section);
            }
        });

        return () => {
            sectionsRef.current.forEach(section => {
                if (section) {
                    observer.unobserve(section);
                }
            });
        };
    }, []);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log(contactForm);
        createDataInMongo("contact", contactForm).then((response) => {
            console.log("Response from createdData:", response._id);
            setFormSubmit(true);
        });

    }
    const handleContactFormChange = async (event) => {
        const { name, value } = event.target;
        setContactForm({
            ...contactForm,
            [name]: value
        });

    }

    const landingPageContent = () => (
        <div>
            <section className='header'>
                <div className="header-banner">
                    <div className="header-nav-mobile">
                        {!showMobileHeader ? <h4><i className="fa-solid fa-bars" onClick={() => { setshowMobileHeader(true) }}></i> </h4> :
                            <h4> <i className="fa-solid fa-xmark" onClick={() => { setshowMobileHeader(false) }}></i></h4>
                        }


                    </div>
                    <div className='togather-logo' onClick={() => setActiveComponent('landingPage')}>
                        <img src={togatherLogo} alt="togather-logo" />
                    </div>
                    <div className="header-nav">
                        <nav>
                            <ul>
                                <a href="#about-us">
                                    <li>About us</li>
                                </a>
                                <a href="#team">
                                    <li>Team</li>
                                </a>
                                <a href="#contact-us">
                                    <li>Contact us</li>
                                </a>
                                <a href="#features">
                                    <li>Features</li>
                                </a>
                            </ul>
                        </nav>
                    </div>

                    <div className='login'>
                        <Link to={`/login`}> <button className='button-purple-fill'> Log in</button></Link>
                    </div>
                </div>
                <div className={`header-mobile-content ${showMobileHeader == true ? ('headerShow') : ('headerHide')}`} >
                    <nav>
                        <ul>
                            <a href="#about-us">
                                <li>About us</li>
                            </a>
                            <a href="#team">
                                <li>Team</li>
                            </a>
                            <a href="#contact-us">
                                <li>Contact us</li>
                            </a>
                            <a href="#features">
                                <li>Features</li>
                            </a>
                        </ul>
                    </nav>
                </div>



                <div className='carousel-container'>
                    <div className='carousel-landing-page'>
                        <DarkVariantExample />
                    </div>
                    <div className='header-main'>
                        <h1 data-aos="fade-right">Plan the Perfect Event with ToGathr!</h1>
                        <button data-aos="fade-right" className='button-green-fill' onClick={() => setActiveComponent('eventForm')}>Create Event</button>
                    </div>

                </div>

                <div className='description-banner'>

                    <div data-aos="fade-right" className="description-text">
                        <p>Effortlessly bring your vision to life with ToGathr – the ultimate platform for organizing memorable events.Whether it’s an intimate gathering or a grand celebration, ToGathr guides you every step of the way. Start planning today and watch your event come together beautifully!</p>
                    </div>
                </div>


            </section >




            <section className='who-we-are' id='about-us'>
                <div className='who-we-are-content'>
                    <h1 data-aos="fade-right">Who are we?</h1>
                    <div className='who-we-are-text-image' data-aos="fade-left">
                        <div className="who-we-are-image">
                            <div className="who-we-are-logo"><img src={togatherLogo} alt='togatherLogo' /></div>
                        </div>
                        <div className="who-we-are-text">
                            <p>ToGather helps you to plan personal or professional events effortlessly. This platform aims to combine the various aspects of event planning such as budget tracking, finding vendors/venues, and managing guests under one roof.</p>
                        </div>
                    </div>
                    <div className='image-scroller' data-aos="flip-up">

                        <BannerLandingPage images={images} speed={50000} />

                    </div>
                </div>
            </section>



            <section className='what-we-do' id="features">


                <div className='what-we-do-content'>

                    <h1 data-aos="fade-right">What do we do</h1>

                    <div className='what-we-do-main-container'>

                        <div className='feature-links'>
                            <nav>
                                <ul>
                                    <li className={activeId === 'vendorManagement' ? 'active2' : ''}>
                                        <a href='#vendorManagement'>Venue/Vendor Management</a>
                                    </li>
                                    <li className={activeId === 'guestManagement' ? 'active2' : ''}>
                                        <a href='#guestManagement'>Guest Management</a>
                                    </li>
                                    <li className={activeId === 'budgetTracking' ? 'active2' : ''}>
                                        <a href='#budgetTracking'>Budget Tracking</a>
                                    </li>
                                    <li className={activeId === 'checklist' ? 'active2' : ''}>
                                        <a href='#checklist'>Auto Generated Checklist</a>
                                    </li>
                                    <li className={activeId === 'workspace' ? 'active2' : ''}>
                                        <a href='#workspace'>Collaborative Workspace</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className='feature-description'>
                            <div className="feature-articles">
                                <article className='feature-container-description' id='vendorManagement' ref={el => sectionsRef.current[1] = el}>
                                    <div className='feature-image'>
                                        <img src={vendor_management} alt="vendor-feature-image" />
                                    </div>
                                    <div className='feature-text'>
                                        <p>Finding and comparing vendors can be time consuming, but with this feature, you can easily connect with verified vendors and venues that match your event type and budget. Search, filter, and choose the best options, all in one place!</p>
                                    </div>
                                </article>
                                <article className='feature-container-description' id='guestManagement' ref={el => sectionsRef.current[2] = el}>
                                    <div className='feature-image'>
                                        <img src={guest_management} alt="vendor-feature-image" />
                                    </div>
                                    <div className='feature-text'>
                                        <p>Managing guests can be overwhelming, but this feature automates the process by tracking RSVPs, organizing contact details, and sending bulk invites. You can easily monitor confirmed guests and check them in on the event day.</p>
                                    </div>
                                </article>
                                <article className='feature-container-description' id='budgetTracking' ref={el => sectionsRef.current[3] = el}>
                                    <div className='feature-image'>
                                        <img src={budget_management} alt="vendor-feature-image" />
                                    </div>
                                    <div className='feature-text'>
                                        <p>On ToGather, your budget is visualized, helping you make informed decisions. Set your budget, and the platform suggests vendors and venues within your range. Track and allocate funds easily, get notified if something exceeds your budget, and receive cost-saving tips.</p>
                                    </div>
                                </article>
                                <article className='feature-container-description' id='checklist' ref={el => sectionsRef.current[4] = el}>
                                    <div className='feature-image'>
                                        <img src={checklist_management} alt="vendor-feature-image" />
                                    </div>
                                    <div className='feature-text'>
                                        <p>Our Auto-Generated Checklist simplifies your event planning by creating a personalized list of tasks based on your event details. Stay organized on track with automatic reminders and easy progress tracking, ensuring no detail is overlooked.</p>
                                    </div>
                                </article>
                                <article className='feature-container-description' id='workspace' ref={el => sectionsRef.current[5] = el}>
                                    <div className='feature-image'>
                                        <img src={collaboration_management} alt="vendor-feature-image" />
                                    </div>
                                    <div className='feature-text'>
                                        <p>Planning personal events is often a team effort. Our app lets its users collaborate with their friends and family by enabling them to be added to their workspace. Users can assign specific tasks to their collaborators to ensure easy planning.</p>
                                    </div>
                                </article>
                            </div>
                        </div>


                    </div>
                </div>

            </section>


            <section className="vendor-proposal">
                <div className="vendor-content">
                    <h1 data-aos="fade-right">Join Our Vendor Network</h1>
                    <p>Expand your reach by connecting with event planners and customers. </p>
                    {/* <button className='button-purple-fill' onClick={() => { setActiveComponent('vendorLogin') }}>Join As a Vendor</button> */}
                    <Link to={`/vendor-login`}>
                      <button className='button-purple-fill'>Join As a Vendor</button>
                    </Link>
                </div>
                <div className="proposal-content">
                    <h1 data-aos="fade-right">Project Proposal</h1>
                    <p>Download our comprehensive project proposal to see how we can drive your success with a  clear, actionable plan</p>
                    <a href={downloadEventProposal} download><button className='button-purple-fill'>Download Proposal</button></a>

                </div>

            </section>

            {/* <section>
        <div className='scrollspy-section'>

            <div className='left-navs'>
               <div>
                    <article id="section-1">ar1</article>
                    <article id="section-2">ar2</article>
                    <article id="section-3">ar3</article>
                    </div>
            </div>

            <div className='right-sections'>
                    <li><a href="#section-1">section 1</a></li>
                    <li><a href="#section-2">section 2</a></li>
                    <li><a href="#section-3">section 3</a></li>
            </div>
        </div>
    </section> */}

            <section className='meet-the-team' id='team'>
                <div className='meet-the-team-content'>
                    <h1 data-aos="fade-right">Meet the team</h1>
                    <div className='meet-the-team-text-image'>
                        <div className='meet-the-team-cards'>
                            <div className="meet-the-designers">
                                {teamDesigners.map((data) => (
                                    <Card
                                        key={data.id}
                                        title={data.title}
                                        description={data.description}
                                        imageUrl={data.imageUrl}
                                        linkedinURL={data.linkedinURL}
                                    />
                                ))}
                            </div>
                            <div className="meet-the-developers">
                                {teamDevelopers.map((data) => (
                                    <Card

                                        key={data.id}
                                        title={data.title}
                                        description={data.description}
                                        imageUrl={data.imageUrl}
                                        linkedinURL={data.linkedinURL}
                                    />
                                ))}
                            </div>

                        </div>

                    </div>
                </div>

            </section>

            <footer className='footer' id='contact-us'>
                <div className='footer-content'>
                    <div className='footer-left' data-aos="fade-up">
                        <div className="footer-logo">
                            <img src={togatherLogo} alt="togather-logo" />
                        </div>
                        {/* <div className="footer-social-icons">


                            <div className="youtube-icon">
                                <i className="fa-brands fa-youtube"></i>
                            </div>
                            <div className="instagram-icon">
                                <i className="fa-brands fa-instagram"></i>
                            </div>
                            <div className="twitter-icon">
                                <i className="fa-brands fa-twitter"></i>
                            </div>
                        </div> */}
                        <div className="footer-links">
                            <nav>
                                <ul>
                                    <li><a href="#about-us">About</a></li>
                                    <li><a href="#team">Team</a></li>
                                    <li><a href="#features">Features</a></li>
                                </ul>
                            </nav>
                        </div>


                    </div>
                    <div className='seperator' data-aos="fade-up"
                    >
                        <hr />
                    </div>
                    <div className='footer-right' data-aos="fade-up">
                        <div className='footer-right-content'>
                            {/* <div className="contact-description-data">
                                <div className="phone-contact contactDes">
                                    <i className="fa-solid fa-phone"></i>
                                    <a href="tel:+123456789">+1 (234)-(567)-(890)</a>
                                </div>

                                <div className="email-contact contactDes">
                                    <i className="fa-solid fa-envelope"></i>
                                    <a href="mailto:togather.invite@gmail.com">togather.invite@gmail.com</a>
                                </div>

                                <div className="location-contact contactDes">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <a href="#">123 Project street, vancouver</a>
                                </div>

                            </div> */}
                            <div className="footer-contact-form">
                                {!formSubmit ? <> <h4 className='form-header'>Get In Touch </h4>

                                    <form onSubmit={handleContactSubmit}>
                                        <input type="text" placeholder="Name" name='name' value={contactForm.name} onChange={handleContactFormChange} />
                                        <input type="email" placeholder="Email" name='email' value={contactForm.email} onChange={handleContactFormChange} />
                                        <textarea placeholder="Message" name='message' value={contactForm.message} onChange={handleContactFormChange}></textarea>
                                        <button type="submit" className='button-purple-fill'>Send</button>
                                    </form>
                                </>
                                    :
                                    <div className="form-thanks">
                                        <h3 className=''>Thank you. </h3>
                                        <h4> We'll reach you out shortly.</h4>
                                    </div>
                                }
                            </div>

                        </div>
                    </div>
                    <div className="footer-copyright"
                    >
                        <p >Copyright &copy; 2024 ToGathr.All rights reserverd</p>
                    </div>
                </div>
            </footer>
        </div>
    )


    const eventMutiForm = () => (
        <div>
            <div className="header-banner">
                <div className="header-nav-mobile">
                    <h4 className='header-title'>Event Creation</h4>


                </div>
                <div className='togather-logo' onClick={() => setActiveComponent('landingPage')}>
                    <img src={togatherLogo} alt="togather-logo" />
                </div>
                <div className="header-nav">
                    <h4 className='header-title'>
                        Create your event
                    </h4>
                </div>

                <div className='login'>
                    <Link to={`/login`}> <button className='button-purple-fill'> Log in</button></Link>
                </div>
            </div>
            <div className={`header-mobile-content ${showMobileHeader == true ? ('headerShow') : ('headerHide')}`} >

            </div>
            <MultiStepEvent />
        </div>
    )


    const vendorLogin = () => (
        <div>
            vendor
        </div>
    )



    const renderContent = () => {
        switch (activeComponent) {
            case 'landingPage':
                return landingPageContent();
            case 'eventForm':
                return eventMutiForm();
            case 'vendorLogin':
                return vendorLogin();
            default:
                return landingPageContent();
        }
    };

    return (


        <div className='landing-page'>



            {renderContent()}

        </div>

    )
}

export default LandingPage
