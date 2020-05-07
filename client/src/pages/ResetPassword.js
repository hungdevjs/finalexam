import React, { useState } from "react"
import { Form, FormGroup, Input, Label, Button } from "reactstrap"

import Feedback from "../components/common/Feedback"

export default (props) => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [checkPassword, setCheckPassword] = useState(false)

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "75vh" }}
        >
            <Form
                style={{ width: "300px" }}
                onSubmit={(e) => {
                    e.preventDefault()
                    setCheckPassword(true)
                }}
            >
                <img
                    src="/logo.png"
                    alt=""
                    style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "8px",
                    }}
                />
                <h3>Đặt lại mật khẩu</h3>
                <FormGroup>
                    <Label>Mật khẩu mới (tối thiểu 8 ký tự)</Label>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            border:
                                checkPassword &&
                                (!password.trim() ||
                                    password !== confirmPassword)
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                        placeholder="Mật khẩu mới"
                        minLength={8}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Xác nhận mật khẩu</Label>
                    <Input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            border:
                                checkPassword &&
                                (!confirmPassword.trim() ||
                                    password !== confirmPassword)
                                    ? "1px solid #dc3545"
                                    : "",
                        }}
                        placeholder="Xác nhận mật khẩu"
                        minLength={8}
                    />
                    {checkPassword &&
                        (!password.trim() || password !== confirmPassword) && (
                            <Feedback>
                                Mật khẩu{" "}
                                {!password.trim()
                                    ? "không được bỏ trống"
                                    : "không giống nhau"}
                            </Feedback>
                        )}
                </FormGroup>
                <Button color="primary">Xác nhận</Button>
            </Form>
        </div>
    )
}
