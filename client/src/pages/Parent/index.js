import React from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"

import Transcript from "../Transcript"
import Schedule from "../../components/Schedule"
import TeacherOfClass from "../../components/TeacherOfClass"
import NewTabLink from "../../components/common/NewTabLink"

function Parent({ user }) {
    return (
        <div className="mb-2">
            <Row>
                <Col md={12} className="mb-2">
                    <h6>Student name: {user?.studentName}</h6>
                    <h6>StudentID: {user?.studentId}</h6>
                    <h6>Class: {user?.classRoom}</h6>
                    <NewTabLink to="/profile" title="View profile" />
                </Col>

                <Col md={12}>
                    <Transcript studentId={user._id} isComponent />
                </Col>

                <Col md={12}>
                    <Schedule classRoom={user.classRoom} />
                </Col>

                <Col md={12}>
                    <TeacherOfClass classRoom={user.classRoom} />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user.userInformation,
})

export default connect(mapStateToProps, null)(Parent)
