import React from 'react'
import * as Yup from 'yup';
import moment from 'moment/moment';

export default function ValidationSchema() {
    return Yup.object().shape({
        firstName : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("First Name is required"),
        lastName  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Last Name is required"),
        birthDate : Yup.string().required("Birth Date is required"),
        nationality :  Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Nationality is required"),
        gender    : Yup.string().required("Gender is required"),
        maritalStatus    : Yup.string().required("Marital Status is required"),
        phone     : Yup.string().min(12, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required("Phone Number is required"),
        email     : Yup.string().required("Email is required").email("Invalid mail address"),
        address  : Yup.string().required("Address is required"),
        city  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("City is required"),
        state : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("State is required"),
        country  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Country is required"),
        pincode  : Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Pincode is required"),
        occupation  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Occupation is required"),
        //annualIncome  : Yup.string().required("Annual Income is required"), 
        agreed: Yup.boolean() .oneOf([true], "You must agree to the terms and conditions."),
                              //.required("You must agree to the terms and conditions."),

    })
}