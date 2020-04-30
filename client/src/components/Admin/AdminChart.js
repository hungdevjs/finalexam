import React from "react"
import { Row, Col } from "reactstrap"
import PieChart from "react-minimal-pie-chart"

const AdminChart = (props) => {
    return (
        <Row className="mb-2">
            <Col md={2}>
                <PieChart
                    data={[
                        { title: "Lớp 6", value: 10, color: "#007bff" },
                        { title: "Lớp 7", value: 15, color: "#28a745" },
                        { title: "Lớp 8", value: 20, color: "#ffc107" },
                        { title: "Lớp 9", value: 20, color: "#dc3545" },
                    ]}
                    animate
                    label
                    labelPosition={50}
                    labelStyle={{
                        fill: "#eee",
                        fontFamily: "sans-serif",
                        fontSize: "0.5rem",
                    }}
                    // lineWidth={90}
                />
            </Col>
        </Row>
    )
}

export default AdminChart
