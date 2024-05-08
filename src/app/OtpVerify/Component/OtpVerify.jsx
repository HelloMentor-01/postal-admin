'use client'

import React, { useRef, useEffect } from 'react';
import style from './page.module.css';
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



const OTPVERIFYPAGE = gql`
  mutation VerifyOtp($otp: String!, $phone: String!) {
    verifyOtp(otp: $otp, phone_number: $phone) {
      status
      message
      error
      accessToken
      data {
        id
        first_name
        last_name
        email
        phone_number
      }
    }
  }
`;

const OtpVerify = () => {
  const Router = useRouter();
  const [verifyOtp] = useMutation(OTPVERIFYPAGE);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const phoneNumber = localStorage.getItem('phonenumber');
    if (phoneNumber) {
      setPhone(phoneNumber);
      localStorage.clear();
    }
  }, []);

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 3 && value !== '') {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    
    const response = await verifyOtp({
      variables: {
        otp: otp.join(''),
        phone: phone,
      },
    });

    if (response?.data.verifyOtp.status === 200) {
      const saveAuth = response?.data?.verifyOtp?.accessToken;
      const saveName = response?.data?.verifyOtp?.data[0]?.first_name;
      localStorage.setItem('Auth', saveAuth);
      localStorage.setItem('Profile', JSON.stringify(saveName));
      setOtp(['', '', '', '']);
      // toast.success("OTP Verified", {
      //   position: toast.POSITION.TOP_CENTER,
      // });
      Router.push('/Customerdetails');
    } else if(response?.data.verifyOtp.status === 400) {
      alert('sdsdg')
      // toast.error("Invalid OTP",{
      //   position: toast.POSITION.TOP_CENTER,
      // }
      // )
      setOtp(['', '', '', '']);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" /> 
      <section className={style.maincontainer}>
        <div className={style.card}>
          <h1 className={style.heading}>Enter OTP</h1>
          <div className={style.otpfield}>
            {otp.map((value, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>
          <div className={style.btncontainer}>
            <button className={style.loginbtn} onClick={handleSubmit}>
              Enter Otp
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default OtpVerify;
