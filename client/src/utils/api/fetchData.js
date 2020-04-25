import request from "./request"

const renderParams = (root, params) => {
    if (!params) {
        return root
    }

    let url = `${root}/?`

    for (let key of Object.keys(params)) {
        url += `${key}=${params[key]}&`
    }

    return url
}

export const getAllUser = (
    role,
    searchString = "",
    filterClass = "",
    filterGrade = "",
    filterSubject = "",
    currentPage = 0
) =>
    request.get(
        renderParams("user/getAllUser", {
            role,
            searchString,
            filterClass,
            filterGrade,
            filterSubject,
            currentPage,
        })
    )

export const getAllClass = () => request.get("information/getAllClass")

export const getAllSubject = () => request.get("information/getAllSubject")

export const deleteUser = (role, id) => request.delete(`user/${role}/${id}`)

export const getStudentData = (id) => request.get(`user/student/${id}`)

export const getTeacherData = (id) => request.get(`user/teacher/${id}`)

export const createStudent = (data) => request.post("user/student/create", data)

export const createTeacher = (data) => request.post("user/teacher/create", data)

export const updateTeacher = (id, data) =>
    request.put(`user/teacher/${id}`, data)

export const updateStudent = (data, id) =>
    request.put(`user/student/${id}`, data)

export const getAllClassOfGrade = (grade) =>
    request.get(`grade/getAllClassOfGrade/${grade}`)

export const getAllGrade = () => request.get("grade/getAllGrade")

export const getAllGradeWithMainTeacher = () =>
    request.get("grade/getAllGradeWithMainTeacher")

export const getAllHighlight = (searchString = "", currentPage = 0) =>
    request.get(
        renderParams("highlight", {
            searchString,
            currentPage,
        })
    )

export const deleteHighlight = (id) => request.delete(`highlight/${id}`)

export const getHighlight = (id) => request.get(`highlight/${id}`)

export const createOrUpdateHighlight = (data) =>
    request.post(`highlight/create-update`, data)

export const getClassSchedule = (classRoom) =>
    request.get(`information/schedule/${classRoom}`)

export const getStudentTranscript = (studentId) =>
    request.get(`information/transcript/${studentId}`)

export const getTeacherOfClass = (classRoom) =>
    request.get(`information/teacher/${classRoom}`)

export const getTeacherSchedule = (teacherId) =>
    request.get(`information/teacher/schedule/${teacherId}`)

export const getSemester = () => request.get("/information/semester")
