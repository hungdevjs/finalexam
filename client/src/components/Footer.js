import React from "react"
import styled from "styled-components"
import { connect } from "react-redux"

const FooterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 40px;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #888;
`

const Footer = (props) => {
    return (
        <FooterContainer {...props}>
            <span>School Management System</span>
            <span style={{ fontSize: "0.7rem" }}>developed by hungdev.js</span>
        </FooterContainer>
    )
}

const mapStateToProps = (state) => ({
    option: state.navigate.option,
})

export default connect(mapStateToProps, null)(Footer)
