import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import history from '../config/history'

import changeOptionNavigate from '../redux/action/changeOptionNavigate'

const HeaderContainer = styled.div`
    width: ${props => `calc(100vw - ${props.option})`};
    padding-right: 16px;
    height: 64px;
    position: fixed;
    top: 0;
    left: ${props => props.option};
    background-color: #1e90ff;
    transition: 0.2s ease;
    display: flex;
    align-items: center;
    color: #fff;
`

const NavigateButton = styled.span`
    transition: 0.2s ease;
    padding: 32px;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    cursor: pointer;
`
const UserInfoContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    padding-right: 16px;
    font-weight: bold;
`

const UserInfo = styled.span`
    cursor: pointer;
    white-space: nowrap;
`

const changeWidthNavigate = props => {
    switch (props.option) {
        case '0px':
            props.changeOptionNavigate('70px')
            break
        case '70px':
            props.changeOptionNavigate('200px')
            break
        case '200px':
            props.changeOptionNavigate('0px')
            break
        default:
            break
    }
}

function Header(props) {
    const [userInfo, setUserInfo] = useState('')

    useEffect(() => {
        if (props.userInformation && Object.keys(props.userInformation).length > 0) {
            if (props.userInformation.role === 'parent') {
                setUserInfo(props.userInformation.studentName)
            } else {
                setUserInfo(props.userInformation.email)
            }
        }
    }, [props.userInformation])

    return (
        <HeaderContainer {...props}>
            <NavigateButton 
                {...props}
                onClick={() => changeWidthNavigate(props)}
            >
                {props.option === '0px' ? 
                    <i className="fas fa-bars"></i> :
                    props.option === '70px' ? 
                        <i className="fas fa-arrow-right"></i> :
                        <i className="fas fa-arrow-left"></i>}
            </NavigateButton>
            <UserInfoContainer>
                <UserInfo onClick={() => history.push('/profile')}>{userInfo}</UserInfo>
            </UserInfoContainer>
        </HeaderContainer>
    )
}

const mapStateToProps = state => ({
    userInformation: state.user.userInformation,
    option: state.navigate.option
})

const mapDispatchToProps = {
    changeOptionNavigate
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)