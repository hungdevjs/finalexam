import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import history from "../config/history";

import changeOptionNavigate from "../redux/action/changeOptionNavigate";
import setUserInformation from "../redux/action/setUserInformation";

const HeaderContainer = styled.div`
    width: ${(props) => `calc(100vw - ${props.option})`};
    padding-right: 16px;
    height: 64px;
    position: fixed;
    top: 0;
    left: ${(props) => props.option};
    background-color: #1e90ff;
    transition: 0.2s ease;
    display: flex;
    align-items: center;
    color: #fff;
`;

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
`;
const UserInfoContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    font-weight: bold;
    padding-right: 16px;
`;

const UserInfo = styled.span`
    cursor: pointer;
    white-space: nowrap;
`;

const UserOption = styled.div`
    position: fixed;
    top: 50px;
    right: 16px;
    border-radius: 4px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
    color: #555;
    background-color: #fff;
    opacity: ${(props) => (props.show ? 1 : 0)};
    p {
        padding: 8px 16px;
        margin-bottom: 0;
        cursor: pointer;
        border-radius: 4px;
    }
    p:hover {
        background-color: #ddd;
    }
`;

const changeWidthNavigate = (props) => {
    switch (props.option) {
        case "0px":
            props.changeOptionNavigate("70px");
            break;
        case "70px":
            props.changeOptionNavigate("200px");
            break;
        case "200px":
            props.changeOptionNavigate("0px");
            break;
        default:
            break;
    }
};

function Header(props) {
    const [userInfo, setUserInfo] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (
            props.userInformation &&
            Object.keys(props.userInformation).length > 0
        ) {
            if (props.userInformation.role === "parent") {
                setUserInfo(props.userInformation.studentName);
            } else {
                setUserInfo(props.userInformation.email);
            }
        }
    }, [props.userInformation]);

    const signOut = () => {
        props.setUserInformation({ data: {} });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_from");
        history.push("/login");
        props.changeOptionNavigate("0px");
    };

    return (
        <HeaderContainer {...props}>
            <NavigateButton
                {...props}
                onClick={() => changeWidthNavigate(props)}
            >
                {props.option === "0px" ? (
                    <i className="fas fa-bars"></i>
                ) : props.option === "70px" ? (
                    <i className="fas fa-arrow-right"></i>
                ) : (
                    <i className="fas fa-arrow-left"></i>
                )}
            </NavigateButton>
            <UserInfoContainer>
                <UserInfo onClick={() => setShow(!show)}>{userInfo}</UserInfo>
                <UserOption show={show}>
                    {props.userInformation &&
                        ["teacher", "parent"].includes(
                            props.userInformation.role
                        ) && (
                            <p
                                onClick={() => {
                                    setShow(false);
                                    history.push("/profile");
                                }}
                            >
                                Profile
                            </p>
                        )}
                    <p onClick={signOut}>Sign out</p>
                </UserOption>
            </UserInfoContainer>
        </HeaderContainer>
    );
}

const mapStateToProps = (state) => ({
    userInformation: state.user.userInformation,
    option: state.navigate.option,
});

const mapDispatchToProps = {
    changeOptionNavigate,
    setUserInformation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
