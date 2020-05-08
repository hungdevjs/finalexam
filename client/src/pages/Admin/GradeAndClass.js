import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Button } from "reactstrap"

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

    const [isPhone, setIsPhone] = useState(window.innerWidth < 768)
    window.addEventListener("resize", () => setIsPhone(window.innerWidth < 768))

    useEffect(() => {
        props
            .getAllGradeWithMainTeacher()
            .then((data) => setGrades(data))
            .catch((err) =>
                renderNoti({
                    type: "danger",
                    title: "Lỗi",
                    message: "Lỗi trong khi lấy dữ liệu",
                })
            )
    }, [])

    const renderScheduleModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => toggle(!isOpen)}
            title={`Thời khóa biểu lớp ${currentClass}`}
            viewOnly
        >
            <Schedule classRoom={currentClass} />

            <NewTabLink
                title="Chỉnh sửa"
                to={`/updateSchedule/${currentClass}`}
            />
        </ViewModal>
    )

    return (
        <div>
            {renderScheduleModal()}
            <Row className="mb-2">
                <Col md={8} className="d-flex">
                    <h5 className="flex-grow-1">
                        QUẢN LÝ LỚP HỌC{" "}
                        {props.year && `${props.year}-${props.year + 1}`}
                    </h5>
                    {!isPhone && (
                        <BackBtn
                            title="trang chủ"
                            onClick={() => history.push("/")}
                        />
                    )}
                </Col>
                {isPhone && (
                    <Col md={12}>
                        <BackBtn
                            title="trang chủ"
                            onClick={() => history.push("/")}
                        />
                    </Col>
                )}
            </Row>
            {grades && grades.length > 0 && (
                <Row className="mb-2">
                    <Col md={8}>
                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th>Khối học</th>
                                    <th>Lớp học</th>
                                    <th>Giáo viên chủ nhiệm</th>
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
                                                    title="Xem danh sách học sinh"
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
                                                    title="Xem thời khóa biểu"
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
                                                            title="Xem danh sách học sinh"
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
                                                            title="Xem thời khóa biểu"
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

const mapStateToProps = (state) => ({
    year: state.time.year,
})

export default connect(mapStateToProps, mapDispatchToProps)(GradeAndClass)
