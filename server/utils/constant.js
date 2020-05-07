module.exports = {
    pageSize: 10,
    schoolEmail: "devschool@gmail.com",
    createStudentText:
        "[Dev School] Account for student $studentName$: StudentID: $studentId$ - Password: $password$",
    createTeacherText:
        "[Dev School] Account for teacher $teacherName$: Email: $teacherEmail$ - Password: $password$",
    smsToMainTeacherText:
        "[Dev School] Message from parent of student $studentName$: $content$",
    forgetPasswordText:
        "[Dev School] Follow this URL to reset your password: $url$",
    forgetPasswordHtml:
        "<strong>[Dev School]</strong> Follow this URL to reset your password: $url$",
    forgetPasswordSubject: "Reset password",
    subjects: [
        "Toán",
        "Văn",
        "Anh",
        "Vật lý",
        "Hóa học",
        "Sinh học",
        "Địa",
        "Sử",
        "GDCD",
        "Âm nhạc",
        "Mỹ thuật",
        "Thể dục",
    ],
    developDomain: "http://localhost:3000",
    productDomain: "",
}
