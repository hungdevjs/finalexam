import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "reactstrap";
import styled from "styled-components";

import SearchBox from "../common/SearchBox";
import CreateBtn from "../buttons/CreateBtn";

const HighlightContainer = styled.div`
    padding: 16px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    white-space: nowrap;
    max-height: 800px;
    overflow: auto;
`;

export default function (props) {
    const url =
        props.listType === "Notifications" ? "/notifications" : "/highlights";

    return (
        <HighlightContainer>
            <Row className="mb-2">
                <Col md={2} className="d-flex align-items-center">
                    <Link to={url}>
                        <h5 className="mb-2">{props.listType}</h5>
                    </Link>
                </Col>
                <Col md={8}>
                    <SearchBox />
                </Col>
                <Col
                    md={2}
                    className="d-flex align-items-start justify-content-end"
                >
                    <CreateBtn />
                </Col>
            </Row>
        </HighlightContainer>
    );
}
