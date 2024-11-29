import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UnsplashImages from './UnsplashImages';
import VendorsList from './VendorsList';
import { useState, useEffect } from 'react';
import '../css/VendorDetailDescription.css';
import Heart from "react-animated-heart";
import { useSnackbar } from './SnackbarContext';


import { readDataFromMongoWithParam, DeleteDataInMongo } from '../../api/mongoRoutingFile';
import VendorTogatherDetailedPage from './VendorTogatherDetailedPage';

import Popover from '@mui/material/Popover';

export default function VendorMain() {
    const showSnackbar = useSnackbar();

    // popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverState, setPopoverState] = useState({});


    const handleClick = (event, id) => {
        setPopoverState({ [id]: event.currentTarget });
    };

    const handleClose = (id) => {
        setPopoverState((prevState) => ({
            ...prevState,
            [id]: null,
        }));
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    // popover
    const [activeTab, setActiveTab] = useState('tab1');

    const [value, setValue] = React.useState(0);
    const [vendType, setVendorType] = useState([]);
    const [location, setLocation] = useState({ lat: null, long: null });

    const [error, setError] = useState(null);

    const [favoriteVendors, setFavoriteVendors] = useState([]);

    const [showAllCategoryCards, setshowAllCategoryCards] = useState(true);
    const [showAllVendorCards, setshowAllVendorCards] = useState(false);

    const [userEmail, setUserEmail] = useState(JSON.parse(localStorage.getItem("user-info")).email);
    const [eventID, setEventID] = useState(localStorage.getItem('eventId'));

    const [bookedList, setBookedList] = useState([]);
    const [favoriteList, setFavoriteList] = useState([]);


    const [isClick, setClick] = useState(true);

    const category_cards = [
        { id: 1, categoryName: "Venues", categoryType: "event_venue", categoryQuery: "business conferences, corporate events, industry seminars" ,categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.74074 19.9674H6.62963L3 32.0002H31L27.3704 19.9674H23.7407L16.9962 28.1475C16.8497 28.3251 16.5774 28.3246 16.4316 28.1464L9.74074 19.9674Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M23.8774 15.4896L16.7132 24.0373L9.64185 15.4588C9.06452 14.7584 8.55543 13.9924 8.27827 13.1281C7.48835 10.6648 7.82223 8.72536 8.30657 7.60572C8.51985 7.11271 8.81552 6.65585 9.09814 6.19905C12.3331 0.970343 18.3159 1.62447 20.8309 2.88582C26.021 5.48883 26.0443 10.3361 25.192 13.2375C24.9442 14.081 24.4421 14.8158 23.8774 15.4896Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M20.044 10.0678C20.044 11.7686 18.6029 13.2361 16.7139 13.2361C14.8249 13.2361 13.3839 11.7686 13.3839 10.0678C13.3839 8.36704 14.8249 6.8995 16.7139 6.8995C18.6029 6.8995 20.044 8.36704 20.044 10.0678Z" stroke="white" stroke-width="3.11931"/>
            </svg>
            },
        { id: 2, categoryName: "Caterers", categoryType: "catering", categoryQuery: "wedding planning, bridal shows, wedding venues", categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5501 29.9487H16.649L16.1596 31.4171M17.5501 29.9487H30.4649M17.5501 29.9487C17.4739 28.2254 18.3104 24.9636 21.901 23.8417M30.4649 29.9487H31.1323L32 32.0512H15.9482L16.1596 31.4171M30.4649 29.9487C30.1251 25.5314 27.1183 23.9412 24.9919 23.5676M22.9229 23.5963C23.2489 23.5395 23.5935 23.4983 23.9574 23.4746C24.2607 23.473 24.6123 23.5009 24.9919 23.5676M22.9229 23.5963V22.0346L24.9919 22.0346V23.5676M22.9229 23.5963C22.5597 23.6595 22.2195 23.7422 21.901 23.8417M16.1596 31.4171H10.275M9.90794 20.0374C4.41965 19.1393 3.37392 22.6727 3.00363 24.6565C3.00115 24.6698 3 24.6828 3 24.6963V31.4171H5.86997M9.90794 20.0374L11.5765 22.874M9.90794 20.0374V19.2531V17.968M11.5765 22.874L10.275 24.3423V31.4171M11.5765 22.874L14.4131 20.0374M10.275 31.4171H5.86997M14.4131 20.0374C17.1496 19.8038 20.6536 19.4033 21.901 23.8417M14.4131 20.0374V18.4347M8.23936 10.7266V9.55864C5.37682 8.63097 5.69827 6.57399 6.22554 5.64092C6.23328 5.62723 6.24283 5.61439 6.25347 5.60282C8.25144 3.42937 10.4541 5.45757 10.8423 6.78879M8.23936 10.7266C7.63867 13.1739 7.59195 18.2286 12.2106 18.8693C14.2685 19.014 18.0306 17.5879 16.6156 10.7266M8.23936 10.7266H16.6156M16.6156 10.7266V9.55864C17.9344 9.23727 20.2025 8.00626 18.768 5.64786C18.7574 5.63036 18.7439 5.61385 18.7287 5.60018C18.2729 5.19159 17.5633 4.76281 16.8087 4.68828M14.1795 6.78879C14.856 5.05338 15.8674 4.59532 16.8087 4.68828M8.23936 4.64825C7.77215 2.81756 10.3418 0.581652 12.5109 3.18465C12.9781 1.91652 16.7158 0.982117 16.8087 4.68828M5.86997 25.6438V31.4171" stroke="white" stroke-width="1.5"/>
            <circle cx="12.9447" cy="26.0433" r="0.642132" stroke="white" stroke-width="1.18524"/>
            <circle cx="12.9447" cy="29.2484" r="0.642132" stroke="white" stroke-width="1.18524"/>
            </svg>
             },
        { id: 3, categoryName: "Photographers", categoryType: "photographer", categoryQuery: "skills workshops, hands-on training, personal development",categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.83091 14.7059H7.40438C6.90491 14.7059 6.5 15.1182 6.5 15.6176C5.67157 15.6176 5 16.2892 5 17.1176V30.0142C5 31.1109 5.88908 32 6.98582 32H27.2201C28.3168 32 29.2059 31.1109 29.2059 30.0142V16.9706C29.2059 16.2234 28.6002 15.6176 27.8529 15.6176C27.8529 15.2278 27.5369 14.9118 27.1471 14.9118H25.8529C25.4631 14.9118 25.1471 15.2278 25.1471 15.6176H22.6471C21.9118 13.5588 21.4118 12.4706 19.6471 12.5294V11.7941C21.0824 11.4882 21.3627 10.1176 21.3235 9.47059C22.2819 9.47059 23.0588 8.69367 23.0588 7.73529V3.98582C23.0588 2.88908 22.1697 2 21.073 2H12.9858C11.8891 2 11 2.88909 11 3.98583V7.64706C11 8.65417 11.8164 9.47059 12.8235 9.47059C12.7059 11 13.8529 11.6569 14.4412 11.7941V12.5294C12.1765 12.4118 11.9118 14.9118 11.5 15.6176H10.7353C10.7353 15.1182 10.3304 14.7059 9.83091 14.7059Z" stroke="white" stroke-width="1.5"/>
            <ellipse cx="7.41182" cy="18.1765" rx="1.17647" ry="1.17647" fill="white"/>
            <ellipse cx="9.00034" cy="19.7054" rx="0.588235" ry="0.588235" fill="white"/>
            <path d="M23.3231 23.7353C23.3231 27.179 20.5315 29.9706 17.0878 29.9706C13.6442 29.9706 10.8525 27.179 10.8525 23.7353C10.8525 20.2916 13.6442 17.5 17.0878 17.5C20.5315 17.5 23.3231 20.2916 23.3231 23.7353Z" stroke="white"/>
            <rect x="14" y="14.1758" width="6.11765" height="1.41176" rx="0.705882" fill="white"/>
            <rect x="12.8366" y="3.83807" width="8.44472" height="1.1506" fill="white" stroke="white" stroke-width="0.496456"/>
            <rect x="12.8366" y="6.42401" width="8.44472" height="1.1506" fill="white" stroke="white" stroke-width="0.496456"/>
            <path d="M22.2799 23.677C22.2799 26.4791 20.0084 28.7506 17.2063 28.7506C14.4043 28.7506 12.1328 26.4791 12.1328 23.677C12.1328 20.875 14.4043 18.6035 17.2063 18.6035C20.0084 18.6035 22.2799 20.875 22.2799 23.677Z" stroke="white" stroke-width="0.5"/>
            <path d="M19.7803 23.6776C19.7803 25.0989 18.6282 26.251 17.2069 26.251C15.7857 26.251 14.6335 25.0989 14.6335 23.6776C14.6335 22.2564 15.7857 21.1042 17.2069 21.1042C18.6282 21.1042 19.7803 22.2564 19.7803 23.6776Z" stroke="white" stroke-width="0.79433"/>
            </svg>
             },
        // { id: 4, categoryName: "Liquor store", categoryType: "liquor_store", categoryQuery: "live music, music festivals, concert tickets" },
        { id: 5, categoryName: "Musicians", categoryType: "night_club", categoryQuery: "team building, company retreats, corporate getaways", categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7976 6.64989C17.7976 8.77795 16.0029 10.5479 13.7327 10.5479C11.4626 10.5479 9.66786 8.77795 9.66786 6.64989C9.66786 4.52182 11.4626 2.75185 13.7327 2.75185C16.0029 2.75185 17.7976 4.52182 17.7976 6.64989Z" stroke="white" stroke-width="1.50369"/>
            <path d="M15.3922 23.6102C15.3922 24.2881 14.8178 24.8676 14.0717 24.8676C13.3256 24.8676 12.7512 24.2881 12.7512 23.6102C12.7512 22.9322 13.3256 22.3528 14.0717 22.3528C14.8178 22.3528 15.3922 22.9322 15.3922 23.6102Z" stroke="white" stroke-width="1.00246"/>
            <path d="M7.21813 19.4069L6.0757 20.629L10.4602 24.0866C10.7483 25.0503 10.7998 26.8467 8.7002 26.3221L2 21.4635L7.92828 13.8926H18.0249L21.7301 17.5588" stroke="white" stroke-linecap="round"/>
            <path d="M8.91602 18.1562V19.8851" stroke="white" stroke-width="1.00246" stroke-linecap="round"/>
            <path d="M9.01758 29.4165V31.2979C9.01758 31.6854 9.33175 31.9996 9.7193 31.9996H17.338C17.7256 31.9996 18.0397 31.6854 18.0397 31.2979V26.5176" stroke="white" stroke-linecap="round"/>
            <path d="M7.43432 21.6731C7.79455 20.8087 9.41042 19.2289 12.9921 19.8251C14.1963 18.4738 17.1728 16.3615 19.4453 18.7222M6.72416 24.922C6.69329 25.6374 7.12556 27.5093 9.10165 29.2739C11.0777 31.0384 13.3214 30.7046 14.1963 30.3171C14.7418 30.0985 16.1353 29.0354 17.3457 26.5316C19.0645 26.2236 22.2736 24.8207 21.3596 21.6731M17.3457 20.4808L18.7042 22.6567L23.0269 20.2125" stroke="white" stroke-linecap="round"/>
            <path d="M17.3447 20.4794L27.2561 14.9651M27.2561 17.767L28.3676 17.0814M27.1326 14.5777L28.6455 17.0814L31.9493 15.7103C32.0831 14.7764 31.8814 12.8369 30.0041 12.5508L27.1326 14.5777Z" stroke="white" stroke-linecap="round"/>
            <path d="M27.0091 18.2343C27.2213 18.455 27.3172 18.8147 27.2088 19.2836C27.1009 19.7499 26.7969 20.2726 26.3003 20.7175C25.8036 21.1625 25.2411 21.4163 24.7514 21.4853C24.2589 21.5548 23.8945 21.4357 23.6823 21.215C23.4701 20.9943 23.3742 20.6346 23.4826 20.1657C23.5904 19.6993 23.8945 19.1767 24.3911 18.7318C24.8877 18.2868 25.4502 18.033 25.94 17.9639C26.4325 17.8945 26.7969 18.0136 27.0091 18.2343Z" stroke="white"/>
            <path d="M7.21759 7.42514L5.60999 5.9926C5.4527 5.85243 5.2034 5.96088 5.19871 6.17151L5.11434 9.95873M5.11434 9.95873L5.08711 11.1808C5.01183 11.6896 4.4805 12.5488 2.97387 12.273C2.6775 12.2188 2.40727 12.0475 2.27802 11.7753C2.05646 11.3088 1.95354 10.6227 2.52437 10.0183C2.96449 9.57124 4.09867 8.93337 5.11434 9.95873Z" stroke="white" stroke-width="1.00246" stroke-linecap="round"/>
            <path d="M26.8763 4.08529L25.2687 2.65276C25.1114 2.51259 24.8621 2.62104 24.8574 2.83167L24.773 6.61889M24.773 6.61889L24.7458 7.84097C24.6705 8.34971 24.1392 9.20899 22.6326 8.9332C22.3362 8.87895 22.066 8.70766 21.9367 8.4355C21.7152 7.96897 21.6122 7.28288 22.1831 6.6785C22.6232 6.23139 23.7574 5.59353 24.773 6.61889Z" stroke="white" stroke-width="1.00246" stroke-linecap="round"/>
            <path d="M32.0027 25.9056L30.3951 24.4731C30.2379 24.3329 29.9886 24.4414 29.9839 24.652L29.8995 28.4392M29.8995 28.4392L29.8723 29.6613C29.797 30.17 29.2657 31.0293 27.759 30.7535C27.4627 30.6993 27.1924 30.528 27.0632 30.2558C26.8416 29.7893 26.7387 29.1032 27.3095 28.4988C27.7496 28.0517 28.8838 27.4138 29.8995 28.4392Z" stroke="white" stroke-linecap="round"/>
            </svg>
             },
        // { id: 6, categoryName: "Dj", categoryType: "establishment", categoryQuery: "charity events, fundraising galas, benefit concerts" },
        { id: 7, categoryName: "Florist", categoryType: "florist", categoryQuery: "trade shows, art exhibitions, product showcases", categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.1304 31.9934C17.2997 28.2251 19.9629 20.5998 29.2606 20.2441C28.9537 24.2558 26.0979 32.222 17.1304 31.9934Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M17.1304 31.9934C16.961 28.2251 14.2979 20.5998 5.0001 20.2441C5.30706 24.2558 8.16286 32.222 17.1304 31.9934Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M13.796 17.4609C13.7643 18.6041 14.3994 20.9158 17.1938 21.0175C19.9882 21.1191 20.6021 18.6888 20.5598 17.4609" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M20.5611 17.4365C21.5453 18.0189 23.8748 18.5852 25.3195 16.191C26.7641 13.7969 24.9369 12.0809 23.8427 11.5222" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M23.9711 11.5225C24.9556 10.9407 26.5743 9.17227 25.1725 6.75278C23.7707 4.3333 21.3866 5.10761 20.3698 5.7972" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M20.431 5.8398C20.5105 4.69896 19.9727 2.36269 17.185 2.14431C14.3972 1.92594 13.6822 4.32843 13.6732 5.55697" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M13.7314 5.66503C12.7541 5.07107 10.4314 4.47741 8.95866 6.8544C7.48592 9.23139 9.2928 10.9687 10.3803 11.5403" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10.3311 11.5224C9.33704 12.0878 7.6892 13.8291 9.05061 16.2715C10.412 18.714 12.8086 17.9794 13.8367 17.3068" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="17.0984" cy="11.553" r="2.58424" stroke="white" stroke-width="1.5"/>
            </svg>
             },
        { id: 8, categoryName: "Rental Equipments", categoryType: "hardware_store", categoryQuery: "networking mixers, business meetups, professional gatherings", categoryIcon: <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.12382 23.1836C3.56254 23.3931 4.01817 23.4277 4.33287 23.3866H8.71158M3.12382 23.1836C2.51477 22.8927 1.93831 22.2647 1.81674 21.0339L0.999817 14.1717C1.3048 13.4202 2.15658 12.368 3.12382 14.1717L4.28627 20.7695C4.31322 20.9224 4.44609 21.0339 4.60139 21.0339H9.10008C9.35813 21.0339 9.61715 21.1032 9.80469 21.2805C10.2879 21.7372 10.6708 22.4895 9.79407 23.1829C9.60916 23.3292 9.37136 23.3866 9.13561 23.3866H8.71158M3.12382 23.1836L0.999817 31.0004M8.71158 23.3866V31.0004" stroke="white" stroke-width="1.45" stroke-linecap="round"/>
            <path d="M30.8726 23.0039C30.4339 23.2134 29.9782 23.248 29.6635 23.207H25.2848M30.8726 23.0039C31.4816 22.7131 32.0581 22.0851 32.1797 20.8542L32.9966 13.992C32.6916 13.2405 31.8398 12.1883 30.8726 13.992L29.7101 20.5898C29.6832 20.7427 29.5503 20.8542 29.395 20.8542H24.8963C24.6383 20.8542 24.3793 20.9235 24.1917 21.1008C23.7085 21.5575 23.3256 22.3098 24.2023 23.0033C24.3872 23.1495 24.625 23.207 24.8608 23.207H25.2848M30.8726 23.0039L32.9966 30.8207M25.2848 23.207V30.8207" stroke="white" stroke-width="1.45" stroke-linecap="round"/>
            <rect x="9.42966" y="13.8449" width="15.2928" height="1.30708" stroke="white" stroke-width="1.30708"/>
            <path d="M15.9015 15.8047V27.9278M18.2216 15.8047V27.9278" stroke="white" stroke-width="1.45" stroke-linecap="round"/>
            <rect x="14.3382" y="28.6195" width="5.34681" height="1.62164" stroke="white" stroke-width="1.45"/>
            <path d="M17.0446 2V6.08462M17.0446 6.08462L14.6949 8.46295C14.5726 8.5868 14.6603 8.79681 14.8344 8.79681H19.1688C19.3412 8.79681 19.4297 8.59042 19.3108 8.46558L17.0446 6.08462Z" stroke="white" stroke-width="1.45" stroke-linecap="round"/>
            </svg>
            },
        { id: 9, categoryName: "Makeup Artist", categoryType: "beauty_salon", categoryQuery: "family reunions, picnics, community gatherings", categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.6309 17.4508V19.4975C13.8372 19.7412 10.2797 21.2519 10.3984 25.3454L18 27.002L25.6505 25.3454C25.7124 23.5788 24.6337 19.9361 19.8243 19.4975V17.4508M28.0349 23.4864L24.2969 18.8846C25.0391 15.639 28.1007 16.0476 29.4366 16.5837L30.3711 21.6457M28.0349 23.4864L29.9923 25.5647L32 29.502C32.3711 29.7943 32.9109 30.2592 33 29.002L31.2541 24.9799L30.3711 21.6457M28.0349 23.4864C28.1939 23.0491 28.5544 22.5901 28.9694 22.1059M30.3711 21.6457C29.9025 21.5507 29.329 21.6862 28.9694 22.1059M28.0349 20.2651L28.9694 22.1059" stroke="white" stroke-width="1.45712" stroke-linecap="round"/>
            <path d="M3.54097 25.1754L1.84546 27.3725C1.53795 27.771 1.60451 28.3429 1.9958 28.6641L3.35799 29.7823C3.76354 30.1152 4.36223 30.0525 4.68577 29.6433L6.4824 27.3706M3.54097 25.1754L4.76479 23.4095C4.91161 23.1977 5.20357 23.1459 5.41632 23.2941L6.18351 23.8284M3.54097 25.1754L6.4824 27.3706M6.4824 27.3706L7.80455 25.5566C7.95744 25.3469 7.90836 25.052 7.69542 24.9009L7.34141 24.6498M6.18351 23.8284L7.34141 24.6498M6.18351 23.8284L7.36731 22.1053L8.76904 20.2645C9.41497 19.7157 10.5564 19.2504 9.88461 21.1706L7.34141 24.6498" stroke="white" stroke-width="1.45712" stroke-linecap="round"/>
            <path d="M10.0658 17.5169L9.91414 11.1939M25.4292 14.593C26.7949 7.10776 24.4685 4.69176 22.6089 3.5552C15.6147 -0.719515 11.553 4.01283 10.1183 7.48791C9.9172 7.97492 9.84959 8.50253 9.86223 9.02925L9.91414 11.1939M9.91414 11.1939C10.5383 11.2923 11.283 11.3572 12.0697 11.3551M12.0697 11.3551C15.1823 11.3471 18.9534 10.2914 18.5268 6.11362C18.5021 6.51567 19.1503 7.50249 21.9409 8.23347C22.9924 9.0741 24.4644 11.5667 21.9409 14.8123C21.2606 15.6164 19.5139 17.283 17.9702 17.5169C16.2631 17.1249 12.6932 15.3437 12.0697 11.3551Z" stroke="white" stroke-width="1.45712" stroke-linecap="round"/>
            </svg>
             },
        { id: 10, categoryName: "Car rental", categoryType: "car_rental", categoryQuery: "networking mixers, business meetups, professional gatherings" ,categoryIcon:<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_3383_86482" fill="white">
            <rect x="2" y="2" width="15.145" height="30" rx="0.631043"/>
            </mask>
            <rect x="2" y="2" width="15.145" height="30" rx="0.631043" stroke="white" stroke-width="3" mask="url(#path-1-inside-1_3383_86482)"/>
            <path d="M13.8839 15.5C13.8839 17.6841 12.0495 19.4833 9.75059 19.4833C7.45171 19.4833 5.61725 17.6841 5.61725 15.5C5.61725 13.3159 7.45171 11.5167 9.75059 11.5167C12.0495 11.5167 13.8839 13.3159 13.8839 15.5Z" stroke="white" stroke-width="1.03333"/>
            <path d="M24.7534 6.92167C24.7534 7.82202 23.9944 8.58057 23.022 8.58057C22.0497 8.58057 21.2906 7.82202 21.2906 6.92167C21.2906 6.02132 22.0497 5.26276 23.022 5.26276C23.9944 5.26276 24.7534 6.02132 24.7534 6.92167Z" stroke="white" stroke-width="1.03333"/>
            <path d="M7.1665 15.2595L9.05963 17.2061L12.2937 14" stroke="white" stroke-width="1.03333" stroke-linecap="round"/>
            <path d="M6.13281 3V4.03053C6.22484 4.32316 6.56665 4.90076 7.1977 4.87023H11.5756C11.8911 4.84478 12.5142 4.64122 12.4827 4.03053V3" stroke="white" stroke-width="1.03333" stroke-linecap="round"/>
            <path d="M27.6163 6.77366C27.4045 10.081 24.5788 13.9216 23.0713 15.5454C22.9729 15.6514 22.8046 15.6399 22.7169 15.5249L21.1086 13.4151L19.4916 10.8958L19.4883 10.8902C19.0145 10.088 18.1904 8.69286 18.3478 6.77366C18.545 4.36908 19.7677 3.45349 20.0832 3.22426C21.3491 2.30451 22.3181 2.38457 23.0412 2.38457C23.475 2.41002 24.5163 2.55251 25.6837 3.22427C26.8511 3.89602 27.6163 5.0945 27.6163 6.77366Z" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M17.8545 17.8027C19.1297 18.0572 22.1377 19.0165 23.9677 20.818M23.9677 20.818L31.4393 23.1152C31.5004 23.134 31.5441 23.1878 31.55 23.2514L31.9186 27.2105C31.9272 27.303 31.8544 27.3829 31.7615 27.3829H30.1204M23.9677 20.818C24.5988 22.131 20.1552 21.874 17.8545 21.5814M24.4804 27.6882H17.8545" stroke="white" stroke-linecap="round"/>
            <path d="M29.7388 26.6928C29.7388 28.0245 28.6186 29.1318 27.2019 29.1318C25.7853 29.1318 24.665 28.0245 24.665 26.6928C24.665 25.3612 25.7853 24.2539 27.2019 24.2539C28.6186 24.2539 29.7388 25.3612 29.7388 26.6928Z" stroke="white"/>
            <ellipse cx="18.2903" cy="24.1004" rx="0.513491" ry="0.496927" fill="white"/>
            <ellipse cx="19.9451" cy="25.3211" rx="0.513491" ry="0.496927" fill="white"/>
            <ellipse cx="21.5233" cy="24.1004" rx="0.513491" ry="0.496927" fill="white"/>
            </svg>
            },
        // { id: 11, categoryName: "Event Transport", categoryType: "car_rental", categoryQuery: "family reunions, picnics, community gatherings" },
        { id: 12, categoryName: "Convenience Store", categoryType: "convenience_store", categoryQuery: "family reunions, picnics, community gatherings" },

    ];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleVendorType = (vendorType) => {
        setVendorType(vendorType);
        setshowAllCategoryCards(!showAllCategoryCards);
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (position.coords) {
                        setLocation({ lat: latitude, long: longitude });
                    }
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getLocation();
        console.log('location', location);
    }, []);

    const handleComponentChangeStatus = () => {

        setshowAllCategoryCards(!showAllCategoryCards);
    }


    const handleTabClick = async (tab) => {
        setActiveTab(tab);
        if (tab == 'tab1') {
            setshowAllCategoryCards(true);
        }

        if (tab == 'tab2') {
            readBookedVendors();
        }

        if (tab == 'tab3') {
            readFavoriteVendors();
        }


    };



    const deleteFavorites = (favoriteID) => {


        DeleteDataInMongo('favorites', favoriteID).then(response => {
            console.log('Response from updateData:', response);
            // toast('Deleted Successfully')
            showSnackbar('Vendor removed from favorites.');

            readFavoriteVendors();


        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });



    }

    const handleUnBookNow = (bookedID) => {
        DeleteDataInMongo('booked_vendors', bookedID).then(response => {
            console.log('Response from updateData:', response);
            showSnackbar('Booking has been removed.');
            readBookedVendors();


        })
            .catch(error => {
                console.error('Failed to update data:', error);
            });
    }


    const readBookedVendors = async () => {
        try {
           

            const queryParams = {
                and: [
                    { email: userEmail,},
                    { eventID: eventID,}
                ]
            };

            const result = await readDataFromMongoWithParam('booked_vendors', JSON.stringify(queryParams));

            if (result && result.length > 0) {
                console.log(result + '6666666666');
                setBookedList(result);
            } else {
                console.log(false);
            }
        } catch (error) {
            console.error('Error checking event:', error);

        }
    }

    const readFavoriteVendors = async () => {
        try {


            const queryParams = {
                and: [
                    { email: userEmail, },
                    { eventID: eventID },
                ]
            };

            const result = await readDataFromMongoWithParam('favorites', JSON.stringify(queryParams));

            if (result && result.length > 0) {
                console.log(result);
                setFavoriteList(result);
            } else {
                console.log(false);
            }
        } catch (error) {
            console.error('Error checking event:', error);

        }
    }

    return (

        <>

            {!showAllCategoryCards ? <div className="container-back" onClick={handleComponentChangeStatus}>
                <i className="fa-solid fa-chevron-left"></i>
            </div> : <></>}


            <div className="tabs">
                <button onClick={() => handleTabClick('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>All Vendors</button>
                <button onClick={() => handleTabClick('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>Booked Vendors</button>
                <button onClick={() => handleTabClick('tab3')} className={activeTab === 'tab3' ? 'active' : ''}>Favourites</button>
            </div>

            <div style={{ display: activeTab === 'tab1' ? 'block' : 'none' }}>
                <section className='all-category-vendor'>
                    {showAllCategoryCards ? <div className="vendor-category-cards">
                        {category_cards.map((card, index) => (
                            <div
                                className='vendor-category-card'
                                key={card.id}
                                onClick={() => handleVendorType({ vendorType: card.categoryType, vendorName: card.categoryName })} // Changed here
                            >
                                <div className="card-image">
                                    <UnsplashImages query={card.categoryName} numberOfImages={'1'} randomPage={index} />
                                </div>
                                <div className="card-content">
                                    <h4><div className='flex-icon'>{card.categoryIcon}{card.categoryName}</div></h4>
                                </div>
                                <div>

                                </div>
                            </div>
                        ))}
                    </div> :

                        <div className='vendor-details'>
                            <VendorsList getVendorType={vendType} currentLocation={location} />
                        </div>

                    }
                </section>

            </div>
            <div style={{ display: activeTab === 'tab2' ? 'block' : 'none' }}>
                <section className='all-booked-vendor'>
                    {bookedList.length > 0 ? (
                        <div className="vendor-all-cards">
                            {bookedList.map((bookedVendor, index) => (
                                <div
                                    className="vendor-custom-card"
                                    key={bookedVendor._id}
                                >
                                    <div className="vendor-card-image">
                                        <UnsplashImages
                                            query={bookedVendor.business_name}
                                            numberOfImages={'1'}
                                            randomPage={'1'}
                                        />
                                    </div>
                                    <div>
                                        {/* <button >
                    <i className="fa-solid fa-heart"></i>
                  </button> */}
                                    </div>
                                    <div className="vendor-card-info">
                                        <div className="vendor-card-content">
                                            <h5>{bookedVendor.business_name}</h5>
                                            {/* <p>Contact no.: {vendor.user_phone}</p> */}
                                            <p>{bookedVendor.business_location}</p>
                                            <div className='vendor-package-all'>
                                                <a
                                                    className="vendor-show-package"
                                                    aria-describedby={`popover-${bookedVendor._id}`}
                                                    onClick={(event) => handleClick(event, bookedVendor._id)}
                                                >                                                    Package Details
                                                </a>
                                                <Popover
                                                    id={`popover-${bookedVendor._id}`}
                                                    open={Boolean(popoverState[bookedVendor._id])}
                                                    anchorEl={popoverState[bookedVendor._id]}
                                                    onClose={() => handleClose(bookedVendor._id)}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <div className='vendor-package-data'>
                                                        <h5>Package Name : <span>{bookedVendor.package_name}</span></h5>
                                                        <h5>Package Price : <span>{bookedVendor.package_price} / {bookedVendor.pricing_method}</span></h5>
                                                        <h5>Package Includes : <span>{bookedVendor.package_includes}</span></h5>


                                                    </div>
                                                </Popover>
                                            </div>
                                        </div>
                                        <button className="button-purple-fill" onClick={() => handleUnBookNow(bookedVendor._id)}>Cancel Booking</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Booked Vendors.</p>
                    )}
                </section>
            </div>
            <div style={{ display: activeTab === 'tab3' ? 'block' : 'none' }}>


                <section className='all-favorite-vendor'>
                    {favoriteList.length > 0 ? (
                        <div className="vendor-all-cards">
                            {favoriteList.map((bookedVendor, index) => (
                                <div
                                    className="vendor-custom-card"
                                    key={bookedVendor._id}
                                >
                                    <div className="vendor-card-image">
                                        {
                                            bookedVendor.business_image != '' ?
                                                <img src={bookedVendor.business_image} alt='vendor image' />
                                                :
                                                <UnsplashImages
                                                    query={bookedVendor.business_name}
                                                    numberOfImages={'1'}
                                                    randomPage={'1'}
                                                />
                                        }
                                    </div>
                                    <div>
                                        {/* <button >
                    <i className="fa-solid fa-heart"></i>
                  </button> */}
                                    </div>
                                    <div className="vendor-card-info">

                                        <div className="vendor-card-content">
                                            <h5>{bookedVendor.business_name}</h5>
                                            <p>{bookedVendor.business_location}</p>
                                        </div>
                                        <Heart isClick={isClick} onClick={() => deleteFavorites(bookedVendor._id)} />

                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No Favorite Vendors.</p>
                    )}
                </section>



            </div>

        </>
    );
}
