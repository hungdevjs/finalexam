import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Table, Row, Col, Label, Alert, Button } from "reactstrap"

import { getClassSchedule } from "../utils/api/fetchData"

const Schedule = ({ classRoom, role }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        if (classRoom) {
            getClassSchedule(classRoom).then((res) => setData(res.data))
        }
    }, [classRoom])

    return (
        <div className="mb-2">
            <Row>
                <Col md={12}>
                    <Label>Schedule of class {classRoom}</Label>
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
                                            <td key={index}>
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
                                This class doesn't have a schedule
                            </Alert>
                            {role === "admin" && (
                                <Button color="success">Create schedule</Button>
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
})

export default connect(mapStateToProps, null)(Schedule)
