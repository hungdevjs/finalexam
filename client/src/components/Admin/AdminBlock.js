import React from "react"
import { Card, CardHeader, CardBody } from "reactstrap"

export default ({ icon, title, children, height }) => {
    return (
        <Card>
            <CardHeader>
                <i className={icon || ""} /> {title}
            </CardHeader>
            <CardBody style={{ height: height || "", maxHeight: "400px" }}>
                {children}
            </CardBody>
        </Card>
    )
}
