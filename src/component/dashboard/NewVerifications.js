import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import arrow from "../../asset/arrow-right.svg";
import axios from "axios";
import "./ver.css";
import { Prompt } from "react-router-dom";
import styled from "styled-components";
import Layout from "./DashboardLayout";
import start from "../../asset/start.svg";
import details from "../../asset/details.svg";
import payment from "../../asset/process_payment.svg";
import finish from "../../asset/finish.svg";
import {
  addVerificationList,
  deleteVerification,
} from "../../state/actions/verifications";
import VerificationForm from "./VerificationForm";

import { PaystackButton } from "react-paystack";

const request = (data) =>
  axios({
    data,
    method: "post",
    url: "https://croscheck.herokuapp.com/api/v1/verifications/request",
    headers: { "Content-Type": "multipart/form-data" },
  });

const NewVerifications = () => {
  const dispatch = useDispatch();
  const { verifications, selectedInstitution } = useSelector(
    (state) => state.verifications
  );

  const formData = {
    firstName: "",
    institution: selectedInstitution.name || "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    studentId: "",
    course: "",
    qualification: "",
    classification: "",
    admissionYear: "",
    graduationYear: "",
    enrollmentStatus: false,
  };
  let [isBlocking, setIsBlocking] = useState(true);
  const [formValues, setFormValues] = useState([
    { ...formData, _id: Date.now() },
  ]);

  const [requestList, setRequestList] = useState(false);

  const [checked, setChecked] = useState(false);
  const verificationsLength = formValues.length;

  const handleCheck = (e) => {
    setChecked(e.target.checked);
  };
  const verify = async () => {
    console.log("updated form values", formValues);
    for (let i = 0; i < formValues.length; i++) {
      if (formValues[i] instanceof FormData === false) {
        for (const key in formValues[i]) {
          if (!formValues[i][key]) {
            return toast.error(
              "Please complete and submit all verification details"
            );
          }
        }
      }
    }
    dispatch(addVerificationList(formValues));
    setRequestList(true);
  };
  const processPayment = async () => {
    await Promise.allSettled(formValues.map((value) => request(value)));
  };
  const addNewForm = () => {
    setFormValues((values) => [
      ...values,
      { ...formData, _id: Date.now(), institution: "" },
    ]);
  };

  const updateFormValues = (id) => (data) => {
    setFormValues((formValues) =>
      formValues.map((value, index) => (index === id ? data : value))
    );
  };
  // console.log("updated", formValues);

  const deleteOneVerification = (id) => () => {
    setFormValues((formValues) => formValues.filter((v) => v._id !== id));
    console.log("after delete", formValues);
  };
  console.log(formValues);

  let verifRequest = [];
  for (let i = 0; i < verifications.length; i++) {
    let obj = {};
    for (var pair of verifications[i].entries()) {
      obj[pair[0]] = pair[1];
    }
    console.log("each object", obj);
    verifRequest.push(obj);
  }
  let total = verifRequest.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.amount),
    0
  );
  console.log("request arr", verifRequest);

  const removeVerification = (val) => {
    dispatch(deleteVerification(val));
  };

  const componentProps = {
    email: "tolaked@yahoo.com",
    amount: total * 100,
    metadata: {
      name: "Tola",
      phone: "080932215257",
    },
    publicKey: process.env.REACT_APP_PAYSTACK_KEY,
    text: "Pay Now",
    onSuccess: () => {
      console.log("paying");
      processPayment();
      dispatch(addVerificationList([]));
      setRequestList(false);
      setFormValues([formData]);
      toast.success("request submitted");
    },
    onClose: () => {},
  };

  return (
    <div>
      <Layout>
        <VerificationBody>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ marginTop: "20px" }}
          />
          <Prompt
            when={isBlocking}
            message={(location) =>
              `Are you sure you want to go to ${location.pathname}`
            }
          />
          <div className={requestList ? "none" : ""}>
            {" "}
            <h2
              style={{
                color: "#0092E0",
                fontFamily: "Roboto",
              }}
            >
              New Verification
            </h2>
            <p style={{ fontFamily: "Roboto" }}>Education Verification</p>
          </div>
          <IconDiv>
            <div>
              <img src={start} alt="starts" style={{ color: "blue" }} />
            </div>
            <Line></Line>
            <img src={details} alt="details" />
            <Line></Line>
            <img src={payment} alt="details" />
            <Line></Line>
            <img src={finish} alt="details" />
          </IconDiv>
          <div className="step-text">
            <span style={{ paddingLeft: "15px" }}>START</span>
            <span style={{ paddingLeft: "5px" }}>VERIFICATION DETAILS</span>
            <span style={{ paddingRight: "15px" }}>PROCESS PAYMENT</span>
            <span style={{ paddingRight: "10px" }}>FINISH</span>
          </div>

          {formValues.map((values, id) => (
            <div className={requestList ? "none" : ""}>
              {" "}
              <VerificationForm
                key={id}
                verificationsLength={verificationsLength}
                initialValues={values}
                updateFormValues={updateFormValues(id)}
                deleteOneVerification={deleteOneVerification(values._id)}
              />
            </div>
          ))}
          <div className={requestList ? "none" : "bottom-button"}>
            <button onClick={addNewForm} className="add-new-btn">
              Add New Verification <FontAwesomeIcon icon={faPlus} />
            </button>
            <div className="line"></div>
            <div className="consent">
              <input
                type="checkbox"
                value={checked}
                name="checked"
                onChange={handleCheck}
              />
              <span>
                I hold the written consent of the individuals named above and
                have provided copies of these consents where requested.
              </span>
            </div>
            <button
              onClick={verify}
              className={!checked ? "notallowed proceed" : "proceed"}
              disabled={!checked}
            >
              Proceed to pay <img src={arrow} alt="right" />
            </button>
          </div>
          {requestList && (
            <SelectSch>
              <div className="new-table">
                <table
                  cellSpacing="0"
                  cellPadding="0"
                  border="0"
                  className="ideTable"
                >
                  <thead className="table-headers">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>category rate</th>
                      <th>amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifRequest.length > 0 &&
                      verifRequest.map((ver) => (
                        <tr key={ver.institution}>
                          <th className="mobile-header">Number</th>
                          <td>{ver.institution}</td>
                          <th className="mobile-header">Market rate</th>
                          <td>{ver.country}</td>
                          <th className="mobile-header">Weight</th>
                          <td>50000</td>
                          <th className="mobile-header">Value</th>
                          <td>{ver.amount}</td>
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              // className="menu-icon"
                              onClick={() =>
                                removeVerification(ver.institution)
                              }
                            />
                          </td>
                        </tr>
                      ))}

                    <td></td>
                    <td></td>
                    <td style={{ color: "black", fontWeight: "bold" }}>
                      TOTAL
                    </td>
                    <td style={{ fontWeight: "bold" }}>&#8358;{total}</td>
                  </tbody>
                </table>
              </div>
              <div className="buttons">
                <button
                  className="add-btn"
                  onClick={() => setRequestList(false)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add another Verification &nbsp;{" "}
                </button>

                <PaystackButton {...componentProps} className="btn" />
              </div>
            </SelectSch>
          )}
        </VerificationBody>
      </Layout>
    </div>
  );
};

