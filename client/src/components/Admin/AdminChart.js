import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"
import Chart from "react-apexcharts"

import AdminBlock from "./AdminBlock"
import getAdminChart from "../../redux/action/getAdminChart"

const AdminChart = (props) => {
    const [data, setData] = useState({})

    useEffect(() => {
        props.getAdminChart().then((data) => setData(data))
    }, [])

    const { piechart } = data

    const pieState = {
        series: piechart ? Object.values(piechart) : [],
        options: {
            chart: {
                width: 380,
                type: "pie",
            },
            legend: {
                position: "bottom",
            },
            labels: ["Khối 6", "Khối 7", "Khối 8", "Khối 9"],
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        chart: {
                            width: 440,
                        },
                    },
                },
            ],
        },
    }
    const state = {
        series: [
            {
                name: "PRODUCT A",
                data: [44, 55, 41, 67, 22, 43, 21, 49],
            },
            {
                name: "PRODUCT B",
                data: [13, 23, 20, 8, 13, 27, 33, 12],
            },
            {
                name: "PRODUCT C",
                data: [11, 17, 15, 15, 21, 14, 15, 13],
            },
        ],
        options: {
            chart: {
                type: "bar",
                height: 350,
                stacked: true,
                stackType: "100%",
                toolbar: {
                    show: false,
                },
            },
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        legend: {
                            position: "bottom",
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                categories: [
                    "2011 Q1",
                    "2011 Q2",
                    "2011 Q3",
                    "2011 Q4",
                    "2012 Q1",
                    "2012 Q2",
                    "2012 Q3",
                    "2012 Q4",
                ],
            },
            fill: {
                opacity: 1,
            },
            legend: {
                position: "bottom",
            },
        },
    }

    return (
        <Row>
            <Col md={6} className="mb-4">
                <AdminBlock
                    title="Tỷ lệ học sinh các khối trong trường"
                    icon="fas fa-chart-pie"
                    height="400px"
                >
                    {piechart && (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Chart
                                options={pieState.options}
                                series={pieState.series}
                                type="pie"
                                width={380}
                            />
                        </div>
                    )}
                </AdminBlock>
            </Col>

            <Col md={6} className="mb-4">
                <AdminBlock
                    title="Phân loại học sinh 4 năm học gần nhất"
                    icon="fas fa-chart-bar"
                >
                    <Chart
                        options={state.options}
                        series={state.series}
                        type="bar"
                        height={350}
                    />
                </AdminBlock>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = {
    getAdminChart,
}

export default connect(null, mapDispatchToProps)(AdminChart)
