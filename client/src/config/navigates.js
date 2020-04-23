export default [
    { path: "/", name: "Home", icon: "fas fa-home" },
    {
        path: "/profile",
        name: "Profile",
        icon: "fas fa-user-edit",
        roles: ["teacher", "parent"],
    },
    {
        path: "/schedule",
        name: "Schedule",
        icon: "far fa-calendar-alt",
        roles: ["teacher"],
    },
    {
        path: "/gradeAndClass",
        name: "Grade and class",
        icon: "fas fa-school",
        roles: ["admin"],
    },
];
