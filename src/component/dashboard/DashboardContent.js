import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { CountryDropdown } from "react-country-region-selector";
import DashboardLayout from "./DashboardLayout";
import Transcript from "../../asset/Transcript.svg";
import EduVer from "../../asset/EduVeri.svg";
import wavy from "../../asset/wavy.svg";
import Institution from "../../asset/institution.svg";
import { getAllInstitutions } from "../../state/actions/institutions";

function DashboardContent() {
  const dispatch = useDispatch();
  const { institutions } = useSelector((state) => state.institutions);

  const [input, setInput] = useState("");
  const [selectedInst, setSelectedInst] = useState({});
  const [hideTable, setHideTable] = useState(false);
  useEffect(() => {
    dispatch(getAllInstitutions());
    console.log("mounted");
  }, [dispatch]);

  function handleInputChange(e) {
    setInput(e.target.value);
  }

  // const handleSelected = (institute) => {
  //   setSelectedInst(institute);
  //   setInput(institute.name);
  // };

  const filteredItems = institutions.filter((item) =>
    item.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
  );

  const handleSelected = (institute) => {
    setSelectedInst(institute);
    setHideTable(true);
    setInput(institute.name);
  };
  console.log(selectedInst);
  return (
    <DashboardLayout>
      <RequisitionBody>
        <h2
          style={{
            color: "#0092E0",
            fontFamily: "Quicksand",
            // fontSize: "16px",
          }}
        >
          What would you like to do today?
        </h2>
        <CardsContainer>
          <Card>
            <img src={Transcript} alt="tran" />
            <div className="tran-text">
              <div className="transcript">
                <p>Transcript Check</p>
                <p>Request transcript from schools</p>
              </div>
              <button>Start New</button>
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
              <p>28</p>
              <img src={wavy} alt="jdjd" />
            </div>
          </Card>
        </CardsContainer>
        <SelectSch>
          <div className="req-trans">
            <img src={Institution} alt="select a sch" />

            <div>
              <p>Select an institution</p>
              <p>Request transcript from schools</p>
            </div>
          </div>
          <div className="selects">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "20px",
                width: "46%",
              }}
            >
              <label style={{ paddingLeft: "5px" }}>Country</label>
              <CountryDropdown
                style={{
                  height: "34px",
                  border: "2px solid #e2e2e2",
                  outline: "none",
                  width: "100%",
                  borderRadius: "14px",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                paddingRight: "20px",
                paddingLeft: "20px",
                width: "48%",
              }}
            >
              <label style={{ paddingLeft: "5px" }}>Select Institution</label>
              <input
                type="text"
                style={{
                  height: "30px",
                  border: "2px solid #e2e2e2",
                  outline: "none",
                  width: "100%",
                  borderRadius: "14px",
                  paddingLeft: "5px",
                }}
                onChange={handleInputChange}
                value={input}
                name="input"
                placeholder="Search for a school"
              />
            </div>
          </div>
          {filteredItems.length > 0 && input.length > 0 && (
            <div className="new-table">
              <table
                cellspacing="0"
                cellpadding="0"
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
                  {filteredItems.map((ite) => (
                    <tr onClick={() => handleSelected(ite)}>
                      <th class="mobile-header">Number</th>
                      <td>{ite.name}</td>
                      <th class="mobile-header">Market rate</th>
                      <td>{ite.country}</td>
                      <th class="mobile-header">Weight</th>
                      <td>{ite.category}</td>
                      <th class="mobile-header">Value</th>
                      <td>{ite.amount}</td>
                    </tr>
                    // <tr className="space"></tr>
                  ))}
                </tbody>
              </table>
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
          <p className="showing">Showing (4) entries</p>
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
              <tr>
                <td>20-09-2020</td>
                <td>Akinade John</td>
                <td>University of Jos</td>
                <td>Completed</td>
              </tr>
              <tr className="space"></tr>
              <tr>
                <td>20-09-2020</td>
                <td>Akinade John</td>
                <td>University of Jos</td>
                <td>Completed</td>
              </tr>
              <tr className="space"></tr>
              <tr>
                <td>20-09-2020</td>
                <td>Akinade John</td>
                <td>University of Jos</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* </Table> */}
      </RequisitionBody>
    </DashboardLayout>
  );
}

export default DashboardContent;

const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
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
  }
  .req-trans {
    display: flex;
    width: 35%;
    padding-left: 20px;
    justify-content: space-between;
    margin-top: 10px;

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
          font: normal normal bold 15px Open Sans;
          letter-spacing: 0.44px;
          color: #000000;
          margin: 0;
        }
      }
      p {
        &:nth-child(2) {
          font: normal normal normal 12px Open Sans;
          letter-spacing: 0.32px;
          color: #707070;
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
      font: normal normal 400 12px Montserrat;
      letter-spacing: 0.18px;
      color: #2c3e50;
      opacity: 1;
    }

    .showing {
      font: normal normal 400 12px Montserrat;
      letter-spacing: 0.14px;
      color: #2c3e50;
      margin-left: 50px;
      opacity: 1;
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
