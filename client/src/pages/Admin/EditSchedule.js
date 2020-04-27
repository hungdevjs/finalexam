import React, { useState, useEffect } from "react"
import { Row, Col, Button, Table } from "reactstrap"

import FilterSelected from "../../components/selecteds/FilterSelected"
import { getAllSubject } from "../../utils/api/fetchData"

export default (props) => {
    const {
        match: {
            params: { classRoom },
        },
    } = props
    const [options, setOptions] = useState([])

    useEffect(() => {
        getAllSubject().then((res) =>
            setOptions(res.data.map((item) => ({ value: item, label: item })))
        )
    }, [])

    return (
        <div className="mb-2">
            <Row>
                <Col md={12}>
                    <h5>Update schedule of class {classRoom}</h5>
                </Col>
                <Col md={12}>
                    <Table
                        bordered
                        striped
                        hover
                        size="sm"
                        responsive
                        style={{ marginBottom: "200px" }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                ].map((day, index) => (
                                    <th key={index}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[0, 1, 2, 3, 4].map((number) => (
                                <tr key={number}>
                                    {[0, 1, 2, 3, 4].map((item) => {
                                        if (number === 0 && item === 0) {
                                            return <td>Chào cờ</td>
                                        }

                                        if (number === 4 && item === 4) {
                                            return <td>Sinh hoạt</td>
                                        }

                                        return (
                                            <td key={item}>
                                                <FilterSelected
                                                    options={options}
                                                    placeholder=""
                                                    onChange={(e) =>
                                                        console.log(e)
                                                    }
                                                />
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                        <Button color="success" className="mt-2">
                            Update
                        </Button>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}
