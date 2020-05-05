import React, { useEffect } from "react"
import { connect } from "react-redux"

import AdminCard from "./Admin/AdminCard"
import teacherGetStudentOff from "../redux/action/teacherGetStudentOff"

const StudentOff = (props) => {
    useEffect(() => {
        props.teacherGetStudentOff()
    }, [])

    const permission = props.studentOff.filter((item) => item.permission)
    const noPermission = props.studentOff.filter((item) => !item.permission)

    return (
        <div className="mb-4">
            <AdminCard color="danger" viewOnly>
                <div className="d-flex justify-content-between">
                    <span>Học sinh nghỉ hôm nay</span>
                    <span>
                        {permission.length} <i className="fas fa-user-plus" />
                    </span>
                    <span>
                        {noPermission.length}{" "}
                        <i className="fas fa-user-minus" />
                    </span>
                </div>
            </AdminCard>
        </div>
    )
}

const mapStateToProps = (state) => ({
    studentOff: state.studentOff.studentOff,
})

const mapDispatchToProps = {
    teacherGetStudentOff,
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentOff)
