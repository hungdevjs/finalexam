import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Table, Row, Col, Label } from "reactstrap"

import { getTeacherOfClass } from "../utils/api/fetchData"
import { subjects } from "../utils/constant"

import ViewModal from "../components/modal/ViewModal"

export default ({ classRoom }) => {
    const [data, setData] = useState({})
    const [isOpen, toggle] = useState(false)
    const [currentTeacher, setCurrentTeacher] = useState({})

    useEffect(() => {
        if (classRoom) {
            getTeacherOfClass(classRoom).then((res) => setData(res.data))
        }
    }, [classRoom])

    const renderModal = () => {
        if (!currentTeacher || Object.keys(currentTeacher).length === 0) {
            return null
        }

        const {
            name,
            yearOfBirth,
            email,
            phoneNumber,
            subject,
        } = currentTeacher

        return (
            <ViewModal
                isOpen={isOpen}
                toggle={() => toggle(!isOpen)}
                title={`${subject} teacher of class ${classRoom}`}
                viewOnly
            >
                <p>Name: {name || ""}</p>
                <p>Year of birth: {yearOfBirth || ""}</p>
                <p>Phone number: {phoneNumber || ""}</p>
                <p>Email: {email || ""}</p>
            </ViewModal>
        )
    }

    return (
        <div className="mb-2">
            {renderModal()}
            <Row>
                <Col md={12}>
                    <Label>Teacher list of class {classRoom}</Label>
                    {data && Object.keys(data).length > 0 && (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    {["Main teacher", ...subjects].map(
                                        (item, index) => (
                                            <th key={index}>{item}</th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Link
                                            onClick={() => {
                                                setCurrentTeacher(
                                                    data.mainTeacher
                                                )
                                                toggle(!isOpen)
                                            }}
                                        >
                                            {data.mainTeacher?.name}
                                        </Link>
                                    </td>
                                    {data.subjectTeacher?.map(
                                        (teacher, index) => (
                                            <td key={index}>
                                                <Link
                                                    onClick={() => {
                                                        setCurrentTeacher(
                                                            teacher
                                                        )
                                                        toggle(!isOpen)
                                                    }}
                                                >
                                                    {teacher?.name}
                                                </Link>
                                            </td>
                                        )
                                    )}
                                </tr>
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
        </div>
    )
}
