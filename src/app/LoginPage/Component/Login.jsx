"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Swal from 'sweetalert2'



// Sending the data to the graphql
const PHONENUMBER = gql`
mutation Login($phoneNumber: String!, $countryCode: String!) {
    login(phone_number: $phoneNumber, country_code: $countryCode) {
      status
      message
      activePhoneNumber
      error
    }
  }
`;

const LoginPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState("");
  const [validate, setValidate] = useState(false)
  const [login] = useMutation(PHONENUMBER);

  const handlePhone = (e) => {
    setValidate(false)
    setPhone(e.target.value);
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = phone;
    if (/^\s*$/.test(value)) {
      setError("Phone Number Cannot Be Empty");
      setValidate(true)
      setPhone('')
    } else if (/[^\w\s]/.test(value)) {
      setValidate(true)
      setError("Phone Number Cannot have Special Characters");
      setPhone('')
    } else if (/[a-zA-Z]/.test(value)) {
      setValidate(true)
      setError("Phone Number Cannot have alphabetics");
      setPhone('')
    } else {
      const response = await login({
        variables: { phoneNumber: phone, countryCode: "+91" },
      });
      if (response?.data?.login?.status == 200) {
        const Active = response?.data?.login?.activePhoneNumber

        typeof window !== 'undefined' ? localStorage.setItem("phonenumber", phone)  : null;
        typeof window !== 'undefined' ? localStorage.setItem("Active", Active)  : null;
        Swal.fire({
          title: "Success",
          text: "OTP sent To your Phone Number",
          icon: "success",
        });
        router.push("/OtpVerify");
      } else if (response?.data?.login?.status == 404) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Your Phone Number is not Registered",
        });
        setPhone('')
      }
    }
  };
  return (
    <>
      <section className={style.header}>
        <div className={style.container}>
          <div className={style.card}>
            <h2 className={style.login}>Login</h2>
            <form className={style.formcontainer}>
              <input
                className={style.input_}
                type="text"
                maxLength={10}
                value={phone}
                onChange={handlePhone}
                placeholder="Your Phone Number"
              />
            </form>
            <p className={validate && style.validation}>{...error}</p>
            <button className={style.loginbtn} onClick={handleSubmit}>
              Login
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
