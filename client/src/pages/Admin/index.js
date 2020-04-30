import React from "react"
import moment from "moment"
import { Col, Row } from "reactstrap"

import StudentTeacher from "../../components/Admin/StudentTeacher"
import Highlight from "../../components/Hightlight"
import AdminReport from "../../components/Admin/AdminReport"
import AdminChart from "../../components/Admin/AdminChart"

export default function (props) {
    return (
        <>
            <AdminReport />
            {/* <AdminChart /> */}
            <Row>
                {/* <Col md={6} className="mb-3">
                    <StudentTeacher role="student" />
                </Col>
                <Col md={6} className="mb-3">
                    <StudentTeacher role="teacher" />
                </Col>

                <Col md={12} className="mb-2">
                    <Highlight />
                </Col> */}
            </Row>
        </>
    )
}
