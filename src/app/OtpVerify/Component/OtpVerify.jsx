'use client'

import React, { useRef, useEffect } from 'react';
import style from './page.module.css';
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'


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
    const phoneNumber =  typeof window !== 'undefined' ? localStorage.getItem('phonenumber') : null;
    if (phoneNumber) {
      setPhone(phoneNumber);
     typeof window !== 'undefined' ? localStorage.clear() : null;
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
    typeof window !== 'undefined' ? localStorage.setItem('Auth', saveAuth) : null;
    typeof window !== 'undefined' ? localStorage.setItem('Profile', JSON.stringify(saveName)): null;
      setOtp(['', '', '', '']);
      Swal.fire({
        title: "Success",
        text: "OTP Verified",
        icon: "success",
      });
      Router.push('/Customerdetails');
    } else if(response?.data.verifyOtp.status === 400) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "OTP Doest Match",
      });
      setOtp(['', '', '', '']);
    }
  };

  return (
    <>
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
