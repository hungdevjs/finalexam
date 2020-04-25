const mongoose = require("mongoose")
const passwordHash = require("password-hash")
const _ = require("lodash")
const { subjects } = require("./utils/constant")

const Admin = require("./models/admin.model")
const Parent = require("./models/parent.model")
const Teacher = require("./models/teacher.model")
const Highlight = require("./models/highlight.model")
const Schedule = require("./models/schedule.model")
const Grade = require("./models/grade.model")
const Semester = require("./models/semester.model")

const uri =
    "mongodb+srv://hungdevjs:Asdfgh1@3@cluster0-qz7nc.gcp.mongodb.net/finalexam9?retryWrites=true&w=majority"

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

const password = passwordHash.generate("12345678")
const dateOfBirth = "Sat Apr 24 2010 11:59:55 GMT+0700 (Indochina Time)"

// create admin
console.log("Creating admin...")
async function createAdmin() {
    const newAdmin = new Admin({
        email: "adminSMS@gmail.com",
        password,
        isDeleted: false,
    })
    await newAdmin.save()
}
createAdmin()
console.log("Created admin")

create semester && year
console.log("Creating semester...")

async function createSemester(data) {
    const newSemester = new Semester(data)
    await newSemester.save()
}

const now = new Date()

const month = now.getMonth() + 1
const year = month < 9 ? now.getFullYear() - 1 : now.getFullYear()
const semester = month < 9 ? 2 : 1

createSemester({ year, semester })

console.log("Created semester")

create class
console.log("Creating grades and classes...")
const grades = [
    { grade: 6, classRoom: ["6A", "6B", "6C", "6D"] },
    { grade: 7, classRoom: ["7A", "7B", "7C", "7D", "7E"] },
    { grade: 8, classRoom: ["8A", "8B", "8C"] },
    { grade: 9, classRoom: ["9A", "9B"] },
]

async function createGrade(grade) {
    grade.isDeleted = false
    const newGrade = new Grade(grade)
    await newGrade.save()
}

for (grade of grades) {
    createGrade(grade)
}

console.log("Created grades and classes")

// create schedule
console.log("Creating schedules...")

let classRoom = []
grades.forEach((grade) => {
    classRoom = [...classRoom, ...grade.classRoom]
})

const length = classRoom.length

async function createSchedule(classSchedule) {
    const newSchedule = new Schedule(classSchedule)
    await newSchedule.save()
}

const lessons = [
    "Văn",
    "Văn",
    "Văn",
    "Văn",
    "Toán",
    "Toán",
    "Toán",
    "Toán",
    "Vật lý",
    "Vật lý",
    "Hóa học",
    "Hóa học",
    "Sinh học",
    "Sinh học",
    "Anh",
    "Anh",
    "Anh",
    "Sử",
    "Địa",
    "GDCD",
    "Âm nhạc",
    "Mỹ thuật",
    "Thể dục",
]

for (let i = 0; i < length; i++) {
    const shuffleSubjects = _.shuffle(lessons)

    const schedule = ["Chào cờ", ...shuffleSubjects, "Sinh hoạt"]

    const classSchedule = {
        classRoom: classRoom[i],
        schedule: {
            mon: schedule.slice(0, 5),
            tue: schedule.slice(5, 10),
            wed: schedule.slice(10, 15),
            thu: schedule.slice(15, 20),
            fri: schedule.slice(20, 25),
        },
        isDeleted: false,
    }
    createSchedule(classSchedule)
}

console.log("Created schedules")

// create highlights
console.log("Creating highlights...")

async function createHighlight(data) {
    const newHighlight = new Highlight(data)
    await newHighlight.save()
}

