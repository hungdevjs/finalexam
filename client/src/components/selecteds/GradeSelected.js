import React, { useEffect, useState } from "react"
import Select from "react-select"

import { getAllGrade } from "../../utils/api/fetchData"

export default function (props) {
    const [options, setOptions] = useState([])

    useEffect(() => {
        getAllGrade().then((res) => {
            const grades = res.data.map((item) => {
                item.value = item.grade
                item.label = item.grade
                return item
            })
            setOptions(grades)
        })
    }, [])

    return (
        <Select
            placeholder={props.placeholder || "Select grade"}
            options={options}
            onChange={props.onChange}
            {...props}
        />
    )
}
