import React, { useState, useEffect } from "react"
import { Table, Row, Col } from "reactstrap"

import { getClassSchedule } from "../utils/api/fetchData"

export default ({ classRoom }) => {
    const [data, setData] = useState({})

    useEffect(() => {
        getClassSchedule(classRoom).then((res) => setData(res.data))
    }, [classRoom])

    return (
        <div>
            <Row>
                <Col md={12}>
                    {data &&
                        data.schedule &&
                        Object.keys(data.schedule).length > 0 && (
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
                                                    {
                                                        data.schedule[item][
                                                            number
                                                        ]
                                                    }
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                </Col>
            </Row>
        </div>
    )
}
