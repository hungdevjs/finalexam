import React from "react"
import moment from "moment"
import { Link } from "react-router-dom"

export default ({ item }) => {
    const htmlContent = document.createElement("p")
    htmlContent.innerHTML = item.content
    const pureContent = htmlContent.innerText

    return (
        <div>
            <div
                style={{
                    padding: "8px 16px",
                    marginBottom: "8px",
                    borderRadius: "20px",
                    backgroundColor: "royalblue",
                    display: "inline-block",
                    color: "#fff",
                }}
            >
                {moment(item.time).format("DD/MM/YYYY")}
            </div>
            <div>
                <Link to={`highlight/edit/${item._id}`}>
                    <b>{item.title}</b>
                </Link>
            </div>
            <div className="mb-2">{`${pureContent.slice(0, 200)}${
                pureContent.length > 200 ? "..." : ""
            }`}</div>
        </div>
    )
}
