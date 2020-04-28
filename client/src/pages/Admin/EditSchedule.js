import React, { useState, useEffect } from "react"
import { Row, Col, Button, Table } from "reactstrap"
import _ from "lodash"

import history from "../../config/history"
import FilterSelected from "../../components/selecteds/FilterSelected"
import {
    getAllSubject,
    createOrUpdateSchedule,
} from "../../utils/api/fetchData"
import renderNoti from "../../utils/renderNoti"

export default (props) => {
    const {
        match: {
            params: { classRoom },
        },
    } = props
    const [options, setOptions] = useState([])
    const [schedule, setSchedule] = useState({
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
    })

    useEffect(() => {
        getAllSubject().then((res) =>
            setOptions(res.data.map((item) => ({ value: item, label: item })))
        )
        let copySchedule = _.cloneDeep(schedule)
        copySchedule["mon"][0] = "Chào cờ"
        copySchedule["fri"][4] = "Sinh hoạt"
        setSchedule(copySchedule)
    }, [])

    const onUpdateSchedule = async () => {
        try {
            if (!checkFullSchedule()) {
                renderNoti({
                    type: "danger",
                    title: "Failed",
                    message: "Please fill out all lessons",
                })
                return
            }
            const data = { classRoom, schedule }
            const res = await createOrUpdateSchedule(data)

            if (res.data !== true) {
                throw new Error(res.data.error)
            }

            renderNoti({
                type: "success",
                title: "Success",
                message: "Update schedule successfully",
            })

            history.push("/gradeAndClass")
        } catch (err) {
            renderNoti({
                type: "warning",
                title: "Failed",
                message: err.message,
            })
        }
    }

    const checkFullSchedule = () =>
        Object.values(schedule).every(
            (daySchedule) =>
                daySchedule.length === 5 && daySchedule.every((item) => item)
        )

    const onChangeSchedule = (key, index, value) => {
        let copySchedule = _.cloneDeep(schedule)
        copySchedule[key][index] = value

        setSchedule(copySchedule)
    }

    return (
        <div className="mb-2">
            <Row>
                <Col md={12}>
                    <h5>Update schedule of class {classRoom}</h5>
                </Col>
                <Col md={12}>
                    <Table
                        bordered
                        striped
                        hover
                        size="sm"
                        responsive
                        style={{ marginBottom: "200px" }}
                    >
                        <thead>
                            <tr>
                                {[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                ].map((day, index) => (
                                    <th key={index}>{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[0, 1, 2, 3, 4].map((number) => (
                                <tr key={number}>
                                    {["mon", "tue", "wed", "thu", "fri"].map(
                                        (day, item) => {
                                            if (number === 0 && item === 0) {
                                                return (
                                                    <td key={item}>Chào cờ</td>
                                                )
                                            }

                                            if (number === 4 && item === 4) {
                                                return (
                                                    <td key={item}>
                                                        Sinh hoạt
                                                    </td>
                                                )
                                            }

                                            return (
                                                <td key={item}>
                                                    <FilterSelected
                                                        options={options}
                                                        placeholder=""
                                                        onChange={(e) => {
                                                            onChangeSchedule(
                                                                day,
                                                                number,
                                                                e.value
                                                            )
                                                        }}
                                                    />
                                                </td>
                                            )
                                        }
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <Button
                            color="success"
                            className="mt-2"
                            onClick={onUpdateSchedule}
                        >
                            Update
                        </Button>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}
