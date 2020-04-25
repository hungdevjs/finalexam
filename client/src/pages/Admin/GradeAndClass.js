import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col } from "reactstrap"

import getAllGradeWithMainTeacher from "../../redux/action/getAllGradeWithMainTeacher"
import renderNoti from "../../utils/renderNoti"
import history from "../../config/history"

import NewTabLink from "../../components/common/NewTabLink"
import BackBtn from "../../components/buttons/BackBtn"
import ViewModal from "../../components/modal/ViewModal"
import Schedule from "../../components/Schedule"

const btnStyle = {
    cursor: "pointer",
}

function GradeAndClass(props) {
    const [grades, setGrades] = useState([])

    const [isOpen, toggle] = useState(false)
    const [currentClass, setCurrentClass] = useState(null)

    useEffect(() => {
        props
            .getAllGradeWithMainTeacher()
            .then((data) => setGrades(data))
            .catch((err) =>
                renderNoti({
                    type: "danger",
                    title: "Failed",
                    message: "Get all grades & classes failed",
                })
            )
    }, [])

    const renderScheduleModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => toggle(!isOpen)}
            title={`Class ${currentClass} schedule`}
            viewOnly
        >
            <Schedule classRoom={currentClass} />
        </ViewModal>
    )

    return (
        <div>
            {renderScheduleModal()}
            <Row className="mb-2">
                <Col md={8} className="d-flex">
                    <h5 className="flex-grow-1">Grades and classes</h5>
                    <BackBtn title="home" onClick={() => history.push("/")} />
                </Col>
            </Row>
            {grades && grades.length > 0 && (
                <Row className="mb-2">
                    <Col md={8}>
                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th>Grade</th>
                                    <th>Grade</th>
                                    <th>Main teacher</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {grades.map((grade, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <th
                                                rowSpan={grade.classRoom.length}
                                            >
                                                {grade.grade}
                                            </th>
                                            <td>{grade.classRoom[0].room}</td>
                                            <td>
                                                <NewTabLink
                                                    to={`/user/teacher/edit/${grade.classRoom[0].mainTeacher._id}`}
                                                    title={
                                                        grade.classRoom[0]
                                                            .mainTeacher.name
                                                    }
                                                />
                                            </td>
                                            <td className="text-center">
                                                <div
                                                    style={btnStyle}
                                                    title="View student list"
                                                    onClick={() =>
                                                        history.push(
                                                            "/students",
                                                            {
                                                                optionClass:
                                                                    grade
                                                                        .classRoom[0]
                                                                        .room,
                                                            }
                                                        )
                                                    }
                                                >
                                                    <i className="fas fa-users"></i>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div
                                                    style={btnStyle}
                                                    title="View schedule"
                                                    onClick={() => {
                                                        setCurrentClass(
                                                            grade.classRoom[0]
                                                                .room
                                                        )
                                                        toggle(!isOpen)
                                                    }}
                                                >
                                                    <i className="fas fa-calendar-alt"></i>
                                                </div>
                                            </td>
                                        </tr>
                                        {grade.classRoom.map((room, i) =>
                                            i > 0 ? (
                                                <tr key={i}>
                                                    <td>{room.room}</td>
                                                    <td>
                                                        <NewTabLink
                                                            to={`/user/teacher/edit/${room.mainTeacher._id}`}
                                                            title={
                                                                room.mainTeacher
                                                                    .name
                                                            }
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <div
                                                            style={btnStyle}
                                                            title="View student list"
                                                            onClick={() =>
                                                                history.push(
                                                                    "/students",
                                                                    {
                                                                        optionClass:
                                                                            room.room,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <i className="fas fa-users"></i>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <div
                                                            style={btnStyle}
                                                            title="View schedule"
                                                            onClick={() => {
                                                                setCurrentClass(
                                                                    room.room
                                                                )
                                                                toggle(!isOpen)
                                                            }}
                                                        >
                                                            <i className="fas fa-calendar-alt"></i>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : null
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    )
}

const mapDispatchToProps = {
    getAllGradeWithMainTeacher,
}

export default connect(null, mapDispatchToProps)(GradeAndClass)
