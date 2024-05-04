"use client";

import React from "react";
import style from "./page.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { BsSortAlphaUp } from "react-icons/bs";
import { BsSortAlphaDownAlt } from "react-icons/bs";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import { gql, useQuery } from "@apollo/client";

/*  Graphql Query */
const GET_CUSTOMER_DETAILS = gql`
  query GetAllUserDetails {
    getAllUserDetails {
      status
      message
      error
      data {
        id
        first_name
        email
        phone_number
        DegreeType {
          id
          name
        }
        SubscriptionPlan {
          id
          plan_name
          plan_price
        }
      }
    }
  }
`;

const SectionOne = () => {
  const { data, loading, error } = useQuery(GET_CUSTOMER_DETAILS);

  const CustomerDetails = data?.getAllUserDetails?.data;


  const [sort, setSort] = useState();
  const [sorted, setSorted] = useState(false);
  const [pg, setPg] = useState();
  const [ug, setUg] = useState();
  const [purchase, setpurchage] = useState(false);
  const [ugdata, setUgData] = useState(false);
  const [free, setFree] = useState();
  const [explore, setExplore] = useState();
  const [achieve, setAchieve] = useState();

  const handleSort = () => {
    const sortedusername = [...CustomerDetails].sort((a, b) => {
      const usernameA = a.first_name.toUpperCase();
      const usernameB = b.first_name.toUpperCase();
      if (usernameA < usernameB) {
        return -1;
      }
      if (usernameA > usernameB) {
        return 1;
      }
      return 0;
    });
    setSort(sortedusername);
    setSorted(true);
  };

  const handlesortup = () => {
    setSorted(false);
  };

  const handlePG = () => {
    const filterplan = [...CustomerDetails].filter((data) => {
      return data.DegreeType.name == "PG";
    });

    setPg(filterplan);
    setUgData(false);
    setpurchage(true);
  };

  const handleUG = () => {
    const filterplan = [...CustomerDetails].filter((data) => {
      return data.DegreeType.name == "UG";
    });
    setUg(filterplan);
    setUgData(true);
    setpurchage(false);
  };

  const freeplan = () => {
    const result = CustomerDetails?.filter((data) => {
      return data.SubscriptionPlan.plan_name == "free";
    });

    setFree(result?.length);
    return result;
  };

  const exploreplan = () => {
    const result = CustomerDetails?.filter((data) => {
      return data.SubscriptionPlan.plan_name == "explore";
    });

    setExplore(result?.length);
    return result;
  };

  const achieveplan = () => {
    const result = CustomerDetails?.filter((data) => {
      return data.SubscriptionPlan.plan_name == "achieve";
    });

    setAchieve(result?.length);
    return result;
  };

  useEffect(() => {
    freeplan();
    exploreplan();
    achieveplan();
  }, [CustomerDetails]);

  return (
    <>
      <section className={style.maincontainer}>
        <h2 className={style.fnt}>Customer Details</h2>
        <div>
          <div className={style.cardcontainer}>
            <div className={style.card}>
              <p className={style.freefnt_}>
                Number of individuals who acquired the Free Package -{" "}
                {free && free} 
              </p>
              <div className={style.background}></div>
            </div>

            <div className={style.card_}>
              <p className={style.freefnt_}>
                Number of individuals who acquired the Explore Package -{" "}
                {explore && explore}
              </p>
              <div className={style.background_}></div>
            </div>

            <div className={style.card__}>
              <p className={style.freefnt_}>
                Number of individuals who acquired the Achieve Package -{" "}
                {achieve && achieve}
              </p>
              <div className={style.background__}></div>
            </div>
          </div>
          <table className={style.table}>
            <thead>
              <tr className={style.tr}>
                <th className={style.th}>
                  Username{" "}
                  <BsSortAlphaUp
                    style={{ cursor: "pointer" }}
                    onClick={handleSort}
                  />{" "}
                  <BsSortAlphaDownAlt
                    style={{ cursor: "pointer" }}
                    onClick={handlesortup}
                  />{" "}
                </th>
                <th className={style.th}>
                  Email{" "}
                  <BsSortAlphaUp
                    style={{ cursor: "pointer" }}
                    onClick={handleSort}
                  />{" "}
                  <BsSortAlphaDownAlt
                    style={{ cursor: "pointer" }}
                    onClick={handlesortup}
                  />
                </th>
                <th className={style.th}>Phone Number</th>
                <th className={style.th}>Package</th>
                <th className={style.th}>
                  Type of Purchage{" "}
                  <TiArrowSortedUp
                    style={{ cursor: "pointer" }}
                    onClick={handlePG}
                  />{" "}
                  <TiArrowSortedDown
                    style={{ cursor: "pointer" }}
                    onClick={handleUG}
                  />
                </th>
              </tr>
            </thead>

            <tbody>
                {loading ? <p>Loading... </p> : sorted
                ? purchase
                  ? pg.map((data, i) => (
                      <tr key={i} className={style.tr}>
                        <td className={style.td}>{data.first_name}</td>
                        <td className={style.td}>{data.email}</td>
                        <td className={style.td}>{data.phone_number}</td>
                        <td className={style.td}>
                          {data.SubscriptionPlan.plan_name}
                        </td>
                        <td className={style.td}>{data.DegreeType.name}</td>
                      </tr>
                    ))
                  : ugdata
                  ? ug.map((data, i) => (
                      <tr key={i} className={style.tr}>
                        <td className={style.td}>{data.first_name}</td>
                        <td className={style.td}>{data.email}</td>
                        <td className={style.td}>{data.phone_number}</td>
                        <td className={style.td}>
                          {data.SubscriptionPlan.plan_name}
                        </td>
                        <td className={style.td}>{data.DegreeType.name}</td>
                      </tr>
                    ))
                  : sort.map((data, i) => (
                      <tr key={i} className={style.tr}>
                        <td className={style.td}>{data.first_name}</td>
                        <td className={style.td}>{data.email}</td>
                        <td className={style.td}>{data.phone_number}</td>
                        <td className={style.td}>
                          {data.SubscriptionPlan.plan_name}
                        </td>
                        <td className={style.td}>{data.DegreeType.name}</td>
                      </tr>
                    ))
                : purchase
                ? pg.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data.SubscriptionPlan.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))
                : ugdata
                ? ug.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data.SubscriptionPlan.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))
                : CustomerDetails?.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data.SubscriptionPlan.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))}
              {/* {sorted
                ? purchase
                  ? pg.map((data, i) => (
                      <tr key={i} className={style.tr}>
                        <td className={style.td}>{data.first_name}</td>
                        <td className={style.td}>{data.email}</td>
                        <td className={style.td}>{data.phone_number}</td>
                        <td className={style.td}>
                          {data.SubscriptionPlan.plan_name}
                        </td>
                        <td className={style.td}>{data.DegreeType.name}</td>
                      </tr>
                    ))
                  : ugdata
                  ? ug.map((data, i) => (
                      <tr key={i} className={style.tr}>
                        <td className={style.td}>{data.first_name}</td>
                        <td className={style.td}>{data.email}</td>
                        <td className={style.td}>{data.phone_number}</td>
                        <td className={style.td}>
                          {data.SubscriptionPlan.plan_name}
                        </td>
                        <td className={style.td}>{data.DegreeType.name}</td>
                      </tr>
                    ))
                  : sort.map((data, i) => (
                      <tr key={i} className={style.tr}>
                        <td className={style.td}>{data.first_name}</td>
                        <td className={style.td}>{data.email}</td>
                        <td className={style.td}>{data.phone_number}</td>
                        <td className={style.td}>
                          {data.SubscriptionPlan.plan_name}
                        </td>
                        <td className={style.td}>{data.DegreeType.name}</td>
                      </tr>
                    ))
                : purchase
                ? pg.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data.SubscriptionPlan.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))
                : ugdata
                ? ug.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data.SubscriptionPlan.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))
                : CustomerDetails?.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data.SubscriptionPlan.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))} */}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default SectionOne;
