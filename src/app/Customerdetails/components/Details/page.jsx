"use client";

import React, { useState, useEffect } from "react";
import style from "./page.module.css";
import { BsSortAlphaUp, BsSortAlphaDownAlt } from "react-icons/bs";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { gql, useQuery } from "@apollo/client";
import { IoIosLogOut } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FcPrevious, FcNext } from "react-icons/fc";
import { MdModeEdit } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useMemo } from "react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

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
  console.log(data?.getAllUserDetails?.data,'data')
  const router = useRouter();
  const FilterAllData = useMemo(() => {
    return data?.getAllUserDetails?.data?.filter((data) => {
      if (!data.email.includes('@mycareershapers.in')) {
        return data;
      }
    });
  }, [data?.getAllUserDetails?.data]);

  const CustomerDetails = FilterAllData;


  

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
  /* Edit Modal */
  const [modalShow, setModalShow] = useState(false);
  const [modalEmail, setEmailmodal] = useState("");
  const [modalPhonenumber, setPhonenumbermodal] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneModalError, setPhonemodalError] = useState("");

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
        (data.SubscriptionPlan &&
          data.SubscriptionPlan.plan_name.includes(searchTerm))
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

  const handleEdit = (data) => {
    setModalShow(true);
    setEmailmodal(data.email);
    setPhonenumbermodal(data.phone_number);
  };

  const modalEmailchange = (e) => {
    if (e.target.value == "") {
      setEmailError("Email cannot be Empty");
    } else {
      setEmailError("");
    }

    setEmailmodal(e.target.value);
  };

  const modalPhonenumberchange = (e) => {
    if (e.target.value == "") {
      setPhonemodalError("Phone Number Cannot be Empty");
    } else {
      setPhonemodalError("");
    }
    setPhonenumbermodal(e.target.value);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const formData = {
      email: modalEmail,
      phone: modalPhonenumber,
    };

    Swal.fire({
      title: "Updated!",
      text: "Number email updated Succesfully",
      icon: "success",
    });
    setEmailmodal("");
    setPhonenumbermodal("");
    setModalShow(false);
  };



  /* Convert Json to Excel */

  const handleExceltojson = () => {
    if(CustomerDetails){
      const Result = CustomerDetails?.map((data)=>{
        const Obj = {
          Name:data.first_name,
          Email:data.email,
          PhoneNumber:data.phone_number,
          Subscriptionplan:data.SubscriptionPlan.plan_name,
          Subscriptionprice:data.SubscriptionPlan.plan_price,
          DegreeTypes:data.DegreeType.name
        }
        return Obj
    })
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(Result);
    XLSX.utils.book_append_sheet(wb, ws, 'SubscriptionDetails');
    XLSX.writeFile(wb, 'SubscriptionDetails.xlsx');
    Swal.fire({
      title: "Downloaded",
      text: "Excel Downloaded Succesfully",
      icon: "success"
    });
    
    
    }else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data Loading....",
      });
    }
   
  };

  const Logout = () => {
    typeof window !== "undefined" ? localStorage.clear() : null;
    router.push("/");
  };

  return (
    <>
      <div>
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          show={modalShow}
          centered
        >
          <Modal.Header onClick={() => setModalShow(false)} closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Email"
                  aria-label="Email"
                  aria-describedby="basic-addon1"
                  value={modalEmail}
                  onChange={modalEmailchange}
                />
              </InputGroup>
              <p className={style.emailerrorfnt}>{emailError}</p>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="PhoneNumber"
                  aria-label="PhoneNumber"
                  aria-describedby="basic-addon1"
                  value={modalPhonenumber}
                  onChange={modalPhonenumberchange}
                />
              </InputGroup>
              <p className={style.emailerrorfnt}>{phoneModalError}</p>
            </form>
            <Button variant="primary" size="md" onClick={handleModalSubmit}>
              Submit
            </Button>{" "}
          </Modal.Body>
        </Modal>
      </div>
      <section className={style.maincontainer}>
        <div className={style.navbar}>
          <div className={style.flex}>
            <p className={style.profilefnt}>
              Welcome{" "}
              {typeof window !== "undefined"
                ? localStorage
                    .getItem("Profile")
                    .replace(/[|&;$%@"<>()+,]/g, "")
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

            {/* Download the Excel Data */} 
            <IoCloudDownloadOutline onClick={handleExceltojson} size={30}  style={{ color: '#0a9ced' }}  />
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
                  Type of Purchase{" "}
                  <TiArrowSortedUp
                    style={{ cursor: "pointer" }}
                    onClick={handlePG}
                  />{" "}
                  <TiArrowSortedDown
                    style={{ cursor: "pointer" }}
                    onClick={handleUG}
                  />
                </th>
                <th className={style.th}>Edit </th>
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
                      <td className={style.td}>
                        {data?.SubscriptionPlan?.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))
                ) : ugdata ? (
                  ug.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data?.SubscriptionPlan?.plan_name}
                      </td>
                      <td className={style.td}>{data.DegreeType.name}</td>
                    </tr>
                  ))
                ) : (
                  sort.map((data, i) => (
                    <tr key={i} className={style.tr}>
                      <td className={style.td}>{data.first_name}</td>
                      <td className={style.td}>{data.email}</td>
                      <td className={style.td}>{data.phone_number}</td>
                      <td className={style.td}>
                        {data?.SubscriptionPlan?.plan_name}
                      </td>
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
                    <td className={style.td}>
                      {data?.SubscriptionPlan?.plan_name}
                    </td>
                    <td className={style.td}>{data.DegreeType.name}</td>
                  </tr>
                ))
              ) : ugdata ? (
                ug.map((data, i) => (
                  <tr key={i} className={style.tr}>
                    <td className={style.td}>{data.first_name}</td>
                    <td className={style.td}>{data.email}</td>
                    <td className={style.td}>{data.phone_number}</td>
                    <td className={style.td}>
                      {data?.SubscriptionPlan?.plan_name}
                    </td>
                    <td className={style.td}>{data.DegreeType.name}</td>
                  </tr>
                ))
              ) : (
                Paginationdata?.map((data, i) => (
                  <tr key={i} className={style.tr}>
                    <td className={style.td}>{data.first_name}</td>
                    <td className={style.td}>{data.email}</td>
                    <td className={style.td}>{data.phone_number}</td>
                    <td className={style.td}>
                      {data?.SubscriptionPlan?.plan_name}
                    </td>
                    <td className={style.td}>{data.DegreeType.name}</td>
                    <td className={style.td}>
                      <MdModeEdit onClick={() => handleEdit(data)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className={style.paginationcontainer}>
            <ul className={style.list}>
              <p className={style.number}>
                Page - {currentpage} / {PageNumber.length}
              </p>
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
    </>
  );
};

export default SectionOne;
