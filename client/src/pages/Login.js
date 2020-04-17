import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import history from '../config/history'
import styled from 'styled-components'

import { Input, Button, Form, FormGroup, Label } from 'reactstrap'
import Select from 'react-select'

import logIn from '../redux/action/login'
import renderNoti from '../utils/renderNoti'

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    margin-top: -64px;
`

const LoginForm = styled.div`
    border-radius: 4px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    padding: 32px 72px;
`

const LoginTitle = styled.div`
    diplay: flex;
    align-items: center;
    margin-bottom: 8px
`

function LogIn(props) {
    useEffect(() => {
        if (props.userInformation && Object.keys(props.userInformation).length > 0) {
            history.push('/')
        }
    }, [props.userInformation])

    useEffect(() => {
        if (localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
            history.push('/')
        }
    }, [])

    const [identity, setIdentity] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('teacher')

    const options = [
        { label: 'Admin', value: 'admin' },
        { label: 'Teacher', value: 'teacher' },
        { label: 'Parent', value: 'parent' }
    ]

    return (
        <LoginContainer>
            <LoginForm >
                <LoginTitle>
                    <img src='/logo.png' alt='' style={{
                        width: '30px',
                        height: '30px',
                        marginRight: '8px'
                    }} />
                    <h3 className='m-0'>Log in</h3>
                </LoginTitle>
                <p>Log in to your account</p>

                <Form onSubmit={e => {
                    e.preventDefault()
                    props.logIn({ identity, password, role })
                        .then(logInStatus => {
                            if (!logInStatus) {
                                renderNoti({
                                    title: 'Log in failed',
                                    message: 'Something is wrong.',
                                    type: 'danger'
                                })
                            }
                        })
                }}>
                    <FormGroup>
                        <Label>You are:</Label>
                        <Select className='mb-2' options={options} value={options.find(option => option.value === role)} onChange={e => setRole(e.value)} />

                        <Input type={role === 'parent' ? 'text' : 'email'} className='mb-2' placeholder={role === 'parent' ? 'Student ID' : 'Email'} value={identity} onChange={e => setIdentity(e.target.value)} />

                        <Input type='password' className='mb-2' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />

                        <Button color='link' className='p-0 mb-2 d-block' onClick={() => { }}>Forgot your password</Button>

                        <Button type='submit' color='primary'>Log in</Button>
                    </FormGroup>
                </Form>
            </LoginForm>
        </LoginContainer>
    )
}

const mapStateToProps = state => ({
    userInformation: state.user.userInformation
})

const mapDispatchToProps = {
    logIn
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogIn)