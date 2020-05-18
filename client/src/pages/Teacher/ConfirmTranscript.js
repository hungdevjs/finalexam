import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Table, Button } from "reactstrap"
import _ from "lodash"

import history from "../../config/history"
import ViewModal from "../../components/modal/ViewModal"
import BackBtn from "../../components/buttons/BackBtn"
import EditBtn from "../../components/buttons/EditBtn"
import getClassTranscript from "../../redux/action/getClassTranscript"
import studentName from "../../utils/subjectName"
import renderNoti from "../../utils/renderNoti"
import { updateTranscript } from "../../utils/api/fetchData"
import subjectName from "../../utils/subjectName"

const ConfirmTranscript = (props) => {
    const {
        match: {
            params: { classRoom, subject },
        },
    } = props

    const [data, setData] = useState([])

    const [currentScore, setCurrentScore] = useState({})
    const [isOpen, toggle] = useState(false)
    const [student, setStudent] = useState({})

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        props
            .getClassTranscript({ classRoom, subject })
            .then((data) => setData(data))
    }

    const editTranscript = (x, index, e) => {
        const { value } = e.target
        if (Number(value) < 0 || Number(value) > 10) {
            e.target.value = e.target.value.slice(0, -1)
            return
        }

        const transcript = _.cloneDeep(currentScore)
        transcript[x][index] = value.trim() ? Number(value) : -1

        setCurrentScore(transcript)
    }

    const updateStudentTranscript = async () => {
        // send request to api to update transcript of this student
        try {
            toggle(!isOpen)

            const subject = {
                name: currentScore?.name,
                subject: currentScore?.subject,
                score: {
                    x1: currentScore?.x1,
                    x2: currentScore?.x2,
                    x3: currentScore?.x3,
                },
            }

            const data = { studentId: student._id, subject }
            await updateTranscript(data)

            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Đã cập nhật bảng điểm",
            })

            getData()
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: "Lỗi trong khi cập nhật bảng điểm",
            })
        }
    }

    const renderModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => toggle(!isOpen)}
            title={`Cập nhật bảng điểm`}
            onConfirm={() => updateStudentTranscript()}
        >
            <Row>
                <Col md={12}>Học sinh: {student?.studentName}</Col>
                <Col md={12}>Lớp: {classRoom}</Col>
                <Col md={12}>
                    Năm học: {props.time.year} - Học kỳ: {props.time.semester}
                </Col>
                <Col md={12} className="mb-2">
                    Môn học: {currentScore.subject}
                </Col>
                <Col md={12} className="mb-2">
                    HS 1:
                    {currentScore?.x1?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            type="number"
                            defaultValue={item > -1 ? item : null}
                            maxLength={2}
                            onChange={(e) => {
                                editTranscript("x1", index, e)
                            }}
                        />
                    ))}
                </Col>

                <Col md={12} className="mb-2">
                    HS 2:
                    {currentScore?.x2?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            maxLength={2}
                            defaultValue={item > -1 ? item : null}
                            onChange={(e) => {
                                editTranscript("x2", index, e)
                            }}
                        />
                    ))}
                </Col>

                <Col md={12} className="mb-2">
                    HS 3:
                    {currentScore?.x3?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            maxLength={2}
                            defaultValue={item > -1 ? item : null}
                            onChange={(e) => {
                                editTranscript("x3", index, e)
                            }}
                        />
                    ))}
                </Col>
            </Row>
        </ViewModal>
    )

    const singleMark = (score) => (
        <>
            <p>
                <span className="mr-2 font-weight-bold">HS1:</span>
                {score.x1.map((item, index) => (
                    <span key={index} className="mr-2">
                        {item}
                    </span>
                ))}
            </p>
            <p>
                <span className="mr-2 font-weight-bold">HS2:</span>
                {score.x2.map((item, index) => (
                    <span key={index} className="mr-2">
                        {item}
                    </span>
                ))}
            </p>
            <p>
                <span className="mr-2 font-weight-bold">HS3:</span>
                {score.x3.map((item, index) => (
                    <span key={index} className="mr-2">
                        {item}
                    </span>
                ))}
            </p>
        </>
    )

    return (
        <>
            <Row className="mb-2">
                <Col md={subject ? 8 : 12} className="d-flex align-items-start">
                    <h5 className="flex-grow-1">
                        BẢNG ĐIỂM LỚP {classRoom}{" "}
                        {subject &&
                            `MÔN ${studentName(null, subject).toUpperCase()}`}
                    </h5>
                    <BackBtn
                        title="trang chủ"
                        onClick={() => history.push("/")}
                    />
                </Col>
            </Row>
            {data && data.length > 0 && (
                <Row className="mb-2">
                    <Col md={subject ? 8 : 12} className="text-right mb-2">
                        <b>Tổng số học sinh: {data.length}</b>
                    </Col>
                    {!subject && (
                        <Col md={12}>
                            <Table bordered striped hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        {[
                                            "STT",
                                            "Tên học sinh",
                                            "Toán",
                                            "Văn",
                                            "Anh",
                                            "Vật lý",
                                            "Hóa học",
                                            "Sinh học",
                                            "Địa",
                                            "Sử",
                                            "GDCD",
                                            "Âm nhạc",
                                            "Mỹ thuật",
                                            "Thể dục",
                                        ].map((item, index) => (
                                            <th
                                                key={index}
                                                className="align-top"
                                            >
                                                {item}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((student, index) => (
                                        <tr key={student._id}>
                                            <td>{index + 1}</td>
                                            <td>{student.studentName}</td>
                                            {Object.values(student.score).map(
                                                (item, index) => (
                                                    <td key={index}>
                                                        {item.medium &&
                                                        item.medium !== -1
                                                            ? item.medium
                                                            : singleMark(item)}
                                                    </td>
                                                )
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    )}

                    {subject && (
                        <Col md={8}>
                            {renderModal()}
                            <Table bordered striped hover size="sm" responsive>
                                <thead>
                                    <tr>
                                        {[
                                            "STT",
                                            "Tên học sinh",
                                            "Hệ số 1",
                                            "Hệ số 2",
                                            "Hệ số 3",
                                        ].map((item, index) => (
                                            <th
                                                key={index}
                                                className="align-top"
                                            >
                                                {item}
                                            </th>
                                        ))}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((student, index) => (
                                        <tr key={student._id}>
                                            <td>{index + 1}</td>
                                            <td>{student.studentName}</td>
                                            {Object.values(student.score).map(
                                                (item, index) => {
                                                    if (Array.isArray(item)) {
                                                        return (
                                                            <td key={index}>
                                                                {item
                                                                    .filter(
                                                                        (
                                                                            number
                                                                        ) =>
                                                                            number !==
                                                                            -1
                                                                    )
                                                                    .join(", ")}
                                                            </td>
                                                        )
                                                    }

                                                    return null
                                                }
                                            )}

                                            {(!student.score.medium ||
                                                student.score.medium ===
                                                    -1) && (
                                                <td className="text-center">
                                                    <EditBtn
                                                        title="Cập nhật điểm"
                                                        onClick={() => {
                                                            setStudent({
                                                                _id:
                                                                    student._id,
                                                                studentName:
                                                                    student.studentName,
                                                            })
                                                            setCurrentScore({
                                                                ...student.score,
                                                                name: subject,
                                                                subject: subjectName(
                                                                    null,
                                                                    subject
                                                                ),
                                                            })
                                                            toggle(!isOpen)
                                                        }}
                                                    />
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    )}

                    <Col md={12}>
                        <Button color="success">Tổng kết điểm</Button>
                    </Col>
                </Row>
            )}
        </>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
})

const mapDispatchToProps = {
    getClassTranscript,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmTranscript)
