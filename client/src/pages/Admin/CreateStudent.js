import React, { useState, useEffect } from "react";
import history from "../../config/history";
import _ from "lodash";
import DatePicker from "react-datepicker";
import { Row, Col, Input, Label, Button } from "reactstrap";
import Selected from "react-select";

import "react-datepicker/dist/react-datepicker.css";

import FilterSelected from "../../components/selecteds/FilterSelected";
import YearSelected from "../../components/selecteds/YearSelected";
import GradeSelected from "../../components/selecteds/GradeSelected";

import BackBtn from "../../components/buttons/BackBtn";

import renderNoti from "../../utils/renderNoti";

import validation from "../../utils/validation";
import { createStudent } from "../../utils/api/fetchData";
import { updateStudent } from "../../utils/api/fetchData";

import { getStudentData } from "../../utils/api/fetchData";
import { getAllClassOfGrade } from "../../utils/api/fetchData";

export default function (props) {
    const { id } = props.match.params;

    const genderOptions = [
        { value: true, label: "Male" },
        { value: false, label: "Female" },
    ];

    const [state, setState] = useState({
        name: {
            value: "",
            field: "name",
            invalid: false,
        },
        gender: {
            value: "",
            field: "gender",
            invalid: false,
        },
        grade: {
            value: "",
            field: "grade",
            invalid: false,
        },
        classRoom: {
            value: "",
            field: "classRoom",
            invalid: false,
        },
        dateOfBirth: {
            value: "",
            field: "dateOfBirth",
            invalid: false,
        },
        address: {
            value: "",
        },
        note: {
            value: "",
        },
        father: {
            name: "",
            yearOfBirth: "",
            phoneNumber: "",
            note: "",
            invalid: false,
        },
        mother: {
            name: "",
            yearOfBirth: "",
            phoneNumber: "",
            note: "",
            invalid: false,
        },
    });

    const [classOptions, setClassOptions] = useState([]);

    // load student data
    useEffect(() => {
        if (id) {
            getStudentData(id).then((res) => {
                const {
                    studentName,
                    gender,
                    grade,
                    classRoom,
                    dateOfBirth,
                    address,
                    note,
                    father,
                    mother,
                    _id,
                    studentId,
                } = res.data;

                getAllClassOfGrade(grade).then((res) => {
                    const options = res.data.map((option) => ({
                        value: option,
                        label: option,
                    }));
                    setClassOptions(options);
                });

                setState({
                    name: {
                        ...state.name,
                        value: studentName,
                    },
                    gender: {
                        ...state.gender,
                        value: gender,
                    },
                    grade: {
                        ...state.grade,
                        value: grade,
                    },
                    classRoom: {
                        ...state.classRoom,
                        value: classRoom,
                    },
                    dateOfBirth: {
                        ...state.dateOfBirth,
                        value: dateOfBirth,
                    },
                    address: {
                        value: address,
                    },
                    note: {
                        value: note,
                    },
                    father: {
                        ...father,
                        invalid: false,
                    },
                    mother: {
                        ...mother,
                        invalid: false,
                    },
                    _id,
                    studentId,
                });
            });
        }
    }, []);

    const checkSingleInput = (key) => {
        if (
            (!key.value && key.field !== "gender") ||
            (key.field === "gender" && key.value === "") ||
            (key.value && !key.value.toString().trim())
        ) {
            setState({
                ...state,
                [key.field]: {
                    ...key,
                    invalid: true,
                },
            });
        } else {
            setState({
                ...state,
                [key.field]: {
                    ...key,
                    invalid: false,
                },
            });
        }
    };

    const checkPhoneNummber = (phoneNumber) => {
        if (validation.phoneNumber(phoneNumber)) {
            return true;
        }

        return false;
    };

    const ErrorMessage = (key) => (
        <p
            className="mb-2 text-danger"
            style={{
                display: key.invalid ? "block" : "none",
                fontSize: "0.75rem",
            }}
        >
            {_.capitalize(_.startCase(key.field).toLowerCase())} is empty
        </p>
    );

    const canSubmit = () => {
        const {
            name,
            gender,
            grade,
            classRoom,
            dateOfBirth,
            father,
            mother,
        } = state;
        const arr = [name, gender, grade, classRoom, dateOfBirth];

        const fatherValid =
            father.name.trim() &&
            father.yearOfBirth.trim() &&
            father.phoneNumber.trim();
        const motherValid =
            mother.name.trim() &&
            mother.yearOfBirth.trim() &&
            mother.phoneNumber.trim();

        const phoneNumberNotEmpty =
            father.phoneNumber.trim().length > 0 ||
            mother.phoneNumber.trim().length > 0;

        let flag = true;

        for (let item of arr) {
            if (!item.value.toString().trim()) {
                flag = false;
            }
        }

        if (!flag) {
            renderNoti({
                title: "Failed",
                message:
                    "Please fill out all basic information of student includes name, gender, grade, class, date of birth",
                type: "danger",
            });
        }

        if (!fatherValid && !motherValid) {
            flag = false;
            setState({
                ...state,
                father: {
                    ...father,
                    invalid: true,
                },
                mother: {
                    ...mother,
                    invalid: true,
                },
            });

            renderNoti({
                title: "Failed",
                message:
                    "Please fill out all basic information of at least Father or Mother",
                type: "danger",
            });
        } else {
            if (fatherValid) {
                setState({
                    ...state,
                    father: {
                        ...father,
                        invalid: false,
                    },
                });
            } else {
                setState({
                    ...state,
                    mother: {
                        ...mother,
                        invalid: false,
                    },
                });
            }
        }

        if (
            phoneNumberNotEmpty &&
            !checkPhoneNummber(father.phoneNumber) &&
            !checkPhoneNummber(mother.phoneNumber)
        ) {
            flag = false;
            renderNoti({
                title: "Failed",
                message: "Parent phone number is not valid",
                type: "danger",
            });
        }

        if (
            flag &&
            father.phoneNumber.trim() &&
            mother.phoneNumber.trim() &&
            (!checkPhoneNummber(father.phoneNumber) ||
                !checkPhoneNummber(mother.phoneNumber))
        ) {
            flag = false;
            renderNoti({
                title: "Failed",
                message: "Parent phone number is not valid",
                type: "danger",
            });
        }

        if (!flag) return false;

        return true;
    };

    const onSubmit = () => {
        if (!canSubmit()) {
            return;
        }

        let submit = id ? updateStudent : createStudent;

        const {
            name,
            gender,
            grade,
            classRoom,
            dateOfBirth,
            address,
            note,
            father,
            mother,
        } = state;
        const data = {
            studentName: name.value,
            gender: gender.value,
            grade: grade.value,
            classRoom: classRoom.value,
            dateOfBirth: dateOfBirth.value,
            address: address.value,
            note: note.value,
            father: {
                name: father.name,
                yearOfBirth: father.yearOfBirth,
                phoneNumber: father.phoneNumber,
                note: father.note,
            },
            mother: {
                name: mother.name,
                yearOfBirth: mother.yearOfBirth,
                phoneNumber: mother.phoneNumber,
                note: mother.note,
            },
        };

        submit(data, id)
            .then(() =>
                renderNoti({
                    title: "Success",
                    message: `${id ? "Update" : "Create"} student successfully`,
                    type: "success",
                })
            )
            .then(() => history.push("/"));
    };

    const {
        name,
        gender,
        grade,
        classRoom,
        dateOfBirth,
        address,
        note,
        father,
        mother,
    } = state;

    return (
        <div>
            <Row>
                <Col md={8}>
                    <h3 className="mb-2">{id ? "EDIT" : "CREATE"} STUDENT</h3>

                    {id && (
                        <Button
                            color="link"
                            className="pl-0"
                            onClick={() => history.push(`/transcript/${id}`)}
                        >
                            View transcript
                        </Button>
                    )}
                </Col>
                <Col md={4} className="text-right">
                    <BackBtn title="home" onClick={() => history.push("/")} />
                </Col>
            </Row>

            <Row className="mb-2">
                <Col md={6} sm={12}>
                    <Label>
                        Student name <span className="text-danger">*</span>
                    </Label>
                    <Input
                        type="text"
                        placeholder="Student name"
                        className={!name.invalid ? "mb-2" : ""}
                        value={name.value}
                        onChange={(e) =>
                            setState({
                                ...state,
                                name: {
                                    ...state.name,
                                    value: e.target.value,
                                },
                            })
                        }
                        onBlur={() => checkSingleInput(name)}
                    />
                    {ErrorMessage(name)}

                    <Row className="mb-2">
                        <Col md={4} sm={12}>
                            <Label>
                                Gender <span className="text-danger">*</span>
                            </Label>
                            <Selected
                                placeholder="Select gender"
                                options={genderOptions}
                                value={
                                    gender.value !== ""
                                        ? genderOptions.find(
                                              (option) =>
                                                  option.value === gender.value
                                          )
                                        : null
                                }
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        gender: {
                                            ...state.gender,
                                            value: e.value,
                                        },
                                    })
                                }
                                onBlur={() => checkSingleInput(gender)}
                            />
                            {ErrorMessage(gender)}
                        </Col>

                        <Col md={4} sm={12}>
                            <Label>
                                Grade <span className="text-danger">*</span>
                            </Label>
                            <GradeSelected
                                value={
                                    grade.value && {
                                        label: grade.value,
                                        value: grade.value,
                                    }
                                }
                                onChange={(e) => {
                                    setState({
                                        ...state,
                                        grade: {
                                            ...state.grade,
                                            value: e.value,
                                        },
                                        classRoom: {
                                            ...classRoom,
                                            value: e.classRoom[0],
                                        },
                                    });
                                    const classArray = e.classRoom.map(
                                        (item) => ({
                                            value: item,
                                            label: item,
                                        })
                                    );
                                    setClassOptions(classArray);
                                }}
                                onBlur={() => checkSingleInput(grade)}
                            />
                            {ErrorMessage(grade)}
                        </Col>

                        <Col md={4} sm={12}>
                            <Label>
                                Class <span className="text-danger">*</span>
                            </Label>
                            <FilterSelected
                                placeholder="Select class"
                                value={
                                    classRoom.value
                                        ? {
                                              value: classRoom.value,
                                              label: classRoom.value,
                                          }
                                        : ""
                                }
                                options={classOptions}
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        classRoom: {
                                            ...state.classRoom,
                                            value: e.value,
                                        },
                                    })
                                }
                                onBlur={() => checkSingleInput(classRoom)}
                                isDisabled={!grade.value}
                            />
                            {ErrorMessage(classRoom)}
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={4} sm={12}>
                            <Label className="d-block">
                                Date of birth{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            <DatePicker
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        dateOfBirth: {
                                            ...state.dateOfBirth,
                                            value: e && e.toString(),
                                        },
                                    })
                                }
                                onBlur={() => checkSingleInput(dateOfBirth)}
                                placeholderText="Select date of birth"
                                customInput={<Input />}
                                showYearDropdown
                                maxDate={new Date()}
                                selected={
                                    dateOfBirth.value
                                        ? new Date(dateOfBirth.value)
                                        : ""
                                }
                            />
                            {ErrorMessage(dateOfBirth)}
                        </Col>

                        <Col md={8} sm={12}>
                            <Label>Address</Label>
                            <Input
                                type="text"
                                placeholder="Address"
                                value={address.value ? address.value : ""}
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        address: {
                                            ...state.address,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={12}>
                            <Label>Note</Label>
                            <Input
                                type="textarea"
                                placeholder="Student note"
                                value={note.value}
                                onChange={(e) =>
                                    setState({
                                        ...state,
                                        note: {
                                            ...state.note,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Col>
                    </Row>
                </Col>

                <Col md={3} sm={12}>
                    <Label>Father name</Label>
                    <Input
                        type="text"
                        placeholder="Father name"
                        className="mb-2"
                        value={father && father.name ? father.name : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    name: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Father year of birth</Label>
                    <YearSelected
                        className="mb-2"
                        value={
                            father && father.yearOfBirth
                                ? {
                                      value: father.yearOfBirth,
                                      label: father.yearOfBirth,
                                  }
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    yearOfBirth: e.value,
                                },
                            })
                        }
                    />

                    <Label>Father phone number</Label>
                    <Input
                        type="text"
                        placeholder="Father phone number"
                        className="mb-2"
                        value={
                            father && father.phoneNumber
                                ? father.phoneNumber
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    phoneNumber: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Note</Label>
                    <Input
                        type="textarea"
                        placeholder="Father note"
                        value={father && father.note ? father.note : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                father: {
                                    ...father,
                                    note: e.target.value,
                                },
                            })
                        }
                    />
                </Col>

                <Col md={3} sm={12}>
                    <Label>Mother name</Label>
                    <Input
                        type="text"
                        placeholder="Mother name"
                        className="mb-2"
                        value={mother && mother.name ? mother.name : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    name: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Mother year of birth</Label>
                    <YearSelected
                        className="mb-2"
                        value={
                            mother && mother.yearOfBirth
                                ? {
                                      value: mother.yearOfBirth,
                                      label: mother.yearOfBirth,
                                  }
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    yearOfBirth: e.value,
                                },
                            })
                        }
                    />

                    <Label>Mother phone number</Label>
                    <Input
                        type="text"
                        placeholder="Mother phone number"
                        className="mb-2"
                        value={
                            mother && mother.phoneNumber
                                ? mother.phoneNumber
                                : ""
                        }
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    phoneNumber: e.target.value,
                                },
                            })
                        }
                    />

                    <Label>Note</Label>
                    <Input
                        type="textarea"
                        placeholder="Mother note"
                        value={mother && mother.note ? mother.note : ""}
                        onChange={(e) =>
                            setState({
                                ...state,
                                mother: {
                                    ...mother,
                                    note: e.target.value,
                                },
                            })
                        }
                    />
                </Col>
            </Row>

            <Row className="mb-2">
                <Col md={12}>
                    <Button color="success" onClick={onSubmit}>
                        {id ? "Update" : "Create"}
                    </Button>
                </Col>
            </Row>
        </div>
    );
}