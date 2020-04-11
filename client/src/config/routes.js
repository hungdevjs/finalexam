import Home from "../pages/Home";
import Profile from "../pages/Profile";
import CreateUser from "../pages/CreateUser";
import GradeAndClass from "../pages/GradeAndClass";

export default [
  { path: "/", component: Home },
  { path: "/profile", component: Profile },
  { path: "/user/:role/create", component: CreateUser },
  { path: "/user/:role/edit/:id", component: CreateUser },
  { path: "/gradeAndClass", component: GradeAndClass, roles: ["admin"] },
];
