import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Label, Alert, Button } from "reactstrap"

import history from "../config/history"
import { getClassSchedule, getTeacherSchedule } from "../utils/api/fetchData"

const Schedule = ({ classRoom, role, teacherId, time }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        if (classRoom && !teacherId) {
            getClassSchedule(classRoom).then((res) => setData(res.data))
        }
        if (teacherId) {
            getTeacherSchedule(teacherId).then((res) => setData(res.data))
        }
    }, [classRoom])

    return (
        <div className="mb-2">
            <Row>
                <Col md={12}>
                    {!teacherId ? (
                        <Label>
                            Schedule of class {classRoom}{" "}
                            {time.year &&
                                time.semester &&
                                `${time.year}-${time.year + 1} ${
                                    time.semester
                                }`}{" "}
                            {}
                        </Label>
                    ) : (
                        <Label>
                            Schedule of teacher {data.name}{" "}
                            {time.year &&
                                time.semester &&
                                `${time.year}-${time.year + 1} ${
                                    time.semester
                                }`}
                        </Label>
                    )}

                    {data &&
                    data.schedule &&
                    Object.keys(data.schedule).length > 0 ? (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[0, 1, 2, 3, 4].map((number) => (
                                    <tr key={number}>
                                        {[
                                            "mon",
                                            "tue",
                                            "wed",
                                            "thu",
                                            "fri",
                                        ].map((item, index) => (
                                            <td
                                                key={index}
                                                style={{ height: "33.33px" }}
                                            >
                                                {data.schedule[item][number]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <>
                            <Alert color="primary">
                                {`This ${
                                    !teacherId ? "class" : "teacher"
                                } doesn't have a schedule`}
                            </Alert>
                            {role === "admin" && !teacherId && (
                                <Button
                                    color="success"
                                    onClick={() =>
                                        history.push(
                                            `/updateSchedule/${classRoom}`
                                        )
                                    }
                                >
                                    Create schedule
                                </Button>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    role: state.user.userInformation.role,
    time: state.time,
})

export default connect(mapStateToProps, null)(Schedule)
