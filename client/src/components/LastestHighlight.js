import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import moment from "moment"
import PerfectScrollbar from "react-perfect-scrollbar"

import getLastestHighlight from "../redux/action/getLastestHighlight"
import AdminBlock from "../components/Admin/AdminBlock"

const SimpleHighlight = ({ item }) => {
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

const title = (
    <div className="d-flex align-items-center">
        <i className="fas fa-newspaper mr-2" />
        <div className="flex-grow-1">Thông báo gần đây</div>
        <Link to="/highlights">Xem tất cả</Link>
    </div>
)

const LastestHighlight = (props) => {
    const [data, setData] = useState([])
    useEffect(() => {
        props.getLastestHighlight().then((data) => setData(data))
    }, [])

    return (
        <AdminBlock title={title}>
            <PerfectScrollbar>
                {data?.map((item, index) => (
                    <>
                        <SimpleHighlight item={item} />
                        {index < data.length - 1 && <hr />}
                    </>
                ))}
            </PerfectScrollbar>
        </AdminBlock>
    )
}

const mapDispatchToProps = {
    getLastestHighlight,
}

export default connect(null, mapDispatchToProps)(LastestHighlight)