for (let i = 0; i < 20; i++) {
    let date = new Date()
    date.setDate(date.getDate() - i)

    const data = {
        title: `Thông báo số ${20 - i}`,
        time: date.toString(),
        isDeleted: false,
        content: `Trường Đại học Bách Khoa Hà Nội đang đào tạo trên 40.000 SV, học viên cao học và nghiên cứu sinh với 67 chuyên ngành đại học và 33 chuyên ngành cao học, 57 chuyên ngành tiến sĩ.
        Hiện nay Trường có quan hệ hợp tác trong đào tạo, Nghiên cứu khoa học với trên 200 trường Đại học, trung tâm Nghiên cứu khoa học, viện nghiên cứu và tổ chức giáo dục của 32 quốc gia trên thế giới, là thành viên của 8 tổ chức mạng lưới đại học quốc tế. Thông qua hợp tác quốc tế, trường đã cử khoảng 500 cán bộ và sinh viên đi nước ngoài học tập, nghiên cứu, trao đổi,...Xây dựng hàng chục dự án quốc tế về đào tạo, trang bị, Nghiên cứu khoa học để góp phần tăng cường cơ sở vật chất cho Trường.
        Bộ GD-ĐT Việt Nam đã giao cho trường Đại học Bách Khoa Hà Nội thực hiện bốn chương trình đào tạo tiên tiến là chương trình Cơ - Điện tử, Công nghệ Vật liệu, Điện - Điện tử và Kỹ thuật Y Sinh. Từ năm 1986 đến nay cơ sở vật chất của Trường đã được cải tạo và nâng cấp một cách cơ bản, cơ sở hạ tầng và cảnh quan đã khang trang sạch đẹp hơn nhiều, đã đầu tư nhiều phòng thí nghiệm hiện đại, xây dựng và đang thực hiện nhiều dự án lớn phục vụ công tác đào tạo và nghiên cứu khoa học ở trình độ cao. Điều kiện làm việc và đời sống vật chất, tinh thần của cán bộ, sinh viên không ngừng được cải thiện. Đặc biệt, tháng 9/2006 Trường đã đưa vào sử dụng Thư viện điện tử Tạ Quang Bửu với mức đầu tư 199 tỷ VNĐ.`,
    }

    createHighlight(data)
}

console.log("Created highlights")

// create students
console.log("Creating students...")
let id = 1
let pad = "0000"

async function createStudent(student) {
    const newStudent = new Parent(student)
    await newStudent.save()
}

for (const room of classRoom) {
    for (let i = 1; i < 11; i++) {
        const stId = pad + id
        const data = {
            studentId: stId.substr(stId.length - 5),
            studentName: `Học sinh ${i} lớp ${room}`,
            password,
            gender: Math.random() > 0.5,
            grade: Number(room[0]),
            classRoom: room,
            dateOfBirth,
            address: "Địa chỉ mặc định",
            note: "Ghi chú mặc định",
            father: {
                name: `Bố học sinh ${i} lớp ${room}`,
                yearOfBirth: "1987",
                phoneNumber: "0123456789",
                note: "Ghi chú mặc định của bố",
            },
            mother: {
                name: `Mẹ học sinh ${i} lớp ${room}`,
                yearOfBirth: "1987",
                phoneNumber: "0123456789",
                note: "Ghi chú mặc định của mẹ",
            },
            isDeleted: false,
            score: {
                math: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                literature: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                english: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                physics: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                chemistry: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                biology: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                geography: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                history: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                law: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                music: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                art: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
                sport: {
                    x1: [10, 9, 9],
                    x2: [8, 7],
                    x3: [8],
                },
            },
        }
        createStudent(data)
        id++
    }
}

console.log("Created students")

// create teachers
console.log("Creating teachers...")

async function createTeacher(teacher) {
    const newTeacher = new Teacher(teacher)
    await newTeacher.save()
}

for (const room of classRoom) {
    let count = 1
    subjects.map((item, index) => {
        const data = {
            name: `Giáo viên ${item} lớp ${room} ${
                index === 0 ? "- Chủ nhiệm" : ""
            }`,
            password,
            yearOfBirth: "1996",
            gender: Math.random() > 0.5,
            email: `giaovien${count}-${room}@gmail.com`,
            phoneNumber: "0123456789",
            mainTeacherOfClass: index === 0 ? [room] : [],
            teacherOfClass: room,
            subject: item,
            isDeleted: false,
        }

        createTeacher(data)

        count++
    })
}

console.log("Created teachers")
console.log("Done!")
