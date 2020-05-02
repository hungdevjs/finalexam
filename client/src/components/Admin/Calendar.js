import React from "react"
import Calendar from "react-calendar"
import AdminBlock from "../Admin/AdminBlock"

export default (props) => (
    <AdminBlock title="Lịch" icon="far fa-calendar-alt" height="350px">
        <Calendar
            onChange={(e) => console.log(e)}
            value={new Date()}
            showWeekNumbers
        />
    </AdminBlock>
)
