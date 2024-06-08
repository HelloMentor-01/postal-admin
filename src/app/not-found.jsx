'use client'

import React from 'react'
import style from './page.module.css'
import { useRouter } from 'next/navigation'

const NotFound = () =>{
	const Router = useRouter()
	
	const handleclick = () =>{
		Router.push('/')
	}

    return (
        <>
		<section className={style.maincontainer}>
			<h2 className={style.fnt}>404</h2>
			<div className={style.image}>
			</div>
			<div>
				<h2 className={style.fnt_}>Look like you're lost</h2>
				<p className={style.fnt__}>the page you are looking for not avaible!</p>
			</div>
			<div className={style.btncontainer}>
				<button className={style.btn} onClick={handleclick}>Main Page</button>
			</div>
		</section>
        </>
    )
}





export default NotFound