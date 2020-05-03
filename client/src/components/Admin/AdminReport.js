import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"

import history from "../../config/history"
import AdminCard from "./AdminCard"
import getAdminReport from "../../redux/action/getAdminReport"

const AdminReport = (props) => {
    const [reports, setReports] = useState({})

    useEffect(() => {
        props.getAdminReport().then((data) => setReports(data))
    }, [])

    return (
        <Row>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="primary"
                    detail="Xem danh sách"
                    onDetailClick={() => history.push("/students")}
                >
                    <i className="fas fa-users" /> Tổng số học sinh:{" "}
                    {reports?.numberOfStudents}
                </AdminCard>
            </Col>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="success"
                    detail="Xem danh sách"
                    onDetailClick={() => history.push("/teachers")}
                >
                    <i className="fas fa-chalkboard-teacher" /> Tổng số giáo
                    viên: {reports?.numberOfTeachers}
                </AdminCard>
            </Col>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard
                    color="warning"
                    detail="Xem danh sách"
                    onDetailClick={() => history.push("/gradeAndClass")}
                >
                    <i className="fas fa-school" /> Lớp học:{" "}
                    {reports?.numberOfClasses}
                </AdminCard>
            </Col>
            <Col md={6} lg={3} className="mb-4">
                <AdminCard color="danger">
                    <i className="fas fa-user-times" /> Học sinh nghỉ học hôm
                    nay: {reports?.numberOfMissingStudents}
                </AdminCard>
            </Col>
        </Row>
    )
}

const mapDispatchToProps = {
    getAdminReport,
}

export default connect(null, mapDispatchToProps)(AdminReport)