import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Row, Col } from "reactstrap";

import history from "../../config/history";
import CreateBtnBig from "../../components/buttons/CreateBtnBig";
import BackBtn from "../../components/buttons/BackBtn";
import DeleteBtn from "../../components/buttons/DeleteBtn";
import SearchBox from "../../components/common/SearchBox";
import FilterSelected from "../../components/selecteds/FilterSelected";
import NewTabLink from "../../components/common/NewTabLink";
import Pagination from "../../components/common/Pagination";

import renderNoti from "../../utils/renderNoti";
import getAllUser from "../../redux/action/getAllUser";
import setModal from "../../redux/action/setModal";
import {
    getAllClass,
    getAllSubject,
    deleteUser,
} from "../../utils/api/fetchData";

const TeacherList = (props) => {
    const [searchString, setSearchString] = useState("");
    const [optionClass, setOptionClass] = useState("");
    const [optionSubject, setOptionSubject] = useState("");
    const [filterClassTeacher, setFilterClassTeacher] = useState([]);
    const [filterSubject, setFilterSubject] = useState([]);
    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [isOpen, toggle] = useState(false);

    const getData = () => {
        props
            .getAllUser(
                "teacher",
                searchString,
                optionClass,
                "",
                optionSubject,
                currentPage
            )
            .then((res) => {
                setData(res.data);
                setTotalPage(res.totalPage);
            })
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Failed",
                    message: "Load teacher list failed",
                });
            });
    };

    useEffect(() => {
        getAllClass().then((res) => {
            const options = res.data.map((c) => ({ label: c, value: c }));
            setFilterClassTeacher(options);
        });

        getAllSubject().then((res) => {
            const options = res.data
                .sort()
                .map((c) => ({ label: c, value: c }));
            setFilterSubject(options);
        });
    }, []);

    useEffect(() => {
        getData();
        //eslint-disable-next-line
    }, [optionClass, optionSubject, currentPage]);

    return (
        <div>
            <Row className="mb-2">
                <Col md={8}>
                    <h5>TEACHER LIST</h5>
                </Col>
                <Col md={4} className="text-right">
                    <CreateBtnBig
                        title="teacher"
                        className="mr-2"
                        onClick={() => history.push("/user/teacher/create")}
                    />
                    <BackBtn title="home" onClick={() => history.push("/")} />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col md={6}>
                    <SearchBox
                        onChange={(e) => setSearchString(e.target.value)}
                        onSearch={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(1);
                            } else {
                                getData();
                            }
                        }}
                    />
                </Col>
                <Col md={3}>
                    <FilterSelected
                        isClearable
                        placeholder="Filter subject"
                        className="flex-grow-1 mr-1"
                        options={filterSubject}
                        onChange={(e) => {
                            setCurrentPage(1);
                            if (e) {
                                setOptionSubject(e.value);
                            } else {
                                setOptionSubject("");
                            }
                        }}
                    />
                </Col>
                <Col md={3}>
                    <FilterSelected
                        isClearable
                        placeholder="Filter class"
                        options={filterClassTeacher}
                        onChange={(e) => {
                            setCurrentPage(1);
                            if (e) {
                                setOptionClass(e.value);
                            } else {
                                setOptionClass("");
                            }
                        }}
                        value={
                            optionClass && {
                                value: optionClass,
                                label: optionClass,
                            }
                        }
                    />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {data && data.length > 0 && (
                        <Table bordered striped hover size="sm" responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Gender</th>
                                    <th>Year of birth</th>
                                    <th>Email</th>
                                    <th>Phone number</th>
                                    <th>Subject</th>
                                    <th>Teacher of class</th>
                                    <th>Main teacher of class</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((teacher, index) => (
                                    <tr key={index}>
                                        <td>
                                            <NewTabLink
                                                title={teacher.name}
                                                to={`/user/teacher/edit/${teacher.id}`}
                                            />
                                        </td>
                                        <td>
                                            {teacher.gender ? "Male" : "Female"}
                                        </td>
                                        <td>{teacher.yearOfBirth}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.phoneNumber}</td>
                                        <td>{teacher.subject}</td>
                                        <td>
                                            {teacher.teacherOfClass.join(", ")}
                                        </td>
                                        <td>
                                            {teacher.mainTeacherOfClass.join(
                                                ", "
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPage={totalPage}
            />
        </div>
    );
};

const mapDispatchToProps = {
    getAllUser,
    setModal,
};

export default connect(null, mapDispatchToProps)(TeacherList);
