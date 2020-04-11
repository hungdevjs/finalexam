import React, { useEffect, useState } from 'react'
import Select from 'react-select'

import getAllGrade from '../../utils/api/getAllGrade'

export default function (props) {
    const [options, setOptions] = useState([])

    useEffect(() => {
        getAllGrade()
            .then(res => {
                const grades = res.data.map(item => {
                    item.value = item.grade
                    item.label = item.grade
                    return item
                })
                setOptions(grades)
            })
    }, [])

    return (
        <Select
            placeholder={props.placeholder || 'Select grade'}
            value={props.gradeSelect ? options.find(option => option.value === props.gradeSelect) : null}
            options={options}
            onChange={props.onChange}
            {...props}
        />
    )
}