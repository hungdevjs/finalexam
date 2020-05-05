import React from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"

import Schedule from "../../components/Schedule"
import ProfileContainer from "../../components/ProfileContainer"
import AdminBlock from "../../components/Admin/AdminBlock"
import LastestHighlightOrEvent from "../../components/LastestHighlightOrEvent"
import TeacherMainClass from "../../components/TeacherMainClass"
import StudentOff from "../../components/StudentOff"

const Teacher = ({ user }) => {
    return (
        <div className="mb-2">
            <Row>
                <Col md={4} className="mb-4">
                    <ProfileContainer />
                </Col>

                <Col md={4} className="d-flex flex-column mb-4">
                    <StudentOff />
                    <AdminBlock
                        title="Thời khóa biểu"
                        icon="fas fa-calendar-week"
                        className="flex-grow-1"
                    >
                        <Schedule teacherId={user?._id} isComponent />
                    </AdminBlock>
                </Col>

                <Col md={4} className="mb-4 d-flex flex-column">
                    <LastestHighlightOrEvent
                        isHighlight
                        noHeight
                        className="flex-grow-1"
                    />
                </Col>

                {user.mainTeacherOfClass && user.mainTeacherOfClass.trim() && (
                    <Col md={12} className="mb-4">
                        <TeacherMainClass userInformation={user} />
                    </Col>
                )}
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user.userInformation,
})

export default connect(mapStateToProps, null)(Teacher)
