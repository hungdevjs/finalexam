import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Label } from "reactstrap"

import history from "../config/history"
import { getStudentTranscript } from "../utils/api/fetchData"
import BackBtn from "../components/buttons/BackBtn"
import { subjects } from "../utils/constant"

const Transcript = (props) => {
    const studentId = props.match?.params?.studentId
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

    return (
        <div className="mb-2">
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
                                            <td>{item.subject}</td>
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
})

export default connect(mapStateToProps, null)(Transcript)
