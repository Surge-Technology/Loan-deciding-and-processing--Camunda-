/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCardFooter,
  CCardImage,
  CCardText,
  CCardTitle,
  CCarousel,
  CCarouselCaption,
  CCarouselItem,
  CContainer,
  CImage,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import './dashboard.css'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import {
  cibAdguard,
  cibBuffer,
  cibFSecure,
  cibHackhands,
  cilBank,
  cilClock,
  cilCreditCard,
  cilLockLocked,
  cilMoney,
  cilVoiceOverRecord,
} from '@coreui/icons'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { MDBCol, MDBContainer, MDBFooter, MDBRow } from 'mdb-react-ui-kit'
import { Shield } from '@mui/icons-material'
import Check from '@mui/icons-material/Check'
import SupportAgent from '@mui/icons-material/SupportAgent'
import { NavLink, useNavigate } from "react-router-dom"
import axios from 'axios'




const Dashboard = () => {
  const showIcons = [
    { icon: cibHackhands, text: 'Account Opening' },
    { icon: cibFSecure, text: 'Transaction ' },
    { icon: cilBank, text: 'Deposit' },
    { icon: cibBuffer, text: 'login secure' },
    { icon: cilCreditCard, text: 'Credit Card ' },
    { icon: cilMoney, text: 'Withdraw' },
  ]
  const [activeIndex, setActiveIndex] = useState(0)
  let navigate = useNavigate()
  const URL = import.meta.env.VITE_BASE_URL;

console.log("url-----",URL);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % showIcons.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [showIcons.length])

  const handleStart = () => {
navigate('/UserRegistration');
    // axios.post('http://localhost:8080/startWorkFlow')
    //   .then((response) => {
    //     // Axios considers any status code in the 2xx range as a success
    //     // So, no need for response.ok
    //     if (response.status !== 200) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.data; // Axios responses already return JSON data in the 'data' property
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     console.error('There was a problem with the fetch operation:', error.message);
    //   });
    }
   
    const handleApplyLoan = () => {
 navigate('/loginPage');
      // axios.post('http://localhost:8080/startLoanRequestWorkFlow')
      //   .then((response) => {
      //     // Axios considers any status code in the 2xx range as a success
      //     // So, no need for response.ok
      //     if (response.status !== 200) {
      //       throw new Error('Network response was not ok');
      //     }
      //     return response.data; // Axios responses already return JSON data in the 'data' property
      //   })
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((error) => {
      //     console.error('There was a problem with the fetch operation:', error.message);
      //   });
    }

    return (
      <div>
        <CCarousel controls indicators>
          <CCarouselItem>
            <CImage className="img-fluid" src="\src\assets\images\l04.jpg" alt="slide 2" />
          </CCarouselItem>
          <CCarouselItem>
            <CImage className=" img-fluid" src="\src\assets\images\l05.jpg" alt="slide 3" />
          </CCarouselItem>
          <CCarouselItem>
            <CImage className="img-fluid" src="\src\assets\images\coin2.jpg" alt="slide 4" />
          </CCarouselItem>
          <CCarouselItem>
            <CImage className="img-fluid" src="\src\assets\images\coin4.jpg" alt="slide 5" />
            <CCarouselCaption className="d-none d-md-block">
              <h5>Second slide label</h5>
              <p>Some representative placeholder content for the first slide.</p>
            </CCarouselCaption>
          </CCarouselItem>
        </CCarousel>
        <div className="icon-container text-center fw-bolder fs-4 mt-4 mb-4">
          <p className="fs-2">The bank you chosen shapes the security of your tomorrow</p>
          <p className="fs-6">What rights for you </p>
          <CIcon icon={showIcons[activeIndex].icon} size="4xl" className="icon-move mb-2" />
          <p>{showIcons[activeIndex].text}</p>
        </div>

        <CContainer className="d-flex justify-content-center mt-3">
          <CRow xs={{ cols: 1 }} md={{ cols: 2 }}>
            <CCol className="ml-6 mr-6 mr-7 mb-4">
              {/* <div className="mx-3 " style={{ padding: '3px 3px' }}> */}
              {/* <CCardImage
                className="rounded-rectangle shadow-sm hover-zoom"
                src="\src\assets\images\a1.jpg"
                onClick={handleStart}
                style={{
                  width: '400px',
                  height: '400px',
                  padding: '4px 4px',
                  borderRadius: '15px',

                }
                }
              ></CCardImage> */}
              <div className="mx-3 " style={{ padding: '3px 3px', listStyle: 'none' }}>
                {/* <a href="#" className="btn btn-primary hover-btn-zoom"  onClick={handleStart}>
                  New Customer{' '}
                </a> */}
                <CNavItem >
                  <CNavLink to="/UserRegistration" as={NavLink}>
                    <CCardImage
                      className="rounded-rectangle shadow-sm hover-zoom"
                      src="\src\assets\images\newcustomer.png"
                      onClick={handleStart}
                      style={{
                        width: '400px',
                        height: '400px',
                        padding: '4px 4px',
                        borderRadius: '15px',
                        cursor: 'pointer',
                      }
                      }
                    ></CCardImage>
                  </CNavLink>
                </CNavItem>
              </div>
              {/* </div> */}
            </CCol>
            <CCol className="ml-6 mr-6 mr-7 mb-4">
              <div className="mx-3 " style={{ padding: '3px 3px', listStyle: 'none' }}>
                <CNavItem >
                  <CNavLink to="/loginPage" as={NavLink}>
                    <CCardImage
                      className="rounded-rectangle shadow-sm hover-zoom"
                      src="\src\assets\images\applyloan.png"
                      onClick={handleApplyLoan}
                      style={{
                        width: '400px',
                        height: '400px',
                        padding: '4px 4px',
                        borderRadius: '15px',
                        cursor: 'pointer',
                      }}
                    ></CCardImage>
                  </CNavLink>
                </CNavItem>

                {/* <div className="d-flex justify-content-center mt-3">
                <a href="#" className="btn btn-primary hover-btn-zoom">
                  Apply Loan
                </a>
              </div> */}
              </div>
            </CCol>
          </CRow>
        </CContainer>
        <CCard bgColor="light" className="text-center text-lg-left">
          <CContainer className="p-4">
            <CRow>
              <CCol lg="3" md="6" className="mb-4 mb-md-0">
                <CIcon
                  icon={cibAdguard}
                  size="3xl"
                  className="mt-3 mb-3"
                  style={{ backgroundColor: '#0059b3', color: 'white', borderRadius: '50%' }}
                />

                <h5 className="bold">Secure Transaction</h5>

                <p className="text-center text-lg-start justify-content-between">
                  {' '}
                  Using certified security certificates to prove our site is legitimate, and it
                  secures the connection between our customer and the system.
                </p>
              </CCol>

              <CCol lg="3" md="6" className="mb-4 mb-md-0">
                <CIcon
                  icon={cilVoiceOverRecord}
                  size="3xl"
                  className="mt-3 mb-3"
                  style={{ backgroundColor: '#0059b3', color: 'white', borderRadius: '50%' }}
                />
                <h5 className="bold">Support Team</h5>

                <p className="text-center text-lg-start justify-content-between">
                  We prioritize your requests and ensure quick turnaround times for issues, big or
                  small.
                </p>
              </CCol>

              <CCol lg="3" md="6" className="mb-4 mb-md-0">
                <div className="d-flex flex-column align-items-center text-center text-md-start">
                  <CIcon
                    icon={cilLockLocked}
                    size="3xl"
                    className="mt-3 mb-3"
                    style={{ backgroundColor: '#0059b3', color: 'white', borderRadius: '50%' }}
                  />

                  <h5 className="bold">Lowest Processing fee than other bank</h5>

                  <p className="text-center text-lg-start ">
                    There are no hidden charges—what you see is what you get, ensuring that you can
                    plan your finances accurately.
                  </p>
                </div>
              </CCol>

              <CCol lg="3" md="6" className="mb-4 mb-md-0">
                <div className="d-flex flex-column align-items-center text-center text-md-start">
                  <CIcon
                    icon={cilClock}
                    size="3xl"
                    className="mt-3 mb-3"
                    style={{ backgroundColor: '#0059b3', color: 'white', borderRadius: '50%' }}
                  />

                  <h5 className="bold">Less time in any approvals</h5>

                  <p className="text-center text-lg-start mt-3">
                    Enjoy peace of mind knowing that you do not have to wait long for decisions,
                    letting you focus on your goals without the stress of long approval times.
                  </p>
                </div>
              </CCol>
            </CRow>
          </CContainer>
        </CCard>
      </div>
    )
  }

  export default Dashboard
