import React, { useEffect } from "react"
import { Route, Redirect } from "react-router-dom"
import { connect } from "react-redux"

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
    return <Route {...props} exact component={render(props)} />
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
})

export default connect(mapStateToProps)(PrivateRoute)
