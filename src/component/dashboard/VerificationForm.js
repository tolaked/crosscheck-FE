import React, { useState, useEffect } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-switch";
import styled from "styled-components";
import arrow from "../../asset/arrow-right.svg";
import account from "../../asset/icon_account.svg";
import qualifications from "../../asset/qualification.svg";
import document from "../../asset/document-attach.svg";
import form from "../../asset/form-line.svg";
import uparrow from "../../asset/format.svg";
import documentAttach from "../../asset/attach.svg";
import cap from "../../asset/graduation-cap.svg";
import download from "../../asset/download.svg";
import { CountryDropdown } from "react-country-region-selector";
import { getAllInstitutions } from "../../state/actions/institutions";
import Institution from "../../asset/institution.svg";

function VerificationForm({
  initialValues,
  updateFormValues,
  deleteOneVerification,
  verificationsLength,
}) {
  const [activeTab, setActiveTab] = useState("individual-details");
  const [pay, setPay] = useState(false);
  const [details, setDetails] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const dispatch = useDispatch();
  const { institutions } = useSelector((state) => state.institutions);
  const { selectedInstitution } = useSelector((state) => state.verifications);

  const [selectedInst, setSelectedInst] = useState({});
  const [input, setInput] = useState("");
  const [hideTable, setHideTable] = useState(false);
  const [schCard, setSchCard] = useState(false);
  const [country, setCountry] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setHideTable(false);
  };

  const filteredItems = institutions.filter((item) =>
    item.name.toLocaleLowerCase().includes(input.toLocaleLowerCase())
  );

  const pageSize = 4;
  const pagesCount = Math.ceil(filteredItems.length / pageSize);

  const handleNavigation = (e, index) => {
    e.preventDefault();
    if (index < 0 || index >= pagesCount) {
      return;
    } else {
      setCurrentPage(index);
    }
  };

  const handleSelected = (institute) => {
    setSelectedInst(institute);
    setHideTable(true);
    setInput(institute.name);
    setSchCard(true);
  };

  useEffect(() => {
    dispatch(getAllInstitutions());
  }, [dispatch]);

  const formik = useFormik({
    initialValues,

    onSubmit: async (values, status) => {
      console.log("submit......", values);

      for (var propName in values) {
        if (
          values[propName] === null ||
          values[propName] === undefined ||
          values[propName] === ""
        ) {
          delete values[propName];
        }
      }

      var formData = new FormData();
      formData.append("institution", selectedInst.name);
      formData.append("amount", selectedInst.amount);
      formData.append("email", user.email);
      for (var key in values) {
        formData.append(key, values[key]);
      }
      for (var pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      updateFormValues(formData);
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      dateOfBirth: Yup.string().required("DOB required"),
      studentId: Yup.string().required("studentID is required"),
      course: Yup.string().required("course is required"),
      qualification: Yup.string().required("Qualification is required"),
      classification: Yup.string().required("classification is required"),
      enrollmentStatus: Yup.bool().oneOf([true, false]),
    }),
  });
  const submitRequest = (e) => {
    e.preventDefault();
    if (!formik.values.certImage) {
      return toast.error("please upload a file");
    } else if (!selectedInst.name) {
      return toast.error("please select a school");
    }
    formik.handleSubmit("paid");
    toast.success("Verification details saved");

    // updateFormValues(initialValues);
  };
  const handleQualificationTab = (e) => {
    e.preventDefault();
    if (
      formik.values.firstName.length === 0 ||
      formik.values.lastName.length === 0 ||
      formik.values.dateOfBirth.length === 0
    ) {
      toast.error("please fill required fields");
      return;
    }
    let presentYear = new Date().getFullYear();
    let DOB = Number(formik.values.dateOfBirth.substr(0, 4));
    let age = presentYear - DOB;

    if (age < 17) {
      return toast.error("Age cannot be less than 17years");
    }
    setActiveTab("qualification-details");
    setPay(false);
  };

  const handleDocumentTab = () => {
    if (
      formik.values.course.length === 0 ||
      formik.values.qualification.length === 0 ||
      formik.values.classification.length === 0 ||
      formik.values.admissionYear.length === 0 ||
      formik.values.graduationYear.length === 0 ||
      formik.values.studentId.length === 0
    ) {
      toast.error("please fill required fields");
      return;
    }
    setActiveTab("documents");
    setPay(true);
  };

  return (
    <SingleCheck
      style={{
        paddingBottom: !details ? "20px" : "",
        marginBottom: !details ? "40px" : "",
      }}
    >
      {schCard && (
        <SelectCheck
          onClick={() => {
            setDetails(!details);
          }}
        >
          <div style={{ width: "100%" }}>
            <img src={cap} alt="graduation cap" />
            <h3>Education Check - {selectedInst.name}</h3>
          </div>
          <FontAwesomeIcon
            icon={details ? faCaretDown : faCaretRight}
            className="arrow"
          />{" "}
        </SelectCheck>
      )}
      {schCard ? (
        <SelectSch style={{ display: !details ? "none" : "" }}>
          <p className="institution-details">Institution Details</p>
          <div className="inst-name">
            <span>Institution name</span>
            <span>
              {selectedInst.name}{" "}
              <span className="change" onClick={() => setSchCard(false)}>
                <small>change</small>
              </span>
            </span>
          </div>
          <div className="sch-country">
            <span>Country</span>
            <span>{selectedInst.country}</span>
          </div>
          {/* <div className="sch-country"><span>Price</span>
    <span>{ selectedInst.amount}</span></div> */}
        </SelectSch>
      ) : (
        <SelectSch>
          <div className="req-trans">
            <img src={Institution} alt="select a sch" />

            <div className="select-inst">
              <p>Select an institute</p>
              <p style={{ fontSize: "12px" }}>
                Select preferred institute to conduct verification
              </p>
            </div>
          </div>
          <div className="selects">
            <div className="select-country">
              <label style={{ paddingLeft: "5px" }}>SELECT COUNTRY</label>
              <CountryDropdown
                name="country"
                id="country"
                className="select-schol"
                value={country}
                onChange={(_, e) => {
                  setCountry(e.target.value);
                }}
              />
            </div>
            <div className="institution-wrapper">
              <label style={{ paddingLeft: "5px" }}>SELECT INSTITUTION</label>
              <input
                type="text"
                onChange={handleInputChange}
                value={input}
                name="input"
                placeholder="Search an institute"
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
                    >
                      <PaginationLink
                        onClick={(e) => handleNavigation(e, currentPage - 1)}
                        previous
                        href={() => false}
                      />
                    </PaginationItem>

                    {[...Array(pagesCount)].map((page, i) => (
                      <PaginationItem active={i === currentPage} key={i}>
                        <PaginationLink
                          onClick={(e) => handleNavigation(e, i)}
                          href={() => false}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem disabled={currentPage >= pagesCount - 1}>
                      <PaginationLink
                        onClick={(e) => handleNavigation(e, currentPage + 1)}
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
      )}
      <FormContainer style={{ display: !details ? "none" : "" }}>
        <form>
          <div className="tabs">
            <ul>
              <li
                onClick={() => {
                  setActiveTab("individual-details");
                  setPay(false);
                }}
                className={
                  activeTab === "individual-details" ? "activeTab" : ""
                }
              >
                <img src={account} alt="details" />
                &nbsp; Individual details
              </li>
              <li
                onClick={(e) => handleQualificationTab(e)}
                className={
                  activeTab === "qualification-details" ? "activeTab" : ""
                }
              >
                <img src={qualifications} alt="details" />
                &nbsp; Qualification details
              </li>
              <li
                onClick={handleDocumentTab}
                className={activeTab === "documents" ? "activeTab" : ""}
              >
                <img src={document} alt="details" />
                &nbsp; Documents
              </li>
            </ul>
          </div>
          {activeTab === "individual-details" && (
            <FormDiv>
              <Field>
                <label>
                  First Name
                  <span>*</span>
                </label>
                <>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      formik.touched.firstName && formik.errors.firstName
                        ? "first-input err"
                        : "first-input"
                    }
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.firstName}
                    </div>
                  ) : null}
                </>
              </Field>

              <Field>
                <label>Middle Name</label>
                <>
                  <input
                    type="text"
                    className={
                      formik.touched.middleName && formik.errors.middleName
                        ? "middle-input err"
                        : "middle-input"
                    }
                    name="middleName"
                    value={formik.values.middleName}
                    onChange={formik.handleChange}
                  />
                </>
              </Field>

              <Field>
                <label>
                  Last Name
                  <span>*</span>
                </label>
                <>
                  <input
                    type="text"
                    className={
                      formik.touched.lastName && formik.errors.lastName
                        ? "last-input err"
                        : "last-input"
                    }
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.lastName}
                    </div>
                  ) : null}
                </>
              </Field>

              <Field className="DOB">
                <label>
                  Date of Birth
                  <span>*</span>
                </label>
                <>
                  <input
                    type="date"
                    className={
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                        ? "date-input err"
                        : "date-input"
                    }
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.dateOfBirth}
                    </div>
                  ) : null}
                </>
              </Field>

              <Field>
                <label>Reference ID</label>
                <input type="text" className="ref-input" />
              </Field>
              <p>
                The reference number will be used to track this case in your
                internal system if you have one
              </p>
              <button
                // disabled={
                //   formik.values.firstName.length === 0 ||
                //   formik.values.lastName.length === 0 ||
                //   formik.values.dateOfBirth.length === 0 ||
                //   new Date().getFullYear() -
                //     Number(formik.values.dateOfBirth.substr(0, 4)) <
                //     17
                // }
                className={
                  formik.values.firstName.length === 0 ||
                  formik.values.lastName.length === 0 ||
                  formik.values.dateOfBirth.length === 0 ||
                  new Date().getFullYear() -
                    Number(formik.values.dateOfBirth.substr(0, 4)) <
                    17
                    ? "btn notallowed"
                    : "btn"
                }
                onClick={handleQualificationTab}
              >
                Next
                <img src={arrow} alt="right" />
              </button>
            </FormDiv>
          )}
          {/* =======QUALIFICATION DETAILS===== */}
          {activeTab === "qualification-details" && (
            <FormDiv>
              <div className="enrollment-status">
                <label>Enrollment status &nbsp; &nbsp;</label>
                <div className="enr-status">
                  <span>Alumni &nbsp;</span>
                  <Switch
                    checked={formik.values.enrollmentStatus}
                    onChange={(checked, e) => {
                      formik.setFieldValue("enrollmentStatus", checked);
                      console.log(checked);
                    }}
                    value={formik.values.enrollmentStatus}
                    name="enrollmentStatus"
                    onColor="#0092E0"
                    onHandleColor="#2693e6"
                    handleDiameter={28}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                  />
                  <span>&nbsp;Current student</span>
                </div>
              </div>
              <p>
                Must be the student ID issued by the institute at the time of
                study
              </p>
              <Field>
                <label>
                  Student ID
                  <span>*</span>
                </label>
                <>
                  <input
                    type="text"
                    className={
                      formik.touched.studentId && formik.errors.studentId
                        ? "student-input err"
                        : "student-input"
                    }
                    name="studentId"
                    value={formik.values.studentId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.studentId && formik.errors.studentId ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.studentId}
                    </div>
                  ) : null}
                </>
              </Field>

              <Field>
                <label>
                  Course
                  <span>*</span>
                </label>
                <>
                  <input
                    type="text"
                    className={
                      formik.touched.course && formik.errors.course
                        ? "course-input err"
                        : "course-input"
                    }
                    name="course"
                    value={formik.values.course}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.course && formik.errors.course ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.course}
                    </div>
                  ) : null}
                </>
              </Field>

              <Field>
                <label>
                  Qualification
                  <span>*</span>
                </label>
                <>
                  <input
                    type="text"
                    className={
                      formik.touched.qualification &&
                      formik.errors.qualification
                        ? "qualification-input err"
                        : "qualification-input"
                    }
                    name="qualification"
                    placeholder="B.Sc"
                    value={formik.values.qualification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.qualification &&
                  formik.errors.qualification ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.qualification}
                    </div>
                  ) : null}
                </>
              </Field>

              <Field>
                <label>
                  Classificaton
                  <span>*</span>
                </label>
                <>
                  <input
                    type="text"
                    placeholder="second class upper"
                    className={
                      formik.touched.classification &&
                      formik.errors.classification
                        ? "class-input err"
                        : "class-input"
                    }
                    name="classification"
                    value={formik.values.classification}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.classification &&
                  formik.errors.classification ? (
                    <div
                      className="error"
                      style={{ marginLeft: "-660px", paddingTop: "3px" }}
                    >
                      {formik.errors.classification}
                    </div>
                  ) : null}
                </>
              </Field>
              {!formik.values.enrollmentStatus && (
                <>
                  <Field>
                    <label>
                      Admission Year<span>*</span>
                    </label>
                    <>
                      <input
                        type="text"
                        className={
                          formik.touched.admissionYear &&
                          formik.errors.admissionYear
                            ? "admission-input err"
                            : "admission-input"
                        }
                        name="admissionYear"
                        value={formik.values.admissionYear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.admissionYear &&
                      formik.errors.admissionYear ? (
                        <div
                          className="error"
                          style={{
                            marginLeft: "-620px",
                            paddingTop: "3px",
                          }}
                        >
                          {formik.errors.admissionYear}
                        </div>
                      ) : null}
                    </>
                  </Field>
                  <Field>
                    <label>
                      Graduation Year<span>*</span>
                    </label>
                    <>
                      <input
                        type="text"
                        className={
                          formik.touched.graduationYear &&
                          formik.errors.graduationYear
                            ? "graduation-input err"
                            : "graduation-input"
                        }
                        name="graduationYear"
                        value={formik.values.graduationYear}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.graduationYear &&
                      formik.errors.graduationYear ? (
                        <div
                          className="error"
                          style={{
                            marginLeft: "-620px",
                            paddingTop: "3px",
                          }}
                        >
                          {formik.errors.graduationYear}
                        </div>
                      ) : null}
                    </>
                  </Field>
                </>
              )}
              <p>
                The reference number will be used to track this case in your
                internal system if you have one
              </p>
              <button
                disabled={
                  formik.values.course.length === 0 ||
                  formik.values.qualification.length === 0 ||
                  formik.values.classification.length === 0 ||
                  formik.values.admissionYear.length === 0 ||
                  formik.values.graduationYear.length === 0 ||
                  formik.values.studentId.length === 0
                }
                className={
                  formik.values.course.length === 0 ||
                  formik.values.qualification.length === 0 ||
                  formik.values.classification.length === 0 ||
                  formik.values.admissionYear.length === 0 ||
                  formik.values.graduationYear.length === 0 ||
                  formik.values.studentId.length === 0
                    ? "btn notallowed"
                    : "btn"
                }
                type="submmit"
                onClick={() => {
                  setActiveTab("documents");
                  setPay(true);
                }}
              >
                Next
                <img src={arrow} alt="right" />
              </button>
            </FormDiv>
          )}
          {activeTab === "documents" && (
            <FormDiv>
              <Field>
                <p className="upload-text">
                  Please upload file in (pdf, jpg,jpeg) format only
                </p>
              </Field>
              <UploadSection>
                {/* <Document>
                  <div className="consent">
                    <p>Download & sign a consent form</p>
                    <img src={form} alt="forms_document" />
                  </div>
                  <div className="icons">
                    <img src={download} alt="download_icon" />
                    <img src={documentAttach} alt="download_icon" />
                  </div>
                </Document> */}

                <Document className="second-upload">
                  <div className="consent">
                    <p>Upload a third party document</p>
                    <img src={uparrow} alt="forms_document" />
                  </div>

                  <div className="file_button_container">
                    <input
                      type="file"
                      name="certImage"
                      style={{ cursor: "pointer" }}
                      onChange={(event) => {
                        formik.setFieldValue(
                          "certImage",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </div>
                </Document>
              </UploadSection>

              <button pay={pay} onClick={submitRequest} className="btn submit">
                Submit details
              </button>
            </FormDiv>
          )}
        </form>
        {verificationsLength > 1 && (
          <button onClick={deleteOneVerification} className="delete">
            <FontAwesomeIcon icon={faTrash} /> Delete verification
          </button>
        )}
      </FormContainer>
    </SingleCheck>
  );
}

export default VerificationForm;

const SingleCheck = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  padding: 10px 10px 5px 10px;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const UploadSection = styled.div`
  width: 80%;
  padding-left: 40px;
  display: flex;
  @media (max-width: 500px) {
    padding-left: 0px;
    width: 100%;
  }
  .second-upload {
    margin-left: 60px;
    @media (max-width: 500px) {
      margin-left: 0px;
      margin: 0 auto;
      margin-bottom: 50px;
    }
    img {
      margin-left: -20px;
    }
  }
`;

const Document = styled.div`
  height: 190px;
  width: 170px;
  background: #e9eaed 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin-bottom: 20px;

  .icons {
    height: 17%;
    padding: 0;
    width: 100%;
    display: flex;

    img {
      padding-left: 0px !important;
      margin-bottom: -35px;
    }
  }
  .consent {
    height: 83%;
  }
  p {
    padding-left: 0px !important;
    text-align: center;
    padding-top: 20px !important;
  }
  img {
    padding-left: 65px;
  }
`;

const FormContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 7px;
  box-shadow: 0px 0px 10px #00000029;
  overflow-x: hidden;
  margin-bottom: 25px;
  padding-bottom: 20px;
  .DOB {
    @media (max-width: 500px) {
      display: flex;
      flex-direction: column;
    }
    input {
      @media (max-width: 500px) {
        width: 250px !important;
      }
    }
  }
  .btn {
    float: right;
    display: flex;
    align-items: center;
    justify-content: space-around;

    /* width: 80px; */
    color: white;
    margin-right: 20px;
    background: #0092e0 0% 0% no-repeat padding-box !important;
    border-radius: 10px;
    opacity: 1;
    height: 30px;
    outline: none;
    border-color: #0092e0;
  }
  .notallowed {
    cursor: not-allowed;
  }
  .tabs {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    /* margin: 0 auto; */
    border-bottom: 1px solid #707070;
    @media (max-width: 500px) {
      display: none;
    }
    ul {
      display: flex;
      justify-content: space-between;
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      li {
        list-style-type: none;
        margin-right: 45px;
        cursor: pointer;

        &.activeTab {
          border-bottom: 2px solid #0092e0;
          font-weight: 500;
          color: #0092e0;
        }
      }
    }
  }
  .delete {
    width: 180px;
    color: #0092e0;
    margin-left: 20px;
    background: #ffffff 0% 0% no-repeat padding-box !important;
    border-radius: 18px;
    opacity: 1;
    height: 30px;
    outline: none;
    border: 1px solid #0092e0;
    cursor: pointer;
    padding-left: 5px;
    padding-right: 5px;
    &:hover {
      background: #0092e0 0% 0% no-repeat padding-box !important;
      color: white;
    }
  }
`;

const FormDiv = styled.div`
  width: 100%;
  margin-top: 20px;
  .enrollment-status {
    display: flex;
    align-items: center;
    padding-left: 40px;
    padding-bottom: 40px;
    @media (max-width: 500px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-left: 15px;
    }
    .enr-status {
      display: flex;
      align-items: center;
    }
  }

  .btn {
    float: right;
    display: flex;
    align-items: center;
    justify-content: space-around;

    width: 80px;
    color: white;
    margin-right: 20px;
    background: #0092e0 0% 0% no-repeat padding-box !important;
    border-radius: 10px;
    opacity: 1;
    height: 30px;
    outline: none;
    border-color: #0092e0;
  }
  .submit {
    width: 150px;
    @media (max-width: 500px) {
      margin-right: 55px !important;
    }
  }
  .notallowed {
    cursor: not-allowed;
  }
  p {
    font-size: 12px;
    padding-left: 135px;
    margin-top: -20px;
    @media (max-width: 500px) {
      padding-left: 10px;
      margin-top: 5px;
    }
  }
`;
const Field = styled.div`
  width: 100%;
  padding-left: 40px;
  padding-bottom: 20px;

  @media (max-width: 500px) {
    padding-left: 15px;
  }
  .upload-text {
    padding-left: 0px !important;
    padding-top: 10px;
  }
  input {
    width: 65%;
    height: 30px;
    border: 1px solid #707070cc;
    border-radius: 5px;
    outline: none;
    @media (max-width: 500px) {
      font-size: 16px;
      width: 90%;
    }
  }
  .err {
    border: 1px solid red !important;
  }
  label {
    span {
      color: red;
    }
  }
  .first-input {
    margin-left: 30px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .middle-input {
    margin-left: 23px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .last-input {
    margin-left: 33px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .date-input {
    margin-left: 24px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .ref-input {
    margin-left: 24px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .student-input {
    margin-left: 34px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .course-input {
    margin-left: 52px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .qualification-input {
    margin-left: 25px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .class-input {
    margin-left: 23px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .admission-input {
    margin-left: 8px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
  .graduation-input {
    margin-left: 3px;
    @media (max-width: 500px) {
      margin-left: 0px;
    }
  }
`;
const SelectCheck = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #fafafb 0% 0% no-repeat padding-box;
  border-radius: 7px;
  border-radius: 7px;
  box-shadow: 0px 0px 10px #00000029;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  div {
    display: flex;
    margin-left: 5px;
  }
  .arrow {
    margin-right: 5px;
  }
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

  .institution-details {
    margin-left: 30px;
    border-bottom: 1px solid gray;
    width: 90%;
    p {
      padding-bottom: 10px;
    }
  }
  .sch-country {
    padding-left: 30px;
    padding-top: 10px;
    padding-bottom: 40px;
    span {
      &:nth-child(1) {
        font: normal normal bold 12px/14px Montserrat;
        letter-spacing: 0.32px;
        color: #707070;
      }
      &:nth-child(2) {
        padding-left: 100px;
        font: normal normal normal 12/14px Montserrat;
        letter-spacing: 0.32px;
        color: #707070;
      }
    }
  }
  .inst-name {
    padding-left: 30px;
    padding-top: 10px;
    @media (max-width: 500px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-left: 20px;
    }
    span {
      &:nth-child(1) {
        font: normal normal bold 12px/14px Montserrat;
        letter-spacing: 0.32px;
        color: #707070;
      }
      &:nth-child(2) {
        padding-left: 40px;
        font: normal normal normal 12/14px Montserrat;
        letter-spacing: 0.32px;
        color: #707070;
        @media (max-width: 500px) {
          padding-left: 0px;
        }
      }
    }
    .change {
      margin-left: 7px;
      background: #ff0000 0% 0% no-repeat padding-box;
      border-radius: 3px;
      padding-left: 5px;
      padding-right: 5px;
      cursor: pointer;
      small {
        font: normal normal bold 12px/14px Montserrat;
        letter-spacing: 0.24px;
        color: #b30000;
        opacity: 1;
      }
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
  .selects {
    display: flex;
    margin-top: 25px;
    width: 100%;
    padding-bottom: 20px;
    .select-country {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      width: 46%;
      @media (max-width: 500px) {
        width: 95%;
        margin-bottom: 20px;
        input {
          width: 0 !important;
        }
      }
      label {
        @media (max-width: 500px) {
          font-size: 14px;
        }
      }
    }
    .select-schol {
      height: 34px;
      border: 2px solid #e2e2e2;
      outline: none;
      width: 100%;
      border-radius: 14px;
    }
    @media (max-width: 500px) {
      flex-direction: column;
    }
  }

  .institution-wrapper {
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    padding-left: 20px;
    width: 48%;
    input {
      height: 34px;
      border: 2px solid #e2e2e2;
      outline: none;
      width: 100%;
      border-radius: 14px;
      padding-left: 5px;
      @media (max-width: 500px) {
        height: 30px;
      }
    }
    @media (max-width: 500px) {
      width: 95%;
      padding-right: 0px;
      label {
        font-size: 14px !important;
      }
    }
  }
  .req-trans {
    display: flex;
    width: 45%;
    padding-left: 20px;
    justify-content: space-between;
    margin-top: 10px;
    @media (max-width: 500px) {
      width: 100%;
    }
    .select-inst {
      @media (max-width: 500px) {
        margin-left: 20px;
      }
    }

    p {
      &:nth-child(1) {
        font-weight: bold;
        margin-bottom: 3px;
        color: black;
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
