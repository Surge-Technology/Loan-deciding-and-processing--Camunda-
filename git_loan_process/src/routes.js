/* eslint-disable prettier/prettier */
import { element } from 'prop-types'
import React from 'react'
import MortageLoan from './views/applyLoan/loanTypes/MortageLoan'
import { reach } from 'yup'



const Home = React.lazy(() => import('./views/dashboard/Home'))
const CreateCustomer = React.lazy(() => import ('./views/createCustomer/CreateCustomer'))
const CustomerDetailsForm = React.lazy(() => import ('./views/createCustomer/CustomerDetailsForm'))
//page 

const SignInPage = React.lazy(() => import ('./pages/SignInPage'))
const UserRegistration = React.lazy(() => import ('../src/pages/UserRegistration'))
const CompanyDetailsForm = React.lazy(() => import ('../src/pages/CompanyDetailsForm'))
const CustomerForm = React.lazy(() => import ('../src/pages/CustomerForm'))
const EmploymentForm = React.lazy(() => import ('../src/pages/EmploymentForm'))
const BankDetailsForm = React.lazy(() => import ('../src/pages/BankDetailForm'))
const checkCustomer = React.lazy(() => import ('../src/pages/checkCustomer'))
const HouseHoldEarnings = React.lazy(() => import ('../src/pages/HouseHoldEarnings'))
const Assets = React.lazy(() => import ('../src/pages/Assets'))
const Liabilities = React.lazy(() => import ('../src/pages/Liabilities'))
const DocumentUpload = React.lazy(() => import ('../src/pages/DocumentUpload'))
const LoanApplicationForm = React.lazy(() => import ('../src/pages/LoanApplicationForm'))
const LoanDisbursementForm = React.lazy(() => import ('../src/pages/LoanDisbursementForm'))
const TaskInbox = React.lazy(() => import ('../src/pages/TaskInbox'))
const LoanAmountDetails = React.lazy(() => import ('../src/pages/LoanAmountDetails'))
const FileUpload = React.lazy(() => import ('../src/pages/FileUpload'))

const milestones= React.lazy(()=>import('../src/milestone/milestone'))
//approver 

const InitialApproverForm = React.lazy(() => import ('../src/pages/InitialApproverForm'))
const LoanApproverDashboard = React.lazy(() => import ('../src/pages/LoanApproverDashboard'))
const ApplicantDashboard = React.lazy(() => import ('../src/views/dashboard/ApplicantDashboard'))
const LegalApprover = React.lazy(() => import ('../src/pages/LegalApprover'))
const UnderWriter = React.lazy(() => import ('../src/pages/UnderWriter'))
//Loan Request
const LoanRequest = React.lazy(() => import ('./views/applyLoan/LoanRequest'))
const BasicDetails = React.lazy(() => import ('./views/applyLoan/BasicDetails'))
const FinancialDetails = React.lazy(() => import  ('./views/applyLoan/FinancialDetails'))
const LoanDetails = React.lazy(() => import ('./views/applyLoan/LoanDetails'))
const SelectType = React.lazy(() => import ('./views/applyLoan/SelectType'))

//Types of loans
const HomeLoan = React.lazy(()=> import ('./views/applyLoan/loanTypes/HomeLoan'))
const PersonalLoan = React.lazy(()=> import ('./views/applyLoan/loanTypes/PersonalLoan'))
const EducationalLoan = React.lazy(()=> import ('./views/applyLoan/loanTypes/EducationalLoan'))
const VehicalLoan = React.lazy(()=> import ('./views/applyLoan/loanTypes/VehicalLoan'))
const MortageLaon = React.lazy(()=> import ('./views/applyLoan/loanTypes/MortageLoan'))

//Review Page
const ReviewPage = React.lazy(() => import('./views/applyLoan/ReviewPage'))

//payment
const PaymentScheduleReport = React.lazy(() => import('../src/pages/PaymentScheduleReport'))
const Payment = React.lazy(() => import('../src/pages/Payment'))
const PaymentTransactionDetails = React.lazy(() => import('../src/pages/PaymentTransactionDetails'))
const LoanApplicationModification = React.lazy(() => import('../src/pages/LoanApplicationModification'))



