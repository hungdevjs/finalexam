import React from 'react'
import moment from 'moment'
import { Col, Row } from 'reactstrap'

import StudentTeacher from '../../components/Admin/StudentTeacher'
import Highlight from '../../components/Admin/Hightlight'

export default function (props) {
    return (
        <Row>
            <Col md={12} style={{ padding: '0 15px 8px' }}>{moment(new Date()).format('DD/MM/YYYY')}</Col>
            <Col md={6} className='mb-2'>
                <StudentTeacher role='student' />
            </Col>
            <Col md={6} className='mb-2'>
                <StudentTeacher role='teacher' />
            </Col>

            <Col md={12} className='mb-2'>
                <Highlight listType='Highlights' />
            </Col>
        </Row>
    )
}