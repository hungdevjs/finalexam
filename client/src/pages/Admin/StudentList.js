import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Row, Col } from "reactstrap";
import { connect } from "react-redux";
import moment from "moment";

import SearchBox from "../../components/common/SearchBox";
import GradeSelected from "../../components/selecteds/GradeSelected";
import FilterSelected from "../../components/selecteds/FilterSelected";
import DeleteBtn from "../../components/buttons/DeleteBtn";
import NewTabLink from "../../components/common/NewTabLink";
import Pagination from "../../components/common/Pagination";

import getAllUser from "../../redux/action/getAllUser";
import setModal from "../../redux/action/setModal";
import { deleteUser } from "../../utils/api/fetchData";
import renderNoti from "../../utils/renderNoti";

const StudentList = (props) => {
    const [searchString, setSearchString] = useState("");
    const [optionClass, setOptionClass] = useState("");
    const [optionGrade, setOptionGrade] = useState("");
    const [filterClassStudent, setFilterClassStudent] = useState([]);
    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await props.getAllUser(
                "student",
                searchString,
                optionClass,
                optionGrade,
                "",
                currentPage
            );
            setData(res.data);
            setTotalPage(res.totalPage);
        } catch (err) {
            renderNoti({
                type: "danger",
                title: "Failed",
                message: "Load student list failed",
            });
        }
    };

    const deleteStudent = (id) => {
        deleteUser("student", id)
            .then(() =>
                renderNoti({
                    title: "Success",
                    message: "Delete student successfully",
                    type: "success",
                })
            )
            .then(() => getData())
            .catch((err) => {
                renderNoti({
                    type: "danger",
                    title: "Failed",
                    message: "Delete student failed",
                });
            });
    };

    const renderParent = (parent) => {
        if (!parent || Object.keys(parent).length === 0) return null;
        return <Link>{parent.name}</Link>;
    };

    useEffect(() => {
        getData();
        //eslint-disable-next-line
    }, [optionClass, optionGrade, currentPage]);

    const onGradeSelected = (e) => {
        setCurrentPage(1);
        if (e) {
            setOptionGrade(e.value);
            const classArray = e.classRoom.map((item) => ({
                value: item,
                label: item,
            }));
            setFilterClassStudent(classArray);
        } else {
            setOptionGrade("");
            setFilterClassStudent([]);
        }
        setOptionClass("");
    };

    return (
        <div>
            <Row>
                <Col md={12}>
                    <h5>STUDENT LIST</h5>
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
                    <GradeSelected
                        isClearable
                        placeholder="Filter grade"
                        onChange={(e) => onGradeSelected(e)}
                    />
                </Col>
                <Col md={3}>
                    <FilterSelected
                        isClearable
                        placeholder="Filter class"
                        options={filterClassStudent}
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
                        isDisabled={filterClassStudent.length === 0}
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
                                    <th>Grade</th>
                                    <th>Class</th>
                                    <th>Date of birth</th>
                                    <th>Father</th>
                                    <th>Mother</th>
                                    <th>Address</th>
                                    <th>Note</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((student, index) => (
                                    <tr key={index}>
                                        <td>
                                            <NewTabLink
                                                title={student.studentName}
                                                to={`/user/student/edit/${student.id}`}
                                            />
                                        </td>
                                        <td>{student.grade}</td>
                                        <td>{student.classRoom}</td>
                                        <td>
                                            {moment(student.dateOfBirth).format(
                                                "DD/MM/YYYY"
                                            )}
                                        </td>
                                        <td>{renderParent(student.father)}</td>
                                        <td>{renderParent(student.mother)}</td>
                                        <td>{student.address}</td>
                                        <td>{student.note}</td>
                                        <td className="text-center">
                                            <DeleteBtn
                                                onClick={() => {
                                                    props.setModal({
                                                        isOpen: true,
                                                        message:
                                                            "Do you want to delete this student ?",
                                                        type: "warning",
                                                        onConfirm: () =>
                                                            deleteStudent(
                                                                student.id
                                                            ),
                                                    });
                                                }}
                                            />
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

export default connect(null, mapDispatchToProps)(StudentList);
