import React, { useEffect, useState } from "react";
import { withFormik, Form, Field } from "formik";
import * as yup from "yup";
import {
  Input,
  Label,
  FormGroup,
  Button,
  Row,
  Col,
  CustomInput,
} from "reactstrap";

import YearSelected from "../components/selecteds/YearSelected";
import FilterSelected from "../components/selecteds/FilterSelected";
import Feedback from "../components/common/Feedback";
import LabelRequired from "../components/common/LabelRequired";
import AllClassSelected from "../components/selecteds/AllClassSelected";

import { getAllSubject, getTeacherData } from "../utils/api/fetchData";

const genderOptions = [
  { value: false, label: "Female" },
  { value: true, label: "Male" },
];

const yearOfBirthRegex = /^\d{4}$/g;
const phoneNumberRegex = /^0\d{9}$/g;

const CreateTeacher = (props) => {
  const { id } = props.match.params;

  const [filterSubject, setFilterSubject] = useState([]);

  useEffect(() => {
    getAllSubject().then((res) => {
      const options = res.data.sort().map((c) => ({ label: c, value: c }));
      setFilterSubject(options);
    });

    if (id) {
      // get teacher data here
      getTeacherData(id).then((res) => {
        const data = res.data;
        props.setFieldValue("name", data.name);
        props.setFieldValue("yearOfBirth", data.yearOfBirth);
        props.setFieldValue("gender", data.gender);
        props.setFieldValue("email", data.email);
        props.setFieldValue("phoneNumber", data.phoneNumber);
        props.setFieldValue("mainTeacher", data.mainTeacherOfClass.length > 0);
        props.setFieldValue("mainTeacherClass", data.mainTeacherOfClass);
        props.setFieldValue("subject", data.subject);
        props.setFieldValue("teacherClass", data.teacherOfClass);
      });
    }
  }, []);

  const {
    name,
    yearOfBirth,
    gender,
    email,
    phoneNumber,
    mainTeacher,
    mainTeacherClass,
    subject,
    teacherClass,
  } = props.values;

  return (
    <Form>
      <h3 className="mb-2">{id ? "EDIT" : "CREATE"} TEACHER</h3>

      <Row>
        <Col md={6}>
          <FormGroup>
            <LabelRequired>Name</LabelRequired>
            <Field
              name="name"
              render={({ field }) => <Input {...field} placeholder="Name" />}
            />
            {props.touched.name && <Feedback>{props.errors.name}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Year of birth</LabelRequired>
            <YearSelected
              name="yearOfBirth"
              onChange={(e) => props.setFieldValue("yearOfBirth", e.value)}
              value={yearOfBirth && { label: yearOfBirth, value: yearOfBirth }}
            />
            {props.touched.yearOfBirth && (
              <Feedback>{props.errors.yearOfBirth}</Feedback>
            )}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Gender</LabelRequired>
            <FilterSelected
              name="gender"
              placeholder="Select gender"
              options={genderOptions}
              onChange={(e) => props.setFieldValue("gender", e.value)}
              value={
                gender !== null && {
                  value: gender,
                  label: gender ? "Male" : "Female",
                }
              }
            />
            {props.touched.gender && <Feedback>{props.errors.gender}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Email</LabelRequired>
            <Field
              name="email"
              render={({ field }) => <Input {...field} placeholder="Email" />}
            />
            {props.touched.email && <Feedback>{props.errors.email}</Feedback>}
          </FormGroup>

          <FormGroup>
            <LabelRequired>Phone number</LabelRequired>
            <Field
              name="phoneNumber"
              render={({ field }) => (
                <Input {...field} placeholder="Phone number" />
              )}
            />
            {props.touched.phoneNumber && (
              <Feedback>{props.errors.phoneNumber}</Feedback>
            )}
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup className="d-flex flex-column">
            <div className="d-flex">
              <Label className="mr-2">Main teacher</Label>
              <CustomInput
                type="checkbox"
                id="mainTeacher"
                onChange={(e) =>
                  props.setFieldValue("mainTeacher", e.target.checked)
                }
                checked={mainTeacher}
              />
            </div>
            <div>
              <AllClassSelected
                isMulti
                isDisabled={!props.values.mainTeacher}
                onChange={(e) => {
                  props.setFieldValue(
                    "mainTeacherClass",
                    e ? e.map((item) => item.value) : []
                  );
                }}
                value={
                  mainTeacherClass &&
                  mainTeacherClass.length > 0 &&
                  mainTeacherClass.map((item) => ({ value: item, label: item }))
                }
              />
              {props.touched.mainTeacherClass && (
                <Feedback>{props.errors.mainTeacherClass}</Feedback>
              )}
            </div>
          </FormGroup>
          <FormGroup>
            <LabelRequired>Subject</LabelRequired>
            <FilterSelected
              placeholder="Select subject"
              className="flex-grow-1 mr-1"
              options={filterSubject}
              onChange={(e) => {
                props.setFieldValue("subject", e.value);
              }}
              value={subject && { value: subject, label: subject }}
            />
            {props.touched.subject && (
              <Feedback>{props.errors.subject}</Feedback>
            )}
          </FormGroup>
          <FormGroup className="d-flex flex-column">
            <Label>Teacher of class</Label>
            <AllClassSelected
              isMulti
              onChange={(e) => {
                props.setFieldValue(
                  "teacherClass",
                  e ? e.map((item) => item.value) : []
                );
              }}
              value={
                teacherClass &&
                teacherClass.length > 0 &&
                teacherClass.map((item) => ({ value: item, label: item }))
              }
            />
            {props.touched.teacherClass && (
              <Feedback>{props.errors.teacherClass}</Feedback>
            )}
          </FormGroup>
        </Col>
      </Row>

      <Button color="success" onClick={props.handleSubmit}>
        {id ? "Update" : "Create"}
      </Button>
    </Form>
  );
};

export default withFormik({
  mapPropsToValues: () => ({
    name: "",
    yearOfBirth: "",
    gender: null,
    email: "",
    phoneNumber: "",
    mainTeacher: false,
    mainTeacherClass: [],
    subject: "",
    teacherClass: [],
  }),
  validationSchema: yup.object().shape({
    name: yup.string().required("Teacher name is required"),
    yearOfBirth: yup
      .string()
      .required("Teacher year of birth is required")
      .matches(yearOfBirthRegex, "Year of birth is invalid"),
    gender: yup.boolean().required("Teacher gender is required").nullable(),
    email: yup.string().required("Email is required").email("Email is invalid"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(phoneNumberRegex, "Phone number is invalid"),
    mainTeacher: yup.boolean(),
    mainTeacherClass: yup.array().when("mainTeacher", {
      is: true,
      then: yup.array().min(1, "Class is required"),
    }),
    subject: yup.string().required("Subject is required"),
    teacherClass: yup
      .string()
      .required("Teacher class is required")
      .min(1, "Teacher class is required"),
  }),
})(CreateTeacher);
