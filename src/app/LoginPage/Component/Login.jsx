'use client'

import React from 'react'
import style from './page.module.css'
import {useState} from 'react'
import {useMutation,gql} from '@apollo/client'

// Sending the data to the graphql
const PHONENUMBER = gql`
mutation Login ($phone: String!) {
    login(phone_number: $phone) {
        status
        message
        error
    }
}
`



const LoginPage = () =>{
    const [phone,setPhone] = useState()
    const [login] = useMutation(PHONENUMBER)
    const [notification,setNotification] = useState(false)

    const handlePhone = (e)=>{
        setPhone(e.target.value)
    }
  
   const handleSubmit = async (e) =>{
    e.preventDefault()
    const response = await login({
        variables: { phone: phone }
      })

      if(response?.data?.login?.status == 200){
        setNotification(true)
        setPhone('')
      }else if(response?.data?.login?.status == 404){
        alert('Opps Your Number Doest Exist')
      }
   
   }

    return (
        <>
       <section className={style.header}>
        <div className={notification && style.notification}>
         <p className={style.notificationfnt}>OTP SENT TO YOUR PHONE NUMBER</p>
        </div>
        <div className={style.container}>
            <div className={style.card}>
               <h2 className={style.login}>Login</h2>
               <form className={style.formcontainer}>
                <input className={style.input_} type='text' maxLength={10} value={phone} onChange={handlePhone} placeholder='Your Phone Number'/>
               </form>
               <button className={style.loginbtn} onClick={handleSubmit}>Login</button>

            </div>

        </div>
        
       </section>
        </>
    )
}



export default LoginPage