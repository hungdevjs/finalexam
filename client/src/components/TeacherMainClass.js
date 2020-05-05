import React, { useEffect, useState } from "react"
import { connect } from "react-redux"

import AdminBlock from "./Admin/AdminBlock"
import Pagination from "./common/Pagination"
import teacherGetAllStudent from "../redux/action/teacherGetAllStudent"
import StudentList from "../pages/Admin/StudentList"

export default (props) => {
    return (
        <AdminBlock
            title={`Danh sách học sinh lớp ${props.userInformation.mainTeacherOfClass}`}
            icon="fas fa-list"
        >
            <StudentList
                classRoom={props.userInformation.mainTeacherOfClass}
                isComponent
            />
        </AdminBlock>
    )
}
