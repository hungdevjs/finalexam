import React, { useEffect, useState } from "react"
import history from "../config/history"
import styled from "styled-components"
import { connect } from "react-redux"

import navigates from "../config/navigates"

import changeOptionNavigate from "../redux/action/changeOptionNavigate"

const NavigateContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: ${(props) => props.option};
    height: 100vh;
    background-color: #092b4c;
    transition: 0.2s ease;
    over-flow: hidden;
`

const NavContainer = styled.div`
    display: ${(props) => (props.option === "0px" ? "none" : "block")};
    transition: 0.2s ease;
    display: flex;
    flex-direction: column;
    height: 100vh;
`

const Nav = styled.div`
    display: ${(props) => (props.option === "0px" ? "none" : "block")};
    &:hover {
        background-color: #0f487f;
    }
    background-color: ${(props) =>
        props.pathName === props.path ? "#0f487f" : "transparent"};
    color: #fff;
    width: ${(props) => props.option};
    cursor: pointer;
    padding: ${(props) => (props.option === "0px" ? "0" : "16px")};
    transition: 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: ${(props) =>
        props.option === "200px" ? "flex-start" : "center"};
`

const NavIcon = styled.i`
    display: ${(props) => (props.option === "0px" ? "none" : "block")};
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const NavName = styled.span`
    font-weight: bold;
    display: ${(props) => (props.option === "200px" ? "block" : "none")};
    margin-left: 1rem;
    transition: 0.2s ease;
`

function Navigate(props) {
    const { role } = props

    const [pathName, setPathName] = useState(window.location.pathName)

    useEffect(() => {
        setPathName(window.location.pathname)
    }, [])

    return (
        <NavigateContainer {...props}>
            <NavContainer {...props}>
                {navigates.map((nav, index) =>
                    !nav.roles || nav.roles.includes(role) ? (
                        <div title={nav.name} key={index}>
                            <Nav
                                {...props}
                                pathName={pathName}
                                path={nav.path}
                                key={index}
                                onClick={() => {
                                    setPathName(nav.path)
                                    history.push(`${nav.path}`)
                                }}
                            >
                                <NavIcon {...props}>
                                    <i className={nav.icon} />
                                </NavIcon>
                                <NavName {...props}>{nav.name}</NavName>
                            </Nav>
                        </div>
                    ) : null
                )}
            </NavContainer>
        </NavigateContainer>
    )
}

const mapStateToProps = (state) => ({
    option: state.navigate.option,
    role: state.user.userInformation.role,
})

const mapDispatchToProps = {
    changeOptionNavigate,
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigate)
