import React from "react"
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

import YearSelected from "../components/selecteds/YearSelected"
import FilterSelected from "../components/selecteds/FilterSelect"
import Feedback from "../components/common/Feedback"
import LabelRequired from "../components/common/LabelRequired"
import AllClassSelected from "../components/selecteds/AllClassSelected"

const genderOptions = [
    { value: false, label: "Female" },
    { value: true, label: "Male" },
]

const yearOfBirthRegex = /^\d{4}$/g
const phoneNumberRegex = /^0\d{9}$/g

const CreateTeacher = (props) => {
    const { id } = props.match.params

    return (
        <Form>
            <h3 className="mb-2">{id ? "EDIT" : "CREATE"} TEACHER</h3>

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
                        />
                        {props.touched.gender && (
                            <Feedback>{props.errors.gender}</Feedback>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <LabelRequired>Gender</LabelRequired>
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
                                    props.setFieldValue(
                                        "mainTeacher",
                                        e.target.checked,
                                    )
                                }
                            />
                        </div>
                        {props.values.mainTeacher && (
                            <div>
                                <AllClassSelected isMulti />
                            </div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

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
    }),
})(CreateTeacher)