export default NewVerifications;

const VerificationBody = styled.div`
  height: 100%;
  padding-left: 30px;
  overflow-y: scroll;
  padding-right: 30px;
  background: #fafafb;
  font-family: "Rubik", sans-serif;
  @media (max-width: 500px) {
    padding-right: 25px;
    padding-left: 25px;
  }
  .step-text {
    width: 64%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    font-size: 12px;
    margin-top: 20px;
    @media (max-width: 500px) {
      display: none;
    }
  }
  .none {
    display: none;
  }
  .bottom-button {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 7px;
    box-shadow: 0px 0px 10px #00000029;
    padding-top: 30px;
    padding-bottom: 30px;
    .line {
      border-bottom: 1px solid grey;
      width: 95%;
      margin-left: 40px;
      margin-bottom: 20px;
      margin-top: 10px;
    }
    button {
      margin-left: 40px;
    }
    .consent {
      border-left: 3px solid #0092e0;
      padding-top: 5px;
      padding-bottom: 5px;
      margin-left: 40px;
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      span {
        font-size: 14px;
        margin-left: 15px;
        color: #707070;
        font-weight: normal;
        font-family: "Roboto";
      }
    }
  }

  p {
    font: normal normal bold 14px Segoe UI;
    letter-spacing: 0.44px;
    color: #707070;
    opacity: 1;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .btn {
    cursor: pointer;
    color: white;
    margin-right: 20px;
    background: #0092e0 0% 0% no-repeat padding-box !important;
    border-radius: 10px;
    opacity: 1;
    height: 30px;
    outline: none;
    border: 1px solid #0092e0;
  }
  .add-btn {
    width: 250px;
    color: #0092e0;
    margin-right: 20px;
    background: #ffffff 0% 0% no-repeat padding-box !important;
    border-radius: 20px;
    opacity: 1;
    outline: 0;
    border: 1px solid #0092e0;
    cursor: pointer;
    margin-bottom: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-weight: bold;
    &:hover {
      background: #0092e0 0% 0% no-repeat padding-box !important;
      color: white;
    }
  }
  .proceed {
    width: 200px;
    padding: 8px;
    border-radius: 17px;
    cursor: pointer;
    color: white;
    margin-right: 20px;
    background: #0092e0 0% 0% no-repeat padding-box !important;
    opacity: 1;
    outline: none;
    border: 1px solid #0092e0;
  }
  .notallowed {
    cursor: not-allowed;
  }
`;

const IconDiv = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-top: 15px;
  margin-bottom: 20px;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Line = styled.div`
  width: 130px;
  /* height: 2px; */
  border: 1px dashed #d7dadb;
`;

const SelectSch = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 7px;
  /* height: 150px; */
  box-shadow: 0px 0px 10px #00000029;
  margin-top: 20px;
  .buttons {
    padding-left: 30px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

    .btn {
      width: 140px;
      color: white;
      margin-right: 20px;
      background: #0092e0 0% 0% no-repeat padding-box !important;
      border-radius: 10px;
      opacity: 1;
      height: 30px;
      outline: none;
      border: 1px solid #0092e0;
    }
  }
  .new-table {
    margin-top: 10px;
    width: 100%;
    /* background: #ffffff 0% 0% no-repeat padding-box;
    border-radius: 7px;
    box-shadow: 0px 0px 10px #00000029; */

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
        background-color: #0092e0;
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
  }
`;
