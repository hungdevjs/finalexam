import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Table, Row, Col, Alert } from "reactstrap"
import { connect } from "react-redux"
import moment from "moment"
import history from "../../config/history"

import SearchBox from "../../components/common/SearchBox"
import GradeSelected from "../../components/selecteds/GradeSelected"
import FilterSelected from "../../components/selecteds/FilterSelected"
import CreateBtnBig from "../../components/buttons/CreateBtnBig"
import DeleteBtn from "../../components/buttons/DeleteBtn"
import BackBtn from "../../components/buttons/BackBtn"
import NewTabLink from "../../components/common/NewTabLink"
import Pagination from "../../components/common/Pagination"
import ViewModal from "../../components/modal/ViewModal"

import getAllUser from "../../redux/action/getAllUser"
import teacherGetAllStudent from "../../redux/action/teacherGetAllStudent"
import setModal from "../../redux/action/setModal"
import { deleteUser } from "../../utils/api/fetchData"
import renderNoti from "../../utils/renderNoti"

const StudentList = (props) => {
    const { user } = props
    const { role } = user

    const [searchString, setSearchString] = useState("")
    const [optionClass, setOptionClass] = useState(
        props.location?.state?.optionClass || ""
    )
    const [optionGrade, setOptionGrade] = useState("")
    const [filterClassStudent, setFilterClassStudent] = useState([])
    const [data, setData] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [totalUser, setTotalUser] = useState(0)

    const [isOpen, toggle] = useState(false)
    const [parent, setParent] = useState({})

    const getData = async () => {
        try {
            const res = await (role === "admin"
                ? props.getAllUser(
                      "student",
                      searchString,
                      optionClass,
                      optionGrade,
                      "",
                      currentPage
                  )
                : props.teacherGetAllStudent(
                      searchString,
                      optionClass,
                      currentPage
                  ))

            setData(res.data)
            setTotalPage(res.totalPage)
            setTotalUser(res.totalUser)
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Failed",
                message: "Load student list failed",
            })
        }
    }

    const deleteStudent = (id) => {
        deleteUser("student", id)
            .then(() =>
                renderNoti({
                    title: "Success",
                    message: "Delete student successfully",
                    type: "success",
                })
            )
            .then(() => getData())
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Failed",
                    message: "Delete student failed",
                })
            })
    }

    const renderParent = (parent, position) => {
        if (!parent || Object.keys(parent).length === 0) return null
        return (
            <Link onClick={() => setParentInfoToModal(parent, position)}>
                {parent.name}
            </Link>
        )
    }

    useEffect(() => {
        if (role === "teacher") {
            setFilterClassStudent(
                user?.teacherOfClass?.map((item) => ({
                    value: item,
                    label: item,
                }))
            )
        }
        getData()
        //eslint-disable-next-line
    }, [optionClass, optionGrade, currentPage])

    const onGradeSelected = (e) => {
        setCurrentPage(1)
        if (e) {
            setOptionGrade(e.value)
            const classArray = e.classRoom.map((item) => ({
                value: item,
                label: item,
            }))
            setFilterClassStudent(classArray)
        } else {
            setOptionGrade("")
            setFilterClassStudent([])
        }
        setOptionClass("")
    }

    const renderModal = () => {
        if (!parent || Object.keys(parent).length === 0) return null

        return (
            <ViewModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
                title={`${
                    parent.position === "father" ? "Father" : "Mother"
                } information`}
                viewOnly
            >
                <p>Name: {parent.name || ""}</p>
                <p>Year of birth: {parent.yearOfBirth || ""}</p>
                <p>Phone number: {parent.phoneNumber || ""}</p>
                <p>Note: {parent.note || ""}</p>
            </ViewModal>
        )
    }

    const setParentInfoToModal = (parent, position) => {
        setParent({
            position,
            ...parent,
        })
        toggle(true)
    }

    return (
        <div>
            {renderModal()}
            <Row className="mb-2">
                <Col md={8}>
                    <h5>
                        STUDENT LIST{" "}
                        {props.year && `${props.year}-${props.year + 1}`}
                    </h5>
                </Col>
                <Col md={4} className="text-lg-right text-md-left">
                    {role === "admin" && (
                        <CreateBtnBig
                            title="student"
                            className="mr-2"
                            onClick={() => history.push("/user/student/create")}
                        />
                    )}
                    <BackBtn title="home" onClick={() => history.push("/")} />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={6}>
                    <SearchBox
                        onChange={(e) => setSearchString(e.target.value)}
                        onSearch={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(1)
                            } else {
                                getData()
                            }
                        }}
                    />
                </Col>
                {role === "admin" && (
                    <Col md={3}>
                        <GradeSelected
                            isClearable
                            className="mb-2"
                            placeholder="Filter grade"
                            onChange={(e) => onGradeSelected(e)}
                        />
                    </Col>
                )}
                <Col md={3}>
                    <FilterSelected
                        isClearable
                        placeholder="Filter class"
                        options={filterClassStudent}
                        onChange={(e) => {
                            setCurrentPage(1)
                            if (e) {
                                setOptionClass(e.value)
                            } else {
                                setOptionClass("")
                            }
                        }}
                        value={
                            optionClass && {
                                value: optionClass,
                                label: optionClass,
                            }
                        }
                        isDisabled={
                            role === "admin" && filterClassStudent.length === 0
                        }
                    />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={12} className="text-right">
                    <b>Total students: {totalUser}</b>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {data && data.length > 0 ? (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {[
                                        "Name",
                                        "Gender",
                                        "Grade",
                                        "Class",
                                        "Date of birth",
                                        "Father",
                                        "Mother",
                                        "Address",
                                        "Note",
                                        "",
                                    ].map((item, index) => (
                                        <th key={index} className="align-top">
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((student, index) => (
                                    <tr key={index}>
                                        <td>
                                            <NewTabLink
                                                title={student.studentName}
                                                to={`/user/student/edit/${student.id}`}
                                            />
                                        </td>
                                        <td>
                                            {student.gender ? "Male" : "Female"}
                                        </td>
                                        <td>{student.grade}</td>
                                        <td>{student.classRoom}</td>
                                        <td>
                                            {moment(student.dateOfBirth).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </td>
                                        <td>
                                            {renderParent(
                                                student.father,
                                                "father"
                                            )}
                                        </td>
                                        <td>
                                            {renderParent(
                                                student.mother,
                                                "mother"
                                            )}
                                        </td>
                                        <td>{student.address}</td>
                                        <td>{student.note}</td>
                                        <td className="text-center">
                                            {role === "admin" ? (
                                                <DeleteBtn
                                                    onClick={() => {
                                                        props.setModal({
                                                            isOpen: true,
                                                            message:
                                                                "Do you want to delete this student ?",
                                                            type: "warning",
                                                            onConfirm: () =>
                                                                deleteStudent(
                                                                    student.id
                                                                ),
                                                        })
                                                    }}
                                                />
                                            ) : (
                                                <NewTabLink
                                                    title={
                                                        <div title="View transcript">
                                                            <i className="fas fa-table"></i>
                                                        </div>
                                                    }
                                                    to={`/student/transcript/${student.id}`}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert color="primary">No student to display</Alert>
                    )}
                </Col>
            </Row>
            {data && data.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPage={totalPage}
                />
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    year: state.time.year,
    user: state.user.userInformation,
})

const mapDispatchToProps = {
    getAllUser,
    teacherGetAllStudent,
    setModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentList)
