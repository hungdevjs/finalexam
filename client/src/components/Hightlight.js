import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Row, Col, Alert } from "reactstrap"
import styled from "styled-components"

import history from "../config/history"
import SearchBox from "./common/SearchBox"
import CreateBtn from "./buttons/CreateBtn"
import Pagination from "./common/Pagination"
import HighlightDetail from "./HighlightDetail"

import getAllHighlight from "../redux/action/getAllHighlight"

const HighlightContainer = styled.div`
    padding: 16px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    white-space: nowrap;
    overflow: auto;
`

const Highlight = (props) => {
    const [data, setData] = useState([])
    const [searchString, setSearchString] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    const [isPhone, setIsPhone] = useState(window.innerWidth < 768)

    useEffect(() => {
        getData()
    }, [currentPage])

    const getData = () => {
        props.getAllHighlight(searchString, currentPage).then((res) => {
            setData((res && res.data) || [])
            setTotalPage((res && res.totalPage) || 1)
        })
    }

    window.addEventListener("resize", () => setIsPhone(window.innerWidth < 768))

    return (
        <HighlightContainer>
            <Row className="mb-2 d-flex align-items-start">
                <Col md={2} className="mb-2 d-flex align-items-center">
                    <h5 className="mb-2 flex-grow-1">Highlights</h5>
                    {isPhone && (
                        <CreateBtn
                            onClick={() => history.push("/highlight/create")}
                        />
                    )}
                </Col>
                <Col md={8}>
                    <SearchBox
                        onChange={(e) => setSearchString(e.target.value)}
                        onSearch={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(1)
                            } else {
                                getData()
                            }
                        }}
                    />
                </Col>
                {!isPhone && (
                    <Col
                        md={2}
                        className="d-flex align-items-start justify-content-end"
                    >
                        <CreateBtn
                            onClick={() => history.push("/highlight/create")}
                        />
                    </Col>
                )}
            </Row>
            <Row>
                {data &&
                    data.length > 0 &&
                    data.map((highlight, index) => (
                        <Col md={6} key={index} className="px-3">
                            <HighlightDetail
                                highlight={highlight}
                                afterDelete={() => {
                                    if (currentPage === 1) {
                                        getData()
                                        return
                                    }
                                    setCurrentPage(1)
                                }}
                            />
                        </Col>
                    ))}

                {!data ||
                    (data && data.length === 0 && (
                        <Col md={12}>
                            <Alert color="primary">
                                No highlight to display
                            </Alert>
                        </Col>
                    ))}
            </Row>
            {data && data.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPage={totalPage}
                />
            )}
        </HighlightContainer>
    )
}

const mapDispatchToProps = {
    getAllHighlight,
}

export default connect(null, mapDispatchToProps)(Highlight)
