import React from 'react'
import { Router, Route } from 'react-router-dom'
import history from '../config/history'
import { connect } from 'react-redux'
import styled from 'styled-components'

import routes from '../config/routes'

import PrivateRoute from './PrivateRoute'
import Login from '../pages/Login'
import Navigate from './Navigate'
import Header from './Header'

const ContentContainer = styled.div`
    transition: 0.2s ease;
    padding-left: ${props => props.option};
    width: 100%;
    padding-top: 72px;
`

function Layout(props) {
    return (
        <div className="min-vh-100vh d-flex">     
            {props.role && <Navigate />}
            <div style={{ zIndex: 9999 }}>{props.role && <Header />}</div>     
            <ContentContainer {...props}>              
                <Router history={history}>
                    {routes.map(route =>
                        <PrivateRoute key={route.path} {...route} /> 
                    )}
                    <Route path='/login' exact component={Login} />
                </Router>
            </ContentContainer>
        </div>
    )
}

const mapStateToProps = state => ({
    role: state.user.userInformation.role,
    option: state.navigate.option
})

export default connect(
    mapStateToProps
)(Layout)