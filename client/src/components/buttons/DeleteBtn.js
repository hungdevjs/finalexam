import React from "react"

export default ({ onClick }) => (
    <div
        className="text-center"
        style={{ cursor: "pointer" }}
        onClick={onClick}
        title="Delete"
    >
        <i className="far fa-trash-alt"></i>
    </div>
)
