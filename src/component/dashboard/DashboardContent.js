import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { CountryDropdown } from "react-country-region-selector";
import DashboardLayout from "./DashboardLayout";
import Transcript from "../../asset/Transcript.svg";
import EduVer from "../../asset/EduVeri.svg";
import wavy from "../../asset/wavy.svg";
import Institution from "../../asset/institution.svg";
import { getAllInstitutions } from "../../state/actions/institutions";
import {
  getUserVerification,
  selectSchool,
  getUserTranscript,
} from "../../state/actions/verifications";
import Modal from "../FormModal";
import Input from "./Input";

const DashboardContent = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const arr = ["a", "b", "c"];

  const dispatch = useDispatch();
  const { institutions } = useSelector((state) => state.institutions);
  const { userVerifications, newTranscript } = useSelector(
    (state) => state.verifications
  );
  const [input, setInput] = useState("");
  const [hideTable, setHideTable] = useState(false);
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getUserTranscript(user.email));
  }, [dispatch]);

  const allHistory = userVerifications.concat(newTranscript);
  useEffect(() => {
    dispatch(getUserVerification(user.email));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllInstitutions());
    dispatch(getUserVerification(user.email));
  }, [dispatch]);

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  const filteredItems = institutions.filter((item) =>
    item.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
  );

  const pageSize = 10;
  const pagesCount = Math.ceil(filteredItems.length / pageSize);

  const verificationsCount = Math.ceil(allHistory.length / pageSize);

  const handleNavigation = (e, index) => {
    e.preventDefault();
    if (index < 0 || index >= pagesCount) {
      return;
    } else {
      setCurrentPage(index);
    }
  };

  const verificationsNavigation = (e, index) => {
    e.preventDefault();
    if (index < 0 || index >= verificationsCount) {
      return;
    } else {
      setCurrentPage(index);
    }
  };

  const handleSelected = (institute) => {
    dispatch(selectSchool(institute));
    setHideTable(true);
    setInput(institute.name);
    history.push("/new");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DashboardLayout history={history}>
      <RequisitionBody>
        <h2
          style={{
            color: "#0092E0",
            fontFamily: "segoebold",
            // fontSize: "16px",
          }}
        >
          What would you like to do today?
        </h2>
        {arr.map((leta) => (
          <Input name={leta} />
        ))}
        <CardsContainer>
          <Card>
            <img src={Transcript} alt="tran" />
            <div className="tran-text">
              <div className="transcript">
                <p>Transcript Check</p>
                <p>Request transcript from schools</p>
              </div>
              <button>
                <Link
                  to="/transcript"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Start New
                </Link>
              </button>
            </div>
          </Card>
          <Card>
            <img src={EduVer} alt="tran" />
            <div className="tran-text">
              <div className="transcript">
                <p>Education Check</p>
                <p>Verify educational credentials</p>
              </div>
              <button>
                <Link
                  to="/new"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Start New
                </Link>
              </button>
            </div>
          </Card>
          <Card className="transcript-card">
            <div className="total-verification">Total Verification Orders</div>
            <div className="num">
              <p>{allHistory.length}</p>
              <img src={wavy} alt="wave" />
            </div>
          </Card>
        </CardsContainer>
        <SelectSch>
          <div className="req-trans">
            <img src={Institution} alt="select a sch" />

            <div className="paragraph">
              <p>Select an institution</p>
              <p>Request education verification </p>
            </div>
          </div>
          <div className="selects">
            <div className="sch-select">
              <label style={{ paddingLeft: "5px" }}>Select Institution</label>
              <input
                type="text"
                className="schl-input"
                onChange={handleInputChange}
                value={input}
                name="input"
                placeholder="Search for a school"
              />
            </div>
            <div className="country-select">
              <label style={{ paddingLeft: "5px" }}>Country</label>
              <CountryDropdown
                style={{
                  height: "34px",
                  border: "2px solid #e2e2e2",
                  outline: "none",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontFamily: "MontserratItalic",
                }}
              />
            </div>
          </div>
          {filteredItems.length > 0 && input.length > 0 && (
            <div className="new-table">
              <table
                cellSpacing="0"
                cellPadding="0"
                border="0"
                className={hideTable ? "hide-table" : ""}
              >
                <thead className="table-headers">
                  <tr>
                    <th>Name</th>
                    <th>Country</th>
                    <th>category rate</th>
                    <th>amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems
                    .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                    .map((ite) => (
                      <tr onClick={() => handleSelected(ite)} key={ite.name}>
                        <th className="mobile-header">Number</th>
                        <td>{ite.name}</td>
                        <th className="mobile-header">Market rate</th>
                        <td>{ite.country}</td>
                        <th className="mobile-header">Weight</th>
                        <td>{ite.category}</td>
                        <th className="mobile-header">Value</th>
                        <td>{ite.amount}</td>
                      </tr>
                      // <tr className="space"></tr>
                    ))}
                </tbody>
              </table>
              {!hideTable && (
                <div className="pagination-line">
                  <p>
                    Showing{" "}
                    {
                      filteredItems.slice(
                        currentPage * pageSize,
                        (currentPage + 1) * pageSize
                      ).length
                    }{" "}
                    of {pagesCount} of entries
                  </p>
                  <Pagination aria-label="Page navigation example">
                    <PaginationItem
                      disabled={currentPage <= 0}
                      className="prev"
                      onClick={(e) => handleNavigation(e, currentPage - 1)}
                    >
                      <PaginationLink previous href={() => false} />
                    </PaginationItem>

                    {[...Array(pagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === currentPage}
                        key={i}
                        onClick={(e) => handleNavigation(e, i)}
                      >
                        <PaginationLink href={() => false}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem
                      disabled={currentPage >= pagesCount - 1}
                      onClick={(e) => handleNavigation(e, currentPage + 1)}
                    >
                      <PaginationLink
                        next
                        href={() => false}
                        className="next"
                      />
                    </PaginationItem>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </SelectSch>
        {/* <Table> */}
        <div className="new-table" id="tableScroll">
          <p
            className="history"
            style={{ marginBottom: "45px", marginTop: "25px" }}
          >
            Verification history
          </p>
          <p className="showing">Showing ({allHistory.length}) entries</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Institution</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="t-body">
              {allHistory.length > 0
                ? allHistory
                    .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                    .map(
                      ({ date, firstName, lastName, institution, status }) => (
                        <>
                          <tr onClick={handleOpen}>
                            <td>{date}</td>
                            <td>{`${firstName}  ${lastName}`}</td>
                            <td>{institution}</td>
                            <td
                              style={{
                                color:
                                  status === "completed"
                                    ? "#7DC900"
                                    : status === "pending"
                                    ? "red"
                                    : "orange",
                              }}
                            >
                              {status}
                            </td>
                          </tr>
                          <tr className="space"></tr>
                        </>
                      )
                    )
                : ""}
            </tbody>
            <Modal open={open} onClose={handleClose} />
          </table>
          <div className="pagination-line">
            <p>
              Showing{" "}
              {
                allHistory.slice(
                  currentPage * pageSize,
                  (currentPage + 1) * pageSize
                ).length
              }{" "}
              of {verificationsCount} of entries
            </p>
            <Pagination aria-label="Page navigation example">
              <PaginationItem
                disabled={currentPage <= 0}
                className="prev"
                onClick={(e) => verificationsNavigation(e, currentPage - 1)}
              >
                <PaginationLink previous href={() => false} />
              </PaginationItem>

              {[...Array(verificationsCount)].map((page, i) => (
                <PaginationItem
                  active={i === currentPage}
                  key={i}
                  onClick={(e) => verificationsNavigation(e, i)}
                >
                  <PaginationLink href={() => false}>{i + 1}</PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem
                disabled={currentPage >= verificationsCount - 1}
                onClick={(e) => verificationsNavigation(e, currentPage + 1)}
              >
                <PaginationLink next href={() => false} className="next" />
              </PaginationItem>
            </Pagination>
          </div>
        </div>
        {/* </Table> */}
      </RequisitionBody>
    </DashboardLayout>
  );
};

export default DashboardContent;

const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  @media (max-width: 500px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .transcript-card {
    display: block;
    height: 98px;
    background: transparent linear-gradient(148deg, #0092e0 0%, #0074b3 100%) 0%
      0% no-repeat padding-box;
    box-shadow: 0px 0px 5px #00000017;
    border-radius: 0px;
  }
`;

const SelectSch = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 7px;
  padding-bottom: 25px;
  box-shadow: 0px 0px 10px #00000029;
  margin-top: 20px;
  .selects {
    display: flex;
    margin-top: 25px;
    width: 100%;
    .sch-select {
      display: flex;
      flex-direction: column;
      padding-right: 20px;
      padding-left: 20px;
      width: 46%;
      label {
        font-family: MontserratRegular;
        font-size: 12px;
        text-transform: uppercase;
        color: #707070;
      }
      .schl-input {
        height: 28px;
        border: 2px solid #e2e2e2;
        outline: none;
        font-family: MontserratItalic;
        border-radius: 14px;
        padding-left: 5px;
        padding-left: 15px;
        @media screen and (max-width: 500px) {
          font-size: 16px;
          width: 250px;
        }
        @media (max-width: 500px) {
          width: 100%;
        }
      }
      @media (max-width: 500px) {
        width: 80%;
        padding-right: 0px;
      }
    }
    .country-select {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      width: 46%;
      label {
        font-family: MontserratRegular;
        font-size: 12px;
        text-transform: uppercase;
        color: #707070;
      }
      @media (max-width: 500px) {
        width: 87%;
        margin-bottom: 15px;
        margin-top: 15px;
      }
    }
    @media (max-width: 500px) {
      display: flex;
      flex-direction: column;
    }
  }
  .req-trans {
    display: flex;
    width: 35%;
    padding-left: 20px;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 10px;
    @media (max-width: 500px) {
      width: 100%;
      padding-left: 10px;
    }
    .paragraph {
      p {
        &:nth-child(1) {
          font-family: segoebold;
          font-size: 15px;
          letter-spacing: 0.44px;
          color: #173049;
          text-transform: capitalize;
        }
        &:nth-child(2) {
          font-family: MontserratRegular;
          font-size: 14px;
          letter-spacing: 0.44px;
          color: #707070;
          margin: 0;
        }
      }
      @media (max-width: 500px) {
        padding-right: 20px;
      }
    }

    p {
      &:nth-child(1) {
        font-weight: bold;
        margin-bottom: 3px;
      }
      &:nth-child(2) {
        font-size: 14px;
        font: normal normal medium 15px/19px Montserrat;
        letter-spacing: 0.3px;
        color: #707070;
        margin: 0;
      }
    }
  }
`;

// const Table = styled.div`

// `;

const Card = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 0px 10px #00000029;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 7px;
  height: 100px;
  opacity: 3;
  @media (max-width: 500px) {
    margin-bottom: 20px;
  }
  .total-verification {
    height: 30%;
    background: #ef0a0a;
    color: white;
    font: normal normal bold 16px/18px Open Sans;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .num {
    height: 70%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    p {
      color: white;
      font: normal normal medium 22px/30px Montserrat;
      font-family: Montserrat;
      font-weight: normal;
      letter-spacing: 1.04px;
      font-size: 22px;
    }
  }
  .tran-text {
    display: flex;
    flex-direction: column;
    padding-right: 5px;

    .transcript {
      margin-top: 8px;
      padding-right: 10px;
      p {
        &:nth-child(1) {
          font-size: 15px;
          letter-spacing: 0.44px;
          color: #000000;
          margin: 0;
          font-family: segoebold;
        }
      }
      p {
        &:nth-child(2) {
          font-size: 12px;
          letter-spacing: 0.32px;
          font-weight: normal;
          color: #707070;
          font-family: MontserratRegular;
          margin: 0;
        }
      }
    }

    button {
      width: 90px;
      height: 30px;
      outline: none;
      border-radius: 6px;
      color: white;
      font-size: 12px;
      border: 1px solid #0092e0;
      background: #0092e0;
      margin-top: 15px;
    }
  }
`;
const RequisitionBody = styled.div`
  height: 100%;
  padding-left: 30px;
  overflow-y: scroll;
  padding-right: 30px;
  background: #fafafb;
  font-family: "Rubik", sans-serif;
  ::-webkit-scrollbar {
    display: none;
  }
  .new-table {
    margin-top: 10px;
    width: 100%;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 7px;
    box-shadow: 0px 0px 10px #00000029;

    /* height: 90%; */
    overflow-x: hidden;
    margin-bottom: 10px;
    padding-bottom: 20px;
    .hide-table {
      display: none;
    }

    table {
      margin: 0 auto;
      width: 95%;
      border-collapse: collapse;
      text-align: left;
      overflow: hidden;
      font-size: 14px;
      .mobile-header {
        display: none;
      }

      td,
      th {
        padding: 10px;
        @media (max-width: 500px) {
          padding: 9px !important;
        }
      }

      td {
        /* border-left: 1px solid #ecf0f1;
        border-right: 1px solid #ecf0f1; */
      }

      th {
        background-color: #1e2a36;
        color: white;
      }

      /* tr:nth-of-type(even) td {
        background-color: lighten(#4ecdc4, 35%);
      } */
      tr {
        cursor: pointer;
        &:nth-child(odd) {
          background-color: #f3f2ee;
        }
        &:hover {
          background-color: #d9f4f2;
        }
      }
    }
    .history {
      margin-left: 50px;
      font-family: MontserratBold;
      letter-spacing: 0.44px;
      color: #173049;
      opacity: 1;
    }

    .showing {
      font-family: MontserratRegular;
      letter-spacing: 0.44px;
      color: #707070;
      opacity: 1;
      margin-left: 50px;
    }
  }

  /* .new-table {
    margin-top: 15px;
    width: 100%;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 7px;
    box-shadow: 0px 0px 10px #00000029;

    height: 90%;
    overflow-x: hidden;
    margin-bottom: 10px;
    padding-bottom: 20px;

    
    table {
      border-collapse: separate;
      border-spacing: 0 10px;
      width: 90%;
      margin: 0 auto;
      thead {
        width: 80%;
        background-color: #efeff4;
      }
      th {
        opacity: 1;
        font: normal normal 600 14px/18px Montserrat;
        letter-spacing: 0.28px;
        color: #2c3e50;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 5px;
      }

      tr {
        cursor: default;
        width: 100%;
      }

      .t-body {
        .space tr {
          height: 10px;
          background-color: #efeff4 !important;
        }
        tr {
          padding-top: 10px;
          background-color: white;

          td {
            padding-left: 10px;
            padding-top: 10px;
            padding-bottom: 10px;
            text-align: center;
            font: normal normal normal 12px Montserrat;
            letter-spacing: 0.28px;
            color: #707070;
            opacity: 1;
            &:nth-child(1) {
              border-left: 0px;
              border-top-right-radius: 0px;
              border-bottom-right-radius: 0px;
              border-right: none;
            }

            &:nth-child(2) {
              border-left: none;
              border-right: none;
              border-radius: 0px;
            }

            &:last-child {
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px;
              border-left: none;
              border-right: 0px;
            }
          }
        }
      }

      td {
        font-family: "Rubik", sans-serif;
        letter-spacing: 0.14px;
        color: #171725;
        opacity: 0.85;
        font-weight: 500;
        text-transform: capitalize;
        font-size: 12px;
        border-radius: 5px;

         &.time {
          color: #92929d;
          text-transform: lowercase;
          opacity: 1;
          font-weight: 400;
        } 
      }
    }
  }  */
`;

// const RequisitionDiv = styled.div`
//   display: flex;
//   /* padding-left: 20px;
//   padding-right: 20px; */
//   padding-top: 20px;
//   justify-content: space-between;
//   align-items: center;
//   svg[data-icon="search"] {
//     width: 15px !important;
//   }
//   .ant-input-affix-wrapper > input.ant-input {
//     font-size: 14px;
//     height: auto;
//     display: flex;
//     align-items: center;
//     border-color: #503faa !important;
//     outline: #503faa;
//   }

//   .ant-select-selector {
//     height: 29px !important;
//     &:hover {
//       border-color: #503faa !important;
//     }
//     &::selection {
//       border-color: #503faa !important;
//     }
//     html {
//       --antd-wave-shadow-color: #503faa !important;
//     }
//   }
//   .ant-input-search.ant-input-affix-wrapper {
//     border-color: #503faa !important;
//   }
//   .ant-input-search.ant-input-affix-wrapper > input.ant-input {
//     padding-left: 0px;
//     &::placeholder {
//       font-family: "Rubik", sans-serif;
//       font-size: 13px !important;
//       padding-left: 3px;
//       font-weight: 300;
//     }
//   }
// `;
