import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PerfectScrollbar from "react-perfect-scrollbar"

import getLastestHighlight from "../redux/action/getLastestHighlight"
import AdminBlock from "./Admin/AdminBlock"
import SimpleHighlight from "./SimpleHighlight"

const highlightTitle = (
    <div className="d-flex align-items-center">
        <i className="fas fa-newspaper mr-2" />
        <div className="flex-grow-1">Thông báo gần đây</div>
        <Link to="/highlights">Xem tất cả</Link>
    </div>
)

const LastestHighlightOrEvent = (props) => {
    const [data, setData] = useState([])
    useEffect(() => {
        if (props.isHighlight) {
            props.getLastestHighlight().then((data) => setData(data))
        }
    }, [])

    return (
        <AdminBlock
            title={props.isHighlight ? highlightTitle : "Sự kiện sắp tới"}
            icon={!props.isHighlight && "fab fa-elementor"}
            height="350px"
        >
            <PerfectScrollbar>
                {data?.map((item, index) => (
                    <React.Fragment key={index}>
                        <SimpleHighlight item={item} />
                        {index < data.length - 1 && <hr />}
                    </React.Fragment>
                ))}
            </PerfectScrollbar>
        </AdminBlock>
    )
}

const mapDispatchToProps = {
    getLastestHighlight,
}

export default connect(null, mapDispatchToProps)(LastestHighlightOrEvent)
