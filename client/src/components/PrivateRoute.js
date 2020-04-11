import React, { useEffect } from "react"
import { Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"

import history from "../config/history"

import getUserInformation from "../redux/action/getUserInformation"

const RedirectRoute = () => <Redirect to="/" />

// check if user has role to view this page
const render = (props) => {
    return !props.roles ||
        (Object.keys(props.userInformation).length > 0 &&
            props.roles.includes(props.userInformation.role))
        ? props.component
        : RedirectRoute
}

function PrivateRoute(props) {
    // check if user is login
    useEffect(() => {
        if (
            props.userInformation &&
            Object.keys(props.userInformation).length === 0
        ) {
            props.getUserInformation().then((status) => {
                if (!status) {
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    localStorage.removeItem("access_from")
                    history.push("/login")
                }
            })
        }
    }, [])

    return <Route {...props} exact component={render(props)} />
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
})

const mapDispatchToProps = {
    getUserInformation,
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
