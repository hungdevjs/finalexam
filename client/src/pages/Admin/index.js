import React from "react"
import moment from "moment"
import { Col, Row, CardHeader } from "reactstrap"

import StudentTeacher from "../../components/Admin/StudentTeacher"
import Highlight from "../Hightlight"
import AdminReport from "../../components/Admin/AdminReport"
import AdminChart from "../../components/Admin/AdminChart"
import LastestHighlightOrEvent from "../../components/LastestHighlightOrEvent"
import Calendar from "../../components/Admin/Calendar"

export default function (props) {
    return (
        <>
            <AdminReport />
            <AdminChart />
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
                <Col md={12} xl={4} className="mb-4">
                    <Calendar />
                </Col>
                <Col md={6} xl={4} className="mb-4">
                    <LastestHighlightOrEvent isHighlight />
                </Col>
                <Col md={6} xl={4} className="mb-4">
                    <LastestHighlightOrEvent />
                </Col>
            </Row>
        </>
    )
}
