import React from "react"
import { Card, CardHeader, CardBody } from "reactstrap"

export default ({ icon, title, children }) => {
    return (
        <Card>
            <CardHeader>
                <i className={icon} /> {title}
            </CardHeader>
            <CardBody>{children}</CardBody>
        </Card>
    )
}
