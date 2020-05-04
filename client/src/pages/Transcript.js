import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Label } from "reactstrap"
import _ from "lodash"

import history from "../config/history"
import { getStudentTranscript, updateTranscript } from "../utils/api/fetchData"
import BackBtn from "../components/buttons/BackBtn"
import { subjects } from "../utils/constant"
import EditBtn from "../components/buttons/EditBtn"
import ViewModal from "../components/modal/ViewModal"
import renderNoti from "../utils/renderNoti"

const Transcript = (props) => {
    const studentId = props.match?.params?.studentId
    const { role, subject } = props
    const [data, setData] = useState([])
    const subjectName = [
        "math",
        "literature",
        "english",
        "physics",
        "chemistry",
        "biology",
        "geography",
        "history",
        "law",
        "music",
        "art",
        "sport",
    ]

    const [currentSubject, setCurrentSubject] = useState({})
    const [isOpen, toggle] = useState(false)

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        const id = studentId || props.studentId
        getStudentTranscript(id).then((res) => {
            if (
                res.data &&
                res.data.score &&
                Object.keys(res.data.score).length > 0
            ) {
                let dataWithSubject = { ...res.data }
                subjectName.map((item, index) => {
                    dataWithSubject.score[item].subject = subjects[index]
                })
                setData(dataWithSubject)
            }
        })
    }

    const updateStudentTranscript = async () => {
        // send request to api to update transcript of this student
        try {
            const subject = {
                name: currentSubject?.name,
                subject: currentSubject?.subject,
                score: {
                    x1: currentSubject?.x1,
                    x2: currentSubject?.x2,
                    x3: currentSubject?.x3,
                },
            }
            const data = { studentId, subject }
            await updateTranscript(data)

            renderNoti({
                type: "success",
                title: "Thành công",
                message: "Đã cập nhật bảng điểm",
            })

            toggle(!isOpen)
            getData()
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Lỗi",
                message: "Lỗi trong khi cập nhật bảng điểm",
            })
        }
    }

    const editTranscript = (x, index, e) => {
        const { value } = e.target
        if (Number(value) < 0 || Number(value) > 10) {
            e.target.value = e.target.value.slice(0, -1)
            return
        }

        const transcript = _.cloneDeep(currentSubject)
        transcript[x][index] = value.trim() ? Number(value) : -1

        setCurrentSubject(transcript)
    }

    const renderModal = () => (
        <ViewModal
            isOpen={isOpen}
            toggle={() => toggle(!isOpen)}
            title={`Cập nhật bảng điểm`}
            onConfirm={() => updateStudentTranscript()}
        >
            <Row>
                <Col md={12}>Student: {data?.name}</Col>
                <Col md={12} className="mb-2">
                    Môn học: {currentSubject.subject}
                </Col>
                <Col md={12} className="mb-2">
                    HS 1:
                    {currentSubject?.x1?.map((item, index) => (
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
                    {currentSubject?.x2?.map((item, index) => (
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
                    {currentSubject?.x3?.map((item, index) => (
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

    return (
        <div className="mb-2">
            {role === "teacher" && renderModal()}
            {!props.isComponent && (
                <>
                    <Row>
                        <Col md={8} className="d-flex align-items-start">
                            <h5 className="flex-grow-1">
                                BẢNG ĐIỂM{" "}
                                {props.time.year &&
                                    props.time.semester &&
                                    `${props.time?.year}-${
                                        props.time?.year + 1
                                    } ${props.time?.semester}`}
                            </h5>
                            <BackBtn
                                title={role === "admin" ? "detail" : "list"}
                                onClick={() =>
                                    history.push(
                                        role === "admin"
                                            ? `/user/student/edit/${studentId}`
                                            : "/students"
                                    )
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={12}>
                            <Label>Tên học sinh: {data?.name}</Label>
                        </Col>
                    </Row>
                </>
            )}

            {/* {props.isComponent && (
                <Label>
                    Transcript of {data?.name}{" "}
                    {props.time.year &&
                        props.time.semester &&
                        `${props.time.year}-${props.time.year + 1} ${
                            props.time.semester
                        }`}
                </Label>
            )} */}

            {data && data.score && Object.keys(data.score).length > 0 && (
                <Row className="mb-2">
                    <Col md={props.isComponent ? 12 : 8}>
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {[
                                        "Môn học",
                                        "Hệ số 1",
                                        "Hệ số 2",
                                        "Hệ số 3",
                                    ].map((item, index) => (
                                        <th key={index}>{item}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(data.score).map(
                                    (item, index) => (
                                        <tr key={index}>
                                            <td>
                                                {item.subject}{" "}
                                                {role === "teacher" &&
                                                    item.subject ===
                                                        subject && (
                                                        <EditBtn
                                                            onClick={() => {
                                                                setCurrentSubject(
                                                                    {
                                                                        ...item,
                                                                        name: Object.keys(
                                                                            data.score
                                                                        )[
                                                                            index
                                                                        ],
                                                                    }
                                                                )
                                                                toggle(!isOpen)
                                                            }}
                                                        />
                                                    )}
                                            </td>
                                            <td>
                                                {item.x1
                                                    .filter(
                                                        (score) => score > -1
                                                    )
                                                    .join(", ")}
                                            </td>
                                            <td>
                                                {item.x2
                                                    .filter(
                                                        (score) => score > -1
                                                    )
                                                    .join(", ")}
                                            </td>
                                            <td>
                                                {item.x3
                                                    .filter(
                                                        (score) => score > -1
                                                    )
                                                    .join(", ")}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
    role: state.user.userInformation.role,
    subject: state.user.userInformation.subject,
})

export default connect(mapStateToProps, null)(Transcript)
