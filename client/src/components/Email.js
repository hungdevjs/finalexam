import React from "react"
import { Label, Input, Button } from "reactstrap"

import AdminBlock from "./Admin/AdminBlock"

export default (props) => {
    return (
        <AdminBlock title="Gửi tin nhắn" icon="far fa-envelope">
            <Label>Gửi tin nhắn đến cô giáo chủ nhiệm</Label>
            <Input type="textarea" rows={8} className="mb-3" />
            <div className="text-right">
                <Button color="primary" className="mr-2">
                    Gửi SMS
                </Button>
                <Button color="warning">Gửi email</Button>
            </div>
        </AdminBlock>
    )
}
