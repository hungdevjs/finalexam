import Home from "../pages/Home"
import Profile from "../pages/Profile"
import CreateUser from "../pages/Admin/CreateUser"
import GradeAndClass from "../pages/Admin/GradeAndClass"
import StudentList from "../pages/Admin/StudentList"
import TeacherList from "../pages/Admin/TeacherList"
import CreateHighlight from "../pages/CreateHighlight"
import Transcript from "../pages/Transcript"

export default [
    { path: "/", component: Home },
    { path: "/profile", component: Profile, roles: ["teacher", "parent"] },
    { path: "/user/:role/create", component: CreateUser, roles: ["admin"] },
    { path: "/user/:role/edit/:id", component: CreateUser, roles: "admin" },
    { path: "/gradeAndClass", component: GradeAndClass, roles: ["admin"] },
    { path: "/students", component: StudentList, roles: ["admin", "teacher"] },
    { path: "/teachers", component: TeacherList, roles: ["admin"] },
    { path: "/highlight/edit/:id", component: CreateHighlight },
    { path: "/highlight/create", component: CreateHighlight, roles: ["admin"] },
    {
        path: "/student/transcript/:studentId",
        component: Transcript,
        roles: ["admin", "teacher"],
    },
]
