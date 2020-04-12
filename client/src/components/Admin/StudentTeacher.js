import React, { useEffect, useState } from 'react'
import history from '../../config/history'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import styled from 'styled-components'
import { Button, Table } from 'reactstrap'

import SearchBox from '../SearchBox'
import FilterSelect from '../selecteds/FilterSelect'
import GradeSelected from '../selecteds/GradeSelected'

import DeleteBtn from '../buttons/DeleteBtn'
import CreateBtn from '../buttons/CreateBtn'

import getAllUser from '../../redux/action/getAllUser'
import setModal from '../../redux/action/setModal'
import { getAllClass, getAllSubject, deleteUser } from '../../utils/api/fetchData'
import renderNoti from '../../utils/renderNoti'

const StudentTeacherContainer = styled.div`
    padding: 16px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    white-space: nowrap;
    min-height: 400px;
    max-height: 800px;
    overflow: auto;
`

function StudentTeacher(props) {
    const [role, setRole] = useState(props.role)

    const [data, setData] = useState([])

    const [filterClassStudent, setFilterClassStudent] = useState([])
    const [filterClassTeacher, setFilterClassTeacher] = useState([])
    const [filterSubject, setFilterSubject] = useState([])

    const [searchString, setSearchString] = useState('')
    const [optionClass, setOptionClass] = useState('')
    const [optionGrade, setOptionGrade] = useState('')
    const [optionSubject, setOptionSubject] = useState('')

    //eslint-disable-next-line
    useEffect(() => {
        getData()
        //eslint-disable-next-line
    }, [optionClass, optionGrade, optionSubject])

    //eslint-disable-next-line
    const getData = () => {
        props.getAllUser(role, searchString, optionClass, optionGrade, optionSubject)
            .then(data => setData(data))
            .catch(err => { })
    }

    const getFilters = () => {
        getAllClass()
            .then(res => {
                const options = res.data.map(c => ({ label: c, value: c }))
                setFilterClassTeacher(options)
            })

        getAllSubject()
            .then(res => {
                const options = res.data.sort().map(c => ({ label: c, value: c }))
                setFilterSubject(options)
            })
    }

    const removeUser = (role, id) => {
        deleteUser(role, id)
            .then(() => renderNoti({
                title: 'Success',
                message: 'Delete user successfully',
                type: 'success'
            }))
            .then(() => getData())
            .catch(err => { })
    }

    useEffect(() => {
        getData();
        getFilters()
        //eslint-disable-next-line
    }, [role])

    const onGradeSelected = e => {
        setOptionGrade(e.value)
        const classArray = e.classRoom.map(item => ({ value: item, label: item }))
        setFilterClassStudent(classArray)
    }

    const header = role === 'student' ? 'Students' : 'Teachers'
    const url = role === 'student' ? '/students' : 'teachers'

    return (
        <StudentTeacherContainer>
            <div className='d-flex align-items-center mb-2'>
                <div className='flex-grow-1'>
                    <Link to={url}><h5 className='d-inline'>{header}</h5></Link>
                </div>
                <CreateBtn onClick={() => history.push(`/user/${role}/create`)} />
            </div>

            <SearchBox onChange={e => setSearchString(e.target.value)} onSearch={() => getData()} />

            <div className='d-flex align-items-center w-100 mb-2'>
                {role === 'student' && <GradeSelected
                    placeholder='Filter grade'
                    className='flex-grow-1 mr-1'
                    onChange={e => onGradeSelected(e)}
                />}
                {role === 'teacher' && <FilterSelect
                    placeholder='Subject filter'
                    className='flex-grow-1 mr-1'
                    options={filterSubject}
                    onChange={e => setOptionSubject(e.value)}
                />}

                <FilterSelect
                    placeholder='Class filter'
                    className='flex-grow-1 ml-1'
                    options={role === 'student' ? filterClassStudent : filterClassTeacher}
                    onChange={e => setOptionClass(e.value)}
                    isDisabled={role === 'student' && filterClassStudent.length === 0}
                />
            </div>

            <Table bordered striped hover size='sm' responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>
                            {role === 'student' ?
                                'Class' :
                                'Email'}
                        </th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {data && data.map((item, index) => <tr key={index}>
                        <td>
                            <Link to={`/user/${role}/edit/${item.id}`}>
                                {role === 'student' ?
                                    item.studentName :
                                    item.name}
                            </Link>
                        </td>
                        <td>
                            {role === 'student' ?
                                item.classRoom :
                                item.email}
                        </td>
                        <td>
                            <DeleteBtn onClick={() => props.setModal({ isOpen: true, message: 'Do you want to delete this user ?', type: 'warning', onConfirm: () => removeUser(role, item.id) })} />
                        </td>
                    </tr>)}
                </tbody>
            </Table>

        </StudentTeacherContainer>
    )
}

const mapDispatchToProps = {
    getAllUser,
    setModal
}

export default connect(
    null,
    mapDispatchToProps
)(StudentTeacher)