import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Label } from "reactstrap"
import PieChart from "react-minimal-pie-chart"

import AdminBlockChart from "./AdminBlockChart"
import getAdminChart from "../../redux/action/getAdminChart"

const AdminChart = (props) => {
    const [data, setData] = useState({})

    useEffect(() => {
        props.getAdminChart().then((data) => setData(data))
    }, [])

    const { piechart } = data
    const pieColor = [
        { name: "Lớp 6", color: "#007bff" },
        { name: "Lớp 7", color: "#28a745" },
        { name: "Lớp 8", color: "#ffc107" },
        { name: "Lớp 9", color: "#dc3545" },
    ]
    return (
        <Row className="mb-4">
            <Col md={6}>
                <AdminBlockChart title="Tỷ lệ học sinh các khối trong trường">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="w-75 d-flex flex-column align-items-center">
                            {piechart && (
                                <PieChart
                                    data={[
                                        {
                                            title: "Lớp 6",
                                            value: piechart.grade6,
                                            color: "#007bff",
                                        },
                                        {
                                            title: "Lớp 7",
                                            value: piechart.grade7,
                                            color: "#28a745",
                                        },
                                        {
                                            title: "Lớp 8",
                                            value: piechart.grade8,
                                            color: "#ffc107",
                                        },
                                        {
                                            title: "Lớp 9",
                                            value: piechart.grade9,
                                            color: "#dc3545",
                                        },
                                    ]}
                                    animate
                                    label
                                    labelPosition={50}
                                    labelStyle={{
                                        fill: "#eee",
                                        fontFamily: "sans-serif",
                                        fontSize: "0.4rem",
                                    }}
                                    // lineWidth={90}
                                />
                            )}
                        </div>
                        <div className="px-2 mt-4 d-flex w-100 justify-content-around">
                            {pieColor.map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex align-items-center justify-content-end mb-2"
                                >
                                    {item.name}:
                                    <div
                                        style={{
                                            width: "15px",
                                            height: "15px",
                                            backgroundColor: item.color,
                                            borderRadius: "50%",
                                        }}
                                        className="ml-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </AdminBlockChart>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = {
    getAdminChart,
}

export default connect(null, mapDispatchToProps)(AdminChart)
