export default [
    { path: "/", name: "Home", icon: "fas fa-home" },
    {
        path: "/profile",
        name: "Profile",
        icon: "fas fa-user-edit",
        roles: ["teacher", "parent"],
    },
    {
        path: "/students",
        name: "List students",
        icon: "fas fa-users",
        roles: ["admin"],
    },
    {
        path: "/teachers",
        name: "List teachers",
        icon: "fas fa-chalkboard-teacher",
        roles: ["admin"],
    },
    {
        path: "/gradeAndClass",
        name: "Grade and class",
        icon: "fas fa-school",
        roles: ["admin"],
    },
    {
        path: "/timeInfo",
        name: "Time info",
        icon: "fas fa-info",
        roles: ["admin"],
    },
]
