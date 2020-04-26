import React, { useState } from "react"
import { connect } from "react-redux"
import { Row, Col, Button, Input, Label } from "reactstrap"

import setModal from "../../redux/action/setModal"
import ViewModal from "../../components/modal/ViewModal"

const TimeInfo = ({ time }) => {
    const [isOpen, toggle] = useState(false)
    const [password, setPassword] = useState("")

    const upgrade = () => {
        console.log("upgrade")
    }

    const renderModal = () => {
        return (
            <ViewModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
                title="Confirm upgrade time"
                onConfirm={upgrade}
            >
                <Label>Fill your password to continue</Label>
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </ViewModal>
        )
    }

    return (
        <Row className="mb-2">
            {renderModal()}
            <Col md={12}>
                <h5>TIME INFO</h5>
            </Col>
            <Col md={12}>
                <b>Current year: {`${time?.year}-${time?.year + 1}`}</b>
            </Col>
            <Col md={12}>
                <b>Current semester: {time?.semester}</b>
            </Col>
            <Col md={12} className="pt-2">
                <Button color="primary" onClick={() => toggle(!isOpen)}>
                    Upgrade
                </Button>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => ({
    time: state.time,
})

export default connect(mapStateToProps, null)(TimeInfo)
