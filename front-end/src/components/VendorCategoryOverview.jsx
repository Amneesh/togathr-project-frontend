import React from 'react'
import "../css/VendorDetailDescription.css";



const VendorCard = ({ vendor }) => {
    return (
        <div className="ven-card">
            <div className="ven-header">
                <img src={vendor.image} alt={vendor.name} />
            </div>
            <div className="ven-footer">
                <h4>{vendor.name}</h4>
                <p>Starts from : {vendor.price}</p>
                <div className="ven-footer-content">
                    <p><i className="fa-solid fa-location-dot"></i> {vendor.place}</p>
                    <p>&#11088; {vendor.rating}</p>
                </div>
            </div>
        </div>
    );
};

const VendorCategoryOverview = ({ active }) => {
    return (

        <div className='main-cat'>
            <div className='heading-cat'>
                <h3>Vendor Categories</h3>
                <button className='button-purple' onClick={(e) => active('vendors')} >View All</button>
            </div>
            <div className='flex-cat'>


                <div className='m-cat'>
                    <div className='bg-color' >
                        <button onClick={(e) => active('vendors')}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.74074 19.9674H6.62963L3 32.0002H31L27.3704 19.9674H23.7407L16.9962 28.1475C16.8497 28.3251 16.5774 28.3246 16.4316 28.1464L9.74074 19.9674Z" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M23.8774 15.4896L16.7132 24.0373L9.64185 15.4588C9.06452 14.7584 8.55543 13.9924 8.27827 13.1281C7.48835 10.6648 7.82223 8.72536 8.30657 7.60572C8.51985 7.11271 8.81552 6.65585 9.09814 6.19905C12.3331 0.970343 18.3159 1.62447 20.8309 2.88582C26.021 5.48883 26.0443 10.3361 25.192 13.2375C24.9442 14.081 24.4421 14.8158 23.8774 15.4896Z" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M20.044 10.0678C20.044 11.7686 18.6029 13.2361 16.7139 13.2361C14.8249 13.2361 13.3839 11.7686 13.3839 10.0678C13.3839 8.36704 14.8249 6.8995 16.7139 6.8995C18.6029 6.8995 20.044 8.36704 20.044 10.0678Z" stroke="#5E11C9" strokeWidth="3.11931" />
                        </svg>
                        </button>
                    </div>

                    <p>Venues</p>
                </div>

                <div className='m-cat'>
                    <div className='bg-color'>
                    <button onClick={(e) => active('vendors')}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.12382 23.1836C3.56254 23.3931 4.01817 23.4277 4.33287 23.3866H8.71158M3.12382 23.1836C2.51477 22.8927 1.93831 22.2647 1.81674 21.0339L0.999817 14.1717C1.3048 13.4202 2.15658 12.368 3.12382 14.1717L4.28627 20.7695C4.31322 20.9224 4.44609 21.0339 4.60139 21.0339H9.10008C9.35813 21.0339 9.61715 21.1032 9.80469 21.2805C10.2879 21.7372 10.6708 22.4895 9.79407 23.1829C9.60916 23.3292 9.37136 23.3866 9.13561 23.3866H8.71158M3.12382 23.1836L0.999817 31.0004M8.71158 23.3866V31.0004" stroke="#5E11C9" strokeWidth="1.45" strokeLinecap="round" />
                            <path d="M30.8726 23.0039C30.4339 23.2134 29.9782 23.248 29.6635 23.207H25.2848M30.8726 23.0039C31.4816 22.7131 32.0581 22.0851 32.1797 20.8542L32.9966 13.992C32.6916 13.2405 31.8398 12.1883 30.8726 13.992L29.7101 20.5898C29.6832 20.7427 29.5503 20.8542 29.395 20.8542H24.8963C24.6383 20.8542 24.3793 20.9235 24.1917 21.1008C23.7085 21.5575 23.3256 22.3098 24.2023 23.0033C24.3872 23.1495 24.625 23.207 24.8608 23.207H25.2848M30.8726 23.0039L32.9966 30.8207M25.2848 23.207V30.8207" stroke="#5E11C9" strokeWidth="1.45" strokeLinecap="round" />
                            <rect x="9.42966" y="13.8449" width="15.2928" height="1.30708" stroke="#5E11C9" strokeWidth="1.30708" />
                            <path d="M15.9015 15.8047V27.9278M18.2216 15.8047V27.9278" stroke="white" strokeWidth="1.45" strokeLinecap="round" />
                            <rect x="14.3382" y="28.6195" width="5.34681" height="1.62164" stroke="#5E11C9" strokeWidth="1.45" />
                            <path d="M17.0446 2V6.08462M17.0446 6.08462L14.6949 8.46295C14.5726 8.5868 14.6603 8.79681 14.8344 8.79681H19.1688C19.3412 8.79681 19.4297 8.59042 19.3108 8.46558L17.0446 6.08462Z" stroke="#5E11C9" strokeWidth="1.45" strokeLinecap="round" />
                        </svg>
                        </button>
                    </div>
                    <p>Rental Equipments</p>

                </div>

                <div className='m-cat'>
                    <div className='bg-color'>
                    <button onClick={(e) => active('vendors')}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.1304 31.9934C17.2997 28.2251 19.9629 20.5998 29.2606 20.2441C28.9537 24.2558 26.0979 32.222 17.1304 31.9934Z" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M17.1304 31.9934C16.961 28.2251 14.2979 20.5998 5.0001 20.2441C5.30706 24.2558 8.16286 32.222 17.1304 31.9934Z" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M13.796 17.4609C13.7643 18.6041 14.3994 20.9158 17.1938 21.0175C19.9882 21.1191 20.6021 18.6888 20.5598 17.4609" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M20.5611 17.4365C21.5453 18.0189 23.8748 18.5852 25.3195 16.191C26.7641 13.7969 24.9369 12.0809 23.8427 11.5222" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M23.9711 11.5225C24.9556 10.9407 26.5743 9.17227 25.1725 6.75278C23.7707 4.3333 21.3866 5.10761 20.3698 5.7972" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M20.431 5.8398C20.5105 4.69896 19.9727 2.36269 17.185 2.14431C14.3972 1.92594 13.6822 4.32843 13.6732 5.55697" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M13.7314 5.66503C12.7541 5.07107 10.4314 4.47741 8.95866 6.8544C7.48592 9.23139 9.2928 10.9687 10.3803 11.5403" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M10.3311 11.5224C9.33704 12.0878 7.6892 13.8291 9.05061 16.2715C10.412 18.714 12.8086 17.9794 13.8367 17.3068" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="17.0984" cy="11.553" r="2.58424" stroke="#5E11C9" strokeWidth="1.5" />
                        </svg>
                        </button>
                    </div>
                    <p>florist</p>
                </div>

                <div className='m-cat'>
                    <div className='bg-color'>
                    <button onClick={(e) => active('vendors')}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <mask id="path-1-inside-1_3383_86482" fill="white">
                                <rect x="2" y="2" width="15.145" height="30" rx="0.631043" />
                            </mask>
                            <rect x="2" y="2" width="15.145" height="30" rx="0.631043" stroke="#5E11C9" strokeWidth="3" mask="url(#path-1-inside-1_3383_86482)" />
                            <path d="M13.8839 15.5C13.8839 17.6841 12.0495 19.4833 9.75059 19.4833C7.45171 19.4833 5.61725 17.6841 5.61725 15.5C5.61725 13.3159 7.45171 11.5167 9.75059 11.5167C12.0495 11.5167 13.8839 13.3159 13.8839 15.5Z" stroke="#5E11C9" strokeWidth="1.03333" />
                            <path d="M24.7534 6.92167C24.7534 7.82202 23.9944 8.58057 23.022 8.58057C22.0497 8.58057 21.2906 7.82202 21.2906 6.92167C21.2906 6.02132 22.0497 5.26276 23.022 5.26276C23.9944 5.26276 24.7534 6.02132 24.7534 6.92167Z" stroke="#5E11C9" strokeWidth="1.03333" />
                            <path d="M7.1665 15.2595L9.05963 17.2061L12.2937 14" stroke="#5E11C9" strokeWidth="1.03333" strokeLinecap="round" />
                            <path d="M6.13281 3V4.03053C6.22484 4.32316 6.56665 4.90076 7.1977 4.87023H11.5756C11.8911 4.84478 12.5142 4.64122 12.4827 4.03053V3" stroke="#5E11C9" strokeWidth="1.03333" strokeLinecap="round" />
                            <path d="M27.6163 6.77366C27.4045 10.081 24.5788 13.9216 23.0713 15.5454C22.9729 15.6514 22.8046 15.6399 22.7169 15.5249L21.1086 13.4151L19.4916 10.8958L19.4883 10.8902C19.0145 10.088 18.1904 8.69286 18.3478 6.77366C18.545 4.36908 19.7677 3.45349 20.0832 3.22426C21.3491 2.30451 22.3181 2.38457 23.0412 2.38457C23.475 2.41002 24.5163 2.55251 25.6837 3.22427C26.8511 3.89602 27.6163 5.0945 27.6163 6.77366Z" stroke="#5E11C9" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M17.8545 17.8027C19.1297 18.0572 22.1377 19.0165 23.9677 20.818M23.9677 20.818L31.4393 23.1152C31.5004 23.134 31.5441 23.1878 31.55 23.2514L31.9186 27.2105C31.9272 27.303 31.8544 27.3829 31.7615 27.3829H30.1204M23.9677 20.818C24.5988 22.131 20.1552 21.874 17.8545 21.5814M24.4804 27.6882H17.8545" stroke="#5E11C9" strokeLinecap="round" />
                            <path d="M29.7388 26.6928C29.7388 28.0245 28.6186 29.1318 27.2019 29.1318C25.7853 29.1318 24.665 28.0245 24.665 26.6928C24.665 25.3612 25.7853 24.2539 27.2019 24.2539C28.6186 24.2539 29.7388 25.3612 29.7388 26.6928Z" stroke="#5E11C9" />
                            <ellipse cx="18.2903" cy="24.1004" rx="0.513491" ry="0.496927" fill="#5E11C9" />
                            <ellipse cx="19.9451" cy="25.3211" rx="0.513491" ry="0.496927" fill="#5E11C9" />
                            <ellipse cx="21.5233" cy="24.1004" rx="0.513491" ry="0.496927" fill="#5E11C9" />
                        </svg>
                        </button>
                    </div>
                    <p>car Rental</p>
                </div>

                <div className='m-cat'>
                    <div className='bg-color'>
                    <button onClick={(e) => active('vendors')}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.6309 17.4508V19.4975C13.8372 19.7412 10.2797 21.2519 10.3984 25.3454L18 27.002L25.6505 25.3454C25.7124 23.5788 24.6337 19.9361 19.8243 19.4975V17.4508M28.0349 23.4864L24.2969 18.8846C25.0391 15.639 28.1007 16.0476 29.4366 16.5837L30.3711 21.6457M28.0349 23.4864L29.9923 25.5647L32 29.502C32.3711 29.7943 32.9109 30.2592 33 29.002L31.2541 24.9799L30.3711 21.6457M28.0349 23.4864C28.1939 23.0491 28.5544 22.5901 28.9694 22.1059M30.3711 21.6457C29.9025 21.5507 29.329 21.6862 28.9694 22.1059M28.0349 20.2651L28.9694 22.1059" stroke="#5E11C9" strokeWidth="1.45712" strokeLinecap="round" />
                            <path d="M3.54097 25.1754L1.84546 27.3725C1.53795 27.771 1.60451 28.3429 1.9958 28.6641L3.35799 29.7823C3.76354 30.1152 4.36223 30.0525 4.68577 29.6433L6.4824 27.3706M3.54097 25.1754L4.76479 23.4095C4.91161 23.1977 5.20357 23.1459 5.41632 23.2941L6.18351 23.8284M3.54097 25.1754L6.4824 27.3706M6.4824 27.3706L7.80455 25.5566C7.95744 25.3469 7.90836 25.052 7.69542 24.9009L7.34141 24.6498M6.18351 23.8284L7.34141 24.6498M6.18351 23.8284L7.36731 22.1053L8.76904 20.2645C9.41497 19.7157 10.5564 19.2504 9.88461 21.1706L7.34141 24.6498" stroke="#5E11C9" strokeWidth="1.45712" strokeLinecap="round" />
                            <path d="M10.0658 17.5169L9.91414 11.1939M25.4292 14.593C26.7949 7.10776 24.4685 4.69176 22.6089 3.5552C15.6147 -0.719515 11.553 4.01283 10.1183 7.48791C9.9172 7.97492 9.84959 8.50253 9.86223 9.02925L9.91414 11.1939M9.91414 11.1939C10.5383 11.2923 11.283 11.3572 12.0697 11.3551M12.0697 11.3551C15.1823 11.3471 18.9534 10.2914 18.5268 6.11362C18.5021 6.51567 19.1503 7.50249 21.9409 8.23347C22.9924 9.0741 24.4644 11.5667 21.9409 14.8123C21.2606 15.6164 19.5139 17.283 17.9702 17.5169C16.2631 17.1249 12.6932 15.3437 12.0697 11.3551Z" stroke="#5E11C9" strokeWidth="1.45712" strokeLinecap="round" />
                        </svg>
                        </button>
                    </div>
                    <p>makeup</p>

                </div>





            </div>


        </div>
    )
}

export default VendorCategoryOverview