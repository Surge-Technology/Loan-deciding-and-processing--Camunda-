/* eslint-disable prettier/prettier */
import React from 'react'
import { CCol, CFooter, CNavItem, CNavLink } from '@coreui/react'
import { MDBCol, MDBContainer, MDBFooter, MDBRow } from 'mdb-react-ui-kit'
import { bottom } from '@popperjs/core'
const AppFooter = () => {
  if (location.pathname !== '/signUpPage') {
    return null;
  }
  return (
    <MDBFooter className=" text-white text-center text-lg-left" bgColor="dark" >
      <MDBContainer className="p-4">
      {/* <MDBRow className='text-center mr-4 ml-4 '>
        
      //     <MDBCol lg="4" md="10" className="mb-3 mb-md-0  ">
      //       <h5 className="text-uppercase">Information</h5>

      //       <ul className="list-unstyled justify-content-start">
      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             Home
      //           </a>
      //         </li>
      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             About Us
      //           </a>
      //         </li>

      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             Contact
      //           </a>
      //         </li>
      //       </ul>
      //     </MDBCol>

      //     <MDBCol lg="4" md="10" className="mb-3 mb-md-0 ml-30px mr-20px">
      //       <h5 className="text-uppercase">Services</h5>

      //       <ul className="list-unstyled mb-0">
      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             Saving Account
      //           </a>
      //         </li>

      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             personal loan
      //           </a>
      //         </li>
      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             Home loan
      //           </a>
      //         </li>
      //       </ul>
      //     </MDBCol>

      //     <MDBCol lg="4" md="10" className="mb-3 mb-md-0 justify-content-start">
      //       <h5 className="text-uppercase">Loans</h5>

      //       <ul className="list-unstyled text-justify">
      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             vehicle loan
      //           </a>
      //         </li>
      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             Educational loan
      //           </a>
      //         </li>

      //         <li>
      //           <a href="#!" className="text-white  text-decoration-none">
      //             Health care loan{' '}
      //           </a>
      //         </li>
      //       </ul>
      //     </MDBCol>
      //   </MDBRow>*/}
        <div className="p-3 mt-3">
          <div className="footer-links">
            <a href="#">Home</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
          </div>
          <div className="contact-info">
            <p>123 Main St, Chennnai, India | Phone: +916369900800</p>
            <p>
              Email: metro@bank.com | Social: <a href="#">Twitter</a> <a href="#">LinkedIn</a>
            </p>
          </div>
          <div className="legal-info">
            <p>© 2024 MetroBank. All rights reserved.</p>
          </div>
        </div>
      </MDBContainer>
    </MDBFooter>
  )
}

export default React.memo(AppFooter)
