import React from "react"
import { connect } from "react-redux"
import { Row, Col } from "reactstrap"

import NewTabLink from "../../components/common/NewTabLink"
import Schedule from "../../components/Schedule"
import Highlight from "../../components/Hightlight"

const Teacher = ({ user }) => {
    return (
        <div className="mb-2">
            <Row>
                <Col md={12} className="mb-2">
                    <h6>Teacher name: {user?.name}</h6>
                    <h6>Subject: {user?.subject}</h6>
                    {user?.mainTeacherOfClass.length > 0 && (
                        <h6>
                            Main teacher of class:{" "}
                            {user?.mainTeacherOfClass.join(", ")}
                        </h6>
                    )}
                    <h6>Teacher of class: {user?.teacherOfClass.join(", ")}</h6>
                    <NewTabLink to="/profile" title="View profile" />
                    <br />
                    <a href="#highlight">Highlights</a>
                </Col>

                <Col md={12}>
                    <Schedule teacherId={user?._id} />
                </Col>

                <Col md={12} id="highlight">
                    <Highlight />
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user.userInformation,
})

export default connect(mapStateToProps, null)(Teacher)
