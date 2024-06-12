"use client";

import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import { BsSortAlphaUp, BsSortAlphaDownAlt } from "react-icons/bs";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { gql, useQuery } from "@apollo/client";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FcPrevious, FcNext } from "react-icons/fc";

// Graphql Query
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
  const router = useRouter();
  const CustomerDetails = data?.getAllUserDetails?.data;

  const [details, setDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentpage, setCurrentPage] = useState(1);
  const [postperPage] = useState(10);
  const [sort, setSort] = useState();
  const [sorted, setSorted] = useState(false);
  const [pg, setPg] = useState();
  const [ug, setUg] = useState();
  const [purchase, setPurchase] = useState(false);
  const [ugdata, setUgData] = useState(false);
  const [free, setFree] = useState();
  const [explore, setExplore] = useState();
  const [achieve, setAchieve] = useState();
  const [prev, setPrev] = useState(0);
  const [next, setNext] = useState(3);

  useEffect(() => {
    if (data && !loading && !error) {
      setDetails(CustomerDetails);
      freeplan();
      exploreplan();
      achieveplan();
    }
  }, [data, loading, error, CustomerDetails]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchDetails = () => {
    if (!CustomerDetails) return [];
    setCurrentPage(1);
    return CustomerDetails.filter((data) => {
      const searchTerm = search.toLowerCase();
      return (
        data.first_name.toLowerCase().includes(searchTerm) ||
        data.email.toLowerCase().includes(searchTerm) ||
        data.phone_number.includes(search) ||
        (data.SubscriptionPlan && data.SubscriptionPlan.plan_name.includes(searchTerm))
      );
    });
  };

  useEffect(() => {
    const filteredDetails = handleSearchDetails();
    setDetails(filteredDetails);
  }, [search, CustomerDetails]);

  const inputLast = currentpage * postperPage;
  const inputFirst = inputLast - postperPage;
  const Paginationdata = details?.slice(inputFirst, inputLast);

  const PageNumber = [];
  for (let i = 1; i <= Math.ceil(details?.length / postperPage); i++) {
    PageNumber.push(i);
  }

  const Paginationpage = (data) => {
    setCurrentPage(data);
  };

  const handlePrev = () => {
    if (prev > 0) {
      setPrev(prev - 3);
      setNext(next - 3);
    }
  };

  const handleNext = () => {
    if (next < PageNumber.length) {
      setPrev(prev + 3);
      setNext(next + 3);
    }
  };

  const handleSort = () => {
    const sortedusername = [...Paginationdata].sort((a, b) => {
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
    const filterplan = [...Paginationdata].filter((data) => {
      return data.DegreeType.name === "PG";
    });

    setPg(filterplan);
    setUgData(false);
    setPurchase(true);
  };

  const handleUG = () => {
    const filterplan = [...Paginationdata].filter((data) => {
      return data.DegreeType.name === "UG";
    });
    setUg(filterplan);
    setUgData(true);
    setPurchase(false);
  };

  const freeplan = () => {
    const result = CustomerDetails?.filter((data) => {
      return data.SubscriptionPlan?.plan_name === "free";
    });

    setFree(result?.length);
    return result;
  };

  const exploreplan = () => {
    const result = CustomerDetails?.filter((data) => {
      return data.SubscriptionPlan?.plan_name === "explore";
    });

    setExplore(result?.length);
    return result;
  };

  const achieveplan = () => {
    const result = CustomerDetails?.filter((data) => {
      return data.SubscriptionPlan?.plan_name === "achieve";
    });

    setAchieve(result?.length);
    return result;
  };

  const Logout = () => {
    typeof window !== "undefined" ? localStorage.clear() : null;
    router.push("/");
  };

  return (
    <section className={style.maincontainer}>
      <div className={style.navbar}>
        <div className={style.flex}>
          <p className={style.profilefnt}>
            Welcome{" "}
            {typeof window !== "undefined"
              ? localStorage.getItem("Profile").replace(/[|&;$%@"<>()+,]/g, "")
              : null}
          </p>
          <IoIosLogOut size={30} onClick={Logout} />
        </div>
      </div>

      <h2 className={style.fnt}>Customer Details</h2>
      <div>
        <div className={style.cardcontainer}>
          <div className={style.card__}>
            <p className={style.freefnt_}>
              Free Package Users <br />
              {free && free}
            </p>
            <div className={style.background__}></div>
          </div>

          <div className={style.card_}>
            <p className={style.freefnt_}>
              Explore Package Users <br />
              {explore && explore}
            </p>
            <div className={style.background_}></div>
          </div>

          <div className={style.card}>
            <p className={style.freefnt_}>
              Achieve Package Users <br />
              {achieve && achieve}
            </p>
            <div className={style.background}></div>
          </div>
        </div>

        <div className={style.numberofpeople}>
          <input
            type="text"
            onChange={handleSearch}
            className={style.searchbar}
            placeholder="Search By KeyWords"
          />
          <span>Total Purchase - {CustomerDetails?.length}</span>
        </div>

        <table className={style.table}>
          <thead>
            <tr className={style.tr}>
              <th className={style.th}>
                Username{" "}
                <BsSortAlphaUp style={{ cursor: "pointer" }} onClick={handleSort} />{" "}
                <BsSortAlphaDownAlt style={{ cursor: "pointer" }} onClick={handlesortup} />{" "}
              </th>
              <th className={style.th}>
                Email{" "}
                <BsSortAlphaUp style={{ cursor: "pointer" }} onClick={handleSort} />{" "}
                <BsSortAlphaDownAlt style={{ cursor: "pointer" }} onClick={handlesortup} />
              </th>
              <th className={style.th}>Phone Number</th>
              <th className={style.th}>Package</th>
              <th className={style.th}>
                Type of Purchase{" "}
                <TiArrowSortedUp style={{ cursor: "pointer" }} onClick={handlePG} />{" "}
                <TiArrowSortedDown style={{ cursor: "pointer" }} onClick={handleUG} />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : sorted ? (
              purchase ? (
                pg.map((data, i) => (
                  <tr key={i} className={style.tr}>
                    <td className={style.td}>{data.first_name}</td>
                    <td className={style.td}>{data.email}</td>
                    <td className={style.td}>{data.phone_number}</td>
                    <td className={style.td}>{data?.SubscriptionPlan?.plan_name}</td>
                    <td className={style.td}>{data.DegreeType.name}</td>
                  </tr>
                ))
              ) : ugdata ? (
                ug.map((data, i) => (
                  <tr key={i} className={style.tr}>
                    <td className={style.td}>{data.first_name}</td>
                    <td className={style.td}>{data.email}</td>
                    <td className={style.td}>{data.phone_number}</td>
                    <td className={style.td}>{data?.SubscriptionPlan?.plan_name}</td>
                    <td className={style.td}>{data.DegreeType.name}</td>
                  </tr>
                ))
              ) : (
                sort.map((data, i) => (
                  <tr key={i} className={style.tr}>
                    <td className={style.td}>{data.first_name}</td>
                    <td className={style.td}>{data.email}</td>
                    <td className={style.td}>{data.phone_number}</td>
                    <td className={style.td}>{data?.SubscriptionPlan?.plan_name}</td>
                    <td className={style.td}>{data.DegreeType.name}</td>
                  </tr>
                ))
              )
            ) : purchase ? (
              pg.map((data, i) => (
                <tr key={i} className={style.tr}>
                  <td className={style.td}>{data.first_name}</td>
                  <td className={style.td}>{data.email}</td>
                  <td className={style.td}>{data.phone_number}</td>
                  <td className={style.td}>{data?.SubscriptionPlan?.plan_name}</td>
                  <td className={style.td}>{data.DegreeType.name}</td>
                </tr>
              ))
            ) : ugdata ? (
              ug.map((data, i) => (
                <tr key={i} className={style.tr}>
                  <td className={style.td}>{data.first_name}</td>
                  <td className={style.td}>{data.email}</td>
                  <td className={style.td}>{data.phone_number}</td>
                  <td className={style.td}>{data?.SubscriptionPlan?.plan_name}</td>
                  <td className={style.td}>{data.DegreeType.name}</td>
                </tr>
              ))
            ) : (
              Paginationdata?.map((data, i) => (
                <tr key={i} className={style.tr}>
                  <td className={style.td}>{data.first_name}</td>
                  <td className={style.td}>{data.email}</td>
                  <td className={style.td}>{data.phone_number}</td>
                  <td className={style.td}>{data?.SubscriptionPlan?.plan_name}</td>
                  <td className={style.td}>{data.DegreeType.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={style.paginationcontainer}>
          <ul className={style.list}>
            <p className={style.number}>Page - {currentpage} / {PageNumber.length}</p>
            <FcPrevious size={25} onClick={handlePrev} />
            {PageNumber.slice(prev, next).map((data, i) => (
              <li
                key={i}
                style={{ background: currentpage === data ? "#0a9ced" : "" }}
                className={style.paginationinside}
                onClick={() => Paginationpage(data)}
              >
                {data}
              </li>
            ))}
            <FcNext size={25} onClick={handleNext} />
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SectionOne;
