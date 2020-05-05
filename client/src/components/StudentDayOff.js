import React from "react"
import { Row, Col } from "reactstrap"

import AdminBlock from "../components/Admin/AdminBlock"
import AdminCard from "../components/Admin/AdminCard"

export default (props) => {
    const permission = props.dayOff.filter((day) => day.permission)
    const noPermission = props.dayOff.filter((day) => !day.permission)

    return (
        <AdminBlock
            title="Số ngày nghỉ trong học kỳ"
            icon="fas fa-times"
            className="flex-grow-1 mb-4"
        >
            <Row>
                <Col md={12} className="mb-4">
                    <AdminCard color="primary" viewOnly>
                        <i class="fas fa-user-plus mr-2" />
                        Có phép: {permission.length}
                    </AdminCard>
                </Col>

                <Col md={12}>
                    <AdminCard color="danger" viewOnly>
                        <i class="fas fa-user-minus mr-2" />
                        Không phép: {noPermission.length}
                    </AdminCard>
                </Col>
            </Row>
        </AdminBlock>
    )
}
