'use client'

import React, { useEffect, useState } from 'react';
import style from './page.module.css';

const Loading = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < 100) {
          return prevCount + 1;
        } else {
          clearInterval(interval);
          return prevCount;
        }
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.loading_container}>
      <p className={style.loading_fnt}>Loading....{count}%</p>
    </div>
  );
};

export default Loading;
