import React, { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import { BasicDatePicker } from "./BasicDatePicker";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import axiosInstance from "../services/service";

export const EditStudent = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [dobError, setDobError] = useState(false);
  const [image, setImage] = useState("");
  const [intialData, setIntialData] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getData = async () => {
    try {
      const result = await axiosInstance.get(`/student/${id}`);
      setIntialData(result.data);
      const date = new Date(result.data.dob);
      setSelectedDate(date);
    } catch (error) {
      console.error(error); // Log error for debugging
      navigate("/login");
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    fatherName: Yup.string().required("Father Name is required"),
    phoneNumber: Yup.number().required("Phone Number is required"),
    city: Yup.string().required("City is required"),
    address: Yup.string().required("Address is required"),
  });
  const setDate = useCallback(
    (date) => {
      setSelectedDate(date);
      setDobError(false);
    },
    [selectedDate]
  );

  const handleSubmit = async (formData) => {
    try {
      await axiosInstance.patch(`/student/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (error) {
      navigate("/login");
    }
  };
  return (
    <div>
      <div style={{ margin: "10px" }}>
        <Link to="/">
          <Button variant="contained" color="success">
            Back
          </Button>
        </Link>
      </div>
      <h1></h1>
      <Formik
        initialValues={{
          firstName: intialData.firstName,
          lastName: intialData.lastName,
          fatherName: intialData.fatherName,
          phoneNumber: intialData.phoneNumber,
          city: intialData.city,
          address: intialData.address,
          studentImage: intialData?.profileImage?.url,
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            console.log("studentImage", image);
            const formData = new FormData();
            // Append text fields
            formData.append("firstName", values.firstName);
            formData.append("lastName", values.lastName);
            formData.append("fatherName", values.fatherName);
            formData.append("phoneNumber", Number(values.phoneNumber));
            formData.append("city", values.city);
            formData.append("address", values.address);
            formData.append("dob", selectedDate);
            formData.append("image", image);
            handleSubmit(formData);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Container maxWidth="sm" id="student-container">
            <form onSubmit={handleSubmit} className="addStudent">
              <input
                type="text"
                name="firstName"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="FirstName"
                value={values.firstName}
              />
              {errors.firstName && touched.firstName && (
                <div style={{ color: "red", paddingLeft: "10px" }}>
                  {errors.firstName}
                </div>
              )}
              <input
                type="text"
                name="lastName"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="LastName"
                value={values.lastName}
              />
              {errors.lastName && touched.lastName && (
                <div style={{ color: "red", paddingLeft: "10px" }}>
                  {errors.lastName}
                </div>
              )}
              <input
                type="text"
                name="fatherName"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="FatherName"
                value={values.fatherName}
              />
              {errors.fatherName && touched.fatherName && (
                <div style={{ color: "red", paddingLeft: "10px" }}>
                  {errors.fatherName}
                </div>
              )}
              <input
                type="text"
                name="phoneNumber"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="PhoneNumber"
                value={values.phoneNumber}
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <div style={{ color: "red", paddingLeft: "10px" }}>
                  {errors.phoneNumber}
                </div>
              )}
              <input
                type="text"
                name="city"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="City"
                value={values.city}
              />
              {errors.city && touched.city && (
                <div style={{ color: "red", paddingLeft: "10px" }}>
                  {errors.city}
                </div>
              )}
              <input
                type="text"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Address"
                value={values.address}
              />
              {errors.address && touched.address && (
                <div
                  style={{
                    color: "red",
                    paddingLeft: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  {errors.address}
                </div>
              )}
              <BasicDatePicker setDate={setDate} intialData={selectedDate} />
              {dobError && (
                <div style={{ color: "red", padding: "10px" }}>
                  Dob is required
                </div>
              )}
              <input
                type="file"
                name="studentImage"
                onChange={(event) => {
                  setImage(event.currentTarget.files[0]);
                }}
                onBlur={handleBlur}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    margin: "10px",
                    width: "24%",
                    padding: "8px",
                    borderRadius: "5px",
                    background: "green",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (selectedDate === "") {
                      setDobError(true);
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </Container>
        )}
      </Formik>
    </div>
  );
};