const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', element: Home},
  { path: '/createCustomer', name: 'CreateCustomer', element: CreateCustomer},
  { path: '/customerDetailsForm', name: 'CustomerDetailsForm', element: CustomerDetailsForm},
  { path: '/customerForm', name: 'CustomerForm', element: CustomerForm},
  { path: '/loanOfficer', name: 'LoanApplicationModification', element: LoanApplicationModification},


{path:'/userRegistration',name:'UserRegistration',element:UserRegistration},
{path:'/loginPage',name:'SignInPage',element:SignInPage},
{path:'/companyDetailsForm',name:'CompanyDetailsForm',element:CompanyDetailsForm},
{path:'/employmentForm',name:'EmploymentForm',element:EmploymentForm},
{path:'/bankDetail',name:'BankDetailForm',element:BankDetailsForm},
{path:'/milestones',name:'milestone', element:milestones} ,
{path:'/checkCustomer',name:'checkCustomer', element:checkCustomer} ,
{path:'/houseHoldEarnings',name:'HouseHoldEarnings', element:HouseHoldEarnings} ,
{path:'/assets',name:'Assets', element:Assets} ,
{path:'/liabilities',name:'Liabilities', element:Liabilities} ,
{path:'/customerForm/:email}',name:'CustomerForm', element:CustomerForm} ,
{path:'/document',name:'DocumentUpload', element:DocumentUpload} ,


{path:'/loanApproverDashboard',name:'LoanApproverDashboard', element:LoanApproverDashboard} ,
{path:'/applicantdashboard',name:'ApplicantDashboard', element: ApplicantDashboard},
{path:'/initialApprover',name:'InitialApproverForm', element:InitialApproverForm} ,
{path:'/legalApprover',name:'LegalApprover', element:LegalApprover} ,
{path:'/underwriterForm',name:'UnderWriter', element:UnderWriter} ,
{path:'/PaymentScheduleReport',name:'PaymentScheduleReport', element:PaymentScheduleReport} ,
{path:'/Payment',name:'Payment', element:Payment} ,
{path:'/PaymentTransactionDetails',name:'PaymentTransactionDetails', element:PaymentTransactionDetails} ,




{path:'/loanApproval',name:'LoanApplicationForm', element:LoanApplicationForm} ,
{path:'/loanDisbursementForm',name:'LoanDisbursementForm', element:LoanDisbursementForm} ,
{path:'/taskInbox',name:'TaskInbox', element:TaskInbox} ,
{path:'/loanAmountDetails',name:'LoanAmountDetails', element:LoanAmountDetails} ,
{path:'/file',name:'FileUpload', element:FileUpload} ,




  { path: '/applyLoan', name: 'LoanRequest', element: LoanRequest},
  { path: '/applyLoan/basicDetails/:id', name: 'BasicDetails', element: BasicDetails},
  { path: '/applyLoan/financialDetails/:id', name:'FinancialDetails', element: FinancialDetails},
  { path: '/applyLoan/loanDetails/:id', name:'LaonDetails', element: LoanDetails},
  { path: '/applyLoan/selectType/:id', name:'SelectType', element: SelectType},
  { path: '/selectType', name:'SelectType', element: SelectType},

  { path: '/loanTypes/homeLoan/:id', name: 'HomeLoan', element: HomeLoan},
  { path: '/loanTypes/personalLoan/:id', name: 'PersonalLoan', element: PersonalLoan},
  { path: '/loanTypes/educationalLoan/:id', name: 'EducationalLoan', element: EducationalLoan},
  { path: '/loanTypes/vehicalLoan/:id', name: 'VehicalLoan', element: VehicalLoan},
  { path: '/loanTypes/mortageLoan/:id', name: 'MortageLoan', element: MortageLaon},

  { path: '/applyLoan/reviewPage/:id', name: 'ReviewPage', element: ReviewPage},
]
export default routes
