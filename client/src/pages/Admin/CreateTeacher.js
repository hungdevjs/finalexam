import React, { useEffect, useState } from "react"
import { withFormik, Form, Field } from "formik"
import * as yup from "yup"
import {
    Input,
    Label,
    FormGroup,
    Button,
    Row,
    Col,
    CustomInput,
} from "reactstrap"

import YearSelected from "../../components/selecteds/YearSelected"
import FilterSelected from "../../components/selecteds/FilterSelected"
import Feedback from "../../components/common/Feedback"
import LabelRequired from "../../components/common/LabelRequired"
import AllClassSelected from "../../components/selecteds/AllClassSelected"
import BackBtn from "../../components/buttons/BackBtn"

import Schedule from "../../components/Schedule"

import history from "../../config/history"
import renderNoti from "../../utils/renderNoti"

import {
    getAllSubject,
    getTeacherData,
    createTeacher,
    updateTeacher,
    updateProfile,
} from "../../utils/api/fetchData"

const genderOptions = [
    { value: false, label: "Female" },
    { value: true, label: "Male" },
]

const yearOfBirthRegex = /^\d{4}$/g
const phoneNumberRegex = /^0\d{9}$/g

const CreateTeacher = (props) => {
    const teacherId = props.id
    const id = props.match?.params?.id || teacherId

    const [filterSubject, setFilterSubject] = useState([])

    useEffect(() => {
        if (!teacherId) {
            getAllSubject().then((res) => {
                const options = res.data
                    .sort()
                    .map((c) => ({ label: c, value: c }))
                setFilterSubject(options)
            })
        }

        if (id) {
            // get teacher data here
            getTeacherData(id).then((res) => {
                const data = res.data
                props.setFieldValue("name", data.name)
                props.setFieldValue("yearOfBirth", data.yearOfBirth)
                props.setFieldValue("gender", data.gender)
                props.setFieldValue("email", data.email)
                props.setFieldValue("phoneNumber", data.phoneNumber)
                props.setFieldValue(
                    "mainTeacher",
                    data.mainTeacherOfClass && data.mainTeacherOfClass.trim()
                )
                props.setFieldValue(
                    "mainTeacherOfClass",
                    data.mainTeacherOfClass
                )
                props.setFieldValue("subject", data.subject)
                props.setFieldValue("teacherOfClass", data.teacherOfClass)
            })
        }
    }, [])

    const {
        name,
        yearOfBirth,
        gender,
        email,
        phoneNumber,
        mainTeacher,
        mainTeacherOfClass,
        subject,
        teacherOfClass,
    } = props.values

    return (
        <Form className="mb-2">
            <Row>
                <Col md={12} className="d-flex align-items-start">
                    <div className="flex-grow-1">
                        <h5 className="mb-2">
                            {id ? "EDIT" : "CREATE"}{" "}
                            {teacherId ? "PROFILE" : "TEACHER"}
                        </h5>
                    </div>

                    {!teacherId && (
                        <BackBtn
                            title="home"
                            onClick={() => history.push("/")}
                        />
                    )}
                </Col>
                <Col md={4} className="text-right"></Col>
            </Row>

            <Row>
                <Col md={6}>
                    <FormGroup>
                        <LabelRequired>Name</LabelRequired>
                        <Field
                            name="name"
                            render={({ field }) => (
                                <Input {...field} placeholder="Name" />
                            )}
                        />
                        {props.touched.name && (
                            <Feedback>{props.errors.name}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <LabelRequired>Year of birth</LabelRequired>
                        <YearSelected
                            name="yearOfBirth"
                            onChange={(e) =>
                                props.setFieldValue("yearOfBirth", e.value)
                            }
                            value={
                                yearOfBirth && {
                                    label: yearOfBirth,
                                    value: yearOfBirth,
                                }
                            }
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
                            onChange={(e) =>
                                props.setFieldValue("gender", e.value)
                            }
                            value={
                                gender !== null && {
                                    value: gender,
                                    label: gender ? "Male" : "Female",
                                }
                            }
                        />
                        {props.touched.gender && (
                            <Feedback>{props.errors.gender}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <LabelRequired>Email</LabelRequired>
                        <Field
                            name="email"
                            render={({ field }) => (
                                <Input {...field} placeholder="Email" />
                            )}
                        />
                        {props.touched.email && (
                            <Feedback>{props.errors.email}</Feedback>
                        )}
                    </FormGroup>
                </Col>

                <Col md={6}>
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

                    <FormGroup className="d-flex flex-column">
                        <div className="d-flex">
                            <Label className="mr-2">Main teacher</Label>
                            <CustomInput
                                type="checkbox"
                                id="mainTeacher"
                                onChange={(e) => {
                                    props.setFieldValue(
                                        "mainTeacher",
                                        e.target.checked
                                    )
                                    if (!e.target.checked) {
                                        props.setFieldValue(
                                            "mainTeacherOfClass",
                                            ""
                                        )
                                    }
                                }}
                                checked={mainTeacher}
                                disabled={teacherId}
                            />
                        </div>
                        <div>
                            <AllClassSelected
                                isDisabled={
                                    !props.values.mainTeacher || teacherId
                                }
                                onChange={(e) => {
                                    props.setFieldValue(
                                        "mainTeacherOfClass",
                                        e.value
                                    )
                                }}
                                value={
                                    mainTeacherOfClass &&
                                    mainTeacherOfClass.trim() && {
                                        value: mainTeacherOfClass,
                                        label: mainTeacherOfClass,
                                    }
                                }
                                viewOnly={teacherId}
                            />
                            {props.touched.mainTeacherOfClass && (
                                <Feedback>
                                    {props.errors.mainTeacherOfClass}
                                </Feedback>
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
                                props.setFieldValue("subject", e.value)
                            }}
                            value={
                                subject && { value: subject, label: subject }
                            }
                            isDisabled={teacherId}
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
                                    "teacherOfClass",
                                    e ? e.map((item) => item.value) : []
                                )
                            }}
                            value={
                                teacherOfClass &&
                                teacherOfClass.length > 0 &&
                                teacherOfClass.map((item) => ({
                                    value: item,
                                    label: item,
                                }))
                            }
                            isDisabled={teacherId}
                            viewOnly={teacherId}
                        />
                        {props.touched.teacherOfClass && (
                            <Feedback>{props.errors.teacherOfClass}</Feedback>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            {id && <Schedule teacherId={id} />}

            <Button color="success" onClick={props.handleSubmit}>
                {id ? "Update" : "Create"}
            </Button>
        </Form>
    )
}

export default withFormik({
    mapPropsToValues: () => ({
        name: "",
        yearOfBirth: "",
        gender: null,
        email: "",
        phoneNumber: "",
        mainTeacher: false,
        mainTeacherOfClass: "",
        subject: "",
        teacherOfClass: [],
    }),
    validationSchema: yup.object().shape({
        name: yup.string().required("Teacher name is required"),
        yearOfBirth: yup
            .string()
            .required("Teacher year of birth is required")
            .matches(yearOfBirthRegex, "Year of birth is invalid"),
        gender: yup.boolean().required("Teacher gender is required").nullable(),
        email: yup
            .string()
            .required("Email is required")
            .email("Email is invalid"),
        phoneNumber: yup
            .string()
            .required("Phone number is required")
            .matches(phoneNumberRegex, "Phone number is invalid"),
        mainTeacher: yup.boolean(),
        mainTeacherOfClass: yup.string().when("mainTeacher", {
            is: true,
            then: yup.string().required("Class is required"),
        }),
        subject: yup.string().required("Subject is required"),
        teacherOfClass: yup
            .string()
            .required("Teacher class is required")
            .min(1, "Teacher class is required"),
    }),
    handleSubmit: async (values, { props }) => {
        try {
            const teacherId = props.id
            const id = props.match?.params?.id || teacherId

            const res = await (id
                ? (teacherId ? updateProfile : updateTeacher)(
                      values,
                      id,
                      "teacher"
                  )
                : createTeacher(values))

            if (res.data && res.data.error) {
                throw new Error(res.data.error)
            }

            renderNoti({
                type: "success",
                title: "Success",
                message: `${id ? "Update" : "Create"} teacher successfully`,
            })
            history.push("/")
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Failed",
                message: err.message,
            })
        }
    },
})(CreateTeacher)
