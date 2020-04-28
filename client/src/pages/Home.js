import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import moment from "moment"

import Admin from "./Admin"
import Teacher from "./Teacher"
import Parent from "./Parent"

function Home(props) {
    const [role, setRole] = useState("")

    useEffect(() => {
        if (
            props.userInformation &&
            Object.keys(props.userInformation).length > 0
        ) {
            setRole(props.userInformation.role)
        }
    }, [props.userInformation])

    const { time } = props

    return (
        <div>
            {["admin", "parent", "teacher"].includes(role) && (
                <div className="mt-1 mb-2">
                    <b>
                        {`${moment(new Date()).format("DD/MM/YYYY")} - Year: ${
                            time.year ? time.year : ""
                        }-${time.year ? time.year + 1 : ""} - Semester: ${
                            time.semester ? time.semester : ""
                        }`}
                    </b>
                </div>
            )}
            {role === "admin" ? (
                <Admin />
            ) : role === "teacher" ? (
                <Teacher />
            ) : role === "parent" ? (
                <Parent />
            ) : null}
        </div>
    )
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
    time: state.time,
})

export default connect(mapStateToProps, null)(Home)
