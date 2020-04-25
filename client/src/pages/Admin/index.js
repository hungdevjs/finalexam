import React from "react"
import moment from "moment"
import { Col, Row } from "reactstrap"

import StudentTeacher from "../../components/Admin/StudentTeacher"
import Highlight from "../../components/Hightlight"

export default function (props) {
    return (
        <Row>
            <Col md={6} className="mb-3">
                <StudentTeacher role="student" />
            </Col>
            <Col md={6} className="mb-3">
                <StudentTeacher role="teacher" />
            </Col>

            <Col md={12} className="mb-2">
                <Highlight />
            </Col>
        </Row>
    )
}
