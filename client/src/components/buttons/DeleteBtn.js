import React from 'react'

export default ({ onClick }) => (
    <div
        className='text-center'
        style={{ cursor: 'pointer' }}
        onClick={onClick}
    >
        <i className='far fa-trash-alt'></i>
    </div>
)