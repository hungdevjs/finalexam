import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Label } from "reactstrap"
import _ from "lodash"

import history from "../config/history"
import { getStudentTranscript } from "../utils/api/fetchData"
import BackBtn from "../components/buttons/BackBtn"
import { subjects } from "../utils/constant"
import EditBtn from "../components/buttons/EditBtn"
import ViewModal from "../components/modal/ViewModal"

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
    }, [])

    const updateTranscript = () => {
        // send request to api to update transcript of this student
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
            title={`Edit transcript`}
            onConfirm={updateTranscript}
        >
            <Row>
                <Label className="ml-3">
                    Subject: {currentSubject.subject}
                </Label>
                <Col md={12} className="mb-2">
                    x1:
                    {currentSubject?.x1?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            type="number"
                            defaultValue={item}
                            maxLength={2}
                            onChange={(e) => {
                                editTranscript("x1", index, e)
                            }}
                        />
                    ))}
                </Col>

                <Col md={12} className="mb-2">
                    x2:
                    {currentSubject?.x2?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            maxLength={2}
                            defaultValue={item}
                            onChange={(e) => {
                                editTranscript("x2", index, e)
                            }}
                        />
                    ))}
                </Col>

                <Col md={12} className="mb-2">
                    x3:
                    {currentSubject?.x3?.map((item, index) => (
                        <input
                            className="mx-2 text-center"
                            style={{ width: "27px" }}
                            key={index}
                            maxLength={2}
                            defaultValue={item}
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
                                TRANSCRIPT{" "}
                                {props.time.year &&
                                    props.time.semester &&
                                    `${props.time?.year}-${
                                        props.time?.year + 1
                                    } ${props.time?.semester}`}
                            </h5>
                            <BackBtn
                                title="detail"
                                onClick={() =>
                                    history.push(
                                        `/user/student/edit/${studentId}`
                                    )
                                }
                            />
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={12}>
                            <Label>Student name: {data?.name}</Label>
                        </Col>
                    </Row>
                </>
            )}

            {props.isComponent && (
                <Label>
                    Transcript of {data?.name}{" "}
                    {props.time.year &&
                        props.time.semester &&
                        `${props.time.year}-${props.time.year + 1} ${
                            props.time.semester
                        }`}
                </Label>
            )}

            {data && data.score && Object.keys(data.score).length > 0 && (
                <Row className="mb-2">
                    <Col md={props.isComponent ? 12 : 8}>
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {["Subject", "x1", "x2", "x3"].map(
                                        (item, index) => (
                                            <th key={index}>{item}</th>
                                        )
                                    )}
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
                                            <td>{item.x1.join(", ")}</td>
                                            <td>{item.x2.join(", ")}</td>
                                            <td>{item.x3.join(", ")}</td>
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
