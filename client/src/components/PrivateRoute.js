import React, { useEffect, useState } from "react"
import { Route } from "react-router-dom"
import { connect } from "react-redux"

const CheckPermission = () => {
    const [canAccess, setPermission] = useState(true)
    useEffect(() => {
        const checkPermission = setTimeout(() => {
            setPermission(false)
        }, 5000)

        return () => clearTimeout(checkPermission)
    }, [])

    return (
        <div>
            {canAccess && <i className="fas fa-spinner fa-pulse"></i>}
            {canAccess
                ? " Checking permission..."
                : " You don't have permission to view this page"}
        </div>
    )
}

// check if user has role to view this page
const render = (props) => {
    return !props.roles ||
        (Object.keys(props.userInformation).length > 0 &&
            props.roles.includes(props.userInformation.role))
        ? props.component
        : CheckPermission
}

function PrivateRoute(props) {
    return <Route {...props} exact component={render(props)} />
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
})

export default connect(mapStateToProps)(PrivateRoute)
