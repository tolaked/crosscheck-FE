import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CountryDropdown,
  //   RegionDropdown,
  //   CountryRegionData,
} from "react-country-region-selector";

//import css module
import "react-flags-select/css/react-flags-select.css";
import { signUp, setLoading, setErrorMessage } from "../../state/actions/users";

function Register() {
  const [visibility, setVisibility] = useState(false);
  const dispatch = useDispatch();
  let acctType;
  const { error } = useSelector((state) => state.user);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      accountType: "",
      password: "",
      country: "",

      ...(acctType === "organization"
        ? { companyWebsite: "", organizationName: "" }
        : null),
      // ...(employeeStatus === "DISABLED" ? { employmentStartDate: "" } : null),
    },

    onSubmit: async (values) => {
      console.log(values);
      dispatch(setLoading(true));
      dispatch(setErrorMessage(""));
      try {
        const res = await signUp(values);
        formik.resetForm();
        console.log("RES", res.data);
        dispatch(setLoading(false));
        window.location.href = "/login";
      } catch (err) {
        if (
          err.response.data.message &&
          err.response.data.message === "user already exist"
        ) {
          dispatch(setErrorMessage("Email already exist"));
        }
      }
    },
    validationSchema: Yup.object({
      //   ...(employeeStatus === "DISABLED" && {
      //     employmentStartDate: Yup.string().required("date is required"),
      //   }),
      //   // employmentStopDate: Yup.string().required("date is required"),
      //   hrComment: Yup.string().required("Comment is required"),
      firstName: Yup.string().required("Reason is required"),
      lastName: Yup.string().required("last name is required"),
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
      country: Yup.string().required("Country is required"),
      phone: Yup.string().required("Phone is required"),
      accountType: Yup.string().required("Account type is required"),
      //   ...(formik.values.accountType === "organization" && {
      //     companyWebsite: Yup.string().required("website is required"),
      //   }),
    }),
  });
  acctType = formik.values.accountType;
  return (
    <div className="container">
      <div className="form-section">
        <form>
          <h3 style={{ color: "#FF2600" }}>Create An Account</h3>
          <p className="intro-text">
            Created for job applicants and hiring managers who wants to stay
            ahead
          </p>
          {error.length > 0 && <p style={{ color: "red" }}>{error}</p>}
          <div className="name-section fields">
            <div className="firstname-input">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="input"
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="error">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div className="lastname-input ">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="input"
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="error">{formik.errors.lastName}</div>
              ) : null}
            </div>
          </div>
          <div className="email-input fields">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="input"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="country-phone fields">
            <div className="country-input">
              <label htmlFor="email">Are you an</label>
              <select
                name="accountType"
                id="accountType"
                className="input"
                style={{ height: "35px" }}
                value={formik.values.accountType}
                onChange={formik.handleChange}
              >
                <option value="" disabled selected>
                  Select an Option
                </option>
                <option selected value="individual">
                  Individual
                </option>
                <option value="organization">Organization</option>
              </select>
            </div>
            {formik.values.accountType === "organization" && (
              <div className="phone">
                <label htmlFor="email">Company Name</label>
                <input
                  type="text"
                  name="organizationName"
                  id="organizationName"
                  className="input"
                  value={formik.values.organizationName}
                  onChange={formik.handleChange}
                />
              </div>
            )}

            {formik.touched.accountType && formik.errors.accountType ? (
              <div className="error">{formik.errors.accountType}</div>
            ) : null}
          </div>
          <div className="country-phone fields">
            <div className="country-input">
              <label htmlFor="country">Country</label>
              <CountryDropdown
                name="country"
                id="country"
                className="country"
                value={formik.values.country}
                onChange={(_, e) => formik.handleChange(e)}
              />
              {/* <RegionDropdown
                country={country}
                value={region}
                onChange={selectRegion}
              /> */}
              {formik.touched.country && formik.errors.country ? (
                <div className="error">{formik.errors.country}</div>
              ) : null}
            </div>
            <div className="phone">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="input"
                value={formik.values.phone}
                onChange={formik.handleChange}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="error">{formik.errors.phone}</div>
              ) : null}
            </div>
          </div>
          <div
            className="password-input fields"
            style={{ position: "relative" }}
          >
            <label>Enter password</label>

            <input
              name="password"
              id="password"
              type={!visibility ? "text" : "password"}
              className="input"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {!visibility ? (
              <FontAwesomeIcon
                icon={faEyeSlash}
                className="custom-icon"
                onClick={() => setVisibility(!visibility)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faEye}
                className="custom-icon"
                onClick={() => setVisibility(!visibility)}
              />
            )}
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>

          {formik.values.accountType === "organization" && (
            <div
              className="password-input fields"
              style={{ marginTop: "10px" }}
            >
              <label>Company's website</label>

              <input
                type="text"
                className="input"
                name="companyWebsite"
                id="companyWebsite"
                value={formik.values.companyWebsite}
                onChange={formik.handleChange}
              />
              {formik.touched.companyWebsite && formik.errors.companyWebsite ? (
                <div className="error">{formik.errors.companyWebsite}</div>
              ) : null}
            </div>
          )}

          <button
            type="button"
            className="register-button"
            onClick={formik.handleSubmit}
          >
            REGISTER
          </button>
          <div className="terms">
            <div className="accept">
              <input
                type="checkbox"
                name="check"
                className="check"
                style={{ marginRight: "10px" }}
              />
              <span>I agree to the terms and conditions</span>
            </div>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              //   style={{ textDecoration: "none", fontSize: "14px" }}
            >
              forgot password
            </a>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p>Sign up with</p>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button className="facebook">
                <FontAwesomeIcon
                  icon={faFacebookF}
                  style={{
                    background: "#0092e0",
                    color: "white",
                    fontSize: "16px",
                  }}
                />{" "}
                Facebook
              </button>
              <button className="google">
                <FontAwesomeIcon
                  icon={faGoogle}
                  style={{
                    background: "#FF2600",
                    color: "white",
                    fontSize: "16px",
                  }}
                />{" "}
                Google
              </button>
            </div>
            <p className="paragraph">
              Already have an account?
              <Link style={{ color: "#0092e0", textDecoration: "none" }} to="/">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="image-section">{/* <img src={men} /> */}</div>
    </div>
  );
}

export default Register;
