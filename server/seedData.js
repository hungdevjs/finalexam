const passwordHash = require("password-hash");

const Admin = require("./models/admin.model");
const Parent = require("./models/parent.model");
const Teacher = require("./models/teacher.model");
const Highlight = require("./models/highlight.model");
const Schedule = require("./models/schedule.model");
const Grade = require("./models/grade.model");

// create admin
console.log("Creating admin");
async function createAdmin() {
    const newAdmin = new Admin({
        email: "adminSMS@gmail.com",
        password: passwordHash.generate("12345678"),
        isDeleted: false,
    });
    await newAdmin.save();
}
createAdmin();

// create class
console.log("Creating grades and classes...");
const grades = [
    { grade: 6, classRoom: ["6A", "6B", "6C", "6D"] },
    { grade: 7, classRoom: ["7A", "7B", "7C", "7D", "7E"] },
    { grade: 8, classRoom: ["8A", "8B", "8C"] },
    { grade: 9, classRoom: ["9A", "9B"] },
];

async function createGrade(grade) {
    grade.isDeleted = false;
    const newGrade = new Grade(grade);
    await newGrade.save();
}

for (grade of grades) {
    createGrade(grade);
}

console.log("Created grades and classes");
